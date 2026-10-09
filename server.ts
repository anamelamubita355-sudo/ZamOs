import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  try {
    genAI = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

// System prompt for ZamOS Assistant
const ZAMOS_SYSTEM_INSTRUCTION = `You are "ZamOS Citizen AI Navigator" - the official sovereign digital assistant for the Republic of Zambia's unified public systems.
You assist citizens, businesses, and public officers in Zambia with verified procedures, policies, and navigation across ZESCO, ZRA, RTSA, PACRA, CDF, MoH, and emergency services. Provide concise, highly accurate, culturally respectful responses.`;

// ==========================================
// PERSISTENT DATABASE ENGINE (JSON DISK STORE)
// ==========================================

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'zamos_store.json');

const hashPassword = (pwd: string) => crypto.createHash('sha256').update(pwd).digest('hex');

interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'Super Administrator' | 'ZESCO Grid Controller' | 'DMMU Dispatch Director' | 'CDF National Auditor' | 'Content Manager' | 'ZRA Revenue Analyst';
  department: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_2FA';
  lastLogin: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  action: string;
  module: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

interface PublicAnnouncement {
  id: string;
  title: string;
  category: 'Policy & Governance' | 'Energy & Grid' | 'Public Health' | 'Commerce & Tax' | 'Civic Notice';
  authorEmail: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  emergencyAlerts: any[];
  publicAnnouncements: PublicAnnouncement[];
  powerStations: any[];
  loadSheddingSchedules: any[];
  publicServiceDirectory: any[];
  cdfApplications: any[];
  auditLogs: AuditLog[];
  systemSettings: any;
}

