import React, { useState } from 'react';
import { 
  HeartPulse, 
  Search, 
  ShieldCheck, 
  Building2, 
  Pill, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Activity,
  Bed
} from 'lucide-react';
import { MAJOR_HOSPITALS } from '../data/zambiaData';

export const SmartCareHealthModule: React.FC = () => {
  const [smartCareSearch, setSmartCareSearch] = useState('104829/11/1');
  const [patientRecord, setPatientRecord] = useState<{
    fullName: string;
    smartCareId: string;
    nrc: string;
    bloodGroup: string;
    nhimaStatus: 'ACTIVE_COVERED' | 'EXPIRED';
    allergies: string[];
    chronicConditions: string[];
    registeredClinic: string;
    lastVisit: string;
  } | null>({
    fullName: 'Lupando Musonda',
    smartCareId: 'SC-LUS-2024-8190',
    nrc: '104829/11/1',
    bloodGroup: 'O Positive',
    nhimaStatus: 'ACTIVE_COVERED',
    allergies: ['Penicillin', 'Sulphonamides'],
    chronicConditions: ['Mild Hypertension'],
    registeredClinic: 'Chilenje Level 1 Hospital (Lusaka)',
    lastVisit: '18 September 2026',
  });

  const essentialDrugs = [
    { name: 'TLD (Tenofovir/Lamivudine/Dolutegravir ARV)', category: 'HIV/AIDS Chronic Care', stockPercent: 96, status: 'Optimal' },
    { name: 'Coartem (Artemether-Lumefantrine)', category: 'Antimalarial Therapy', stockPercent: 91, status: 'Optimal' },
    { name: 'Amoxicillin 500mg Capsules', category: 'Antibiotic Spectrum', stockPercent: 88, status: 'Good' },
    { name: 'ORS & Zinc Dispersible Tablets', category: 'Diarrheal Dehydration Care', stockPercent: 98, status: 'Optimal' },
    { name: 'Human Insulin (Mixtard / Actrapid)', category: 'Endocrine Care', stockPercent: 82, status: 'Good' },
    { name: 'Paracetamol 500mg / Pain Relief', category: 'Essential Analgesic', stockPercent: 95, status: 'Optimal' },
  ];

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <HeartPulse className="w-4 h-4" />
              <span>Ministry of Health & ZAMMSA</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">SmartCare Electronic Health Records</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display mt-1">
              National Health Command & SmartCare Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Access digital patient health summaries, track live bed and ICU availability across tertiary teaching hospitals, and monitor essential medicines inventory at ZAMMSA.
            </p>
          </div>
        </div>

        {/* Public Health Alert Banner */}
        <div className="mt-4 bg-emerald-950/40 border border-emerald-800/40 rounded-xl p-3.5 flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-slate-300">
            <strong className="text-emerald-300">National Health Epidemiological Advisory:</strong> Cholera proactive water chlorination is active across Lusaka, Copperbelt, and Luapula. Routine oral vaccination campaigns and clean water borehole testing are fully operational.
          </div>
        </div>
      </div>

      {/* Main Dual Grid: SmartCare Patient Record & Hospital Bed Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: SmartCare Patient Electronic Record Lookup (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              SmartCare Electronic Health Card
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">NHIMA Linked</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={smartCareSearch}
              onChange={(e) => setSmartCareSearch(e.target.value)}
              placeholder="Enter NRC (e.g. 104829/11/1) or SmartCare ID"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => {
                setPatientRecord({
                  fullName: 'Lupando Musonda',
                  smartCareId: `SC-LUS-2024-${Math.floor(1000 + Math.random() * 9000)}`,
                  nrc: smartCareSearch || '104829/11/1',
                  bloodGroup: 'O Positive',
                  nhimaStatus: 'ACTIVE_COVERED',
                  allergies: ['Penicillin', 'Sulphonamides'],
                  chronicConditions: ['Mild Hypertension'],
                  registeredClinic: 'Chilenje Level 1 Hospital (Lusaka)',
                  lastVisit: '18 September 2026',
                });
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Fetch
            </button>
          </div>

          {patientRecord && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-sm font-bold text-slate-100">{patientRecord.fullName}</div>
                  <div className="text-xs text-slate-400 font-mono">SmartCare ID: {patientRecord.smartCareId}</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 border border-emerald-800/60 px-2.5 py-1 rounded">
                  NHIMA ACTIVE
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Zambian NRC:</span>
                  <span className="text-slate-200">{patientRecord.nrc}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Blood Group:</span>
                  <span className="text-red-400 font-bold">{patientRecord.bloodGroup}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Primary Health Facility:</span>
                  <span className="text-slate-200">{patientRecord.registeredClinic}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Documented Allergies:</span>
                  <span className="text-amber-400 font-semibold">{patientRecord.allergies.join(', ')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Last Clinical Consultation:</span>
                  <span className="text-slate-300">{patientRecord.lastVisit}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted on MoH SmartCare Sovereign Health Network</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Major Referral Hospitals Bed Capacity & ZAMMSA Drugs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hospitals Bed Status */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Bed className="w-4 h-4 text-emerald-400" />
              National Teaching & Referral Hospitals Telemetry
            </h3>

            <div className="space-y-3">
              {MAJOR_HOSPITALS.map((hosp) => (
                <div
                  key={hosp.id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{hosp.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {hosp.level} · {hosp.city}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase">Available Beds</span>
                      <span className="text-emerald-400 font-bold">{hosp.availableBeds} / {hosp.totalBeds}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase">ICU Beds</span>
                      <span className="text-blue-400 font-bold">{hosp.icuAvailable} Beds</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded ${
                        hosp.traumaCenterStatus === 'Active'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {hosp.traumaCenterStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ZAMMSA Essential Medicines Inventory */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-3">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-400" />
              ZAMMSA Essential Medicines Stock Health
            </h3>
            <p className="text-xs text-slate-400">
              Zambia Medicines & Medical Supplies Agency central medical store availability
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {essentialDrugs.map((drug, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                  <div className="font-semibold text-slate-200 truncate">{drug.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{drug.category}</div>
                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Stock Availability:</span>
                    <span className="text-emerald-400 font-bold">{drug.stockPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${drug.stockPercent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
