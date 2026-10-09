export type TabId = 
  | 'overview' 
  | 'zesco' 
  | 'zra' 
  | 'rtsa' 
  | 'pacra' 
  | 'cdf' 
  | 'smartcare' 
  | 'boz' 
  | 'emergency' 
  | 'assistant'
  | 'admin';

export type AdminTabId =
  | 'admin_overview'
  | 'admin_content'
  | 'admin_alerts'
  | 'admin_grid'
  | 'admin_directory'
  | 'admin_cdf'
  | 'admin_users'
  | 'admin_reports'
  | 'admin_settings';

export interface ProvinceInfo {
  id: string;
  name: string;
  capital: string;
  population: string;
  areaKm2: number;
  constituenciesCount: number;
  economicPillars: string[];
  powerDeficitAlert: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  majorHospital: string;
  activeCdfProjects: number;
}

export interface PowerStation {
  id: string;
  name: string;
  type: 'Hydro' | 'Coal' | 'Solar' | 'Diesel';
  location: string;
  installedCapacityMW: number;
  currentOutputMW: number;
  operationalStatus: 'Optimal' | 'Constrained' | 'Maintenance';
  notes: string;
  verifiedSource?: string;
  lastVerifiedAt?: string;
  isSimulated?: boolean;
}

export interface LoadSheddingSchedule {
  township: string;
  city: string;
  province: string;
  todaySlot: string;
  tomorrowSlot: string;
  status: 'CURRENTLY_OFF' | 'CURRENTLY_ON';
  substation: string;
  isSimulated?: boolean;
}

export interface LukuTransaction {
  id: string;
  meterNumber: string;
  customerName: string;
  amountZMW: number;
  unitsKWh: number;
  tokenNumber: string;
  date: string;
  receiptNumber: string;
  isSimulated?: boolean;
}

export interface CdfConstituency {
  id: string;
  name: string;
  province: string;
  totalAllocationZMW: number;
  disbursedZMW: number;
  activeProjects: number;
  bursariesAwarded: number;
  grantsDisbursedZMW: number;
  mpName: string;
  recentProjects: Array<{
    title: string;
    type: 'Health' | 'Education' | 'Water' | 'Roads' | 'Empowerment';
    costZMW: number;
    status: 'Completed' | 'Ongoing' | 'Tendering';
  }>;
}

export interface HospitalFacility {
  id: string;
  name: string;
  province: string;
  city: string;
  level: string;
  totalBeds: number;
  availableBeds: number;
  icuAvailable: number;
  traumaCenterStatus: 'Active' | 'Surge' | 'Full';
  smartCareConnected: boolean;
  isSimulated?: boolean;
}

export interface TollPlaza {
  id: string;
  name: string;
  route: string;
  province: string;
  smallVehicleFeeZMW: number;
  truckFeeZMW: number;
  liveQueueMins: number;
  activeBooths: number;
  isSimulated?: boolean;
}

export interface BorderPost {
  id: string;
  name: string;
  borderWith: string;
  commercialQueueHours: number;
  asycudaStatus: 'ONLINE' | 'DEGRADED';
  dailyClearedTrucks: number;
  isSimulated?: boolean;
}

// In-App Notification Center
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'approval' | 'system';
  severity: 'CRITICAL' | 'HIGH' | 'INFO' | 'SUCCESS';
  timestamp: string;
  read: boolean;
  targetTab?: TabId;
  metadata?: Record<string, any>;
}

// Admin Dashboard Types
export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'Super Administrator' | 'ZESCO Grid Controller' | 'DMMU Dispatch Director' | 'CDF National Auditor' | 'Content Manager' | 'ZRA Revenue Analyst';
  department: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_2FA';
  lastLogin: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  agency: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ADVISORY';
  description: string;
  affectedProvinces: string[];
  status: 'ACTIVE' | 'STANDBY' | 'RESOLVED' | 'ARCHIVED';
  isSimulated: boolean;
  publishedAt: string;
  expiresAt: string;
}

export interface PublicAnnouncement {
  id: string;
  title: string;
  category: 'Policy & Governance' | 'Energy & Grid' | 'Public Health' | 'Commerce & Tax' | 'Civic Notice';
  authorEmail: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string;
  updatedAt: string;
}

export interface PublicServiceEntry {
  id: string;
  agencyName: string;
  shortCode: string;
  ministry: string;
  category: 'Utilities & Power' | 'Revenue & Taxation' | 'Transport & Safety' | 'Business & Commerce' | 'Health & Welfare' | 'Civic & Identity' | 'Security & Emergency';
  hotlines: string[];
  email: string;
  physicalAddress: string;
  operatingHours: string;
  verifiedPortalUrl: string;
  isVerifiedOfficial: boolean;
  portalDescription: string;
}

export interface CdfApplicationRecord {
  id: string;
  referenceNumber: string;
  applicantName: string;
  nrc: string;
  constituency: string;
  ward: string;
  type: 'TEVETA Bursary' | 'Youth/Women Grant' | 'Community Project';
  amountZMW: number;
  submittedAt: string;
  status: 'SUBMITTED' | 'WDC_VETTING' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  notes: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  action: string;
  module: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  allowPublicApplications: boolean;
  gridSimulationMode: boolean;
  strictTwoFactorAuth: boolean;
  auditRetentionDays: number;
  broadcastBannerText: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}