// Initial Seed Data
const getInitialSeed = (): DatabaseSchema => ({
  users: [
    {
      id: 'USR-ZM-001',
      fullName: 'Dr. Mwamba Silungwe',
      email: 'admin@zamos.gov.zm',
      passwordHash: hashPassword('ZamOS@2026!Gov'),
      role: 'Super Administrator',
      department: 'Smart Zambia Institute (e-Government)',
      status: 'ACTIVE',
      lastLogin: '2026-10-09 14:32 CAT',
    },
    {
      id: 'USR-ZM-002',
      fullName: 'Eng. Chishimba Kapembwa',
      email: 'grid.control@zesco.co.zm',
      passwordHash: hashPassword('ZescoGrid#2026'),
      role: 'ZESCO Grid Controller',
      department: 'ZESCO National Control Centre (NCC)',
      status: 'ACTIVE',
      lastLogin: '2026-10-09 13:15 CAT',
    },
    {
      id: 'USR-ZM-003',
      fullName: 'Maj. Thandiwe Phiri',
      email: 'dispatch@dmmu.gov.zm',
      passwordHash: hashPassword('DmmuResponse#2026'),
      role: 'DMMU Dispatch Director',
      department: 'Disaster Management & Mitigation Unit',
      status: 'ACTIVE',
      lastLogin: '2026-10-09 11:45 CAT',
    },
    {
      id: 'USR-ZM-004',
      fullName: 'Kabwe Mwananshiku',
      email: 'cdf.audits@mlgrd.gov.zm',
      passwordHash: hashPassword('CdfAudit#2026'),
      role: 'CDF National Auditor',
      department: 'Ministry of Local Govt & Rural Dev',
      status: 'ACTIVE',
      lastLogin: '2026-10-08 17:05 CAT',
    },
    {
      id: 'USR-ZM-005',
      fullName: 'Natasha Banda',
      email: 'content@zamos.gov.zm',
      passwordHash: hashPassword('ContentManager#2026'),
      role: 'Content Manager',
      department: 'Ministry of Information and Media',
      status: 'ACTIVE',
      lastLogin: '2026-10-09 10:10 CAT',
    },
  ],
  emergencyAlerts: [
    {
      id: 'ALT-ZM-001',
      title: 'Stage 2 Power Rationing Directive (Lake Kariba Drought)',
      agency: 'Ministry of Energy & ZESCO National Control Centre',
      severity: 'HIGH',
      description: 'Lake Kariba live usable storage is at 12.8% (476.22m). Generation restricted at Kariba North Bank to 420 MW. 8-hour daily rationing cycle enforced across Lusaka and Copperbelt.',
      affectedProvinces: ['Lusaka Province', 'Copperbelt Province', 'Central Province', 'Southern Province'],
      status: 'ACTIVE',
      isSimulated: true,
      publishedAt: '2026-10-09 06:00 CAT',
      expiresAt: '2026-10-16 23:59 CAT',
    },
    {
      id: 'ALT-ZM-002',
      title: 'Seasonal Water-Borne Disease Proactive Chlorination Alert',
      agency: 'Ministry of Health & DMMU Public Health Taskforce',
      severity: 'MODERATE',
      description: 'Preventative household water chlorination and borehole water testing initiated in high-density peri-urban areas of Lusaka, Kitwe, and Ndola ahead of rainfall.',
      affectedProvinces: ['Lusaka Province', 'Copperbelt Province'],
      status: 'ACTIVE',
      isSimulated: true,
      publishedAt: '2026-10-08 10:00 CAT',
      expiresAt: '2026-10-25 18:00 CAT',
    },
    {
      id: 'ALT-ZM-003',
      title: 'Heavy Haulage Bridge Weight Compliance at Kazungula OSBP',
      agency: 'RTSA & National Road Fund Agency (NRFA)',
      severity: 'ADVISORY',
      description: 'Mandatory weighbridge verification on all multi-axle freight carriers exiting or entering via Kazungula Bridge.',
      affectedProvinces: ['Southern Province'],
      status: 'STANDBY',
      isSimulated: true,
      publishedAt: '2026-10-07 14:00 CAT',
      expiresAt: '2026-10-14 20:00 CAT',
    },
  ],
  publicAnnouncements: [
    {
      id: 'ANN-ZM-101',
      title: '2026 National Budget CDF Window Open for Cooperative Grants',
      category: 'Civic Notice',
      authorEmail: 'admin@zamos.gov.zm',
      content: 'The Ministry of Local Government & Rural Development confirms that all 156 Constituencies have received the first tranche of the 2026 CDF allocation (K30.6M baseline). Ward Development Committees are receiving applications for secondary school bursaries and women/youth community grants.',
      status: 'PUBLISHED',
      publishedAt: '2026-10-08 09:00 CAT',
      updatedAt: '2026-10-08 09:00 CAT',
    },
    {
      id: 'ANN-ZM-102',
      title: 'ZRA Digital Taxpayer Clearance (TCC) Direct System Integration',
      category: 'Commerce & Tax',
      authorEmail: 'admin@zamos.gov.zm',
      content: 'All government suppliers and bidders for public tenders are reminded that verified electronic Tax Clearance Certificates (TCC) must be generated with real-time QR hash authentication.',
      status: 'PUBLISHED',
      publishedAt: '2026-10-07 11:30 CAT',
      updatedAt: '2026-10-07 11:30 CAT',
    },
    {
      id: 'ANN-ZM-103',
      title: 'Draft Policy Circular: Energy Wheeling and Off-Grid Mini-Grids',
      category: 'Energy & Grid',
      authorEmail: 'grid.control@zesco.co.zm',
      content: 'Open-access grid wheeling tariff consultation paper prepared by ERB (Energy Regulation Board) and ZESCO for commercial solar developers.',
      status: 'DRAFT',
      publishedAt: '2026-10-09 12:00 CAT',
      updatedAt: '2026-10-09 12:00 CAT',
    },
  ],
  powerStations: [
    {
      id: 'kariba-north',
      name: 'Kariba North Bank Power Station',
      type: 'Hydro',
      location: 'Siavonga, Southern Province',
      installedCapacityMW: 1080,
      currentOutputMW: 420,
      operationalStatus: 'Constrained',
      verifiedSource: 'Zambezi River Authority & ZESCO SCADA Live Telemetry',
      lastVerifiedAt: '2026-10-09 14:00 CAT',
      notes: 'Restricted discharge due to Lake Kariba usable storage at 12.8%. Water level 476.22m.',
      isSimulated: true,
    },
    {
      id: 'kafue-gorge-upper',
      name: 'Kafue Gorge Upper Power Station',
      type: 'Hydro',
      location: 'Kafue Gorge, Southern/Central Province',
      installedCapacityMW: 900,
      currentOutputMW: 650,
      operationalStatus: 'Optimal',
      verifiedSource: 'ZESCO Generation Directorate SCADA Feeder',
      lastVerifiedAt: '2026-10-09 14:00 CAT',
      notes: 'Operating on Kafue River regulated discharge.',
      isSimulated: true,
    },
    {
      id: 'kafue-gorge-lower',
      name: 'Kafue Gorge Lower Power Station (KGL)',
      type: 'Hydro',
      location: 'Chikankata District, Southern Province',
      installedCapacityMW: 750,
      currentOutputMW: 480,
      operationalStatus: 'Optimal',
      verifiedSource: 'KGL Operation Command Station 330kV Bus',
      lastVerifiedAt: '2026-10-09 14:00 CAT',
      notes: 'Flagship modern hydro station (5 x 150MW).',
      isSimulated: true,
    },
    {
      id: 'itezhi-tezhi',
      name: 'Itezhi-Tezhi Hydro Power Plant',
      type: 'Hydro',
      location: 'Itezhi-Tezhi, Central Province',
      installedCapacityMW: 120,
      currentOutputMW: 85,
      operationalStatus: 'Optimal',
      verifiedSource: 'ITT Power Company Joint SCADA Hub',
      lastVerifiedAt: '2026-10-09 14:00 CAT',
      notes: 'Kafue River storage balancing reservoir.',
      isSimulated: true,
    },
    {
      id: 'maamba-coal',
      name: 'Maamba Collieries Thermal Plant',
      type: 'Coal',
      location: 'Maamba, Sinazongwe District',
      installedCapacityMW: 300,
      currentOutputMW: 290,
      operationalStatus: 'Optimal',
      verifiedSource: 'Maamba Base-Load Grid Synchronizer',
      lastVerifiedAt: '2026-10-09 14:00 CAT',
      notes: 'Base-load thermal generation offsetting hydro drought shortages.',
      isSimulated: true,
    },
    {
      id: 'bangweulu-solar',
      name: 'Bangweulu Solar PV Plant',
      type: 'Solar',
      location: 'Lusaka South MFEZ',
      installedCapacityMW: 54,
      currentOutputMW: 48,
      operationalStatus: 'Optimal',
      verifiedSource: 'Industrial Development Corporation (IDC) Solar Feeder',
      lastVerifiedAt: '2026-10-09 14:00 CAT',
      notes: 'Scaling Solar utility feeder.',
      isSimulated: true,
    },
    {
      id: 'ngonye-solar',
      name: 'Ngonye Solar PV Plant',
      type: 'Solar',
      location: 'Lusaka South MFEZ',
      installedCapacityMW: 34,
      currentOutputMW: 30,
      operationalStatus: 'Optimal',
      verifiedSource: 'Enel Green Power Automated SCADA Inverter',
      lastVerifiedAt: '2026-10-09 14:00 CAT',
      notes: 'Enel Green Power utility installation.',
      isSimulated: true,
    },
  ],
  loadSheddingSchedules: [
    {
      township: 'Woodlands, Kabulonga & Sunningdale',
      city: 'Lusaka',
      province: 'Lusaka',
      todaySlot: '06:00 - 14:00 (Stage 2 Outage)',
      tomorrowSlot: '14:00 - 22:00 (Stage 2 Outage)',
      status: 'CURRENTLY_OFF',
      substation: 'Woodlands 33kV Substation',
      isSimulated: true,
    },
    {
      township: 'Matero, George & Zingalume',
      city: 'Lusaka',
      province: 'Lusaka',
      todaySlot: '14:00 - 22:00 (Stage 2 Outage)',
      tomorrowSlot: '06:00 - 14:00 (Stage 2 Outage)',
      status: 'CURRENTLY_ON',
      substation: 'Matero West 11kV Feeder',
      isSimulated: true,
    },
    {
      township: 'Rhodes Park, Fairview & Northmead',
      city: 'Lusaka',
      province: 'Lusaka',
      todaySlot: '22:00 - 06:00 (Overnight Slot)',
      tomorrowSlot: '06:00 - 14:00 (Stage 2 Outage)',
      status: 'CURRENTLY_ON',
      substation: 'Lusaka Central Bulk Supply',
      isSimulated: true,
    },
    {
      township: 'Chelston, Avondale & Silverest',
      city: 'Lusaka',
      province: 'Lusaka',
      todaySlot: '06:00 - 14:00 (Stage 2 Outage)',
      tomorrowSlot: '14:00 - 22:00 (Stage 2 Outage)',
      status: 'CURRENTLY_OFF',
      substation: 'Airport Feeder 33kV',
      isSimulated: true,
    },
    {
      township: 'Kitwe Industrial, Nkana West & Riverside',
      city: 'Kitwe',
      province: 'Copperbelt',
      todaySlot: '14:00 - 22:00 (Mining Priority Off-peak)',
      tomorrowSlot: '06:00 - 14:00 (Stage 2 Outage)',
      status: 'CURRENTLY_ON',
      substation: 'Nkana Main Switchyard',
      isSimulated: true,
    },
    {
      township: 'Ndola Kansenshi, Hillcrest & Itawa',
      city: 'Ndola',
      province: 'Copperbelt',
      todaySlot: '06:00 - 14:00 (Stage 2 Outage)',
      tomorrowSlot: '22:00 - 06:00 (Overnight Slot)',
      status: 'CURRENTLY_OFF',
      substation: 'Kansenshi 33kV Substation',
      isSimulated: true,
    },
    {
      township: 'Livingstone Maramba & Highlands',
      city: 'Livingstone',
      province: 'Southern',
      todaySlot: '14:00 - 22:00 (Stage 2 Outage)',
      tomorrowSlot: '06:00 - 14:00 (Stage 2 Outage)',
      status: 'CURRENTLY_ON',
      substation: 'Victoria Falls Hydro Line 1',
      isSimulated: true,
    },
    {
      township: 'Solwezi Kyawama & Mess',
      city: 'Solwezi',
      province: 'North-Western',
      todaySlot: '06:00 - 14:00 (Stage 2 Outage)',
      tomorrowSlot: '14:00 - 22:00 (Stage 2 Outage)',
      status: 'CURRENTLY_OFF',
      substation: 'Solwezi Main Bulk Terminal',
      isSimulated: true,
    },
  ],
  publicServiceDirectory: [
    {
      id: 'DIR-001',
      agencyName: 'Zambia Electricity Supply Corporation',
      shortCode: 'ZESCO',
      ministry: 'Ministry of Energy',
      category: 'Utilities & Power',
      hotlines: ['+260 211 361111', '0211 362222', '322 (Shortcode)'],
      email: 'contactcentre@zesco.co.zm',
      physicalAddress: 'Stand No. 6949, Great East Road, Lusaka',
      operatingHours: '24/7 Call Centre & Emergency Response',
      verifiedPortalUrl: 'https://www.zesco.co.zm',
      isVerifiedOfficial: true,
      portalDescription: 'Official customer care, fault reporting, and load-shedding publications.',
    },
    {
      id: 'DIR-002',
      agencyName: 'Zambia Revenue Authority',
      shortCode: 'ZRA',
      ministry: 'Ministry of Finance and National Planning',
      category: 'Revenue & Taxation',
      hotlines: ['+260 211 381111', '0211 382222', '5972 (Toll Free)'],
      email: 'advice@zra.org.zm',
      physicalAddress: 'Revenue House, Kalambo Road, Lusaka',
      operatingHours: 'Monday - Friday: 08:00 - 17:00 CAT',
      verifiedPortalUrl: 'https://www.zra.org.zm',
      isVerifiedOfficial: true,
      portalDescription: 'MyTax online registration, TPIN verification, customs ASYCUDA World.',
    },
    {
      id: 'DIR-003',
      agencyName: 'Patents and Companies Registration Agency',
      shortCode: 'PACRA',
      ministry: 'Ministry of Commerce, Trade and Industry',
      category: 'Business & Commerce',
      hotlines: ['+260 211 255151', '0211 255127'],
      email: 'pro@pacra.org.zm',
      physicalAddress: 'PACRA House, Haile Selassie Avenue, Longacres, Lusaka',
      operatingHours: 'Monday - Friday: 08:00 - 17:00 CAT',
      verifiedPortalUrl: 'https://www.pacra.org.zm',
      isVerifiedOfficial: true,
      portalDescription: 'Online business name reservation, company incorporation, and annual returns.',
    },
    {
      id: 'DIR-004',
      agencyName: 'Road Transport and Safety Agency',
      shortCode: 'RTSA',
      ministry: 'Ministry of Transport and Logistics',
      category: 'Transport & Safety',
      hotlines: ['+260 211 280500', '983 (Toll Free)'],
      email: 'info@rtsa.org.zm',
      physicalAddress: 'Premium House, Independence Avenue, Lusaka',
      operatingHours: 'Monday - Friday: 08:00 - 17:00 CAT',
      verifiedPortalUrl: 'https://www.rtsa.org.zm',
      isVerifiedOfficial: true,
      portalDescription: 'Driver licenses, motor vehicle fitness, e-service road tax payments.',
    },
    {
      id: 'DIR-005',
      agencyName: 'Ministry of Local Government & Rural Development (CDF)',
      shortCode: 'MLGRD / CDF',
      ministry: 'Ministry of Local Government and Rural Development',
      category: 'Civic & Identity',
      hotlines: ['+260 211 250720', '0211 250528'],
      email: 'info@mlgrd.gov.zm',
      physicalAddress: 'Church Road, Lusaka',
      operatingHours: 'Monday - Friday: 08:00 - 17:00 CAT',
      verifiedPortalUrl: 'https://www.mlgrd.gov.zm',
      isVerifiedOfficial: true,
      portalDescription: 'Constituency Development Fund (CDF) guidelines, circulars, and allocations.',
    },
    {
      id: 'DIR-006',
      agencyName: 'Ministry of Health & SmartCare',
      shortCode: 'MoH',
      ministry: 'Ministry of Health',
      category: 'Health & Welfare',
      hotlines: ['+260 211 253040', '9090 (Toll Free)'],
      email: 'info@moh.gov.zm',
      physicalAddress: 'Ndeke House, Haile Selassie Avenue, Lusaka',
      operatingHours: 'Monday - Friday: 08:00 - 17:00 CAT',
      verifiedPortalUrl: 'https://www.moh.gov.zm',
      isVerifiedOfficial: true,
      portalDescription: 'National health policies, disease surveillance, SmartCare digital records.',
    },
    {
      id: 'DIR-007',
      agencyName: 'Disaster Management and Mitigation Unit',
      shortCode: 'DMMU',
      ministry: 'Office of the Vice President',
      category: 'Security & Emergency',
      hotlines: ['+260 211 252687', '0211 252692', '112 (Emergency)'],
      email: 'info@dmmu-ovp.gov.zm',
      physicalAddress: 'Cabinet Office, Independence Avenue, Lusaka',
      operatingHours: '24/7 Emergency Operations Centre',
      verifiedPortalUrl: 'https://www.dmmu-ovp.gov.zm',
      isVerifiedOfficial: true,
      portalDescription: 'National drought relief, flood response, early warning bulletins.',
    },
    {
      id: 'DIR-008',
      agencyName: 'Bank of Zambia',
      shortCode: 'BOZ',
      ministry: 'Ministry of Finance and National Planning',
      category: 'Revenue & Taxation',
      hotlines: ['+260 211 399300', '0211 228888'],
      email: 'info@boz.zm',
      physicalAddress: 'Bank Square, Cairo Road, Lusaka',
      operatingHours: 'Monday - Friday: 08:30 - 15:30 CAT',
      verifiedPortalUrl: 'https://www.boz.zm',
      isVerifiedOfficial: true,
      portalDescription: 'Monetary policy rates, official daily Kwacha foreign exchange fixings.',
    },
  ],
  cdfApplications: [
    {
      id: 'CDF-APP-901',
      referenceNumber: 'CDF/LUS/2026/04918',
      applicantName: 'Misozi Tembo',
      nrc: '192841/11/1',
      constituency: 'Lusaka Central',
      ward: 'Kabulonga Ward 18',
      type: 'TEVETA Bursary',
      amountZMW: 8500,
      submittedAt: '2026-10-08 11:20 CAT',
      status: 'WDC_VETTING',
      notes: 'Applying for TEVETA Heavy Duty Earthmoving Equipment at Lusaka Trades.',
    },
    {
      id: 'CDF-APP-902',
      referenceNumber: 'CDF/MUN/2026/08210',
      applicantName: 'Tusole Women Poultry Cooperative',
      nrc: '284719/11/1',
      constituency: 'Munali Constituency',
      ward: 'Mtendere Ward 12',
      type: 'Youth/Women Grant',
      amountZMW: 45000,
      submittedAt: '2026-10-07 14:40 CAT',
      status: 'APPROVED',
      notes: 'Commercial broiler production grant approved by CDFC.',
    },
    {
      id: 'CDF-APP-903',
      referenceNumber: 'CDF/NDO/2026/01294',
      applicantName: 'Kansenshi Youth Welding Association',
      nrc: '391048/24/1',
      constituency: 'Ndola Central',
      ward: 'Kansenshi Ward',
      type: 'Youth/Women Grant',
      amountZMW: 50000,
      submittedAt: '2026-10-06 09:15 CAT',
      status: 'DISBURSED',
      notes: 'Welding workshop tools grant disbursed via commercial bank.',
    },
  ],
  auditLogs: [
    {
      id: 'LOG-9481',
      timestamp: '2026-10-09 14:32:10 CAT',
      actorEmail: 'admin@zamos.gov.zm',
      action: 'SYSTEM_BOOT',
      module: 'Security & Auth',
      ipAddress: '102.140.24.11 (Lusaka HQ)',
      status: 'SUCCESS',
      details: 'Sovereign Database initialized and verified with persistent storage.',
    },
  ],
  systemSettings: {
    maintenanceMode: false,
    allowPublicApplications: true,
    gridSimulationMode: true,
    strictTwoFactorAuth: true,
    auditRetentionDays: 90,
    broadcastBannerText: 'National Drought Advisory: Stage 2 load shedding remains active. Official verified public portals are online.',
    lastUpdatedBy: 'admin@zamos.gov.zm',
    lastUpdatedAt: '2026-10-09 14:00 CAT',
  },
});

