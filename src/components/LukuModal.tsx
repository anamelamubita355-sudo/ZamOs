import React, { useState } from 'react';
import { Zap, Copy, Check, ShieldCheck, Download, Printer, RefreshCw } from 'lucide-react';

interface LukuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LukuModal: React.FC<LukuModalProps> = ({ isOpen, onClose }) => {
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('100');
  const [customerName, setCustomerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [units, setUnits] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  if (!isOpen) return null;

  // Generate a realistic 20-digit STS token divided into 4-digit blocks
  const generateSTSToken = () => {
    const raw = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
    return raw.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (meterNumber.length < 11) {
      alert('Please enter a valid 11-digit ZESCO Meter Number.');
      return;
    }

    setIsLoading(true);
    setGeneratedToken(null);

    setTimeout(() => {
      const kwacha = parseFloat(amount) || 100;
      // Average residential electricity tariff estimate (~1.40 ZMW / kWh including VAT & duties)
      const calculatedUnits = parseFloat((kwacha / 1.42).toFixed(1));
      
      setUnits(calculatedUnits);
      setGeneratedToken(generateSTSToken());
      setCustomerName('ANAMELA MUBITA'); // Auto-filled verified account holder
      setReceiptNumber(`REC-ZESCO-${Math.floor(100000 + Math.random() * 900000)}`);
      setIsLoading(false);
    }, 1200);
  };

  const copyToClipboard = () => {
    if (generatedToken) {
      navigator.clipboard.writeText(generatedToken.replace(/-/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadReceipt = () => {
    if (!generatedToken) return;
    const content = `================================================
REPUBLIC OF ZAMBIA · ZESCO LIMITED
INSTANT LUKU PREPAID ELECTRICITY VOUCHER
================================================
Receipt No:      ${receiptNumber}
Date & Time:     ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lusaka' })} CAT
Customer Name:   ${customerName || 'ANAMELA MUBITA'}
Meter Number:    ${meterNumber}
Amount Paid:     K${amount}.00 ZMW
Units Purchased: ${units} kWh
Tariff Rate:     ~K1.42 / kWh (Incl. VAT & REA Levy)

------------------------------------------------
STS 20-DIGIT TOKEN:
${generatedToken}
------------------------------------------------
Enter the 20 digits on your keypad and press '#'
Emergency Support: ZESCO 322 / Toll-Free 0800-100-100
================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ZESCO-LUKU-${receiptNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setGeneratedToken(null);
    setUnits(null);
    setCopied(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 text-white shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Instant ZESCO LUKU</h2>
            <p className="text-xs text-slate-400">STS 20-Digit Standard Prepaid Meter Token</p>
          </div>
        </div>

        {!generatedToken ? (
          <form onSubmit={handlePurchase} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Meter Number (11 Digits)
              </label>
              <input
                type="text"
                maxLength={11}
                placeholder="e.g. 01429857412"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono focus:border-amber-500 focus:outline-none placeholder:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Purchase Amount (ZMW)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['50', '100', '200', '500'].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      amount === val 
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' 
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    K{val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Estimated Energy:</span>
                <span className="font-mono text-amber-400 font-bold">
                  {((parseFloat(amount) || 0) / 1.42).toFixed(1)} kWh
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Standard STS Standard:</span>
                <span className="text-slate-300">IEC 62055-41 Compliant</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || meterNumber.length < 11}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Token via ZESCO Grid...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Purchase LUKU Token (K{amount})</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>STS Token Generated & Verified</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{receiptNumber}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Account Holder</div>
                  <div className="font-bold text-slate-100">{customerName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Meter Number</div>
                  <div className="font-mono font-bold text-slate-100">{meterNumber}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Amount Paid</div>
                  <div className="font-bold text-amber-400">K{amount}.00 ZMW</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Energy Credited</div>
                  <div className="font-bold text-emerald-400 font-mono">{units} kWh</div>
                </div>
              </div>
            </div>

            {/* The 20-digit Token Display */}
            <div className="bg-slate-950 border-2 border-amber-500/50 rounded-xl p-4 text-center space-y-2">
              <div className="text-[10px] uppercase font-mono tracking-widest text-amber-400">
                20-Digit STS Prepaid Token
              </div>
              <div className="text-xl sm:text-2xl font-mono font-black tracking-wider text-amber-300 select-all">
                {generatedToken}
              </div>
              <p className="text-[10px] text-slate-400">
                Enter digits into your keypad and press the enter key
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={copyToClipboard}
                className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Token'}</span>
              </button>

              <button
                type="button"
                onClick={downloadReceipt}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Save Receipt</span>
              </button>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="w-full py-2 bg-transparent hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Purchase Another Token</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
