import React, { useState } from 'react';
import { 
  Coins, 
  ArrowRightLeft, 
  TrendingUp, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Clock 
} from 'lucide-react';

export const BozPaymentsModule: React.FC = () => {
  // Converter state
  const [amountUSD, setAmountUSD] = useState<number>(100);
  const fxUSD = 27.42;
  const fxGBP = 34.85;
  const fxEUR = 29.60;
  const fxZAR = 1.48;

  // Universal Sovereign Payment State
  const [invoiceType, setInvoiceType] = useState('ZESCO Electricity Token');
  const [referenceNumber, setReferenceNumber] = useState('INV-ZM-2026-9481');
  const [paymentAmount, setPaymentAmount] = useState<number>(250);
  const [operator, setOperator] = useState<'airtel' | 'mtn' | 'zamtel'>('airtel');
  const [phoneNumber, setPhoneNumber] = useState('0978912345');
  const [paymentState, setPaymentState] = useState<'idle' | 'push_sent' | 'confirmed'>('idle');

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentState('push_sent');

    setTimeout(() => {
      setPaymentState('confirmed');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Coins className="w-4 h-4" />
              <span>Bank of Zambia (BOZ) & National Payment Switch</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">Monetary Policy & Interoperability</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display mt-1">
              Sovereign Treasury, Kwacha Exchange Rates & Mobile Money Switch
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Official daily BOZ fixing, real-time currency conversions, monetary indicators, and interoperable national payment settlement across Airtel Money, MTN MoMo, and Zamtel Kwacha.
            </p>
          </div>
        </div>

        {/* BOZ Macro Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">BOZ Monetary Policy Rate</span>
            <div className="text-base font-bold text-emerald-400 mt-0.5">13.50%</div>
            <span className="text-[10px] text-slate-400">Target Inflation Anchor</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">National Inflation Rate</span>
            <div className="text-base font-bold text-amber-400 mt-0.5">15.2%</div>
            <span className="text-[10px] text-slate-400">Year-on-Year CPI</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">Statutory Reserve Ratio</span>
            <div className="text-base font-bold text-slate-200 mt-0.5">26.0%</div>
            <span className="text-[10px] text-slate-400">Commercial Bank Liquidity</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">Gross Int'l Reserves</span>
            <div className="text-base font-bold text-blue-400 mt-0.5">$3.42 Billion</div>
            <span className="text-[10px] text-slate-400">3.8 Months Import Cover</span>
          </div>
        </div>
      </div>

      {/* Main Grid: FX Rates & Converter (Left) and Universal Mobile Money Switch (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Official FX Fixings & Converter */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
              Official BOZ Foreign Exchange Fixing
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Daily Mid-Rate</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {[
              { pair: 'USD / ZMW (US Dollar)', rate: fxUSD, change: '+0.12%' },
              { pair: 'GBP / ZMW (British Pound)', rate: fxGBP, change: '+0.08%' },
              { pair: 'EUR / ZMW (Euro)', rate: fxEUR, change: '-0.05%' },
              { pair: 'ZAR / ZMW (South African Rand)', rate: fxZAR, change: '+0.21%' },
            ].map((fx) => (
              <div key={fx.pair} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-slate-200 font-bold">{fx.pair}</div>
                  <div className="text-[10px] text-slate-500">Bank of Zambia Authorized Rate</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-emerald-400">K{fx.rate.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400">{fx.change}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Currency Converter */}
          <div className="bg-slate-950 p-4.5 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-300">Live Kwacha (ZMW) Calculator</div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 block mb-1">Foreign Amount (USD)</label>
                <input
                  type="number"
                  min="1"
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 block mb-1">Equivalent Zambian Kwacha</label>
                <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-mono font-bold">
                  K{(amountUSD * fxUSD).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ZMW
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Universal Sovereign Mobile Money Switch (Airtel, MTN, Zamtel) */}
        <div className="lg:col-span-6 bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Unified National Mobile Money Gateway
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">ZEP-S Switch</span>
          </div>

          <p className="text-xs text-slate-400">
            Pay any sovereign invoice or utility bill with immediate cross-network clearance.
          </p>

          <form onSubmit={handleSimulatePayment} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Public Service / Invoice</label>
              <select
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option>ZESCO Electricity Token</option>
                <option>ZRA Tax Assessment (PAYE / Turnover Tax)</option>
                <option>RTSA Motor Vehicle Road Fitness & Tax</option>
                <option>PACRA Company Incorporation Fee</option>
                <option>NRFA National e-Toll Card Balance</option>
                <option>TEVETA / University Tuition Fee</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reference Number</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Amount (ZMW)</label>
                <input
                  type="number"
                  min="5"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Operator choice */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Select Network Provider</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOperator('airtel')}
                  className={`p-2 rounded-lg border text-xs font-medium cursor-pointer ${
                    operator === 'airtel'
                      ? 'bg-red-950/70 border-red-500 text-red-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Airtel Money
                </button>
                <button
                  type="button"
                  onClick={() => setOperator('mtn')}
                  className={`p-2 rounded-lg border text-xs font-medium cursor-pointer ${
                    operator === 'mtn'
                      ? 'bg-amber-950/70 border-amber-500 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  MTN MoMo
                </button>
                <button
                  type="button"
                  onClick={() => setOperator('zamtel')}
                  className={`p-2 rounded-lg border text-xs font-medium cursor-pointer ${
                    operator === 'zamtel'
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Zamtel Kwacha
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Zambian Mobile Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="097xxxxxxx / 096xxxxxxx / 095xxxxxxx"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={paymentState === 'push_sent'}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {paymentState === 'push_sent' ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Sending USSD Prompt to {phoneNumber}...</span>
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Send Payment Request (K{paymentAmount})</span>
                </>
              )}
            </button>
          </form>

          {/* Payment Status Modal / Banner */}
          {paymentState === 'confirmed' && (
            <div className="bg-slate-950 border border-emerald-500/60 rounded-xl p-4 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Payment Approved & Settled!
                </span>
                <span>TXN-BOZ-819204</span>
              </div>
              <div className="text-slate-300 text-[11px] pt-1">
                K{paymentAmount}.00 paid to <strong>{invoiceType}</strong> ({referenceNumber}) from {operator.toUpperCase()} account ({phoneNumber}).
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Cleared by Bank of Zambia National Electronic Payment Switch.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