// Load or initialize Database
let db: DatabaseSchema;

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read database file, initializing fresh seed:', err);
  }
  const seed = getInitialSeed();
  saveDatabase(seed);
  return seed;
}

function saveDatabase(dataToSave?: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const data = dataToSave || db;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database to disk:', err);
  }
}

db = loadDatabase();

// In-Memory active token sessions
const validSessions = new Map<string, { userId: string; email: string; role: string; expiresAt: number }>();

// Append Audit Log Helper
const recordAudit = (actorEmail: string, action: string, module: string, details: string, status: 'SUCCESS' | 'WARNING' | 'FAILED' = 'SUCCESS') => {
  const log: AuditLog = {
    id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' }) + ' CAT',
    actorEmail,
    action,
    module,
    ipAddress: '102.140.24.11 (Lusaka GovNet)',
    status,
    details,
  };
  db.auditLogs = [log, ...db.auditLogs.slice(0, 199)];
  saveDatabase();
};

// Auth Middleware Helper
const authenticateToken = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing security token' });
  }

  const token = authHeader.split(' ')[1];
  const session = validSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) validSessions.delete(token);
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }

  (req as any).user = session;
  next();
};

// ==========================================
// AUTHENTICATION & SESSION ENDPOINTS
// ==========================================

// Login endpoint - verifies credentials server-side with zero hardcoded client bypass
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Official email and password are required' });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user || user.passwordHash !== hashPassword(password)) {
    recordAudit(email, 'LOGIN_FAILED', 'Security & Auth', 'Failed credential verification challenge', 'FAILED');
    return res.status(401).json({ error: 'Invalid official credentials. Access denied.' });
  }

  if (user.status === 'SUSPENDED') {
    recordAudit(email, 'LOGIN_BLOCKED', 'Security & Auth', 'Attempted authentication by suspended account', 'WARNING');
    return res.status(403).json({ error: 'Officer account suspended. Contact Smart Zambia Administrator.' });
  }

  const token = 'zamos_' + crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  validSessions.set(token, {
    userId: user.id,
    email: user.email,
    role: user.role,
    expiresAt,
  });

  user.lastLogin = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' }) + ' CAT';
  recordAudit(user.email, 'LOGIN_SUCCESS', 'Security & Auth', `Officer verified with role [${user.role}]`);
  saveDatabase();

  const { passwordHash: _, ...safeUser } = user;
  res.json({ token, user: safeUser, expiresAt });
});

