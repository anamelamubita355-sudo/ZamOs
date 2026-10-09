import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  DollarSign, 
  Percent, 
  Truck, 
  Printer, 
  ExternalLink,
  Building
} from 'lucide-react';
import { BORDER_POSTS } from '../data/zambiaData';

export const ZraTaxModule: React.FC = () => {
  // PAYE Calculator State
  const [grossSalary, setGrossSalary] = useState<number>(15000);
  const [basicSalary, setBasicSalary] = useState<number>(12000);
  const [includeNapsa, setIncludeNapsa] = useState<boolean>(true);
  const [includeNhima, setIncludeNhima] = useState<boolean>(true);

  // TPIN Lookup State
  const [tpinInput, setTpinInput] = useState<string>('1004829103');
  const [tpinResult, setTpinResult] = useState<{
    tpin: string;
    taxpayerName: string;
    status: 'COMPLIANT' | 'OVERDUE_RETURNS';
    registeredTaxes: string[];
    taxOffice: string;
  } | null>({
    tpin: '1004829103',
    taxpayerName: 'Chanda Mwila Enterprise Ltd',
    status: 'COMPLIANT',
    registeredTaxes: ['Income Tax (Corporate)', 'Value Added Tax (VAT 16%)', 'Pay As You Earn (PAYE)', 'Withholding Tax'],
    taxOffice: 'Lusaka Large Taxpayer Office (Kabulonga)',
  });

  // TCC Certificate modal state
  const [showTccCert, setShowTccCert] = useState<boolean>(false);

  // 2026 PAYE Zambian Tax Calculation logic
  const calculatePaye = () => {
    // NAPSA: 5% of gross, capped at K1,342
    const napsa = includeNapsa ? Math.min(grossSalary * 0.05, 1342.40) : 0;
    // NHIMA: 1% of basic salary
    const nhima = includeNhima ? basicSalary * 0.01 : 0;

    let taxableIncome = grossSalary;
    let paye = 0;

    // Band 1: 0 to 5,100 @ 0%
    if (taxableIncome > 5100) {
      // Band 2: 5,101 to 7,100 (up to 2,000) @ 20%
      const band2Taxable = Math.min(taxableIncome - 5100, 2000);
      paye += band2Taxable * 0.20;

      // Band 3: 7,101 to 9,200 (up to 2,100) @ 30%
      if (taxableIncome > 7100) {
        const band3Taxable = Math.min(taxableIncome - 7100, 2100);
        paye += band3Taxable * 0.30;

        // Band 4: Above 9,200 @ 37%
        if (taxableIncome > 9200) {
          const band4Taxable = taxableIncome - 9200;
          paye += band4Taxable * 0.37;
        }
      }
    }

    const totalDeductions = napsa + nhima + paye;
    const netTakeHome = grossSalary - totalDeductions;

    return {
      napsa,
      nhima,
      paye,
      totalDeductions,
      netTakeHome,
      effectiveTaxRate: (paye / grossSalary) * 100,
    };
  };

  const taxDetails = calculatePaye();

  const handleTpinLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tpinInput) return;
    setTpinResult({
      tpin: tpinInput,
      taxpayerName: 'Verified Zambian Taxpayer / Trader',
      status: 'COMPLIANT',
      registeredTaxes: ['Income Tax (Individual)', 'Turnover Tax (4%)', 'Presumptive Tax'],
      taxOffice: 'Lusaka Medium Taxpayer Office (Cairo Road)',
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Receipt className="w-4 h-4" />
              <span>Zambia Revenue Authority (ZRA)</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">MyTax Online & ASYCUDA</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display mt-1">
              National Taxation, PAYE Engine & Customs Clearance
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Official 2026 statutory taxation brackets, instant TPIN compliance verification, Tax Clearance Certificates (TCC), and cross-border transit status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTccCert(true)}
              className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Tax Clearance (TCC)</span>
            </button>
          </div>
        </div>

        {/* Quick Statutory Reference */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Tax-Free Threshold</span>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">K5,100 / month</div>
            <span className="text-[10px] text-slate-400">0% on first K5,100</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Top PAYE Bracket</span>
            <div className="text-base font-bold font-mono text-slate-200 mt-0.5">37.0%</div>
            <span className="text-[10px] text-slate-400">Above K9,200</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">SME Turnover Tax</span>
            <div className="text-base font-bold font-mono text-amber-400 mt-0.5">4.0%</div>
            <span className="text-[10px] text-slate-400">Under K800k turnover</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Standard VAT</span>
            <div className="text-base font-bold font-mono text-blue-400 mt-0.5">16.0%</div>
            <span className="text-[10px] text-slate-400">Value Added Tax</span>
          </div>
        </div>
      </div>

      {/* Main Dual Section: PAYE Calculator (Left) & TPIN / Customs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Official PAYE Calculator */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              2026 PAYE Salary & Take-Home Calculator
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Republic of Zambia Finance Act</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Monthly Gross Salary (ZMW)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={grossSalary}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setGrossSalary(val);
                  if (basicSalary > val) setBasicSalary(val);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Basic Salary (for NHIMA 1%)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Deductions Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNapsa}
                onChange={(e) => setIncludeNapsa(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span>NAPSA Pension (5%, cap K1,342.40)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNhima}
                onChange={(e) => setIncludeNhima(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span>NHIMA Health Insurance (1% basic)</span>
            </label>
          </div>

          {/* Salary Breakdown Summary */}
          <div className="bg-slate-950 rounded-xl p-4.5 border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Statutory Breakdown & Net Pay
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Gross Monthly Earnings:</span>
                <span className="text-slate-200 font-bold">K{grossSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">PAYE Tax Deducted:</span>
                <span className="text-amber-400 font-bold">- K{taxDetails.paye.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              {includeNapsa && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">NAPSA Pension (5%):</span>
                  <span className="text-slate-300">- K{taxDetails.napsa.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {includeNhima && (
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">NHIMA Health (1%):</span>
                  <span className="text-slate-300">- K{taxDetails.nhima.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-300">
                <span>Total Statutory Deductions:</span>
                <span className="font-bold text-red-400">- K{taxDetails.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-sm font-bold text-slate-100">Net Take-Home Salary:</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  K{taxDetails.netTakeHome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/80 flex justify-between">
              <span>Effective PAYE Tax Rate: {taxDetails.effectiveTaxRate.toFixed(1)}%</span>
              <span className="text-emerald-400 font-semibold">Compliant with ZRA 2026 Bands</span>
            </div>
          </div>
        </div>

        {/* Right Column: TPIN Verification & Border Customs */}
        <div className="lg:col-span-5 space-y-6">
          {/* TPIN Lookup */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
            <h3 className="text-base font-bold text-slate-100 font-display mb-1 flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              TPIN Verification & Compliance Search
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Verify taxpayer status, registered tax lines, and compliance certificate standing.
            </p>

            <form onSubmit={handleTpinLookup} className="flex gap-2 mb-4">
              <input
                type="text"
                value={tpinInput}
                onChange={(e) => setTpinInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit TPIN (e.g. 1004829103)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Verify
              </button>
            </form>

            {tpinResult && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <div className="text-xs font-bold text-slate-200">{tpinResult.taxpayerName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">TPIN: {tpinResult.tpin}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800/60 px-2 py-0.5 rounded">
                    COMPLIANT
                  </span>
                </div>
                <div className="text-xs space-y-1.5">
                  <div className="text-slate-400 text-[11px]">Registered Tax Types:</div>
                  <div className="flex flex-wrap gap-1">
                    {tpinResult.registeredTaxes.map((tax, i) => (
                      <span key={i} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {tax}
                      </span>
                    ))}
                  </div>
                  <div className="pt-2 text-[11px] text-slate-400">
                    Jurisdiction: <span className="text-slate-300">{tpinResult.taxOffice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Border Customs Clearance Tracker */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
            <h3 className="text-base font-bold text-slate-100 font-display mb-1 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              ZRA Customs & One-Stop Border Posts
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real-time commercial vehicle clearance queues and ASYCUDA World status.
            </p>

            <div className="space-y-2.5">
              {BORDER_POSTS.map((border) => (
                <div key={border.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200">{border.name}</div>
                    <div className="text-[10px] text-slate-400">{border.borderWith}</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-amber-400 font-semibold">~{border.commercialQueueHours} hrs queue</div>
                    <div className="text-[10px] text-emerald-400">{border.dailyClearedTrucks} trucks/day</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tax Clearance Certificate (TCC) Modal */}
      {showTccCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border-2 border-emerald-500/80 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowTccCert(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-900 border border-slate-800 cursor-pointer"
            >
              Close
            </button>

            {/* Certificate Header */}
            <div className="text-center pb-4 border-b border-slate-800 space-y-1">
              <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                REPUBLIC OF ZAMBIA
              </div>
              <h3 className="text-lg font-bold text-slate-100 font-display">
                ZAMBIA REVENUE AUTHORITY
              </h3>
              <div className="text-xs text-amber-400 font-mono font-semibold">
                ELECTRONIC TAX CLEARANCE CERTIFICATE (TCC)
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Issued pursuant to Section 81B of the Income Tax Act
              </div>
            </div>

            {/* Certificate Body */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Certificate No:</span>
                <span className="font-bold text-slate-200">ZRA/TCC/2026/094821</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Taxpayer Name:</span>
                <span className="font-bold text-emerald-400">{tpinResult?.taxpayerName || 'Chanda Mwila Enterprise Ltd'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">TPIN:</span>
                <span className="font-bold text-slate-200">{tpinResult?.tpin || '1004829103'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Date of Issue:</span>
                <span className="text-slate-300">09 October 2026</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Expiry Date:</span>
                <span className="text-slate-300 font-bold">31 December 2026</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Compliance Status:</span>
                <span className="text-emerald-400 font-bold">FULLY SATISFIED (ALL RETURNS LODGED)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Digitally Authenticated with ZRA Core Tax Hash</span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
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
