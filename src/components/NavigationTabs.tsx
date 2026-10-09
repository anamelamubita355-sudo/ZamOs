import React from 'react';
import { 
  LayoutDashboard, 
  Zap, 
  Receipt, 
  Car, 
  Building2, 
  HandCoins, 
  HeartPulse, 
  Coins, 
  PhoneCall, 
  Bot,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { TabId, AdminUser } from '../types/zambia';

interface NavigationTabsProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  currentUser: AdminUser | null;
  onOpenLogin: () => void;
}

interface NavItem {
  id: TabId;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ 
  activeTab, 
  setActiveTab,
  currentUser,
  onOpenLogin,
}) => {
  const baseNavItems: NavItem[] = [
    { id: 'overview', label: 'Command Overview', sublabel: '10 Provinces & Grid', icon: LayoutDashboard },
    { id: 'zesco', label: 'ZESCO Power Grid', sublabel: 'LUKU & Kariba Dam', icon: Zap },
    { id: 'zra', label: 'ZRA Tax & Revenue', sublabel: 'PAYE & TPIN & Borders', icon: Receipt },
    { id: 'rtsa', label: 'RTSA & e-Toll', sublabel: 'Driver License & Plazas', icon: Car },
    { id: 'pacra', label: 'PACRA Commerce', sublabel: 'Company Registration', icon: Building2 },
    { id: 'cdf', label: 'CDF Transparency', sublabel: '156 Constituencies', icon: HandCoins },
    { id: 'smartcare', label: 'SmartCare Health', sublabel: 'UTH & Medicine Stocks', icon: HeartPulse },
    { id: 'boz', label: 'Bank of Zambia', sublabel: 'Kwacha FX & MoMo', icon: Coins },
    { id: 'emergency', label: '991 / 993 Emergency', sublabel: 'DMMU National Dispatch', icon: PhoneCall },
    { id: 'assistant', label: 'ZamGov Citizen AI', sublabel: 'Multilingual Civic Guide', icon: Bot },
  ];

  return (
    <nav className="border-b border-slate-800 bg-slate-900/60 sticky top-[57px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
          {baseNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0 min-h-[42px] ${
                  isActive
                    ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                />
                <div className="leading-tight">
                  <div className={`text-xs ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-slate-500 hidden xl:block font-mono">
                    {item.sublabel}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Admin Dashboard Tab */}
          {currentUser ? (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0 min-h-[42px] border ${
                activeTab === 'admin'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-sm'
                  : 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400 hover:bg-emerald-950/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="leading-tight">
                <div className="text-xs">Administrator Dashboard</div>
                <div className="text-[10px] text-emerald-500/80 hidden xl:block font-mono">
                  Sovereign Management
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-all whitespace-nowrap cursor-pointer shrink-0 min-h-[42px] bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              title="Official Government Administrator Login"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <div className="text-xs">Officer Portal</div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
