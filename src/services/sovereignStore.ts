import { 
  AppNotification, 
  EmergencyAlert, 
  PublicAnnouncement, 
  PowerStation, 
  LoadSheddingSchedule, 
  CdfApplicationRecord, 
  AuditLogEntry, 
  AdminUser, 
  SystemSettings 
} from '../types/zambia';
import { POWER_STATIONS, LOAD_SHEDDING_SCHEDULES } from '../data/zambiaData';

// Initial Notifications Seed
const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-001',
    title: 'Stage 2 Power Rationing Directive Active',
    message: 'Lake Kariba live water storage is at 12.8% (476.22m). ZESCO 8-hour daily rationing active across Lusaka & Copperbelt.',
    type: 'emergency',
    severity: 'HIGH',
    timestamp: '10 mins ago',
    read: false,
    targetTab: 'zesco',
  },
  {
    id: 'NOTIF-002',
    title: 'CDF Grant Dossier Awaiting Approval',
    message: 'Misozi Tembo (Lusaka Central) submitted application CDF/LUS/2026/04918 for TEVETA Earthmoving Equipment Bursary.',
    type: 'approval',
    severity: 'INFO',
    timestamp: '42 mins ago',
    read: false,
    targetTab: 'cdf',
  },
  {
    id: 'NOTIF-003',
    title: 'BOZ Daily Kwacha Mid-Rate Fixing Updated',
    message: 'Bank of Zambia official foreign exchange mid-rate published: USD 1 = ZMW 27.42; Monetary Policy Rate at 13.50%.',
    type: 'system',
    severity: 'INFO',
    timestamp: '2 hours ago',
    read: true,
    targetTab: 'boz',
  },
  {
    id: 'NOTIF-004',
    title: 'ZRA 2026 PAYE Tax Window Synchronized',
    message: 'Statutory 2026 salary bands (K5,100 tax-free threshold) active with electronic TCC verification.',
    type: 'system',
    severity: 'SUCCESS',
    timestamp: '4 hours ago',
    read: true,
    targetTab: 'zra',
  },
  {
    id: 'NOTIF-005',
    title: 'Emergency Advisory: Cholera Water Chlorination Watch',
    message: 'Preventative household water chlorination and borehole testing active in high-density peri-urban zones.',
    type: 'emergency',
    severity: 'CRITICAL',
    timestamp: 'Yesterday',
    read: false,
    targetTab: 'emergency',
  },
];

class SovereignStore {
  private notifications: AppNotification[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedNotifs = localStorage.getItem('zamos_notifications');
      if (savedNotifs) {
        this.notifications = JSON.parse(savedNotifs);
      } else {
        this.notifications = DEFAULT_NOTIFICATIONS;
        this.saveNotifications();
      }
    } catch {
      this.notifications = DEFAULT_NOTIFICATIONS;
    }
  }

  private saveNotifications() {
    try {
      localStorage.setItem('zamos_notifications', JSON.stringify(this.notifications));
    } catch (e) {
      console.error(e);
    }
    this.notify();
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public getNotifications(): AppNotification[] {
    return this.notifications;
  }

  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  public markAsRead(id: string) {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.saveNotifications();
  }

  public markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.saveNotifications();
  }

  public clearAll() {
    this.notifications = [];
    this.saveNotifications();
  }

  public addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    const newNotif: AppNotification = {
      ...notification,
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Just now',
      read: false,
    };
    this.notifications = [newNotif, ...this.notifications];
    this.saveNotifications();
  }
}

export const sovereignStore = new SovereignStore();
