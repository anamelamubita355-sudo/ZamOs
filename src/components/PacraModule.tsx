import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  FileBadge, 
  Users, 
  ShieldCheck, 
  Printer, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const PacraModule: React.FC = () => {
  // Name Search
  const [nameQuery, setNameQuery] = useState('Zambezi Clean Power');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'available' | 'taken'>('available');

  // Registration Wizard Form
  const [step, setStep] = useState<number>(1);
  const [companyType, setCompanyType] = useState('Private Company Limited by Shares');
  const [companyName, setCompanyName] = useState('Zambezi Clean Power Ltd');
  const [sector, setSector] = useState('Renewable Energy & Power Engineering');
  const [shareCapital, setShareCapital] = useState<number>(15000);
  const [director1, setDirector1] = useState('Mwila Chileshe');
  const [nrc1, setNrc1] = useState('381920/11/1');
  const [registeredCity, setRegisteredCity] = useState('Lusaka');
  const [registeredPlot, setRegisteredPlot] = useState('Plot 4928, Great East Road, Rhodes Park');

  // Certificate Modal
  const [showCertificate, setShowCertificate] = useState(false);
  const [generatedRegNum, setGeneratedRegNum] = useState('');

  const registeredEntities = [
    'zambeef products',
    'trade kings',
    'copperbelt energy corporation',
    'zccm investments holdings',
    'zambia sugar',
    'national breweries',
    'zesco limited',
    'zamtel',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameQuery.trim()) return;

    const queryNorm = nameQuery.trim().toLowerCase();
    const isTaken = registeredEntities.some(ent => queryNorm.includes(ent) || ent.includes(queryNorm));
    setSearchStatus(isTaken ? 'taken' : 'available');
  };

  const handleCompleteRegistration = () => {
    const regNo = `1202600${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedRegNum(regNo);
    setShowCertificate(true);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <Building2 className="w-4 h-4" />
              <span>Patents and Companies Registration Agency (PACRA)</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">Companies Act No. 10 of 2017</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display mt-1">
              National Commercial Registry & Enterprise Incorporation
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Instant business name availability search, streamlined four-step incorporation wizard, and certified digital Certificate of Incorporation issuance.
            </p>
          </div>
        </div>

        {/* Name Search Box */}
        <div className="mt-5 max-w-2xl">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Check Business or Company Name Availability in Zambia
          </label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={nameQuery}
              onChange={(e) => {
                setNameQuery(e.target.value);
                setSearchStatus('idle');
              }}
              placeholder="e.g. Lusaka Solar Logistics Ltd"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Check Availability
            </button>
          </form>

          {searchStatus === 'available' && (
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span><strong>"{nameQuery}"</strong> is available for reservation under the Companies Act!</span>
            </div>
          )}

          {searchStatus === 'taken' && (
            <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-950/60 border border-red-800/60 px-3 py-2 rounded-lg">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>Name conflict detected: A registered enterprise already holds this or a very similar name.</span>
            </div>
          )}
        </div>
      </div>

      {/* 4-Step Registration Wizard */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display">
              PACRA Digital Incorporation Wizard
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete the statutory requirements to incorporate your Zambian enterprise
            </p>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === s
                    ? 'bg-blue-600 text-white'
                    : step > s
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
            ))}
          </div>
        </div>

        {/* Step Contents */}
        <div className="py-6">
          {step === 1 && (
            <div className="space-y-4 max-w-xl">
              <h4 className="text-sm font-bold text-slate-200">Step 1: Choose Legal Structure</h4>
              <div className="space-y-2">
                {[
                  {
                    title: 'Private Company Limited by Shares (Ltd)',
                    desc: 'Most common commercial entity. Limited liability for shareholders. Min 2 directors.',
                  },
                  {
                    title: 'Sole Proprietorship / Business Name',
                    desc: 'Owned by an individual. Direct pass-through taxation. Quick registration.',
                  },
                  {
                    title: 'Public Limited Company (PLC)',
                    desc: 'Eligible for listing on Lusaka Securities Exchange (LuSE). Min 2 directors.',
                  },
                ].map((type) => (
                  <label
                    key={type.title}
                    className={`block p-3.5 rounded-lg border cursor-pointer transition-all ${
                      companyType === type.title
                        ? 'bg-blue-950/60 border-blue-500 text-slate-100'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="compType"
                      checked={companyType === type.title}
                      onChange={() => setCompanyType(type.title)}
                      className="hidden"
                    />
                    <div className="font-bold text-xs text-slate-200">{type.title}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{type.desc}</div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 max-w-xl">
              <h4 className="text-sm font-bold text-slate-200">Step 2: Company Details & Sector</h4>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Industry Sector</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option>Renewable Energy & Power Engineering</option>
                  <option>Mining & Mineral Exploration (Copper/Cobalt)</option>
                  <option>Agribusiness & Commercial Farming</option>
                  <option>Information & Communication Technology (ICT)</option>
                  <option>Transport, Logistics & Haulage</option>
                  <option>General Commerce & Retail</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nominal Share Capital (ZMW)</label>
                <input
                  type="number"
                  min="15000"
                  step="5000"
                  value={shareCapital}
                  onChange={(e) => setShareCapital(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Statutory minimum nominal capital for private company is K15,000.
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 max-w-xl">
              <h4 className="text-sm font-bold text-slate-200">Step 3: Director & Shareholder Credentials</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Primary Director Full Name</label>
                  <input
                    type="text"
                    value={director1}
                    onChange={(e) => setDirector1(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Zambian NRC Number</label>
                  <input
                    type="text"
                    value={nrc1}
                    onChange={(e) => setNrc1(e.target.value)}
                    placeholder="e.g. 381920/11/1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="text-xs text-slate-400 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-semibold">INRIS Identity Check:</span> Director NRC status verified. Individual meets age and legal requirements under the Companies Act.
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 max-w-xl">
              <h4 className="text-sm font-bold text-slate-200">Step 4: Registered Physical Address in Zambia</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Town / City</label>
                  <input
                    type="text"
                    value={registeredCity}
                    onChange={(e) => setRegisteredCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Plot / Street Address</label>
                  <input
                    type="text"
                    value={registeredPlot}
                    onChange={(e) => setRegisteredPlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Ready summary */}
              <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/60 text-xs space-y-2">
                <div className="text-xs font-bold text-blue-300">Statutory Filing Summary:</div>
                <div className="text-slate-300">Entity: <strong>{companyName}</strong></div>
                <div className="text-slate-300">Structure: <strong>{companyType}</strong></div>
                <div className="text-slate-300">Nominal Capital: <strong className="font-mono">K{shareCapital.toLocaleString()}</strong></div>
                <div className="text-slate-300">Incorporation Fee: <strong className="font-mono text-emerald-400">K465.00 (Standard PACRA fee)</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
          >
            Previous
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCompleteRegistration}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileBadge className="w-4 h-4" />
              <span>Incorporate & Issue Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* PACRA Official Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-amber-500/80 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 cursor-pointer"
            >
              Close
            </button>

            {/* Official Header */}
            <div className="text-center pb-4 border-b border-slate-800 space-y-1">
              <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                REPUBLIC OF ZAMBIA
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-display">
                PATENTS AND COMPANIES REGISTRATION AGENCY
              </h3>
              <div className="text-xs text-amber-400 font-mono font-bold tracking-wider">
                CERTIFICATE OF INCORPORATION
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                (Section 14 of the Companies Act, No. 10 of 2017)
              </div>
            </div>

            {/* Certificate Body Text */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3.5 text-xs">
              <p className="text-slate-300 leading-relaxed text-center">
                This is to certify that
              </p>
              <div className="text-center text-base font-bold text-amber-300 font-display uppercase tracking-wide">
                {companyName}
              </div>
              <p className="text-slate-300 leading-relaxed text-center">
                is this day incorporated as a <strong>{companyType}</strong> under the Laws of the Republic of Zambia, and that the company is limited.
              </p>

              <div className="space-y-1.5 font-mono text-xs pt-3 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Company Registration No:</span>
                  <span className="text-emerald-400 font-bold">{generatedRegNum}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date of Incorporation:</span>
                  <span className="text-slate-200">09 October 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nominal Capital:</span>
                  <span className="text-slate-200">ZMW {shareCapital.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Office:</span>
                  <span className="text-slate-200">{registeredPlot}, {registeredCity}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Registrar of Companies Official Digital Seal</span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