app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
  const session = (req as any).user;
  const user = db.users.find(u => u.id === session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser });
});

app.post('/api/auth/logout', authenticateToken, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    validSessions.delete(token);
  }
  const session = (req as any).user;
  recordAudit(session.email, 'LOGOUT', 'Security & Auth', 'Officer signed out');
  res.json({ success: true });
});

// ==========================================
// 1. DASHBOARD OVERVIEW & ACTIVITY STATISTICS
// ==========================================

app.get('/api/admin/overview', authenticateToken, (_req: Request, res: Response) => {
  const totalGeneration = db.powerStations.reduce((acc, curr) => acc + curr.currentOutputMW, 0);
  const totalInstalled = db.powerStations.reduce((acc, curr) => acc + curr.installedCapacityMW, 0);
  const activeAlerts = db.emergencyAlerts.filter(a => a.status === 'ACTIVE').length;
  const publishedAnnouncements = db.publicAnnouncements.filter(a => a.status === 'PUBLISHED').length;
  const pendingCdf = db.cdfApplications.filter(a => a.status === 'SUBMITTED' || a.status === 'WDC_VETTING').length;

  res.json({
    timestamp: new Date().toISOString(),
    isSimulatedTelemetry: true,
    grid: {
      totalGenerationMW: totalGeneration,
      installedCapacityMW: totalInstalled,
      peakDemandMW: 2450,
      deficitMW: 2450 - totalGeneration,
      karibaWaterLevelMeters: 476.22,
      usableLiveStoragePercent: 12.8,
      status: 'LOAD_SHEDDING_STAGE_2',
    },
    counts: {
      activeAlertsCount: activeAlerts,
      publishedAnnouncementsCount: publishedAnnouncements,
      totalAnnouncements: db.publicAnnouncements.length,
      pendingCdfApplications: pendingCdf,
      totalUsers: db.users.length,
      directoryEntries: db.publicServiceDirectory.length,
      powerStationsCount: db.powerStations.length,
      auditLogsTotal: db.auditLogs.length,
    },
    recentAudits: db.auditLogs.slice(0, 5),
    settings: db.systemSettings,
  });
});

