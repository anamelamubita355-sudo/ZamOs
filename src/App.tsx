/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabId, AdminUser } from './types/zambia';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { NationalOverview } from './components/NationalOverview';
import { ZescoGridModule } from './components/ZescoGridModule';
import { ZraTaxModule } from './components/ZraTaxModule';
import { RtsaModule } from './components/RtsaModule';
import { PacraModule } from './components/PacraModule';
import { CdfTrackerModule } from './components/CdfTrackerModule';
import { SmartCareHealthModule } from './components/SmartCareHealthModule';
import { BozPaymentsModule } from './components/BozPaymentsModule';
import { EmergencyDispatchModule } from './components/EmergencyDispatchModule';
import { ZamGovAssistant } from './components/ZamGovAssistant';
import { AdminPortal } from './components/AdminPortal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { ShieldCheck, PhoneCall, Zap, Building2, Coins, Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Restore authenticated session from sessionStorage on load
  useEffect(() => {
    const savedToken = sessionStorage.getItem('zamos_auth_token');
    if (savedToken) {
      setAuthToken(savedToken);
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Session invalid');
        })
        .then((data) => {
          if (data.user) setCurrentUser(data.user);
        })
        .catch(() => {
          sessionStorage.removeItem('zamos_auth_token');
          sessionStorage.removeItem('zamos_user');
          setAuthToken(null);
          setCurrentUser(null);
        });
    }
  }, []);

  const handleLoginSuccess = (user: AdminUser, token: string) => {
    setCurrentUser(user);
    setAuthToken(token);
    sessionStorage.setItem('zamos_auth_token', token);
    sessionStorage.setItem('zamos_user', JSON.stringify(user));
    setActiveTab('admin');
  };

  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (e) {
        console.error(e);
      }
    }
    sessionStorage.removeItem('zamos_auth_token');
    sessionStorage.removeItem('zamos_user');
    setCurrentUser(null);
    setAuthToken(null);
    setActiveTab('overview');
  };

  const handleQuickSos = () => {
    setActiveTab('emergency');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Sovereign Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickSos={handleQuickSos}
        currentUser={currentUser}
        onOpenLogin={() => setActiveTab('admin')}
        onLogout={handleLogout}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
      />

      {/* In-App Sovereign Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        onNavigate={setActiveTab}
      />

      {/* Segmented Navigation Bar */}
      <NavigationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLogin={() => setActiveTab('admin')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Separate Administration Portal */}
        {activeTab === 'admin' ? (
          <AdminPortal
            currentUser={currentUser}
            authToken={authToken}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onReturnToPublic={() => setActiveTab('overview')}
          />
        ) : (
          <>
            {activeTab === 'overview' && (
              <NationalOverview onNavigate={setActiveTab} />
            )}
            {activeTab === 'zesco' && (
              <ZescoGridModule />
            )}
            {activeTab === 'zra' && (
              <ZraTaxModule />
            )}
            {activeTab === 'rtsa' && (
              <RtsaModule />
            )}
            {activeTab === 'pacra' && (
              <PacraModule />
            )}
            {activeTab === 'cdf' && (
              <CdfTrackerModule />
            )}
            {activeTab === 'smartcare' && (
              <SmartCareHealthModule />
            )}
            {activeTab === 'boz' && (
              <BozPaymentsModule />
            )}
            {activeTab === 'emergency' && (
              <EmergencyDispatchModule />
            )}
            {activeTab === 'assistant' && (
              <ZamGovAssistant />
            )}
          </>
        )}
      </main>

      {/* Sovereign Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">
                Republic of Zambia · Sovereign Systems Gateway
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                One Zambia, One Nation · National Digital Governance Platform
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <button
              onClick={() => setActiveTab('zesco')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              ZESCO Grid & LUKU
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('zra')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              ZRA Tax & PAYE
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('cdf')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              CDF Transparency
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-emerald-300 transition-colors cursor-pointer font-medium text-emerald-400"
            >
              {currentUser ? 'Administrator Portal (Active)' : 'Officer Portal'}
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('emergency')}
              className="hover:text-red-400 transition-colors cursor-pointer text-red-400/90 font-medium"
            >
              Emergency 991 / 993
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
