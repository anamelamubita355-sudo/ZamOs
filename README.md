# ZamOS — Republic of Zambia Sovereign Systems Hub

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-green.svg)](https://opensource.org/licenses/Apache-2.0)

**ZamOS** is an integrated national digital platform and sovereign operations hub for the **Republic of Zambia**. It unifies parastatals, regulatory authorities, provincial administration across all 10 provinces, verified citizen utilities, and a secure administration portal.

---

## 🏛 Key Systems & Modules

1. **National Sovereign Command & 10-Provinces Matrix**:
   - Live telemetry for national power deficit, Lake Kariba reservoir storage, and provincial infrastructure.
   - Interactive data matrix covering Lusaka, Copperbelt, Southern, Central, Eastern, North-Western, Western, Northern, Luapula, and Muchinga.
2. **ZESCO Power Grid & LUKU Prepayment**:
   - Lake Kariba water level tracker and generation breakdown across Kariba North Bank, Kafue Gorge Upper/Lower, Itezhi-Tezhi, Maamba Coal, and Solar PV plants.
   - 20-digit STS prepaid electricity token generator with PDF/text receipt printing.
   - Official township load-shedding timetable lookup.
3. **Zambia Revenue Authority (ZRA) Tax Portal**:
   - Official 2026 PAYE salary calculator with statutory tax bands (0%, 20%, 30%, 37%), NAPSA (5%), and NHIMA (1%).
   - TPIN verification and electronic Tax Clearance Certificate (TCC) generation with verification QR codes.
   - Commercial border customs status across Kazungula, Chirundu, Kasumbalesa, Nakonde, and Katima Mulilo.
4. **RTSA & NRFA Transport Infrastructure**:
   - Driver's license validity checker and 3-year biometric renewal system.
   - Motor vehicle fitness and road tax payment calculator.
   - National Road Fund Agency (NRFA) e-Toll Pass balance manager across Zambian toll plazas.
5. **PACRA Business & Enterprise Registration**:
   - Instant business name availability checker.
   - 4-step digital company incorporation wizard with official Certificate of Incorporation generation.
6. **Constituency Development Fund (CDF) Transparency Engine**:
   - Tracking statutory K30.6 Million allocations across all 156 constituencies.
   - Project inspection for schools, maternity clinics, solar boreholes, and bursaries.
   - Citizen grant and secondary school bursary digital application workflow.
7. **Ministry of Health (MoH) SmartCare & ZAMMSA**:
   - SmartCare National Electronic Health Record patient lookup by NRC/SmartCare ID.
   - Referral hospital bed and ICU capacity telemetry.
   - ZAMMSA essential medicine stock index and epidemiological alert bulletin.
8. **Bank of Zambia (BOZ) & National Payments Switch**:
   - Daily official foreign exchange fixings (USD, GBP, EUR, ZAR) and live currency converter.
   - BOZ monetary policy rate and national inflation tracking.
   - Interoperable mobile money gateway supporting Airtel Money, MTN MoMo, and Zamtel Kwacha.
9. **National 991/992/993 & DMMU Emergency Dispatch**:
   - Unified SOS dispatcher for Zambia Police (991), Fire & Rescue (992), National Ambulance (993), and Disaster Management & Mitigation Unit (DMMU).
10. **Smart ZamGov Citizen AI Navigator**:
    - AI-assisted civic co-pilot powered by Gemini 3.8 Flash (`@google/genai`) with fallback knowledgebase for Zambian statutory procedures in English and local languages.
11. **Sovereign Administration Portal**:
    - Secure role-based access control (RBAC), SHA-256 credential authentication, and 24-hour token sessions.
    - Management consoles for verified electricity sources, outage notices, emergency advisories, gazetted announcements, public service directory, user accounts, and immutable audit logs.
12. **In-App Sovereign Notification Center**:
    - Live alerts for system updates, pending officer approvals, and emergency status changes.

---

## 🏗 Architecture & Tech Stack

```
zamos-national-systems-hub/
├── server.ts                    # Full-Stack Express backend & Vite middleware integration
├── data/                        # Persistent disk store (JSON store & initial seeds)
├── src/
│   ├── App.tsx                  # Main Sovereign Application Controller
│   ├── main.tsx                 # React entry point
│   ├── index.css                # Tailwind CSS v4 configuration
│   ├── types/
│   │   └── zambia.ts            # Sovereign data models, interfaces, and RBAC types
│   ├── data/
│   │   └── zambiaData.ts        # Authentic baseline datasets for provinces, grid, and CDF
│   └── components/
│       ├── Header.tsx           # Sovereign header with national crest and SOS trigger
│       ├── NavigationTabs.tsx   # Segmented navigation bar
│       ├── NationalOverview.tsx # Sovereign cockpit and 10-provinces matrix
│       ├── ZescoGridModule.tsx  # ZESCO grid telemetry and LUKU token engine
│       ├── ZraTaxModule.tsx     # ZRA 2026 PAYE and border customs
│       ├── RtsaModule.tsx       # RTSA licensing and NRFA e-Toll
│       ├── PacraModule.tsx      # PACRA enterprise registration
│       ├── CdfTrackerModule.tsx # 156 constituencies CDF tracker
│       ├── SmartCareHealthModule.tsx # Digital health and hospital telemetry
│       ├── BozPaymentsModule.tsx# BOZ exchange rates & Mobile Money switch
│       ├── EmergencyDispatchModule.tsx # 991/992/993 unified SOS dispatch
│       ├── ZamGovAssistant.tsx  # Gemini-powered sovereign AI assistant
│       ├── AdminPortal.tsx      # Sovereign administration console (RBAC & audits)
│       └── NotificationCenterModal.tsx # In-app notification center modal
├── index.html                   # HTML entry point with metadata and typography
├── metadata.json                # AI Studio capability specifications
├── package.json                 # Project dependencies and operational scripts
├── tsconfig.json                # TypeScript compilation settings
├── vite.config.ts               # Vite configuration with Tailwind CSS v4 plugin
└── .env.example                 # Environment variables specification
```

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- **Node.js**: v20.x or higher
- **npm** (v10+) or **bun** / **yarn** / **pnpm**
- **Git** installed on your workstation

### 2. Clone and Install
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/zamos-national-systems-hub.git
cd zamos-national-systems-hub

npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate `.env` with your credentials:
```env
# Optional: GEMINI_API_KEY enables the real-time AI assistant
GEMINI_API_KEY="your-gemini-api-key-here"

# Server configuration
PORT=3000
APP_URL="http://localhost:3000"
```
*(Note: If `GEMINI_API_KEY` is not provided, the ZamGov Assistant automatically runs in local civic knowledgebase mode).*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:3000`.

### 5. Typecheck & Build
```bash
# Verify TypeScript types
npm run lint

# Compile production assets
npm run build

# Start production server
npm start
```

---

## 🔐 Officer Administration Portal Credentials

The Administration Portal enforces role-based access control (RBAC). For testing and authorized demonstration, the following official profiles are pre-seeded in the database:

| Role | Official Email | Department |
| :--- | :--- | :--- |
| **Super Administrator** | `admin@zamos.gov.zm` | Smart Zambia Institute (e-Government) |
| **ZESCO Grid Controller** | `grid.control@zesco.co.zm` | ZESCO National Control Centre (NCC) |
| **DMMU Dispatch Director** | `dispatch@dmmu.gov.zm` | Disaster Management & Mitigation Unit |
| **CDF National Auditor** | `cdf.audits@mlgrd.gov.zm` | Ministry of Local Govt & Rural Dev |
| **Content Manager** | `content@zamos.gov.zm` | Ministry of Information and Media |

*(Authorized passwords for demo verification are pre-configured in the Officer Portal login quick-select buttons).*

---

## 📦 Deployment Instructions

### Deploying to Google Cloud Run (Recommended)
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Containerize the application using Node.js:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   EXPOSE 3000
   ENV NODE_ENV=production
   CMD ["npm", "start"]
   ```
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy zamos-national-systems-hub \
     --source . \
     --region europe-west2 \
     --allow-unauthenticated \
     --port 3000
   ```

---

## 🛡️ Security & Privacy Notice
- No production secrets or API keys are committed to version control.
- All client sessions use secure Bearer token headers.
- Simulated electricity telemetry and disaster models are clearly flagged with `[SIMULATED DATA NOTICE]` to prevent misrepresentation of official sovereign data.

---

## 📄 License
Licensed under the Apache License, Version 2.0. Republic of Zambia Sovereign Digital Architecture.
