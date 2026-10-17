import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  X,
  Truck,
  Inbox,
  Wallet,
  FileText,
  UserCheck,
  Users,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function GlobalSearch() {
  const { enquiries, trips, accounts, invoices, drivers, users } = useStore();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = query.trim().toLowerCase();

  const matchingEnquiries = q
    ? enquiries
        .filter(
          (e) =>
            e.company.toLowerCase().includes(q) ||
            e.contact.toLowerCase().includes(q) ||
            e.origin.toLowerCase().includes(q) ||
            e.destination.toLowerCase().includes(q) ||
            e.id.toLowerCase().includes(q),
        )
        .slice(0, 3)
    : [];

  const matchingTrips = q
    ? trips
        .filter(
          (t) =>
            t.id.toLowerCase().includes(q) ||
            t.customer.toLowerCase().includes(q) ||
            t.origin.toLowerCase().includes(q) ||
            t.destination.toLowerCase().includes(q) ||
            t.driver.toLowerCase().includes(q) ||
            t.vehicle.toLowerCase().includes(q),
        )
        .slice(0, 3)
    : [];

  const matchingAccounts = q
    ? accounts
        .filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            a.contact.toLowerCase().includes(q) ||
            a.gstin.toLowerCase().includes(q) ||
            a.id.toLowerCase().includes(q),
        )
        .slice(0, 3)
    : [];

  const matchingInvoices = q
    ? invoices
        .filter(
          (i) =>
            i.id.toLowerCase().includes(q) ||
            i.customer.toLowerCase().includes(q) ||
            i.trip.toLowerCase().includes(q),
        )
        .slice(0, 3)
    : [];

  const matchingDrivers = q
    ? drivers
        .filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.id.toLowerCase().includes(q) ||
            d.phone.toLowerCase().includes(q) ||
            d.assignedVehicle.toLowerCase().includes(q),
        )
        .slice(0, 3)
    : [];

  const matchingUsers = q
    ? users
        .filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q) ||
            u.department.toLowerCase().includes(q),
        )
        .slice(0, 3)
    : [];

  const totalResults =
    matchingEnquiries.length +
    matchingTrips.length +
    matchingAccounts.length +
    matchingInvoices.length +
    matchingDrivers.length +
    matchingUsers.length;

  const handleSelect = (to: string) => {
    setIsOpen(false);
    setQuery("");
    navigate({ to });
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search trips, accounts, or invoices..."
          className="h-9 w-full rounded-lg border border-primary/10 bg-primary-soft/40 pl-9 pr-8 text-xs outline-none transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:bg-background focus:ring-2 focus:ring-primary/20"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {isOpen && q && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[420px] overflow-y-auto rounded-xl border border-border bg-popover p-2 shadow-xl animate-in fade-in-50 zoom-in-95">
          {totalResults === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-3">
              {matchingTrips.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Truck className="size-3.5 text-primary" />
                    <span>Trips ({matchingTrips.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingTrips.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSelect("/trips")}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-muted"
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {t.id} · {t.customer}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {t.origin} → {t.destination} · {t.status}
                          </p>
                        </div>
                        <ArrowRight className="size-3 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingEnquiries.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Inbox className="size-3.5 text-info" />
                    <span>Enquiries ({matchingEnquiries.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingEnquiries.map((e) => (
                      <button
                        key={e.id}
                        onClick={() => handleSelect("/enquiries")}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-muted"
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {e.company} ({e.id})
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {e.origin} → {e.destination} · Stage: {e.stage} · Owner: {e.owner}
                          </p>
                        </div>
                        <ArrowRight className="size-3 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingAccounts.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Wallet className="size-3.5 text-success" />
                    <span>Accounts ({matchingAccounts.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingAccounts.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleSelect("/accounts")}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-muted"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{a.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            GST: {a.gstin} · Outstanding: ₹{a.outstanding} L · Limit: ₹{a.limit} L
                          </p>
                        </div>
                        <ArrowRight className="size-3 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingInvoices.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="size-3.5 text-warning" />
                    <span>Invoices ({matchingInvoices.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingInvoices.map((i) => (
                      <button
                        key={i.id}
                        onClick={() => handleSelect("/invoicing")}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-muted"
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {i.id} · {i.customer}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            ₹{(i.amount / 100000).toFixed(2)} L · Status: {i.status} · Due: {i.due}
                          </p>
                        </div>
                        <ArrowRight className="size-3 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingDrivers.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <UserCheck className="size-3.5 text-primary" />
                    <span>Drivers ({matchingDrivers.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingDrivers.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => handleSelect("/fleet")}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-muted"
                      >
                        <div>
                          <p className="font-semibold text-foreground">
                            {d.name} ({d.id})
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {d.phone} · Vehicle: {d.assignedVehicle} · {d.availability}
                          </p>
                        </div>
                        <ArrowRight className="size-3 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingUsers.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <Users className="size-3.5 text-info" />
                    <span>Users & Team ({matchingUsers.length})</span>
                  </div>
                  <div className="space-y-1">
                    {matchingUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => handleSelect("/users")}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-muted"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{u.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {u.email} · {u.role} · {u.department}
                          </p>
                        </div>
                        <ArrowRight className="size-3 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