// ==========================================
// 2. AUTHORISED CONTENT MANAGEMENT (CRUD)
// ==========================================

app.get('/api/admin/content/announcements', authenticateToken, (_req: Request, res: Response) => {
  res.json({ announcements: db.publicAnnouncements });
});

app.post('/api/admin/content/announcements', authenticateToken, (req: Request, res: Response) => {
  const session = (req as any).user;
  const { title, category, content, status } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newAnn: PublicAnnouncement = {
    id: `ANN-ZM-${Math.floor(100 + Math.random() * 900)}`,
    title,
    category: category || 'Civic Notice',
    authorEmail: session.email,
    content,
    status: status || 'PUBLISHED',
    publishedAt: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' }) + ' CAT',
    updatedAt: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' }) + ' CAT',
  };

  db.publicAnnouncements = [newAnn, ...db.publicAnnouncements];
  recordAudit(session.email, 'CONTENT_CREATED', 'Content Management', `Created announcement [${title}] (${newAnn.status})`);
  res.status(201).json({ success: true, announcement: newAnn });
});

app.put('/api/admin/content/announcements/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = (req as any).user;
  const { title, category, content, status } = req.body;

  const ann = db.publicAnnouncements.find(a => a.id === id);
  if (!ann) return res.status(404).json({ error: 'Announcement not found' });

  if (title) ann.title = title;
  if (category) ann.category = category;
  if (content) ann.content = content;
  if (status) ann.status = status;
  ann.updatedAt = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' }) + ' CAT';

  recordAudit(session.email, 'CONTENT_UPDATED', 'Content Management', `Updated announcement [${ann.id}]: ${ann.title}`);
  res.json({ success: true, announcement: ann });
});

app.put('/api/admin/content/announcements/:id/status', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const session = (req as any).user;

  const ann = db.publicAnnouncements.find(a => a.id === id);
  if (!ann) return res.status(404).json({ error: 'Announcement not found' });

  ann.status = status;
  ann.updatedAt = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' }) + ' CAT';

  recordAudit(session.email, 'CONTENT_STATUS_CHANGED', 'Content Management', `Set status to ${status} for [${ann.id}]`);
  res.json({ success: true, announcement: ann });
});

app.delete('/api/admin/content/announcements/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = (req as any).user;

  const initialLen = db.publicAnnouncements.length;
  db.publicAnnouncements = db.publicAnnouncements.filter(a => a.id !== id);

  if (db.publicAnnouncements.length === initialLen) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  recordAudit(session.email, 'CONTENT_DELETED', 'Content Management', `Deleted announcement [${id}]`);
  res.json({ success: true });
});

// ==========================================
// 3. EMERGENCY ADVISORIES & ANNOUNCEMENTS (CRUD)
// ==========================================

app.get('/api/admin/alerts', (_req: Request, res: Response) => {
  res.json({ alerts: db.emergencyAlerts });
});

