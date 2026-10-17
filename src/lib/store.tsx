import { createContext, useContext, useState, type ReactNode } from "react";
import * as mock from "./mock-data";
import type {
  Enquiry,
  Trip,
  Account,
  Driver,
  Vehicle,
  AppUser,
  AppNotification,
  ActivityLog,
  AppSettings,
} from "./mock-data";
import { invoices as initialInvoices, type Invoice } from "./invoices";

interface Store {
  enquiries: Enquiry[];
  setEnquiries: React.Dispatch<React.SetStateAction<Enquiry[]>>;
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  users: AppUser[];
  setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  activityLogs: ActivityLog[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  logActivity: (log: Omit<ActivityLog, "id" | "timestamp">) => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  tripDialogOpen: boolean;
  setTripDialogOpen: (v: boolean) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [enquiries, setEnquiries] = useState(mock.enquiries);
  const [trips, setTrips] = useState(mock.trips);
  const [accounts, setAccounts] = useState(mock.accounts);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [drivers, setDrivers] = useState(mock.drivers);
  const [vehicles, setVehicles] = useState(mock.vehicles);
  const [users, setUsers] = useState(mock.usersList);
  const [notifications, setNotifications] = useState(mock.notificationsList);
  const [activityLogs, setActivityLogs] = useState(mock.activityLogsList);
  const [tripDialogOpen, setTripDialogOpen] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem("hired_settings");
      return saved ? { ...mock.defaultSettings, ...JSON.parse(saved) } : mock.defaultSettings;
    } catch {
      return mock.defaultSettings;
    }
  });

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const logActivity = (log: Omit<ActivityLog, "id" | "timestamp">) => {
    const newLog: ActivityLog = {
      ...log,
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: "Just now",
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  return (
    <Ctx.Provider
      value={{
        enquiries,
        setEnquiries,
        trips,
        setTrips,
        accounts,
        setAccounts,
        invoices,
        setInvoices,
        drivers,
        setDrivers,
        vehicles,
        setVehicles,
        users,
        setUsers,
        notifications,
        setNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        activityLogs,
        setActivityLogs,
        logActivity,
        settings,
        setSettings,
        tripDialogOpen,
        setTripDialogOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}

export function nextId(prefix: string, ids: string[]) {
  const max = Math.max(0, ...ids.map((i) => parseInt(i.split("-")[1] ?? "0", 10)));
  return `${prefix}-${max + 1}`;
}

export function downloadCsv(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0] ?? {});
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
