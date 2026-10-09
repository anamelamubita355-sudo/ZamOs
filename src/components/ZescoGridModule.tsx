import React, { useState } from 'react';
import { 
  Zap, 
  Droplet, 
  Clock, 
  Search, 
  CreditCard, 
  Copy, 
  Check, 
  Receipt, 
  AlertTriangle, 
  Activity, 
  ShieldCheck, 
  Download,
  ExternalLink 
} from 'lucide-react';
import { POWER_STATIONS, LOAD_SHEDDING_SCHEDULES } from '../data/zambiaData';
import { LukuTransaction } from '../types/zambia';
import { LukuModal } from './LukuModal';

export const ZescoGridModule: React.FC = () => {
  // Luku Purchase Form State
  const [meterNumber, setMeterNumber] = useState('04291847102');
  const [customerName, setCustomerName] = useState('Chileshe Mwape');
  const [amountZMW, setAmountZMW] = useState(200);
  const [paymentProvider, setPaymentProvider] = useState<'airtel' | 'mtn' | 'zamtel'>('airtel');
  const [mobileNumber, setMobileNumber] = useState('0977123456');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<LukuTransaction | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isLukuModalOpen, setIsLukuModalOpen] = useState(false);

  // Dynamic stations and schedules synced with backend
  const [stations, setStations] = useState(POWER_STATIONS);
  const [schedules, setSchedules] = useState(LOAD_SHEDDING_SCHEDULES);

  React.useEffect(() => {
    fetch('/api/admin/power-stations', {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('zamos_auth_token') || ''}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.powerStations && d.powerStations.length > 0) setStations(d.powerStations);
      })
      .catch(() => {});

    fetch('/api/admin/load-shedding', {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('zamos_auth_token') || ''}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.schedules && d.schedules.length > 0) setSchedules(d.schedules);
      })
      .catch(() => {});
  }, []);

  // Search Filter for Load Shedding
  const [searchTownship, setSearchTownship] = useState('');

  // Sample initial transactions
  const [recentTransactions, setRecentTransactions] = useState<LukuTransaction[]>([
    {
      id: 'LUKU-2026-9041',
      meterNumber: '04291847102',
      customerName: 'Chileshe Mwape',
      amountZMW: 150,
      unitsKWh: 112.4,
      tokenNumber: '4829-1920-4491-0391-2810',
      date: '2026-10-08 19:42',
      receiptNumber: 'REC-ZESCO-882194',
    },
  ]);

  // Calculate kWh based on ZRA VAT, REA Levy, and Lifeline Tariffs
  const calculateUnits = (zmw: number) => {
    // 3% REA Levy, 16% VAT
    const netForEnergy = zmw / 1.19;
    // Lifeline: K0.47 for first 100 kWh, K0.85 thereafter
    if (netForEnergy <= 47) {
      return (netForEnergy / 0.47).toFixed(1);
    } else {
      const remaining = netForEnergy - 47;
      const additionalUnits = remaining / 0.85;
      return (100 + additionalUnits).toFixed(1);
    }
  };

  const handleBuyToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meterNumber || amountZMW <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      // Generate 20-digit STS token
      const seg1 = Math.floor(1000 + Math.random() * 9000);
      const seg2 = Math.floor(1000 + Math.random() * 9000);
      const seg3 = Math.floor(1000 + Math.random() * 9000);
      const seg4 = Math.floor(1000 + Math.random() * 9000);
      const seg5 = Math.floor(1000 + Math.random() * 9000);
      const token = `${seg1}-${seg2}-${seg3}-${seg4}-${seg5}`;

      const units = parseFloat(calculateUnits(amountZMW));
      const receipt: LukuTransaction = {
        id: `LUKU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        meterNumber,
        customerName: customerName || 'Zambian Resident',
        amountZMW,
        unitsKWh: units,
        tokenNumber: token,
        date: new Date().toLocaleString('en-GB'),
        receiptNumber: `REC-ZESCO-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setCurrentReceipt(receipt);
      setRecentTransactions([receipt, ...recentTransactions]);
      setIsProcessing(false);
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const filteredSchedules = schedules.filter(s => 
    s.township.toLowerCase().includes(searchTownship.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTownship.toLowerCase()) ||
    s.province.toLowerCase().includes(searchTownship.toLowerCase())
  );

  const totalGenerationMW = stations.reduce((acc, curr) => acc + curr.currentOutputMW, 0);
  const deficitMW = 2450 - totalGenerationMW;

  return (
    <div className="space-y-8">
      {/* Simulation Disclosure Notice */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-amber-300">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-700">
            SIMULATED DATA DECLARATION
          </span>
          <span>Power generation and load-shedding schedules are simulated demonstration models. Token generator calculates 2026 tariffs with 20-digit STS tokens.</span>
        </div>
        <a 
          href="https://www.zesco.co.zm" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 cursor-pointer"
        >
          Official ZESCO Portal <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Top Banner: Grid Telemetry & Kariba Water Level */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Zap className="w-4 h-4" />
              <span>Zambia Electricity Supply Corporation (ZESCO)</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">National Control Centre (NCC)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display mt-1">
              National Hydro Grid & Drought Water Elevation Telemetry
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Real-time monitoring of Lake Kariba water reservoir, Kafue cascade (Upper & Lower), Maamba Coal, and solar feed to optimize power rationing across Zambia.
            </p>
          </div>

          {/* Quick Metrics Badge Container */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-lg">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Total Generation</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{totalGenerationMW} MW</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-lg">
              <div className="text-[10px] text-slate-400 uppercase font-mono">National Peak Demand</div>
              <div className="text-lg font-bold font-mono text-slate-200">2,450 MW</div>
            </div>
            <div className="bg-amber-950/40 border border-amber-800/40 px-3.5 py-2 rounded-lg">
              <div className="text-[10px] text-amber-400 uppercase font-mono">Rationing Deficit</div>
              <div className="text-lg font-bold font-mono text-amber-300">-{deficitMW} MW</div>
            </div>
          </div>
        </div>

        {/* Lake Kariba Reservoir Gauge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4.5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-blue-400 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-blue-400" />
                Lake Kariba Water Level
              </span>
              <span className="font-mono text-slate-300">476.22m</span>
            </div>
            {/* Visual Level indicator */}
            <div className="space-y-1.5 my-3">
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Min: 475.50m (Dead Storage)</span>
                <span>Max: 488.50m</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-blue-500 rounded-full" 
                  style={{ width: '12.8%' }} 
                />
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Usable Storage:</span>
                <span className="font-mono font-bold text-amber-400">12.8% (8.32 BCM)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Zambezi River Authority (ZRA) allocation currently limits Kariba North Bank discharge to protect turbines from cavitation.
            </p>
          </div>

          {/* Major Power Plants Breakdown */}
          <div className="md:col-span-2 bg-slate-950/80 border border-slate-800 rounded-xl p-4.5">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Operational Power Station Outputs
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {POWER_STATIONS.map((station) => (
                <div 
                  key={station.id} 
                  className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5 text-xs flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200 truncate">{station.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      station.operationalStatus === 'Optimal' 
                        ? 'text-emerald-400 bg-emerald-950/60' 
                        : 'text-amber-400 bg-amber-950/60'
                    }`}>
                      {station.type}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2 font-mono">
                    <span className="text-slate-400 text-[11px]">Current:</span>
                    <span className="font-bold text-emerald-400">{station.currentOutputMW} MW</span>
                    <span className="text-slate-500 text-[11px]">/ {station.installedCapacityMW} MW</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Interactive Dual Section: LUKU Token Generator & Load Shedding Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: ZESCO LUKU Prepaid Electricity Token Generator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 font-display">
                    ZESCO LUKU Token Purchase
                  </h3>
                  <p className="text-xs text-slate-400">
                    Generate instant 20-digit STS prepaid electricity token
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLukuModalOpen(true)}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Open Instant ZESCO LUKU Modal dialog"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Modal</span>
              </button>
            </div>

            <form onSubmit={handleBuyToken} className="space-y-4 mt-5">
              {/* Meter Number */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  11-Digit Meter Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={meterNumber}
                    onChange={(e) => setMeterNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="e.g. 04291847102"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <div className="absolute right-3 top-2.5 text-[10px] text-slate-500 font-mono">
                    STS STANDARD
                  </div>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Customer / Premise Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Mwape Chileshe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Purchase Amount Presets & Custom */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Amount in Zambian Kwacha (ZMW)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[50, 100, 200, 500].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setAmountZMW(preset)}
                      className={`py-1.5 text-xs font-mono font-semibold rounded-md border transition-colors cursor-pointer ${
                        amountZMW === preset
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      K{preset}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={amountZMW}
                  onChange={(e) => setAmountZMW(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                  <span>Estimated Units:</span>
                  <span className="text-emerald-300 font-bold">~{calculateUnits(amountZMW)} kWh</span>
                </div>
              </div>

              {/* Mobile Money Provider */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Pay via Mobile Money
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('airtel')}
                    className={`py-2 px-2 text-xs rounded-lg border text-center transition-all cursor-pointer ${
                      paymentProvider === 'airtel'
                        ? 'bg-red-950/60 border-red-500 text-red-200 font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Airtel Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('mtn')}
                    className={`py-2 px-2 text-xs rounded-lg border text-center transition-all cursor-pointer ${
                      paymentProvider === 'mtn'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-200 font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentProvider('zamtel')}
                    className={`py-2 px-2 text-xs rounded-lg border text-center transition-all cursor-pointer ${
                      paymentProvider === 'zamtel'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-medium'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Zamtel Kwacha
                  </button>
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Payer Phone Number
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="0977xxxxxx"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isProcessing ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Contacting ZESCO STS Gateway...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Purchase K{amountZMW} LUKU Token</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Token Slip / Receipt */}
          {currentReceipt && (
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-200 uppercase font-mono">
                    Official ZESCO LUKU Slip
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentReceipt.receiptNumber}
                </span>
              </div>

              {/* Prominent 20-Digit Token */}
              <div className="my-4 text-center bg-slate-950 border border-slate-800 rounded-lg p-3.5">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  Prepaid Keypad Token (20 Digits)
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tracking-wider my-1.5 select-all">
                  {currentReceipt.tokenNumber}
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => copyToClipboard(currentReceipt.tokenNumber)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-md transition-colors cursor-pointer"
                  >
                    {copiedToken ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Token</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Receipt Details */}
              <div className="space-y-1.5 text-xs text-slate-300 font-mono pt-1 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Meter Number:</span>
                  <span className="font-semibold text-slate-200">{currentReceipt.meterNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="text-slate-200">{currentReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Energy Units:</span>
                  <span className="font-bold text-emerald-400">{currentReceipt.unitsKWh} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-semibold text-slate-200">ZMW {currentReceipt.amountZMW.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">VAT (16%) & REA (3%):</span>
                  <span className="text-slate-400">Included</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Issued At:</span>
                  <span>{currentReceipt.date}</span>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800 text-center">
                Punch this 20-digit number directly into your house meter keypad and press <strong># / Enter</strong>.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Load-Shedding Timetable & Search (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Zambia Load-Shedding Timetable
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Official 2026 emergency rationing rotation across Lusaka, Copperbelt, and provinces
                </p>
              </div>

              {/* Search Township Input */}
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTownship}
                  onChange={(e) => setSearchTownship(e.target.value)}
                  placeholder="Filter township or city..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* List of Schedules */}
            <div className="space-y-3 mt-4">
              {filteredSchedules.map((schedule, idx) => {
                const isOffNow = schedule.status === 'CURRENTLY_OFF';
                return (
                  <div
                    key={idx}
                    className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-200">
                            {schedule.township}
                          </span>
                          <span className="text-xs text-slate-500">·</span>
                          <span className="text-xs text-slate-400">{schedule.city}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {schedule.substation} ({schedule.province} Province)
                        </div>
                      </div>

                      {/* Live Outage Status Badge */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5 ${
                            isOffNow
                              ? 'bg-amber-950/70 border border-amber-800/60 text-amber-300'
                              : 'bg-emerald-950/70 border border-emerald-800/60 text-emerald-300'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isOffNow ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                          {isOffNow ? 'Outage in Progress' : 'Power Restored / Active'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/60 text-xs">
                      <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Today’s Rationing Window</span>
                        <span className="font-mono font-medium text-slate-200 mt-0.5 block">{schedule.todaySlot}</span>
                      </div>
                      <div className="bg-slate-900/70 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Tomorrow’s Slot</span>
                        <span className="font-mono font-medium text-slate-300 mt-0.5 block">{schedule.tomorrowSlot}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredSchedules.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No township found matching "{searchTownship}". Try typing "Woodlands", "Matero", "Kitwe", or "Ndola".
                </div>
              )}
            </div>
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