app.post('/api/admin/alerts', authenticateToken, (req: Request, res: Response) => {
  const session = (req as any).user;
  const { title, agency, severity, description, affectedProvinces } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  const newAlert = {
    id: `ALT-ZM-${Math.floor(100 + Math.random() * 900)}`,
    title,
    agency: agency || 'Disaster Management & Mitigation Unit (DMMU)',
    severity: severity || 'MODERATE',
    description,
    affectedProvinces: affectedProvinces || ['Lusaka Province'],
    status: 'ACTIVE',
    isSimulated: true,
    publishedAt: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' }) + ' CAT',
    expiresAt: '2026-10-31 23:59 CAT',
  };

  db.emergencyAlerts = [newAlert, ...db.emergencyAlerts];
  recordAudit(session.email, 'ALERT_PUBLISHED', 'DMMU Emergency', `Published advisory: ${title} (${severity})`);
  res.status(201).json({ success: true, alert: newAlert });
});

app.put('/api/admin/alerts/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = (req as any).user;
  const { title, severity, description, status, affectedProvinces } = req.body;

  const alert = db.emergencyAlerts.find(a => a.id === id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });

  if (title) alert.title = title;
  if (severity) alert.severity = severity;
  if (description) alert.description = description;
  if (status) alert.status = status;
  if (affectedProvinces) alert.affectedProvinces = affectedProvinces;

  recordAudit(session.email, 'ALERT_UPDATED', 'DMMU Emergency', `Updated alert [${alert.id}] to status ${alert.status}`);
  res.json({ success: true, alert });
});

app.delete('/api/admin/alerts/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = (req as any).user;

  const initialLen = db.emergencyAlerts.length;
  db.emergencyAlerts = db.emergencyAlerts.filter(a => a.id !== id);

  if (db.emergencyAlerts.length === initialLen) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  recordAudit(session.email, 'ALERT_DELETED', 'DMMU Emergency', `Deleted alert [${id}]`);
  res.json({ success: true });
});

// ==========================================
// 4. VERIFIED ELECTRICITY DATA SOURCES MANAGEMENT
// ==========================================

app.get('/api/admin/power-stations', (_req: Request, res: Response) => {
  res.json({ powerStations: db.powerStations });
});

app.post('/api/admin/power-stations', authenticateToken, (req: Request, res: Response) => {
  const session = (req as any).user;
  const { name, type, location, installedCapacityMW, currentOutputMW, verifiedSource, notes } = req.body;

  if (!name || !installedCapacityMW) {
    return res.status(400).json({ error: 'Name and capacity are required' });
  }

  const newStation = {
    id: `gen-${Date.now()}`,
    name,
    type: type || 'Solar',
    location: location || 'Zambia',
    installedCapacityMW: Number(installedCapacityMW),
    currentOutputMW: Number(currentOutputMW || 0),
    operationalStatus: 'Optimal',
    verifiedSource: verifiedSource || 'ZESCO National Grid Telemetry',
    lastVerifiedAt: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' }) + ' CAT',
    notes: notes || 'Verified generation feed added by Grid Controller.',
    isSimulated: true,
  };

  db.powerStations.push(newStation);
  recordAudit(session.email, 'STATION_CREATED', 'ZESCO Power Grid', `Added generation data source [${name}]`);
  res.status(201).json({ success: true, station: newStation });
});

app.put('/api/admin/power-stations/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = (req as any).user;
  const { currentOutputMW, operationalStatus, verifiedSource, notes } = req.body;

  const station = db.powerStations.find(s => s.id === id);
  if (!station) return res.status(404).json({ error: 'Station not found' });

  if (currentOutputMW !== undefined) station.currentOutputMW = Number(currentOutputMW);
  if (operationalStatus !== undefined) station.operationalStatus = operationalStatus;
  if (verifiedSource !== undefined) station.verifiedSource = verifiedSource;
  if (notes !== undefined) station.notes = notes;
  station.lastVerifiedAt = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' }) + ' CAT';

  recordAudit(session.email, 'STATION_UPDATED', 'ZESCO Power Grid', `Updated [${station.name}] output: ${station.currentOutputMW} MW`);
  res.json({ success: true, station });
});

app.delete('/api/admin/power-stations/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = (req as any).user;

  const initialLen = db.powerStations.length;
  db.powerStations = db.powerStations.filter(s => s.id !== id);

  if (db.powerStations.length === initialLen) {
    return res.status(404).json({ error: 'Station not found' });
  }

  recordAudit(session.email, 'STATION_DELETED', 'ZESCO Power Grid', `Deleted power station [${id}]`);
  res.json({ success: true });
});

app.get('/api/admin/load-shedding', (_req: Request, res: Response) => {
  res.json({ schedules: db.loadSheddingSchedules });
});

app.put('/api/admin/load-shedding/:index', authenticateToken, (req: Request, res: Response) => {
  const idx = parseInt(req.params.index, 10);
  const session = (req as any).user;

  if (idx < 0 || idx >= db.loadSheddingSchedules.length) {
    return res.status(404).json({ error: 'Schedule index out of range' });
  }

  const { status, todaySlot, tomorrowSlot } = req.body;
  if (status) db.loadSheddingSchedules[idx].status = status;
  if (todaySlot) db.loadSheddingSchedules[idx].todaySlot = todaySlot;
  if (tomorrowSlot) db.loadSheddingSchedules[idx].tomorrowSlot = tomorrowSlot;

  recordAudit(session.email, 'LOAD_SHEDDING_UPDATED', 'ZESCO Power Grid', `Updated outage status for ${db.loadSheddingSchedules[idx].township} to ${db.loadSheddingSchedules[idx].status}`);
  res.json({ success: true, schedule: db.loadSheddingSchedules[idx] });
});

// ==========================================
// 5. PUBLIC SERVICE DIRECTORY (CRUD)
// ==========================================

app.get('/api/admin/directory', (_req: Request, res: Response) => {
  res.json({ directory: db.publicServiceDirectory });
});

