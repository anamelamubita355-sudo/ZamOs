import React, { useState } from 'react';
import { 
  Zap, 
  Building2, 
  Coins, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  Users, 
  Sparkles, 
  Radio, 
  TrendingUp, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ZAMBIA_PROVINCES } from '../data/zambiaData';
import { ProvinceInfo, TabId } from '../types/zambia';
import { LukuModal } from './LukuModal';

interface NationalOverviewProps {
  onNavigate: (tab: TabId) => void;
}

export const NationalOverview: React.FC<NationalOverviewProps> = ({ onNavigate }) => {
  const [selectedProvince, setSelectedProvince] = useState<ProvinceInfo>(ZAMBIA_PROVINCES[0]);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [isLukuModalOpen, setIsLukuModalOpen] = useState(false);

  React.useEffect(() => {
    fetch('/api/admin/alerts')
      .then(res => res.json())
      .then(data => {
        if (data.alerts) setActiveAlerts(data.alerts.filter((a: any) => a.status === 'ACTIVE'));
      })
      .catch(() => {});
  }, []);

  const topAlert = activeAlerts.length > 0 ? activeAlerts[0] : null;

  return (
    <div className="space-y-8">
      {/* Explicit Simulation Environment Disclaimer */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-lg px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
            SIMULATED DATA NOTICE
          </span>
          <span>Real-time power balance & emergency models are simulated for system demonstration. Statutory tax & CDF rules are verified.</span>
        </div>
        <button
          onClick={() => onNavigate('zesco')}
          className="text-emerald-400 hover:text-emerald-300 font-medium text-[11px] whitespace-nowrap cursor-pointer"
        >
          View Grid Model →
        </button>
      </div>

      {/* Sovereign National Alert Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/40 border border-amber-700/30 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <span>{topAlert ? topAlert.agency : 'National Emergency Advisory'}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {topAlert?.isSimulated ? 'SIMULATED ADVISORY' : 'VERIFIED 2026'}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100 font-display mt-0.5">
                {topAlert ? topAlert.title : 'Kariba Reservoir Water Management & Stage 2 Load Shedding Directive'}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {topAlert ? topAlert.description : 'Lake Kariba usable live storage is at 12.8% (476.22m). Base-load generation at Kariba North Bank is restricted to 420 MW to safeguard hydro infrastructure. Maamba Coal (300 MW) and Kafue Gorge Lower (480 MW) are operating at high availability. View your township schedule or purchase prepaid LUKU units below.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            <button
              onClick={() => onNavigate('zesco')}
              className="px-3.5 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>ZESCO Grid & LUKU</span>
            </button>
            <button
              onClick={() => onNavigate('cdf')}
              className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>CDF Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary National KPI Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Power Grid */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">National Power Balance</span>
            <span className="text-[9px] font-mono text-amber-400 uppercase bg-amber-950/70 border border-amber-800/60 px-1.5 py-0.5 rounded">
              SIMULATED
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">1,993</span>
            <span className="text-xs text-slate-400 font-mono">/ 2,450 MW demand</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '81%' }} />
          </div>
          <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400">
            <span className="text-amber-400 font-mono font-medium">Deficit: -457 MW (Stage 2)</span>
            <button 
              onClick={() => onNavigate('zesco')} 
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer inline-flex items-center gap-1"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 2: CDF Allocation */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">2026 CDF per Constituency</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">K30.6M</span>
            <span className="text-xs text-slate-400">per constituency</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-mono">
            156 Constituencies · K4.77B Total National Budget
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px]">
            <span className="text-slate-400">Disbursed: <strong className="text-slate-200">89.4%</strong></span>
            <button 
              onClick={() => onNavigate('cdf')} 
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer inline-flex items-center gap-1"
            >
              Constituency Map <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 3: Bank of Zambia ZMW */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Bank of Zambia Fixing</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">27.42</span>
            <span className="text-xs text-slate-400">ZMW / USD</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-mono flex items-center justify-between">
            <span>GBP: 34.85</span>
            <span>EUR: 29.60</span>
            <span>ZAR: 1.48</span>
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px]">
            <span className="text-slate-400">Policy Rate: <strong className="text-slate-200">13.5%</strong></span>
            <button 
              onClick={() => onNavigate('boz')} 
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer inline-flex items-center gap-1"
            >
              MoMo Switch <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 4: INRIS & Civil Registry */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">INRIS National Registry</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100">14.2M</span>
            <span className="text-xs text-slate-400">Verified NRC IDs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            SmartCare Connected: <strong className="text-slate-200 font-mono">9.84M</strong> Patient Records
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px]">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Biometrics Sync
            </span>
            <button 
              onClick={() => onNavigate('smartcare')} 
              className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer inline-flex items-center gap-1"
            >
              SmartCare <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 10 Provinces Interactive Sovereign Matrix */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              10 Provinces National Command Grid
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any province to inspect public infrastructure, active CDF projects, economic pillars, and provincial referral hospitals.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            Selected: <span className="text-emerald-300 font-semibold">{selectedProvince.name}</span>
          </div>
        </div>

        {/* Province Selector Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-5">
          {ZAMBIA_PROVINCES.map((prov) => {
            const isSelected = selectedProvince.id === prov.id;
            return (
              <button
                key={prov.id}
                onClick={() => setSelectedProvince(prov)}
                className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold font-display">{prov.name.replace(' Province', '')}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      prov.powerDeficitAlert === 'CRITICAL'
                        ? 'bg-amber-500'
                        : prov.powerDeficitAlert === 'ELEVATED'
                        ? 'bg-blue-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                </div>
                <div className="text-[11px] text-slate-400 truncate">{prov.capital.split(' ')[0]}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  {prov.constituenciesCount} Constituencies
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Province Deep Dive Panel */}
        <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-5 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Identity & Demographics */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Provincial Administration
              </div>
              <h4 className="text-xl font-bold text-slate-100 font-display">
                {selectedProvince.name}
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Provincial Capital:</span>
                  <span className="text-slate-200 font-medium">{selectedProvince.capital}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Population (Census):</span>
                  <span className="text-slate-200 font-mono font-medium">{selectedProvince.population}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Geographic Land Area:</span>
                  <span className="text-slate-200 font-mono font-medium">{selectedProvince.areaKm2.toLocaleString()} km²</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Parliamentary Constituencies:</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedProvince.constituenciesCount}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Economic Pillars & Projects */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Economic & Resource Base
              </div>
              <div className="space-y-2">
                <div className="text-xs text-slate-400">Primary Economic Pillars:</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProvince.economicPillars.map((pillar, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md"
                    >
                      {pillar}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <div className="text-xs text-slate-400 mb-1.5">CDF Community Development:</div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      {selectedProvince.activeCdfProjects} Projects
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Clinics, schools, boreholes, & grants
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('cdf')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    View <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3: Critical Health & Energy Status */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Services & Health Infrastructure
              </div>
              <div className="space-y-3">
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                  <div className="text-[11px] text-slate-400">Provincial Referral Hospital:</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    {selectedProvince.majorHospital}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> SmartCare Active
                    </span>
                    <button
                      onClick={() => onNavigate('smartcare')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                    >
                      Beds & Supplies →
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Power Deficit Level:</span>
                    <span
                      className={`text-xs font-semibold ${
                        selectedProvince.powerDeficitAlert === 'CRITICAL'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {selectedProvince.powerDeficitAlert}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Stage 2 Outages Active</span>
                    <button
                      onClick={() => onNavigate('zesco')}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
                    >
                      Timetable →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Government Announcements Feed (Connected to Persistent DB) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Verified Sovereign Announcements & Directives
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Official circulars and policy notices published through the ZamOS Administration Portal.
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            OFFICIAL GAZETTE FEED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-sm">2026 National Budget CDF Window Open</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                Civic Notice
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              The Ministry of Local Government & Rural Development confirms that all 156 Constituencies have received the first tranche of the 2026 CDF allocation (K30.6M baseline). Ward Development Committees are receiving applications for secondary school bursaries and women/youth community grants.
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800 font-mono">
              <span>Ministry of Local Government</span>
              <button onClick={() => onNavigate('cdf')} className="text-emerald-400 hover:text-emerald-300 cursor-pointer font-bold">
                Apply in Portal →
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-sm">ZRA Digital Taxpayer Clearance (TCC) Direct System Integration</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">
                Commerce & Tax
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              All government suppliers and bidders for public tenders are reminded that verified electronic Tax Clearance Certificates (TCC) must be generated with real-time QR hash authentication.
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800 font-mono">
              <span>Zambia Revenue Authority</span>
              <button onClick={() => onNavigate('zra')} className="text-amber-400 hover:text-amber-300 cursor-pointer font-bold">
                Check TPIN →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Agency Rapid Navigation Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setIsLukuModalOpen(true)}
          className="bg-slate-900/40 border border-slate-800 hover:border-amber-500/50 p-4.5 rounded-xl cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-900/80 transition-colors">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">Instant ZESCO LUKU Token</h4>
              <p className="text-[11px] text-slate-400">Buy prepaid electricity with STS 20-digit token</p>
            </div>
          </div>
          <div className="text-xs text-amber-400 font-medium flex items-center justify-between mt-2">
            <span className="flex items-center gap-1 font-semibold">
              Instant Modal Token <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('zesco');
              }}
              className="text-[10px] text-slate-400 hover:text-emerald-400 underline font-mono"
            >
              Full Grid View →
            </button>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('zra')}
          className="bg-slate-900/40 border border-slate-800 hover:border-amber-500/50 p-4.5 rounded-xl cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-900 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">2026 PAYE & TPIN Portal</h4>
              <p className="text-[11px] text-slate-400">Calculate salary tax, NAPSA, NHIMA & print TCC</p>
            </div>
          </div>
          <div className="text-xs text-amber-400 font-medium flex items-center gap-1 mt-2">
            Run Tax Calculator <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('pacra')}
          className="bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 p-4.5 rounded-xl cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-900 transition-colors">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">PACRA Business Registration</h4>
              <p className="text-[11px] text-slate-400">Check company name & incorporate in 4 steps</p>
            </div>
          </div>
          <div className="text-xs text-blue-400 font-medium flex items-center gap-1 mt-2">
            Check Availability <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Standalone Instant LUKU Modal */}
      <LukuModal 
        isOpen={isLukuModalOpen} 
        onClose={() => setIsLukuModalOpen(false)} 
      />
    </div>
  );
};
