import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Zap, 
  AlertTriangle, 
  BookOpen, 
  HandCoins, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Edit3, 
  Download, 
  Radio, 
  ExternalLink, 
  RefreshCw,
  Search,
  Filter,
  Check,
  Building,
  KeyRound
} from 'lucide-react';
import { 
  AdminUser, 
  AdminTabId, 
  EmergencyAlert, 
  PublicServiceEntry, 
  CdfApplicationRecord, 
  AuditLogEntry, 
  SystemSettings,
  PowerStation,
  LoadSheddingSchedule
} from '../types/zambia';
import { SignedReportExportModal } from './SignedReportExportModal';

interface AdminDashboardProps {
  currentUser: AdminUser;
  authToken: string;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  authToken,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabId>('admin_overview');
  const [isLoading, setIsLoading] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  // 1. Overview Telemetry
  const [overviewMetrics, setOverviewMetrics] = useState<any>(null);

  // 2. Power Grid Management
  const [powerStations, setPowerStations] = useState<PowerStation[]>([]);
  const [loadSheddingList, setLoadSheddingList] = useState<LoadSheddingSchedule[]>([]);
  const [selectedStation, setSelectedStation] = useState<PowerStation | null>(null);

  // 3. Emergency Alerts Management
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertAgency, setNewAlertAgency] = useState('Disaster Management & Mitigation Unit (DMMU)');
  const [newAlertSeverity, setNewAlertSeverity] = useState<'CRITICAL' | 'HIGH' | 'MODERATE' | 'ADVISORY'>('HIGH');
  const [newAlertDesc, setNewAlertDesc] = useState('');
  const [newAlertProvince, setNewAlertProvince] = useState('Lusaka Province');

  // 4. Public Service Directory
  const [directoryEntries, setDirectoryEntries] = useState<PublicServiceEntry[]>([]);
  const [newDirAgency, setNewDirAgency] = useState('');
  const [newDirMinistry, setNewDirMinistry] = useState('');
  const [newDirUrl, setNewDirUrl] = useState('');
  const [newDirHotline, setNewDirHotline] = useState('');
  const [dirSearch, setDirSearch] = useState('');

  // 5. CDF Management
  const [cdfApps, setCdfApps] = useState<CdfApplicationRecord[]>([]);
  const [cdfFilter, setCdfFilter] = useState('ALL');

  // 6. User Management
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerEmail, setNewOfficerEmail] = useState('');
  const [newOfficerRole, setNewOfficerRole] = useState<AdminUser['role']>('ZESCO Grid Controller');
  const [newOfficerPass, setNewOfficerPass] = useState('');

  // 7. Reports & Analytics
  const [reportsData, setReportsData] = useState<any>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // 8. Settings & Audit Logs
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [logSearch, setLogSearch] = useState('');

  // Show temporary toast
  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  // Fetch initial data based on active tab
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      // 1. Overview
      const ovRes = await fetch('/api/admin/overview', { headers });
      if (ovRes.ok) {
        const d = await ovRes.json();
        setOverviewMetrics(d);
        if (d.settings) setSettings(d.settings);
      }

      // 2. Power grid
      const pgRes = await fetch('/api/admin/power-stations', { headers });
      if (pgRes.ok) {
        const d = await pgRes.json();
        setPowerStations(d.powerStations || []);
      }
      const lsRes = await fetch('/api/admin/load-shedding', { headers });
      if (lsRes.ok) {
        const d = await lsRes.json();
        setLoadSheddingList(d.schedules || []);
      }

      // 3. Alerts
      const altRes = await fetch('/api/admin/alerts');
      if (altRes.ok) {
        const d = await altRes.json();
        setAlerts(d.alerts || []);
      }

      // 4. Directory
      const dirRes = await fetch('/api/admin/directory');
      if (dirRes.ok) {
        const d = await dirRes.json();
        setDirectoryEntries(d.directory || []);
      }

      // 5. CDF Apps
      const cdfRes = await fetch('/api/admin/cdf-applications', { headers });
      if (cdfRes.ok) {
        const d = await cdfRes.json();
        setCdfApps(d.applications || []);
      }

      // 6. Users
      const uRes = await fetch('/api/admin/users', { headers });
      if (uRes.ok) {
        const d = await uRes.json();
        setUsersList(d.users || []);
      }

      // 7. Reports
      const repRes = await fetch('/api/admin/reports', { headers });
      if (repRes.ok) {
        const d = await repRes.json();
        setReportsData(d);
      }

      // 8. Logs
      const logsRes = await fetch('/api/admin/audit-logs', { headers });
      if (logsRes.ok) {
        const d = await logsRes.json();
        setAuditLogs(d.auditLogs || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [authToken]);

  // Tab definitions
  const tabs = [
    { id: 'admin_overview' as AdminTabId, label: '1. National Overview', icon: LayoutDashboard },
    { id: 'admin_grid' as AdminTabId, label: '2. Electricity & Grid', icon: Zap },
    { id: 'admin_alerts' as AdminTabId, label: '3. Emergency Alerts', icon: AlertTriangle },
    { id: 'admin_directory' as AdminTabId, label: '4. Public Directory', icon: BookOpen },
    { id: 'admin_cdf' as AdminTabId, label: '5. CDF Verification', icon: HandCoins },
    { id: 'admin_users' as AdminTabId, label: '6. Users & Permissions', icon: Users },
    { id: 'admin_reports' as AdminTabId, label: '7. Reports & Analytics', icon: BarChart3 },
    { id: 'admin_settings' as AdminTabId, label: '8. Settings & Audit', icon: Settings },
  ];

  // Handlers for Power Station update
  const handleUpdateStationMW = async (stationId: string, newMW: number) => {
    try {
      const res = await fetch(`/api/admin/power-stations/${stationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ currentOutputMW: newMW }),
      });
      if (res.ok) {
        const data = await res.json();
        setPowerStations(prev => prev.map(s => s.id === stationId ? data.station : s));
        showToast(`Updated ${data.station.name} generation output.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle load shedding status
  const handleToggleOutage = async (index: number) => {
    const item = loadSheddingList[index];
    const newStatus = item.status === 'CURRENTLY_OFF' ? 'CURRENTLY_ON' : 'CURRENTLY_OFF';
    try {
      const res = await fetch(`/api/admin/load-shedding/${index}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLoadSheddingList(prev => prev.map((s, idx) => idx === index ? { ...s, status: newStatus } : s));
        showToast(`Toggled outage status for ${item.township} to ${newStatus}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Broadcast Alert
  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTitle || !newAlertDesc) return;
    try {
      const res = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          title: newAlertTitle,
          agency: newAlertAgency,
          severity: newAlertSeverity,
          description: newAlertDesc,
          affectedProvinces: [newAlertProvince],
        }),
      });
      if (res.ok) {
        const d = await res.json();
        setAlerts([d.alert, ...alerts]);
        setNewAlertTitle('');
        setNewAlertDesc('');
        showToast('Official emergency advisory published to sovereign feed.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Alert Status
  const handleToggleAlertStatus = async (alertId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'RESOLVED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus as any } : a));
        showToast(`Alert [${alertId}] marked as ${newStatus}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Directory Entry
  const handleAddDirectoryEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirAgency || !newDirUrl) return;
    try {
      const res = await fetch('/api/admin/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          agencyName: newDirAgency,
          ministry: newDirMinistry || 'Government of Zambia',
          verifiedPortalUrl: newDirUrl,
          hotlines: [newDirHotline || '112'],
        }),
      });
      if (res.ok) {
        const d = await res.json();
        setDirectoryEntries([d.entry, ...directoryEntries]);
        setNewDirAgency('');
        setNewDirUrl('');
        setNewDirMinistry('');
        setNewDirHotline('');
        showToast(`Added verified public directory listing for ${d.entry.agencyName}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update CDF Application Status
  const handleUpdateCdfStatus = async (id: string, newStatus: CdfApplicationRecord['status']) => {
    try {
      const res = await fetch(`/api/admin/cdf-applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setCdfApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        showToast(`Application [${id}] updated to ${newStatus}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add System User
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName || !newOfficerEmail || !newOfficerPass) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          fullName: newOfficerName,
          email: newOfficerEmail,
          role: newOfficerRole,
          password: newOfficerPass,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        setUsersList([...usersList, d.user]);
        setNewOfficerName('');
        setNewOfficerEmail('');
        setNewOfficerPass('');
        showToast(`Officer account created for ${d.user.fullName}.`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create user');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle User Status
  const handleToggleUserStatus = async (user: AdminUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus as any } : u));
        showToast(`Officer account [${user.email}] is now ${newStatus}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle System Setting
  const handleToggleSetting = async (key: keyof SystemSettings) => {
    if (!settings) return;
    const newVal = !settings[key];
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ [key]: newVal }),
      });
      if (res.ok) {
        const d = await res.json();
        setSettings(d.settings);
        showToast(`System setting [${String(key)}] updated.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Export Analytics to JSON
  const handleExportReport = () => {
    const reportPayload = {
      exportTimestamp: new Date().toISOString(),
      generatedBy: currentUser.email,
      reportsData,
      overviewMetrics,
      auditLogCount: auditLogs.length,
    };
    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ZamOS_National_Report_${Date.now()}.json`;
    a.click();
    showToast('Downloaded sovereign analytical dataset.');
  };

  return (
    <div className="space-y-6">
      {/* Officer Security Header */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-900/60 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
              <span>Sovereign Officer Dashboard</span>
              <span className="text-slate-600">·</span>
              <span className="text-amber-400 font-bold">{currentUser.role}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 font-display">
              {currentUser.fullName}
              <span className="text-xs font-normal text-slate-400 ml-2 font-mono">
                ({currentUser.email})
              </span>
            </h2>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Department: {currentUser.department} · Last Login: {currentUser.lastLogin}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-center">
          <button
            onClick={fetchAllData}
            disabled={isLoading}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh All Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Sync Systems</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Persistent Toast Alert */}
      {notificationMsg && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/80 rounded-xl text-xs text-emerald-300 flex items-center justify-between shadow-md">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {notificationMsg}
          </span>
          <button onClick={() => setNotificationMsg('')} className="text-slate-400 hover:text-white cursor-pointer text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Prominent Mandatory Simulation Notice Badge */}
      <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-amber-300 uppercase tracking-wider font-mono">[SIMULATED ENVIRONMENT DECLARATION]:</strong> Real-time electricity outputs, power deficit calculations, and emergency dispatches in this dashboard are simulated models for national technology demonstration. They do not supersede certified real-time circulars from the ZESCO National Control Centre (NCC) or Disaster Management and Mitigation Unit (DMMU). Official external portals are verified and linked in the Public Directory.
        </div>
      </div>

      {/* Admin Tab Navigation (Horizontal Scrollable for Android) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-1.5 overflow-x-auto no-scrollbar">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: NATIONAL DASHBOARD OVERVIEW
         ========================================================================= */}
      {activeTab === 'admin_overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Power Deficit</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {overviewMetrics?.grid ? `-${overviewMetrics.grid.deficitMW} MW` : '-457 MW'}
              </div>
              <span className="text-[10px] text-amber-500 font-mono">[Simulated Telemetry]</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Advisories</span>
              <div className="text-2xl font-bold font-mono text-slate-100 mt-1">
                {alerts.filter(a => a.status === 'ACTIVE').length} Broadcasts
              </div>
              <span className="text-[10px] text-slate-500 font-mono">DMMU & Energy Alerts</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">CDF Pending Vetting</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {cdfApps.filter(a => a.status === 'WDC_VETTING' || a.status === 'SUBMITTED').length} Dossiers
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Awaiting Committee Action</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Registered Officers</span>
              <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
                {usersList.length} Active
              </div>
              <span className="text-[10px] text-slate-500 font-mono">RBAC Security Controls</span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display">
              National Sovereign Command Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => setActiveTab('admin_grid')}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <Zap className="w-4 h-4 text-amber-400 mb-1.5" />
                <div className="font-bold text-slate-200">Adjust Power Station Output</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Control Kariba & Kafue generation</div>
              </button>

              <button
                onClick={() => setActiveTab('admin_alerts')}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-red-500 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 mb-1.5" />
                <div className="font-bold text-slate-200">Broadcast Public Alert</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Issue national emergency bulletin</div>
              </button>

              <button
                onClick={() => setActiveTab('admin_cdf')}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <HandCoins className="w-4 h-4 text-emerald-400 mb-1.5" />
                <div className="font-bold text-slate-200">Review CDF Applications</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Vet bursaries and women grants</div>
              </button>

              <button
                onClick={() => setActiveTab('admin_reports')}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-blue-500 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <BarChart3 className="w-4 h-4 text-blue-400 mb-1.5" />
                <div className="font-bold text-slate-200">Export National Analytics</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Download full provincial report</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: ELECTRICITY & POWER-GRID INFORMATION MANAGEMENT
         ========================================================================= */}
      {activeTab === 'admin_grid' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  National Power Station Dispatch & Outage Controller
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Update active generation output for major power stations and manage township load-shedding states.
                </p>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded">
                SIMULATED GRID ENVIRONMENT
              </span>
            </div>

            {/* Power Stations Output Editor */}
            <div className="mt-5 space-y-3">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Operational Power Station Telemetry Controls
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {powerStations.map((station) => (
                  <div
                    key={station.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-200 text-xs">{station.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{station.location}</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {station.type}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Current Output:</span>
                      <span className="text-emerald-400 font-bold">{station.currentOutputMW} MW</span>
                      <span className="text-slate-500">/ {station.installedCapacityMW} MW Max</span>
                    </div>

                    {/* Quick MW Adjustment Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400">Simulate Dispatch:</span>
                      <button
                        onClick={() => handleUpdateStationMW(station.id, Math.max(0, station.currentOutputMW - 50))}
                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs rounded text-slate-200 cursor-pointer"
                      >
                        -50 MW
                      </button>
                      <button
                        onClick={() => handleUpdateStationMW(station.id, Math.min(station.installedCapacityMW, station.currentOutputMW + 50))}
                        className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs rounded text-slate-200 cursor-pointer"
                      >
                        +50 MW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Township Load Shedding Status Controller */}
            <div className="mt-8 space-y-3">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Township Load-Shedding Outage Switcher
              </div>
              <div className="space-y-2">
                {loadSheddingList.map((sched, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-200">{sched.township}</div>
                      <div className="text-[11px] text-slate-400">{sched.substation} · {sched.city}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        sched.status === 'CURRENTLY_OFF'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {sched.status === 'CURRENTLY_OFF' ? 'Outage Active (OFF)' : 'Power Restored (ON)'}
                      </span>

                      <button
                        onClick={() => handleToggleOutage(idx)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Toggle Outage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: EMERGENCY ALERTS AND ADVISORIES MANAGEMENT
         ========================================================================= */}
      {activeTab === 'admin_alerts' && (
        <div className="space-y-6">
          {/* Create Alert Form */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Issue & Broadcast Emergency Advisory
            </h3>
            <p className="text-xs text-slate-400">
              Publish verified emergency directives across public displays. Note: Simulated for demo.
            </p>

            <form onSubmit={handleCreateAlert} className="space-y-4 mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Advisory Title</label>
                  <input
                    type="text"
                    required
                    value={newAlertTitle}
                    onChange={(e) => setNewAlertTitle(e.target.value)}
                    placeholder="e.g. Flash Flooding Warning - Kafue Basin"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Issuing Agency</label>
                  <input
                    type="text"
                    required
                    value={newAlertAgency}
                    onChange={(e) => setNewAlertAgency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">Severity Level</label>
                  <select
                    value={newAlertSeverity}
                    onChange={(e) => setNewAlertSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate Action)</option>
                    <option value="HIGH">HIGH (Elevated Rationing / Threat)</option>
                    <option value="MODERATE">MODERATE (Precautionary)</option>
                    <option value="ADVISORY">ADVISORY (Informational Notice)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Target Province</label>
                  <select
                    value={newAlertProvince}
                    onChange={(e) => setNewAlertProvince(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    <option>Lusaka Province</option>
                    <option>Copperbelt Province</option>
                    <option>Southern Province</option>
                    <option>Central Province</option>
                    <option>Eastern Province</option>
                    <option>North-Western Province</option>
                    <option>Western Province</option>
                    <option>Northern Province</option>
                    <option>Luapula Province</option>
                    <option>Muchinga Province</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Full Advisory Body</label>
                <textarea
                  rows={3}
                  required
                  value={newAlertDesc}
                  onChange={(e) => setNewAlertDesc(e.target.value)}
                  placeholder="Detail instructions for citizens, public transport operators, or health clinics..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Radio className="w-4 h-4" />
                <span>Publish Advisory Bulletin</span>
              </button>
            </form>
          </div>

          {/* Existing Alerts List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display">
              Active & Historic Sovereign Advisories
            </h3>
            <div className="space-y-3">
              {alerts.map((alt) => (
                <div
                  key={alt.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-100 text-sm">{alt.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {alt.agency} · Published: {alt.publishedAt}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        alt.severity === 'CRITICAL' || alt.severity === 'HIGH'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {alt.severity}
                      </span>
                      <button
                        onClick={() => handleToggleAlertStatus(alt.id, alt.status)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded transition-colors cursor-pointer"
                      >
                        {alt.status === 'ACTIVE' ? 'Mark Resolved' : 'Reactivate'}
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{alt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: PUBLIC SERVICE DIRECTORY & VERIFIED PORTAL LINKS
         ========================================================================= */}
      {activeTab === 'admin_directory' && (
        <div className="space-y-6">
          {/* Add Directory Entry */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Verified Public Service Directory Management
            </h3>
            <p className="text-xs text-slate-400">
              Maintain verified official government portal links, hotlines, and physical headquarters for all ministries.
            </p>

            <form onSubmit={handleAddDirectoryEntry} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Agency Name</label>
                <input
                  type="text"
                  required
                  value={newDirAgency}
                  onChange={(e) => setNewDirAgency(e.target.value)}
                  placeholder="e.g. Smart Zambia Institute"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Parent Ministry</label>
                <input
                  type="text"
                  value={newDirMinistry}
                  onChange={(e) => setNewDirMinistry(e.target.value)}
                  placeholder="e.g. Office of the President"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Verified Portal URL</label>
                <input
                  type="url"
                  required
                  value={newDirUrl}
                  onChange={(e) => setNewDirUrl(e.target.value)}
                  placeholder="https://www.szi.gov.zm"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Add Verified Agency
                </button>
              </div>
            </form>
          </div>

          {/* Directory Listings */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 font-display">
                Registered Government Agencies ({directoryEntries.length})
              </h3>
              <input
                type="text"
                value={dirSearch}
                onChange={(e) => setDirSearch(e.target.value)}
                placeholder="Search agency or ministry..."
                className="w-full sm:w-60 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-3">
              {directoryEntries
                .filter(d => d.agencyName.toLowerCase().includes(dirSearch.toLowerCase()) || d.ministry.toLowerCase().includes(dirSearch.toLowerCase()))
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">{entry.agencyName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {entry.shortCode}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">{entry.ministry}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Hotlines: {entry.hotlines.join(', ')} · Hours: {entry.operatingHours}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={entry.verifiedPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 5: CDF INFORMATION & VERIFIED PORTAL LINKS
         ========================================================================= */}
      {activeTab === 'admin_cdf' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                  <HandCoins className="w-4 h-4 text-emerald-400" />
                  National CDF Application Vetting & Oversight Queue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Statutory review of youth/women cooperative grants and TEVETA skills bursary submissions across all 156 constituencies.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.mlgrd.gov.zm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-950 border border-slate-700 text-xs text-emerald-400 rounded-lg flex items-center gap-1.5"
                >
                  <span>MLGRD Official CDF Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Filter By Status:</span>
              {['ALL', 'SUBMITTED', 'WDC_VETTING', 'APPROVED', 'DISBURSED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setCdfFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono cursor-pointer transition-colors ${
                    cdfFilter === st
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Applications Table */}
            <div className="space-y-3 mt-3">
              {cdfApps
                .filter(a => cdfFilter === 'ALL' || a.status === cdfFilter)
                .map((appRecord) => (
                  <div
                    key={appRecord.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                      <div>
                        <div className="font-bold text-slate-200 text-sm">{appRecord.applicantName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Ref: {appRecord.referenceNumber} · NRC: {appRecord.nrc}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right font-mono">
                          <span className="text-[10px] text-slate-400 uppercase block">Requested Amount</span>
                          <span className="font-bold text-emerald-400 text-sm">
                            K{appRecord.amountZMW.toLocaleString()}.00
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          appRecord.status === 'APPROVED' || appRecord.status === 'DISBURSED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {appRecord.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div className="text-slate-400">
                        Constituency: <strong className="text-slate-200">{appRecord.constituency}</strong> ({appRecord.ward}) · Program: <span className="text-slate-300">{appRecord.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateCdfStatus(appRecord.id, 'APPROVED')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateCdfStatus(appRecord.id, 'DISBURSED')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded transition-colors cursor-pointer"
                        >
                          Mark Disbursed
                        </button>
                        <button
                          onClick={() => handleUpdateCdfStatus(appRecord.id, 'REJECTED')}
                          className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 6: SYSTEM USERS AND PERMISSIONS MANAGEMENT
         ========================================================================= */}
      {activeTab === 'admin_users' && (
        <div className="space-y-6">
          {/* Add User Form */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Sovereign User Access & Role-Based Permissions
            </h3>
            <p className="text-xs text-slate-400">
              Provision credentialed public officers across ZESCO, ZRA, DMMU, and Ministry of Local Government.
            </p>

            <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newOfficerName}
                  onChange={(e) => setNewOfficerName(e.target.value)}
                  placeholder="e.g. Lubinda Sitali"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={newOfficerEmail}
                  onChange={(e) => setNewOfficerEmail(e.target.value)}
                  placeholder="officer@zamos.gov.zm"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Assigned Role</label>
                <select
                  value={newOfficerRole}
                  onChange={(e) => setNewOfficerRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Super Administrator">Super Administrator</option>
                  <option value="ZESCO Grid Controller">ZESCO Grid Controller</option>
                  <option value="DMMU Dispatch Director">DMMU Dispatch Director</option>
                  <option value="CDF National Auditor">CDF National Auditor</option>
                  <option value="ZRA Revenue Analyst">ZRA Revenue Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={newOfficerPass}
                  onChange={(e) => setNewOfficerPass(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Provision User Account
                </button>
              </div>
            </form>
          </div>

          {/* Officers Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display">
              Active Authorized Officers ({usersList.length})
            </h3>

            <div className="space-y-3">
              {usersList.map((user) => (
                <div
                  key={user.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{user.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {user.email} · {user.department}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Last Authentication: {user.lastLogin}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-emerald-400 font-semibold">
                      {user.role}
                    </span>

                    <button
                      onClick={() => handleToggleUserStatus(user)}
                      className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                        user.status === 'ACTIVE'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? 'Suspend Account' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 7: REPORTS AND ANALYTICS
         ========================================================================= */}
      {activeTab === 'admin_reports' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  National Systems Performance & Provincial Analytics
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Consolidated key indicator metrics and provincial health scores.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  title="Export official digitally signed PDF document for offline records"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Export Signed Official PDF</span>
                </button>
                <button
                  onClick={handleExportReport}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Dataset (.JSON)</span>
                </button>
              </div>
            </div>

            {/* Provincial Score Matrix */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-2.5">Province</th>
                    <th className="py-2.5">Power Availability Index</th>
                    <th className="py-2.5">CDF Disbursement Rate</th>
                    <th className="py-2.5">Essential Medicine Stocks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {reportsData?.provincialHealthScores?.map((prov: any) => (
                    <tr key={prov.province} className="hover:bg-slate-950/50">
                      <td className="py-2.5 font-bold text-slate-200">{prov.province} Province</td>
                      <td className="py-2.5 text-amber-400">{prov.powerAvailability}</td>
                      <td className="py-2.5 text-emerald-400">{prov.cdfDisbursement}</td>
                      <td className="py-2.5 text-blue-400">{prov.healthStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 8: SYSTEM SETTINGS AND AUDIT LOGS
         ========================================================================= */}
      {activeTab === 'admin_settings' && (
        <div className="space-y-6">
          {/* Settings Toggles */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-400" />
              Sovereign Platform System Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Maintenance Mode</div>
                  <div className="text-[11px] text-slate-400">Lock non-admin citizen submissions</div>
                </div>
                <button
                  onClick={() => handleToggleSetting('maintenanceMode')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs cursor-pointer ${
                    settings?.maintenanceMode ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {settings?.maintenanceMode ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Public Applications Gateway</div>
                  <div className="text-[11px] text-slate-400">Allow citizen CDF & PACRA forms</div>
                </div>
                <button
                  onClick={() => handleToggleSetting('allowPublicApplications')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs cursor-pointer ${
                    settings?.allowPublicApplications ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {settings?.allowPublicApplications ? 'OPEN' : 'CLOSED'}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Strict Two-Factor Authentication</div>
                  <div className="text-[11px] text-slate-400">Mandatory hardware / SMS OTP for staff</div>
                </div>
                <button
                  onClick={() => handleToggleSetting('strictTwoFactorAuth')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs cursor-pointer ${
                    settings?.strictTwoFactorAuth ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {settings?.strictTwoFactorAuth ? 'ACTIVE' : 'OPTIONAL'}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">Grid Telemetry Simulation Mode</div>
                  <div className="text-[11px] text-slate-400">Synthetic demo models enabled</div>
                </div>
                <button
                  onClick={() => handleToggleSetting('gridSimulationMode')}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs cursor-pointer ${
                    settings?.gridSimulationMode ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {settings?.gridSimulationMode ? 'ACTIVE' : 'LIVE FEED'}
                </button>
              </div>
            </div>
          </div>

          {/* Tamper-Evident Audit Trail */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  Tamper-Evident Sovereign Audit Logs
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Immutable chronological log of all administrator operations, authentications, and policy updates.
                </p>
              </div>

              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="Search actor or action..."
                className="w-full sm:w-60 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {auditLogs
                .filter(l => l.actorEmail.toLowerCase().includes(logSearch.toLowerCase()) || l.action.toLowerCase().includes(logSearch.toLowerCase()))
                .map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs font-mono space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{log.action}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-emerald-400">{log.module}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        log.status === 'SUCCESS' ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'
                      }`}>
                        {log.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">{log.details}</div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                      <span>Actor: {log.actorEmail} ({log.ipAddress})</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* Signed Report Export Modal */}
      {authToken && (
        <SignedReportExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          currentUser={currentUser}
          authToken={authToken}
          reportsData={reportsData}
          overviewMetrics={overviewMetrics}
        />
      )}
    </div>
  );
};
