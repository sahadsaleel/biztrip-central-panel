import { createContext, useContext, useState, type ReactNode } from "react";
import * as mock from "./mock-data";
import type { Enquiry, Trip, Account } from "./mock-data";

interface Store {
  enquiries: Enquiry[];
  setEnquiries: React.Dispatch<React.SetStateAction<Enquiry[]>>;
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  accounts: Account[];
  tripDialogOpen: boolean;
  setTripDialogOpen: (v: boolean) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [enquiries, setEnquiries] = useState(mock.enquiries);
  const [trips, setTrips] = useState(mock.trips);
  const [accounts] = useState(mock.accounts);
  const [tripDialogOpen, setTripDialogOpen] = useState(false);
  return (
    <Ctx.Provider value={{ enquiries, setEnquiries, trips, setTrips, accounts, tripDialogOpen, setTripDialogOpen }}>
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