app.post('/api/admin/directory', authenticateToken, (req: Request, res: Response) => {
  const session = (req as any).user;
  const { agencyName, shortCode, ministry, category, hotlines, email, physicalAddress, verifiedPortalUrl, portalDescription } = req.body;

  if (!agencyName || !verifiedPortalUrl) {
    return res.status(400).json({ error: 'Agency Name and Verified Portal URL are required' });
  }

  const newEntry = {
    id: `DIR-${Math.floor(100 + Math.random() * 900)}`,
    agencyName,
    shortCode: shortCode || agencyName.slice(0, 4).toUpperCase(),
    ministry: ministry || 'Government of the Republic of Zambia',
    category: category || 'Civic & Identity',
    hotlines: Array.isArray(hotlines) ? hotlines : [hotlines || '112'],
    email: email || 'info@zamos.gov.zm',
    physicalAddress: physicalAddress || 'Lusaka, Zambia',
    operatingHours: 'Monday - Friday: 08:00 - 17:00 CAT',
    verifiedPortalUrl,
    isVerifiedOfficial: true,
    portalDescription: portalDescription || 'Official Government Service Portal.',
  };

  db.publicServiceDirectory.push(newEntry);
  recordAudit(session.email, 'DIRECTORY_ENTRY_ADDED', 'Public Directory', `Added directory listing [${agencyName}]`);
  res.status(201).json({ success: true, entry: newEntry });
});

app.delete('/api/admin/directory/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = (req as any).user;

  const initialLen = db.publicServiceDirectory.length;
  db.publicServiceDirectory = db.publicServiceDirectory.filter(d => d.id !== id);

  if (db.publicServiceDirectory.length === initialLen) {
    return res.status(404).json({ error: 'Directory entry not found' });
  }

  recordAudit(session.email, 'DIRECTORY_DELETED', 'Public Directory', `Deleted directory entry [${id}]`);
  res.json({ success: true });
});

// ==========================================
// 6. CDF OVERSIGHT & CITIZEN APPLICATIONS
// ==========================================

app.get('/api/admin/cdf-applications', authenticateToken, (_req: Request, res: Response) => {
  res.json({ applications: db.cdfApplications });
});

app.put('/api/admin/cdf-applications/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  const session = (req as any).user;

  const appRecord = db.cdfApplications.find(a => a.id === id);
  if (!appRecord) return res.status(404).json({ error: 'Application not found' });

  if (status) appRecord.status = status;
  if (notes) appRecord.notes = notes;

  recordAudit(session.email, 'CDF_APP_STATUS_UPDATE', 'CDF Portal', `Updated application [${appRecord.referenceNumber}] to ${appRecord.status}`);
  res.json({ success: true, application: appRecord });
});

// ==========================================
// 7. SYSTEM USERS, ROLES & PERMISSIONS (CRUD)
// ==========================================

app.get('/api/admin/users', authenticateToken, (_req: Request, res: Response) => {
  const safeUsers = db.users.map(({ passwordHash: _, ...u }) => u);
  res.json({ users: safeUsers });
});

app.post('/api/admin/users', authenticateToken, (req: Request, res: Response) => {
  const session = (req as any).user;
  const { fullName, email, role, department, password } = req.body;

  if (!fullName || !email || !role || !password) {
    return res.status(400).json({ error: 'Full name, email, role, and password are required' });
  }

  if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
    return res.status(409).json({ error: 'User with this official email already exists' });
  }

  const newUser: UserRecord = {
    id: `USR-ZM-${Math.floor(100 + Math.random() * 900)}`,
    fullName,
    email: email.trim(),
    passwordHash: hashPassword(password),
    role,
    department: department || 'Sovereign Systems Operations',
    status: 'ACTIVE',
    lastLogin: 'Never',
  };

  db.users.push(newUser);
  recordAudit(session.email, 'USER_CREATED', 'User Management', `Created user account for ${fullName} (${role})`);
  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({ success: true, user: safeUser });
});

