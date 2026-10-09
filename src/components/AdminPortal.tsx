import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  AlertCircle, 
  Activity, 
  LayoutDashboard, 
  FileText, 
  AlertTriangle, 
  Zap, 
  BookOpen, 
  HandCoins, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  ArrowLeft, 
  ExternalLink, 
  RefreshCw, 
  Plus, 
  Edit3, 
  Trash2, 
  Archive, 
  CheckCircle2, 
  Download, 
  Check, 
  Search, 
  KeyRound, 
  Radio, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { 
  AdminUser, 
  AdminTabId, 
  EmergencyAlert, 
  PublicAnnouncement, 
  PublicServiceEntry, 
  PowerStation, 
  LoadSheddingSchedule, 
  CdfApplicationRecord, 
  AuditLogEntry, 
  SystemSettings 
} from '../types/zambia';
import { SignedReportExportModal } from './SignedReportExportModal';

interface AdminPortalProps {
  currentUser: AdminUser | null;
  authToken: string | null;
  onLoginSuccess: (user: AdminUser, token: string) => void;
  onLogout: () => void;
  onReturnToPublic: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  authToken,
  onLoginSuccess,
  onLogout,
  onReturnToPublic,
}) => {
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<AdminTabId>('admin_overview');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // 1. Overview data
  const [overviewMetrics, setOverviewMetrics] = useState<any>(null);

  // 2. Content Management (Announcements)
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>([]);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<PublicAnnouncement['category']>('Civic Notice');
  const [annContent, setAnnContent] = useState('');
  const [annStatus, setAnnStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);

  // 3. Emergency Alerts
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertAgency, setAlertAgency] = useState('Disaster Management & Mitigation Unit (DMMU)');
  const [alertSeverity, setAlertSeverity] = useState<EmergencyAlert['severity']>('HIGH');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertProvince, setAlertProvince] = useState('Lusaka Province');

  // 4. Power Grid & Verified Data Sources
  const [powerStations, setPowerStations] = useState<PowerStation[]>([]);
  const [loadSheddingList, setLoadSheddingList] = useState<LoadSheddingSchedule[]>([]);
  const [newStationName, setNewStationName] = useState('');
  const [newStationType, setNewStationType] = useState<PowerStation['type']>('Solar');
  const [newStationCapacity, setNewStationCapacity] = useState<number>(50);
  const [newStationSource, setNewStationSource] = useState('ZESCO SCADA Feed');

  // 5. CDF Management
  const [cdfApps, setCdfApps] = useState<CdfApplicationRecord[]>([]);

  // 6. Public Directory
  const [directory, setDirectory] = useState<PublicServiceEntry[]>([]);
  const [dirAgency, setDirAgency] = useState('');
  const [dirMinistry, setDirMinistry] = useState('');
  const [dirUrl, setDirUrl] = useState('');
  const [dirHotline, setDirHotline] = useState('');

  // 7. System Users & RBAC
  const [usersList, setUsersList] = useState<AdminUser[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminUser['role']>('ZESCO Grid Controller');
  const [newUserPass, setNewUserPass] = useState('');

  // 8. Settings & Audit Logs
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [logFilter, setLogFilter] = useState('');
  const [reportsData, setReportsData] = useState<any>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Pre-configured official officer demo profiles (server-validated credentials)
  const demoProfiles = [
    { label: 'Super Admin', email: 'admin@zamos.gov.zm', pass: 'ZamOS@2026!Gov', role: 'Smart Zambia Institute' },
    { label: 'Grid Controller', email: 'grid.control@zesco.co.zm', pass: 'ZescoGrid#2026', role: 'ZESCO National Control Centre' },
    { label: 'DMMU Director', email: 'dispatch@dmmu.gov.zm', pass: 'DmmuResponse#2026', role: 'Disaster Management Unit' },
    { label: 'Content Manager', email: 'content@zamos.gov.zm', pass: 'ContentManager#2026', role: 'Ministry of Information' },
    { label: 'CDF Auditor', email: 'cdf.audits@mlgrd.gov.zm', pass: 'CdfAudit#2026', role: 'Local Government' },
  ];

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoginError('');
  };

  // Perform secure login against backend /api/auth/login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setLoginError('Please enter both official email and security password.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication challenge failed. Access denied.');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Fetch all administrative data once authenticated
  const fetchAdminData = async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      // Overview
      const ovRes = await fetch('/api/admin/overview', { headers });
      if (ovRes.ok) {
        const d = await ovRes.json();
        setOverviewMetrics(d);
        if (d.settings) setSettings(d.settings);
      }

      // Announcements
      const annRes = await fetch('/api/admin/content/announcements', { headers });
      if (annRes.ok) {
        const d = await annRes.json();
        setAnnouncements(d.announcements || []);
      }

      // Alerts
      const altRes = await fetch('/api/admin/alerts');
      if (altRes.ok) {
        const d = await altRes.json();
        setAlerts(d.alerts || []);
      }

      // Power Grid
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

      // Directory
      const dirRes = await fetch('/api/admin/directory');
      if (dirRes.ok) {
        const d = await dirRes.json();
        setDirectory(d.directory || []);
      }

      // CDF
      const cdfRes = await fetch('/api/admin/cdf-applications', { headers });
      if (cdfRes.ok) {
        const d = await cdfRes.json();
        setCdfApps(d.applications || []);
      }

      // Users
      const uRes = await fetch('/api/admin/users', { headers });
      if (uRes.ok) {
        const d = await uRes.json();
        setUsersList(d.users || []);
      }

      // Reports
      const repRes = await fetch('/api/admin/reports', { headers });
      if (repRes.ok) {
        const d = await repRes.json();
        setReportsData(d);
      }

      // Audit Logs
      const logsRes = await fetch('/api/admin/audit-logs', { headers });
      if (logsRes.ok) {
        const d = await logsRes.json();
        setAuditLogs(d.auditLogs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authToken && currentUser) {
      fetchAdminData();
    }
  }, [authToken, currentUser]);

  // Tab configurations
  const tabs = [
    { id: 'admin_overview' as AdminTabId, label: 'Overview & Statistics', icon: LayoutDashboard },
    { id: 'admin_content' as AdminTabId, label: 'Content Management', icon: FileText },
    { id: 'admin_alerts' as AdminTabId, label: 'Advisories & Alerts', icon: AlertTriangle },
    { id: 'admin_grid' as AdminTabId, label: 'Verified Electricity Sources', icon: Zap },
    { id: 'admin_cdf' as AdminTabId, label: 'CDF Application Vetting', icon: HandCoins },
    { id: 'admin_directory' as AdminTabId, label: 'Public Directory', icon: BookOpen },
    { id: 'admin_users' as AdminTabId, label: 'Users & Permissions', icon: Users },
    { id: 'admin_reports' as AdminTabId, label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'admin_settings' as AdminTabId, label: 'Audit Logs & Settings', icon: Settings },
  ];

  // -------------------------------------------------------------
  // Content Actions (Announcements CRUD)
  // -------------------------------------------------------------
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent || !authToken) return;

    try {
      if (editingAnnId) {
        const res = await fetch(`/api/admin/content/announcements/${editingAnnId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
          body: JSON.stringify({ title: annTitle, category: annCategory, content: annContent, status: annStatus }),
        });
        if (res.ok) {
          const d = await res.json();
          setAnnouncements(prev => prev.map(a => a.id === editingAnnId ? d.announcement : a));
          setEditingAnnId(null);
          showToast('Updated public announcement.');
        }
      } else {
        const res = await fetch('/api/admin/content/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
          body: JSON.stringify({ title: annTitle, category: annCategory, content: annContent, status: annStatus }),
        });
        if (res.ok) {
          const d = await res.json();
          setAnnouncements([d.announcement, ...announcements]);
          showToast('Created new public announcement.');
        }
      }
      setAnnTitle('');
      setAnnContent('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleAnnStatus = async (id: string, currentStatus: string) => {
    if (!authToken) return;
    const newStatus = currentStatus === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/content/announcements/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const d = await res.json();
        setAnnouncements(prev => prev.map(a => a.id === id ? d.announcement : a));
        showToast(`Announcement marked as ${newStatus}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!authToken || !confirm('Are you sure you want to delete this authorized announcement?')) return;
    try {
      const res = await fetch(`/api/admin/content/announcements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
        showToast('Announcement permanently deleted.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------------------------------------------
  // Alerts Actions
  // -------------------------------------------------------------
  const handlePublishAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle || !alertDesc || !authToken) return;
    try {
      const res = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          title: alertTitle,
          agency: alertAgency,
          severity: alertSeverity,
          description: alertDesc,
          affectedProvinces: [alertProvince],
        }),
      });
      if (res.ok) {
        const d = await res.json();
        setAlerts([d.alert, ...alerts]);
        setAlertTitle('');
        setAlertDesc('');
        showToast('Published sovereign emergency bulletin.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAlert = async (id: string) => {
    if (!authToken || !confirm('Permanently delete this emergency advisory?')) return;
    try {
      const res = await fetch(`/api/admin/alerts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a.id !== id));
        showToast('Advisory deleted.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------------------------------------------
  // Power Station Actions
  // -------------------------------------------------------------
  const handleUpdateStationMW = async (id: string, newMW: number) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/power-stations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ currentOutputMW: newMW }),
      });
      if (res.ok) {
        const d = await res.json();
        setPowerStations(prev => prev.map(s => s.id === id ? d.station : s));
        showToast(`Updated ${d.station.name} to ${d.station.currentOutputMW} MW.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPowerStation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStationName || !authToken) return;
    try {
      const res = await fetch('/api/admin/power-stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          name: newStationName,
          type: newStationType,
          installedCapacityMW: newStationCapacity,
          currentOutputMW: Math.floor(newStationCapacity * 0.8),
          verifiedSource: newStationSource,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        setPowerStations([...powerStations, d.station]);
        setNewStationName('');
        showToast(`Added verified electricity source: ${d.station.name}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStation = async (id: string) => {
    if (!authToken || !confirm('Remove this electricity data source?')) return;
    try {
      const res = await fetch(`/api/admin/power-stations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setPowerStations(prev => prev.filter(s => s.id !== id));
        showToast('Power station removed.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------------------------------------------
  // User Management Actions
  // -------------------------------------------------------------
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPass || !authToken) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({
          fullName: newUserName,
          email: newUserEmail,
          role: newUserRole,
          password: newUserPass,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        setUsersList([...usersList, d.user]);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPass('');
        showToast(`Created officer account for ${d.user.fullName}.`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create user');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleUserStatus = async (user: AdminUser) => {
    if (!authToken) return;
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus as any } : u));
        showToast(`User [${user.email}] is now ${newStatus}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!authToken || !confirm('Permanently delete this administrator account?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setUsersList(prev => prev.filter(u => u.id !== id));
        showToast('Officer account deleted.');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete user');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // -------------------------------------------------------------
  // Settings Actions
  // -------------------------------------------------------------
  const handleToggleSetting = async (key: keyof SystemSettings) => {
    if (!settings || !authToken) return;
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

  // =============================================================
  // RENDER: LOGIN VIEW (IF NOT AUTHENTICATED)
  // =============================================================
  if (!currentUser || !authToken) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="bg-slate-950 border-2 border-emerald-500/80 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
          {/* Back to public link */}
          <button
            onClick={onReturnToPublic}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Citizen Dashboard</span>
          </button>

          {/* Header */}
          <div className="text-center space-y-2 pb-4 border-b border-slate-800">
            <div className="w-14 h-14 bg-emerald-950 border border-emerald-500/50 rounded-2xl flex items-center justify-center text-amber-400 mx-auto shadow-inner">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold font-mono">
              Republic of Zambia
            </div>
            <h2 className="text-xl font-bold text-slate-100 font-display">
              Sovereign Administration Portal
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Restricted system access for authorized public officers, statutory regulators, and system administrators.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official Government Email Address
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-10 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isLoggingIn ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Verifying Sovereign Identity...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Administration Console</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Officer Profiles (Click to Authenticate):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {demoProfiles.map((p) => (
                <button
                  key={p.email}
                  type="button"
                  onClick={() => handleFillDemo(p.email, p.pass)}
                  className="p-2 rounded bg-slate-900 hover:bg-slate-800/80 border border-slate-800 text-left transition-colors cursor-pointer"
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
  }

  // =============================================================
  // RENDER: AUTHENTICATED ADMINISTRATOR DASHBOARD
  // =============================================================
  return (
    <div className="space-y-6">
      {/* Officer Banner & Navigation */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-900/60 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-bold shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
              <span>Sovereign Administration Console</span>
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
              Department: {currentUser.department} · Authenticated CAT: {currentUser.lastLogin}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-center">
          <button
            onClick={onReturnToPublic}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Dashboard</span>
          </button>
          <button
            onClick={fetchAdminData}
            disabled={isLoading}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Sync Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Sync</span>
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

      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/80 rounded-xl text-xs text-emerald-300 flex items-center justify-between shadow-md">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {toastMsg}
          </span>
          <button onClick={() => setToastMsg('')} className="text-slate-400 hover:text-white cursor-pointer text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Mandatory Simulation Notice Banner */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-amber-300 uppercase tracking-wider font-mono">[SIMULATED ENVIRONMENT DECLARATION]:</strong> All changes made here (announcements, power station generation, emergency advisories) are persisted in the sovereign database and immediately update the public citizen dashboard. Real-time telemetry figures are simulated models for system demonstration.
        </div>
      </div>

      {/* Management Navigation Tabs (Responsive) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-1.5 overflow-x-auto no-scrollbar">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap min-h-[40px] ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
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
          SECTION 1: DASHBOARD OVERVIEW & ACTIVITY STATISTICS
         ========================================================================= */}
      {activeTab === 'admin_overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Power Deficit</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {overviewMetrics?.grid ? `-${overviewMetrics.grid.deficitMW} MW` : '-457 MW'}
              </div>
              <span className="text-[10px] text-amber-500 font-mono">[Simulated Telemetry]</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Public Announcements</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {announcements.filter(a => a.status === 'PUBLISHED').length} Published
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{announcements.length} Total Registered</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Advisories</span>
              <div className="text-2xl font-bold font-mono text-red-400 mt-1">
                {alerts.filter(a => a.status === 'ACTIVE').length} Broadcasts
              </div>
              <span className="text-[10px] text-slate-500 font-mono">DMMU & Energy Alerts</span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Audited Actions</span>
              <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
                {auditLogs.length} Events
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Immutable Audit Trail</span>
            </div>
          </div>

          {/* Activity Statistics & Recent Audit Log Stream */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              Recent Sovereign Operational Audits
            </h3>
            <div className="space-y-2">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{log.action}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">{log.module}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{log.details}</div>
                  <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-800/80">
                    <span>Officer: {log.actorEmail}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: AUTHORISED CONTENT MANAGEMENT (CRUD)
         ========================================================================= */}
      {activeTab === 'admin_content' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              {editingAnnId ? 'Edit Authorized Announcement' : 'Draft & Publish Public Announcement'}
            </h3>
            <p className="text-xs text-slate-400">
              Create, edit, publish, archive, or delete authorized civic circulars that appear on the public dashboard.
            </p>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3 mt-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 mb-1">Announcement Title</label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    placeholder="e.g. Energy Regulation Board Notice on Solar Mini-Grids"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option>Civic Notice</option>
                    <option>Policy & Governance</option>
                    <option>Energy & Grid</option>
                    <option>Public Health</option>
                    <option>Commerce & Tax</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Content Body</label>
                <textarea
                  rows={4}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Official text for citizens and stakeholders..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="annStatus"
                      checked={annStatus === 'PUBLISHED'}
                      onChange={() => setAnnStatus('PUBLISHED')}
                    />
                    <span>Publish Immediately</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="annStatus"
                      checked={annStatus === 'DRAFT'}
                      onChange={() => setAnnStatus('DRAFT')}
                    />
                    <span>Save as Draft</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  {editingAnnId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAnnId(null);
                        setAnnTitle('');
                        setAnnContent('');
                      }}
                      className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                  >
                    {editingAnnId ? 'Save Changes' : 'Save Announcement'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Announcements Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display">
              Public Announcements Repository ({announcements.length})
            </h3>
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-100 text-sm">{ann.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {ann.category} · Published: {ann.publishedAt} by {ann.authorEmail}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        ann.status === 'PUBLISHED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : ann.status === 'ARCHIVED'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {ann.status}
                      </span>
                      <button
                        onClick={() => {
                          setEditingAnnId(ann.id);
                          setAnnTitle(ann.title);
                          setAnnCategory(ann.category);
                          setAnnContent(ann.content);
                          setAnnStatus(ann.status as any);
                        }}
                        className="p-1 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleAnnStatus(ann.id, ann.status)}
                        className="px-2 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded cursor-pointer"
                      >
                        {ann.status === 'PUBLISHED' ? 'Archive' : 'Publish'}
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="p-1 text-red-400 hover:text-red-300 rounded bg-red-950/60 border border-red-900 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: EMERGENCY ADVISORIES & ANNOUNCEMENTS MANAGEMENT
         ========================================================================= */}
      {activeTab === 'admin_alerts' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Broadcast Sovereign Emergency Advisory
            </h3>

            <form onSubmit={handlePublishAlert} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Advisory Title</label>
                  <input
                    type="text"
                    required
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                    placeholder="e.g. Kariba Dam Water Storage Directive"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Agency</label>
                  <input
                    type="text"
                    value={alertAgency}
                    onChange={(e) => setAlertAgency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Severity</label>
                  <select
                    value={alertSeverity}
                    onChange={(e) => setAlertSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="ADVISORY">ADVISORY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Province</label>
                  <select
                    value={alertProvince}
                    onChange={(e) => setAlertProvince(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    <option>Lusaka Province</option>
                    <option>Copperbelt Province</option>
                    <option>Southern Province</option>
                    <option>Central Province</option>
                    <option>Eastern Province</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Advisory Description</label>
                <textarea
                  rows={3}
                  required
                  value={alertDesc}
                  onChange={(e) => setAlertDesc(e.target.value)}
                  placeholder="Full bulletin body..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <Radio className="w-4 h-4" />
                <span>Publish Advisory Bulletin</span>
              </button>
            </form>
          </div>

          {/* Active Advisories */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display">
              Published Advisories & Alerts ({alerts.length})
            </h3>
            <div className="space-y-3">
              {alerts.map((alt) => (
                <div key={alt.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-100 text-sm">{alt.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {alt.agency} · Severity: {alt.severity} · Status: {alt.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteAlert(alt.id)}
                        className="p-1 text-red-400 hover:text-red-300 rounded bg-red-950/60 border border-red-900 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-300">{alt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: VERIFIED ELECTRICITY DATA SOURCES MANAGEMENT
         ========================================================================= */}
      {activeTab === 'admin_grid' && (
        <div className="space-y-6">
          {/* Add Data Source */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Manage Verified Electricity Data Sources & Generation Telemetry
            </h3>

            <form onSubmit={handleAddPowerStation} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Station Name</label>
                <input
                  type="text"
                  required
                  value={newStationName}
                  onChange={(e) => setNewStationName(e.target.value)}
                  placeholder="e.g. Itawa Solar PV Farm"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Fuel / Tech Type</label>
                <select
                  value={newStationType}
                  onChange={(e) => setNewStationType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Hydro">Hydro</option>
                  <option value="Solar">Solar</option>
                  <option value="Coal">Coal Thermal</option>
                  <option value="Diesel">Diesel / Heavy Fuel</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Capacity (MW)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newStationCapacity}
                  onChange={(e) => setNewStationCapacity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Add Generation Feed
                </button>
              </div>
            </form>
          </div>

          {/* Active Generation Sources Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display">
              Verified Generation Stations ({powerStations.length})
            </h3>
            <div className="space-y-3">
              {powerStations.map((station) => (
                <div key={station.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-slate-100 text-sm">{station.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {station.type} · Source: {station.verifiedSource || 'ZESCO SCADA'} · Verified: {station.lastVerifiedAt}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-emerald-400 font-bold">
                        {station.currentOutputMW} / {station.installedCapacityMW} MW
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateStationMW(station.id, Math.max(0, station.currentOutputMW - 50))}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded cursor-pointer"
                        >
                          -50 MW
                        </button>
                        <button
                          onClick={() => handleUpdateStationMW(station.id, Math.min(station.installedCapacityMW, station.currentOutputMW + 50))}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded cursor-pointer"
                        >
                          +50 MW
                        </button>
                        <button
                          onClick={() => handleDeleteStation(station.id)}
                          className="p-1 text-red-400 hover:text-red-300 rounded bg-red-950/60 border border-red-900 cursor-pointer ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 5: CDF APPLICATION VETTING
         ========================================================================= */}
      {activeTab === 'admin_cdf' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                <HandCoins className="w-4 h-4 text-emerald-400" />
                CDF Citizen Grant & Bursary Vetting Queue
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review submitted applications for statutory CDFC approval.
              </p>
            </div>
            <a
              href="https://www.mlgrd.gov.zm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              MLGRD Official Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-3">
            {cdfApps.map((a) => (
              <div key={a.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-100 text-sm">{a.applicantName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Ref: {a.referenceNumber} · {a.constituency} ({a.ward}) · Type: {a.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-emerald-400 font-bold">K{a.amountZMW.toLocaleString()}.00</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {a.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 6: PUBLIC SERVICE DIRECTORY
         ========================================================================= */}
      {activeTab === 'admin_directory' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Verified Public Service Directory
            </h3>

            <div className="space-y-3">
              {directory.map((dir) => (
                <div key={dir.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-100 text-sm">{dir.agencyName} ({dir.shortCode})</div>
                    <div className="text-[10px] text-slate-400">{dir.ministry} · Hotlines: {dir.hotlines.join(', ')}</div>
                  </div>
                  <a
                    href={dir.verifiedPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 rounded-lg flex items-center gap-1.5 self-start sm:self-auto"
                  >
                    <span>Visit Verified Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 7: USERS, ROLES & PERMISSIONS
         ========================================================================= */}
      {activeTab === 'admin_users' && (
        <div className="space-y-6">
          {/* Add User */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              User Accounts & Role-Based Permissions
            </h3>

            <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Mutinta Mulenga"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="officer@zamos.gov.zm"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Super Administrator">Super Administrator</option>
                  <option value="ZESCO Grid Controller">ZESCO Grid Controller</option>
                  <option value="DMMU Dispatch Director">DMMU Dispatch Director</option>
                  <option value="CDF National Auditor">CDF National Auditor</option>
                  <option value="Content Manager">Content Manager</option>
                  <option value="ZRA Revenue Analyst">ZRA Revenue Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newUserPass}
                  onChange={(e) => setNewUserPass(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Provision User Account
                </button>
              </div>
            </form>
          </div>

          {/* Users Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display">
              Active Authorized Officers ({usersList.length})
            </h3>
            <div className="space-y-3">
              {usersList.map((u) => (
                <div key={u.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-100 text-sm">{u.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {u.email} · Role: {u.role} · Last Login: {u.lastLogin}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleUserStatus(u)}
                      className={`px-3 py-1 rounded text-xs cursor-pointer ${
                        u.status === 'ACTIVE'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                    {u.email !== currentUser.email && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1 text-red-400 hover:text-red-300 rounded bg-red-950/60 border border-red-900 cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 8: REPORTS & ANALYTICS (SECURE SIGNED PDF EXPORT)
         ========================================================================= */}
      {activeTab === 'admin_reports' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  National Systems Reports & Sovereign Analytics
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Consolidated sovereign KPI indicators, provincial performance index, and verified audit telemetry.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/40 border border-emerald-500/50"
                  title="Generate certified, digitally signed PDF for official offline records"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>Export Signed Official PDF</span>
                </button>
              </div>
            </div>

            {/* Core Executive Telemetry Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs font-mono">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Grid Generation Avg</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">
                  {reportsData?.summary?.powerGenerationAverageMW || overviewMetrics?.grid?.totalGenerationMW || 1993} MW
                </div>
                <span className="text-[10px] text-slate-400 font-sans">Peak Demand: 2,450 MW</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Load Shedding Adherence</span>
                <div className="text-xl font-bold text-blue-400 mt-1">
                  {reportsData?.summary?.loadSheddingCompliancePercent || 94.2}%
                </div>
                <span className="text-[10px] text-slate-400 font-sans">Stage 2 Provincial Cycles</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">CDF Disbursed (2026)</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">
                  K4.22 Billion
                </div>
                <span className="text-[10px] text-slate-400 font-sans">88.4% of K4.77B Budget</span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Emergency Dispatch SLA</span>
                <div className="text-xl font-bold text-amber-400 mt-1">
                  14.2 min
                </div>
                <span className="text-[10px] text-slate-400 font-sans">3,410 Incidents YTD</span>
              </div>
            </div>

            {/* Provincial Operational Matrix */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  10 Provinces Comprehensive Telemetry Matrix
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Verified Daily Sync CAT</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                      <th className="py-2.5 px-3">Province</th>
                      <th className="py-2.5 px-3">Power Availability</th>
                      <th className="py-2.5 px-3">CDF Disbursement</th>
                      <th className="py-2.5 px-3">Essential Medicine Stocks</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-[11px]">
                    {reportsData?.provincialHealthScores?.map((prov: any) => (
                      <tr key={prov.province} className="hover:bg-slate-900/50">
                        <td className="py-2.5 px-3 font-bold text-slate-200 font-sans">{prov.province} Province</td>
                        <td className="py-2.5 px-3 text-amber-400">{prov.powerAvailability}</td>
                        <td className="py-2.5 px-3 text-emerald-400">{prov.cdfDisbursement}</td>
                        <td className="py-2.5 px-3 text-blue-400">{prov.healthStock}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                            OPERATIONAL
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Security & Offline Certification Banner */}
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3.5 flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-emerald-300">
                  Secure Offline Records Certification Ready
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Exported documents include the official Republic of Zambia header, authenticated officer credentials ({currentUser.fullName} · {currentUser.role}), an anti-tamper SHA-256 cryptographic digest, and an official GRZ verification seal. Every export is recorded to the immutable sovereign audit log.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 9: AUDIT LOGS & SETTINGS
         ========================================================================= */}
      {activeTab === 'admin_settings' && (
        <div className="space-y-6">
          {/* Settings */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-400" />
              Sovereign Platform Settings
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
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 font-display flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                Immutable Sovereign Audit Trail ({auditLogs.length})
              </h3>
              <input
                type="text"
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                placeholder="Search audit trail..."
                className="w-full sm:w-60 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {auditLogs
                .filter(l => l.actorEmail.toLowerCase().includes(logFilter.toLowerCase()) || l.action.toLowerCase().includes(logFilter.toLowerCase()))
                .map((log) => (
                  <div key={log.id} className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{log.action}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-emerald-400">{log.module}</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold text-emerald-400 bg-emerald-950">
                        {log.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{log.details}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                      <span>Actor: {log.actorEmail}</span>
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
