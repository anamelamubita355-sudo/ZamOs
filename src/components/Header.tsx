import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  PhoneCall, 
  ShieldCheck, 
  Clock, 
  Coins, 
  Lock,
  Bell,
  UserCheck
} from 'lucide-react';
import { TabId, AdminUser } from '../types/zambia';
import { sovereignStore } from '../services/sovereignStore';

interface HeaderProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onQuickSos: () => void;
  currentUser: AdminUser | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onQuickSos,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenNotifications,
}) => {
  const [lusakaTime, setLusakaTime] = useState('');
  const [unreadCount, setUnreadCount] = useState(sovereignStore.getUnreadCount());

  useEffect(() => {
    const unsub = sovereignStore.subscribe(() => {
      setUnreadCount(sovereignStore.getUnreadCount());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const updateTime = () => {
      // Central Africa Time (CAT) is UTC+2
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Africa/Lusaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setLusakaTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur sticky top-0 z-40">
      {/* Sovereign National Color Accent Ribbon (Green, Red, Black, Copper) */}
      <div className="h-1.5 w-full flex">
        <div className="h-full flex-1 bg-emerald-600" title="Green: Flora & Natural Resources" />
        <div className="h-full w-24 bg-red-600" title="Red: Struggle for Freedom" />
        <div className="h-full w-24 bg-black" title="Black: The Zambian People" />
        <div className="h-full w-24 bg-amber-600" title="Orange/Copper: Mineral Wealth & Copper" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Crest & Title */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-amber-400 font-bold shadow-inner group-hover:border-emerald-500 transition-colors">
            {/* Eagle of Liberty Graphic Silhouette */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-amber-500" aria-label="Zambian Eagle">
              <path d="M12 2L15 8L21 9L16 14L18 20L12 17L6 20L8 14L3 9L9 8L12 2Z" opacity="0.85" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Republic of Zambia</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">ZamOS v2026.4</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight font-display flex items-center gap-2">
              National Sovereign Systems Hub
              <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                (One Zambia, One Nation)
              </span>
            </h1>
          </div>
        </div>

        {/* Live National Tickers & Action bar */}
        <div className="flex items-center gap-3 text-xs">
          {/* Lusaka Time */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-md border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Lusaka CAT:</span>
            <span className="font-mono text-slate-200 font-medium">{lusakaTime || '14:53:10'}</span>
          </div>

          {/* Bank of Zambia Kwacha Fixing */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 bg-slate-900/80 px-2.5 py-1.5 rounded-md border border-slate-800">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-500">BOZ:</span>
            <span className="font-mono text-amber-300 font-medium">USD 1 = K27.42</span>
          </div>

          {/* Grid Alert Status */}
          <div 
            onClick={() => setActiveTab('zesco')}
            className="hidden sm:flex items-center gap-2 bg-amber-950/40 hover:bg-amber-950/60 border border-amber-800/40 px-2.5 py-1.5 rounded-md text-amber-300 cursor-pointer transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-medium text-[11px]">Grid: -457 MW (Stage 2)</span>
          </div>

          {/* Notification Center Bell Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Sovereign In-App Notifications Center"
            aria-label="Open notifications center"
          >
            <Bell className="w-4 h-4 text-emerald-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold font-mono text-[9px] flex items-center justify-center shadow">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Emergency 991/992/993 SOS Trigger */}
          <button
            onClick={onQuickSos}
            className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 text-white font-medium px-3 py-2 rounded-lg transition-colors shadow-sm cursor-pointer min-h-[38px]"
            title="Open Unified National Emergency 991/992/993 Dispatch"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-bold">991/993</span>
          </button>

          {/* Admin / Officer Portal Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/60 p-1 pl-2.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <button
                onClick={() => setActiveTab('admin')}
                className="text-emerald-300 font-semibold hover:text-white transition-colors cursor-pointer text-xs"
              >
                {activeTab === 'admin' ? 'Admin Active' : 'Admin Console'}
              </button>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-red-400 p-1 text-[11px] rounded transition-colors cursor-pointer ml-1"
                title="Sign Out"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer min-h-[38px]"
              title="Official Government Administrator Login"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Officer Portal</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