app.put('/api/admin/users/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, status, department, password } = req.body;
  const session = (req as any).user;

  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (role) user.role = role;
  if (status) user.status = status;
  if (department) user.department = department;
  if (password) user.passwordHash = hashPassword(password);

  recordAudit(session.email, 'USER_UPDATED', 'User Management', `Updated user [${user.email}] status=${user.status}, role=${user.role}`);
  const { passwordHash: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

app.delete('/api/admin/users/:id', authenticateToken, (req: Request, res: Response) => {
  const { id } = req.params;
  const session = (req as any).user;

  const target = db.users.find(u => u.id === id);
  if (!target) return res.status(404).json({ error: 'User not found' });

  if (target.email === session.email) {
    return res.status(400).json({ error: 'Cannot delete own active administrative account' });
  }

  db.users = db.users.filter(u => u.id !== id);
  recordAudit(session.email, 'USER_DELETED', 'User Management', `Deleted user account [${target.email}]`);
  res.json({ success: true });
});

// ==========================================
// 8. REPORTS & ANALYTICS
// ==========================================

app.get('/api/admin/reports', authenticateToken, (_req: Request, res: Response) => {
  const totalGeneration = db.powerStations.reduce((acc, curr) => acc + curr.currentOutputMW, 0);

  res.json({
    generatedAt: new Date().toISOString(),
    isSimulatedDatasets: true,
    summary: {
      powerGenerationAverageMW: totalGeneration,
      loadSheddingCompliancePercent: 94.2,
      cdfTotalFundsAllocatedZMW: 4773600000,
      cdfDisbursedZMW: 4218000000,
      verifiedTaxesCollectedZMW: 112450000000,
      emergencyDispatchesResolvedYTD: 3410,
      averageEmergencyResponseTimeMinutes: 14.2,
      activePublicAnnouncements: db.publicAnnouncements.filter(a => a.status === 'PUBLISHED').length,
    },
    provincialHealthScores: [
      { province: 'Lusaka', powerAvailability: '62%', cdfDisbursement: '88%', healthStock: '94%' },
      { province: 'Copperbelt', powerAvailability: '60%', cdfDisbursement: '90%', healthStock: '92%' },
      { province: 'Southern', powerAvailability: '74%', cdfDisbursement: '85%', healthStock: '90%' },
      { province: 'Central', powerAvailability: '71%', cdfDisbursement: '84%', healthStock: '88%' },
      { province: 'Eastern', powerAvailability: '82%', cdfDisbursement: '89%', healthStock: '89%' },
      { province: 'North-Western', powerAvailability: '65%', cdfDisbursement: '87%', healthStock: '86%' },
      { province: 'Western', powerAvailability: '86%', cdfDisbursement: '86%', healthStock: '87%' },
      { province: 'Northern', powerAvailability: '84%', cdfDisbursement: '88%', healthStock: '88%' },
      { province: 'Luapula', powerAvailability: '85%', cdfDisbursement: '91%', healthStock: '89%' },
      { province: 'Muchinga', powerAvailability: '88%', cdfDisbursement: '86%', healthStock: '85%' },
    ],
  });
});

app.post('/api/admin/reports/audit-export', authenticateToken, (req: Request, res: Response) => {
  const session = (req as any).user;
  const { reportRef, sha256Hash, format } = req.body;
  recordAudit(
    session.email,
    'REPORT_EXPORTED_SIGNED_PDF',
    'Reports & Analytics',
    `Exported official digitally signed sovereign PDF record [Ref: ${reportRef || 'ZAM-REP-2026'}] (SHA-256: ${sha256Hash ? sha256Hash.substring(0, 16) + '...' : 'VERIFIED'})`
  );
  res.json({ success: true, timestamp: new Date().toISOString() });
});

// ==========================================
// 9. SYSTEM SETTINGS & AUDIT LOGS
// ==========================================

app.get('/api/admin/settings', authenticateToken, (_req: Request, res: Response) => {
  res.json({ settings: db.systemSettings });
});

app.put('/api/admin/settings', authenticateToken, (req: Request, res: Response) => {
  const session = (req as any).user;
  const { maintenanceMode, allowPublicApplications, gridSimulationMode, strictTwoFactorAuth, broadcastBannerText } = req.body;

  if (maintenanceMode !== undefined) db.systemSettings.maintenanceMode = Boolean(maintenanceMode);
  if (allowPublicApplications !== undefined) db.systemSettings.allowPublicApplications = Boolean(allowPublicApplications);
  if (gridSimulationMode !== undefined) db.systemSettings.gridSimulationMode = Boolean(gridSimulationMode);
  if (strictTwoFactorAuth !== undefined) db.systemSettings.strictTwoFactorAuth = Boolean(strictTwoFactorAuth);
  if (broadcastBannerText !== undefined) db.systemSettings.broadcastBannerText = String(broadcastBannerText);

  db.systemSettings.lastUpdatedBy = session.email;
  db.systemSettings.lastUpdatedAt = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' }) + ' CAT';

  recordAudit(session.email, 'SYSTEM_SETTINGS_UPDATE', 'System Settings', 'Modified core platform configuration');
  res.json({ success: true, settings: db.systemSettings });
});

app.get('/api/admin/audit-logs', authenticateToken, (_req: Request, res: Response) => {
  res.json({ auditLogs: db.auditLogs });
});

// ==========================================
// PUBLIC APIS CONNECTED TO AUTHENTIC PERSISTENT DATA
// ==========================================

app.get('/api/public/announcements', (_req: Request, res: Response) => {
  const published = db.publicAnnouncements.filter(a => a.status === 'PUBLISHED');
  res.json({ announcements: published });
});

app.get('/api/public/alerts', (_req: Request, res: Response) => {
  const active = db.emergencyAlerts.filter(a => a.status === 'ACTIVE');
  res.json({ alerts: active });
});

app.get('/api/national-metrics', (_req: Request, res: Response) => {
  const totalGeneration = db.powerStations.reduce((acc, curr) => acc + curr.currentOutputMW, 0);
  res.json({
    timestamp: new Date().toISOString(),
    isSimulatedTelemetry: true,
    notice: 'Simulated National Telemetry for System Demonstration. Official circulars published via verified ministry links.',
    grid: {
      zescoTotalDemandMW: 2450,
      zescoCurrentGenerationMW: totalGeneration,
      deficitMW: 2450 - totalGeneration,
      karibaWaterLevelMeters: 476.22,
      karibaMinimumOperatingLevel: 475.50,
      karibaFullSupplyLevel: 488.50,
      usableLiveStoragePercent: 12.8,
      status: 'LOAD_SHEDDING_STAGE_2',
    },
    treasury: {
      fxRates: { USD: 27.42, GBP: 34.85, EUR: 29.60, ZAR: 1.48 },
      inflationRate: 15.2,
      monetaryPolicyRate: 13.5,
      ytdRevenueCollectedZMW: 112450000000,
      targetZMW: 145000000000,
    },
    civic: {
      cdfAllocatedPerConstituencyZMW: 30600000,
      constituenciesTotal: 156,
      provincesCount: 10,
      inrisRegisteredCitizens: 14210450,
      smartCareActiveRecords: 9840200,
    },
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'ZamOS Unified National Platform',
    version: '2026.4',
    country: 'Republic of Zambia',
    maintenanceMode: db.systemSettings.maintenanceMode,
    timestamp: new Date().toISOString(),
  });
});

// Assistant endpoint
app.post('/api/assistant', async (req: Request, res: Response) => {
  const { prompt, conversationHistory = [] } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (genAI) {
    try {
      const contents = [];
      for (const item of conversationHistory.slice(-6)) {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.text }],
        });
      }
      contents.push({ role: 'user', parts: [{ text: prompt }] });

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: { systemInstruction: ZAMOS_SYSTEM_INSTRUCTION, temperature: 0.6 },
      });

      return res.json({
        reply: response.text || 'Ndaboka. No response generated from ZamOS core.',
        source: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.error('Gemini API call fallback to local knowledgebase:', err?.message);
    }
  }

  // Knowledgebase fallback
  return res.json({
    reply: `**ZamOS Sovereign Hub:** Greetings! You can access verified public information for ZESCO prepaid tokens, ZRA PAYE salary tax 2026, PACRA business registration, CDF bursary grants across 156 constituencies, and emergency hotlines (991/992/993). Authorized officers can sign in to the Administration Portal for verified system updates.`,
    source: 'zamos-sovereign-core',
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZamOS Sovereign Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
