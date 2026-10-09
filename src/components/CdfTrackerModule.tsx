import React, { useState } from 'react';
import { 
  HandCoins, 
  Search, 
  MapPin, 
  School, 
  Droplet, 
  Building, 
  Users, 
  CheckCircle2, 
  Clock, 
  FilePlus, 
  FileText,
  DollarSign
} from 'lucide-react';
import { CDF_CONSTITUENCIES } from '../data/zambiaData';
import { CdfConstituency } from '../types/zambia';

export const CdfTrackerModule: React.FC = () => {
  const [selectedConst, setSelectedConst] = useState<CdfConstituency>(CDF_CONSTITUENCIES[0]);
  const [searchFilter, setSearchFilter] = useState('');
  
  // Application Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [nrc, setNrc] = useState('');
  const [ward, setWard] = useState('Kabulonga Ward 18');
  const [appType, setAppType] = useState<'bursary' | 'grant'>('bursary');
  const [programTitle, setProgramTitle] = useState('TEVETA Automotive Mechanics Certificate');
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const filteredConstituencies = CDF_CONSTITUENCIES.filter(c => 
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.province.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.mpName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    const appId = `CDF/${selectedConst.name.slice(0, 3).toUpperCase()}/2026/${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedAppId(appId);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <HandCoins className="w-4 h-4" />
              <span>Ministry of Local Government and Rural Development</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">Constituency Development Fund Act 2024</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display mt-1">
              National CDF Transparency Portal & Citizen Grant Gateway
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Track the landmark K30.6 Million allocation across all 156 constituencies in Zambia. Inspect community schools, solar boreholes, maternity clinics, and apply for youth & women empowerment grants and TEVETA skills bursaries.
            </p>
          </div>

          <button
            onClick={() => {
              setSubmittedAppId(null);
              setShowApplyModal(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Apply for Bursary / Grant</span>
          </button>
        </div>

        {/* National CDF Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Allocation Per Constituency</span>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">K30.60 Million</div>
            <span className="text-[10px] text-slate-400">Annual National Allocation</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Total National Fund</span>
            <div className="text-base font-bold font-mono text-slate-200 mt-0.5">K4.77 Billion</div>
            <span className="text-[10px] text-slate-400">156 Constituencies Total</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Youth/Skills Bursaries</span>
            <div className="text-base font-bold font-mono text-blue-400 mt-0.5">68,400+</div>
            <span className="text-[10px] text-slate-400">Students Supported</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Community Projects</span>
            <div className="text-base font-bold font-mono text-amber-400 mt-0.5">5,820+</div>
            <span className="text-[10px] text-slate-400">Completed & In Progress</span>
          </div>
        </div>
      </div>

      {/* Main Constituency Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Constituency List & Search (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search constituency, MP, province..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredConstituencies.map((c) => {
                const isSelected = selectedConst.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConst(c)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-display">{c.name}</span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {((c.disbursedZMW / c.totalAllocationZMW) * 100).toFixed(0)}% Disbursed
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.province} Province</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                      MP: {c.mpName}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Constituency Profile & Community Projects (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
            {/* Header of selected constituency */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                  {selectedConst.province} Province · Parliamentary Constituency
                </span>
                <h3 className="text-2xl font-bold text-slate-100 font-display mt-0.5">
                  {selectedConst.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Member of Parliament: <strong className="text-slate-200">{selectedConst.mpName}</strong>
                </p>
              </div>

              <div className="text-right bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
                <span className="text-[10px] text-slate-400 uppercase">Total Allocation</span>
                <div className="text-lg font-bold text-emerald-400">
                  K{(selectedConst.totalAllocationZMW / 1000000).toFixed(1)}M
                </div>
                <div className="text-[10px] text-slate-400">
                  Disbursed: K{(selectedConst.disbursedZMW / 1000000).toFixed(1)}M
                </div>
              </div>
            </div>

            {/* CDF Statutory Windows Breakdown (50% Community, 20% Grants, 20% Bursaries, 10% Other) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px] mb-1">Community Infrastructure (50%)</div>
                <div className="text-base font-bold font-mono text-slate-200">K15.30 Million</div>
                <div className="text-[10px] text-slate-400 mt-1">{selectedConst.activeProjects} Active Works</div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px] mb-1">Youth & Women Grants (20%)</div>
                <div className="text-base font-bold font-mono text-emerald-400">
                  K{(selectedConst.grantsDisbursedZMW / 1000000).toFixed(2)} Million
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Cooperative Grants</div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[11px] mb-1">Skills & Secondary Bursaries (20%)</div>
                <div className="text-base font-bold font-mono text-blue-400">
                  {selectedConst.bursariesAwarded} Students
                </div>
                <div className="text-[10px] text-slate-400 mt-1">TEVETA & Boarding Fees</div>
              </div>
            </div>

            {/* Recent Verified Projects List */}
            <div>
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">
                Key Community Development Projects Funded in {selectedConst.name}
              </h4>

              <div className="space-y-3">
                {selectedConst.recentProjects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{proj.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded">
                          {proj.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        Statutory Cost: <strong className="text-slate-200">K{proj.costZMW.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {proj.status === 'Completed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span>{proj.status}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Citizen Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-emerald-500/80 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 cursor-pointer"
            >
              Close
            </button>

            {!submittedAppId ? (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="pb-3 border-b border-slate-800">
                  <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold font-mono">
                    Ward Development Committee (WDC)
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 font-display">
                    CDF Bursary & Empowerment Grant Application
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Constituency: <strong className="text-emerald-300">{selectedConst.name}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Application Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAppType('bursary')}
                      className={`p-2.5 rounded-lg border text-xs text-center cursor-pointer ${
                        appType === 'bursary'
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      TEVETA Skills Bursary
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppType('grant')}
                      className={`p-2.5 rounded-lg border text-xs text-center cursor-pointer ${
                        appType === 'grant'
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      Youth/Women Group Grant
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Applicant / Cooperative Name
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Misozi Tembo or Tusole Women Cooperative"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">NRC Number</label>
                    <input
                      type="text"
                      required
                      value={nrc}
                      onChange={(e) => setNrc(e.target.value)}
                      placeholder="e.g. 192841/11/1"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Ward Name</label>
                    <input
                      type="text"
                      value={ward}
                      onChange={(e) => setWard(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Programme / Project Description
                  </label>
                  <input
                    type="text"
                    value={programTitle}
                    onChange={(e) => setProgramTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Submit CDF Application
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 bg-emerald-950 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">Application Successfully Lodged!</h3>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2">
                  <div className="text-slate-400">Tracking Reference:</div>
                  <div className="text-base font-bold text-emerald-400">{submittedAppId}</div>
                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    Constituency: {selectedConst.name} · Ward: {ward}
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Your dossier has been transmitted to the Ward Development Committee (WDC) and Constituency Development Fund Committee (CDFC) for statutory vetting.
                </p>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
