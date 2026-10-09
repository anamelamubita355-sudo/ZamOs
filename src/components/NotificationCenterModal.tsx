import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  Clock, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { AppNotification, TabId } from '../types/zambia';
import { sovereignStore } from '../services/sovereignStore';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabId) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'emergency' | 'approval' | 'system'>('all');

  useEffect(() => {
    setNotifications(sovereignStore.getNotifications());
    const unsub = sovereignStore.subscribe(() => {
      setNotifications(sovereignStore.getNotifications());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleItemClick = (notif: AppNotification) => {
    sovereignStore.markAsRead(notif.id);
    if (notif.targetTab) {
      onNavigate(notif.targetTab);
      onClose();
    }
  };

  const getSeverityIcon = (severity: AppNotification['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'HIGH':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      {/* Slide-over panel */}
      <div className="bg-slate-950 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 font-display">
                  Sovereign Notification Center
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                System advisories, approvals & emergency broadcasts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close notifications panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar & Bulk Actions */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'emergency', label: 'Emergency' },
              { id: 'approval', label: 'Approvals' },
              { id: 'system', label: 'System' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[34px] ${
                  activeFilter === f.id
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={() => sovereignStore.markAllAsRead()}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 p-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Read All</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => sovereignStore.clearAll()}
                className="text-[11px] text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-slate-300">No active notifications</div>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                All national public alerts, pending approvals, and system updates have been acknowledged.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              return (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative text-xs space-y-1.5 ${
                    !notif.read
                      ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-400" />
                  )}

                  <div className="flex items-start gap-2.5 pr-4">
                    <div className="mt-0.5 shrink-0">
                      {getSeverityIcon(notif.severity)}
                    </div>
                    <div>
                      <div className={`font-bold ${!notif.read ? 'text-slate-100' : 'text-slate-300'}`}>
                        {notif.title}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notif.timestamp}
                    </span>
                    {notif.targetTab && (
                      <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                        Inspect <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-500 text-center font-mono">
          Zambia Sovereign Notifications Gateway · Encrypted Channel
        </div>
      </div>
    </div>
  );
};
