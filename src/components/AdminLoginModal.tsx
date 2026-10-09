import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, Key, Activity, X, UserCheck } from 'lucide-react';
import { AdminUser } from '../types/zambia';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser, token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Demo Officer profiles that securely authenticate via backend POST /api/auth/login
  const demoProfiles = [
    { label: 'Super Admin', email: 'admin@zamos.gov.zm', pass: 'ZamOS@2026!Gov', role: 'Smart Zambia Institute' },
    { label: 'ZESCO Controller', email: 'grid.control@zesco.co.zm', pass: 'ZescoGrid#2026', role: 'National Control Centre' },
    { label: 'DMMU Director', email: 'dispatch@dmmu.gov.zm', pass: 'DmmuResponse#2026', role: 'Disaster Management' },
    { label: 'CDF Auditor', email: 'cdf.audits@mlgrd.gov.zm', pass: 'CdfAudit#2026', role: 'Local Government' },
  ];

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please provide both official email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication challenge failed.');
      }

      // Save token in sessionStorage
      sessionStorage.setItem('zamos_auth_token', data.token);
      sessionStorage.setItem('zamos_user', JSON.stringify(data.user));

      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border-2 border-emerald-500/70 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
          aria-label="Close login dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pb-4 border-b border-slate-800">
          <div className="w-12 h-12 bg-emerald-950 border border-emerald-500/50 rounded-xl flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-inner">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold font-mono">
            Republic of Zambia
          </div>
          <h3 className="text-lg font-bold text-slate-100 font-display mt-0.5">
            Sovereign Administrator Portal
          </h3>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
            Authorized Public Officers & Ministry Personnel Only. All access attempts are recorded in the sovereign audit trail.
          </p>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-950/60 border border-red-800/80 rounded-lg text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Official Government Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@zamos.gov.zm"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Security Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isLoading ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                <span>Verifying Sovereign Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to Admin Console</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Officer Role (Demonstration Mode):</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {demoProfiles.map((p) => (
              <button
                key={p.email}
                type="button"
                onClick={() => handleFillDemo(p.email, p.pass)}
                className="p-2 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-[11px] text-slate-200">{p.label}</div>
                <div className="text-[9px] text-slate-500 truncate">{p.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
