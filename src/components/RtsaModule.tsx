import React, { useState } from 'react';
import { 
  Car, 
  CreditCard, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck, 
  MapPin, 
  DollarSign, 
  QrCode,
  Calendar
} from 'lucide-react';
import { TOLL_PLAZAS } from '../data/zambiaData';

export const RtsaModule: React.FC = () => {
  // License Search State
  const [licenseSearch, setLicenseSearch] = useState('294819/11/1');
  const [licenseData, setLicenseData] = useState<{
    holderName: string;
    nrc: string;
    licenseNumber: string;
    licenseClass: string;
    expiryDate: string;
    status: 'ACTIVE' | 'EXPIRED' | 'PENDING_RENEWAL';
    pointsPenalty: number;
  } | null>({
    holderName: 'Kondwani Banda',
    nrc: '294819/11/1',
    licenseNumber: 'DL-ZM-2019-847291',
    licenseClass: 'Class B (Light Motor Vehicle & SUV)',
    expiryDate: '14 November 2026',
    status: 'ACTIVE',
    pointsPenalty: 0,
  });

  // Road Tax & Fitness Calculator
  const [vehicleReg, setVehicleReg] = useState('BAF 4821 ZM');
  const [engineCapacity, setEngineCapacity] = useState<'under1500' | 'under2000' | 'under3000' | 'over3000'>('under2000');
  const [duration, setDuration] = useState<'quarter' | 'annual'>('quarter');
  const [isCalculated, setIsCalculated] = useState(true);

  // Toll card balance
  const [tollBalance, setTollBalance] = useState(160);
  const [topUpAmount, setTopUpAmount] = useState(100);
  const [tollSuccessMsg, setTollSuccessMsg] = useState('');

  const calculateFees = () => {
    let roadTax = duration === 'quarter' ? 120 : 450;
    let carbonTax = 200;
    if (engineCapacity === 'under1500') carbonTax = 100;
    if (engineCapacity === 'under2000') carbonTax = 160;
    if (engineCapacity === 'under3000') carbonTax = 275;
    if (engineCapacity === 'over3000') carbonTax = 360;

    const fitness = 150;
    return {
      roadTax,
      carbonTax,
      fitness,
      total: roadTax + carbonTax + fitness,
    };
  };

  const fees = calculateFees();

  const handleTollTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    setTollBalance(prev => prev + topUpAmount);
    setTollSuccessMsg(`Successfully credited K${topUpAmount} to NRFA e-Toll Card!`);
    setTimeout(() => setTollSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Car className="w-4 h-4" />
              <span>Road Transport and Safety Agency (RTSA)</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">NRFA Electronic Tolling</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display mt-1">
              National Driver Licensing, Road Fitness & e-Toll Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Verify driver credentials, calculate statutory road fitness & carbon emissions taxes, and manage prepaid contactless tolling passes across Zambia’s national highway network.
            </p>
          </div>
        </div>

        {/* Toll Plazas live queue ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          {TOLL_PLAZAS.map((toll) => (
            <div key={toll.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>{toll.name.replace(' Toll Plaza', '')}</span>
                <span className="text-emerald-400 font-bold">{toll.activeBooths} Booths</span>
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1 font-mono">
                ~{toll.liveQueueMins} mins queue
              </div>
              <div className="text-[10px] text-slate-500 truncate mt-0.5">{toll.route}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Driver License (Left) & Vehicle Tax / e-Toll (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Driver's License Digital Verification & Renewal */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Digital Driver’s License Verification
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">INRIS Integrated</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={licenseSearch}
              onChange={(e) => setLicenseSearch(e.target.value)}
              placeholder="Enter NRC (e.g. 294819/11/1) or License ID"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => {
                setLicenseData({
                  holderName: 'Kondwani Banda',
                  nrc: licenseSearch || '294819/11/1',
                  licenseNumber: `DL-ZM-2022-${Math.floor(100000 + Math.random() * 900000)}`,
                  licenseClass: 'Class B (Light Motor Vehicle & SUV)',
                  expiryDate: '14 November 2026',
                  status: 'ACTIVE',
                  pointsPenalty: 0,
                });
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>

          {licenseData && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-sm font-bold text-slate-100">{licenseData.holderName}</div>
                  <div className="text-xs text-slate-400 font-mono">NRC: {licenseData.nrc}</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800/60">
                  {licenseData.status}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">License Number:</span>
                  <span className="text-slate-200 font-semibold">{licenseData.licenseNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Permitted Class:</span>
                  <span className="text-slate-200">{licenseData.licenseClass}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-500">Expiry Date:</span>
                  <span className="text-emerald-400 font-semibold">{licenseData.expiryDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Demerit Points:</span>
                  <span className="text-slate-200 font-semibold">{licenseData.pointsPenalty} / 12 points</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Digital Smart Card: Active</span>
                <button
                  onClick={() => alert(`Digital License ${licenseData.licenseNumber} is valid through ${licenseData.expiryDate}. Verified with RTSA Central Register.`)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Show QR Pass</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Vehicle Road Tax & NRFA e-Toll */}
        <div className="lg:col-span-6 space-y-6">
          {/* Road Tax & Carbon Tax Calculator */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" />
              Motor Vehicle Road Tax & Carbon Emissions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Vehicle Registration</label>
                <input
                  type="text"
                  value={vehicleReg}
                  onChange={(e) => setVehicleReg(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Engine Size (cc)</label>
                <select
                  value={engineCapacity}
                  onChange={(e) => setEngineCapacity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="under1500">Under 1,500 cc</option>
                  <option value="under2000">1,501 - 2,000 cc</option>
                  <option value="under3000">2,001 - 3,000 cc</option>
                  <option value="over3000">Over 3,000 cc</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 text-xs">
              <button
                type="button"
                onClick={() => setDuration('quarter')}
                className={`flex-1 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  duration === 'quarter'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Quarterly (3 Months)
              </button>
              <button
                type="button"
                onClick={() => setDuration('annual')}
                className={`flex-1 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  duration === 'annual'
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Annual (12 Months)
              </button>
            </div>

            {/* Fee Result */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Road Tax:</span>
                <span className="text-slate-200">K{fees.roadTax}.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Carbon Emissions Tax:</span>
                <span className="text-slate-200">K{fees.carbonTax}.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Road Fitness Inspection:</span>
                <span className="text-slate-200">K{fees.fitness}.00</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-slate-100">
                <span>Total Statutory Fee:</span>
                <span className="text-emerald-400 font-mono">K{fees.total}.00</span>
              </div>
            </div>
          </div>

          {/* NRFA Contactless e-Toll Card Manager */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                NRFA National e-Toll Card
              </h3>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400">Card Balance</span>
                <div className="text-base font-bold text-emerald-400">K{tollBalance}.00</div>
              </div>
            </div>

            <form onSubmit={handleTollTopUp} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="20"
                  step="20"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  placeholder="Amount in ZMW"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Reload Card
                </button>
              </div>
              {tollSuccessMsg && (
                <div className="text-xs text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/60 p-2 rounded">
                  {tollSuccessMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
