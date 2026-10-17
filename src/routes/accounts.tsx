import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Wallet,
  AlertTriangle,
  IndianRupee,
  ShieldCheck,
  Download,
  Search,
  Percent,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { useStore, downloadCsv } from "@/lib/store";
import { accountEvents, fmtL, utilisation, type Account } from "@/lib/mock-data";
import { CommissionSplitModal } from "@/features/companies";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  Kpi,
  Pill,
  Card,
  NativeSelect,
  th,
  td,
  type Tone,
} from "@/components/hired/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Accounts & Credit — HireD Ops" },
      { name: "description", content: "Manage customer accounts, credit limits and receivables." },
      { property: "og:title", content: "Accounts & Credit — HireD Ops" },
      {
        property: "og:description",
        content: "Manage customer accounts, credit limits and receivables.",
      },
    ],
  }),
  component: AccountsPage,
});

const statusTone: Record<Account["status"], Tone> = {
  Active: "success",
  "On Hold": "warning",
  Blocked: "danger",
};
const eventTone: Record<string, Tone> = {
  "Invoice Raised": "info",
  "Payment Received": "success",
  "Credit Limit Changed": "primary",
  "Status Changed": "warning",
  "Reminder Sent": "danger",
};

function utilBar(pct: number) {
  if (pct >= 90) return "bg-danger";
  if (pct >= 70) return "bg-warning";
  return "bg-success";
}

function AccountsPage() {
  const { accounts } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState<Account | null>(null);
  const [splitModalAccount, setSplitModalAccount] = useState<Account | null>(null);

  const filtered = useMemo(
    () =>
      accounts.filter(
        (a) =>
          (status === "All" || a.status === status) &&
          (a.name.toLowerCase().includes(q.toLowerCase()) ||
            a.id.toLowerCase().includes(q.toLowerCase()) ||
            a.contact.toLowerCase().includes(q.toLowerCase())),
      ),
    [accounts, q, status],
  );

  const totalOutstanding = accounts.reduce((s, a) => s + a.outstanding, 0);
  const totalOverdue = accounts.reduce((s, a) => s + a.overdue, 0);
  const onHold = accounts.filter((a) => a.status !== "Active").length;

  const events = selected ? accountEvents.filter((e) => e.accountId === selected.id) : [];

  return (
    <div>
      <PageHeader
        title="Accounts & Credit"
        subtitle="Customer accounts, credit limits and receivables."
        actions={
          <button
            onClick={() => {
              downloadCsv(
                "accounts.csv",
                filtered.map((a) => ({
                  id: a.id,
                  name: a.name,
                  gstin: a.gstin,
                  contact: a.contact,
                  limit: a.limit,
                  outstanding: a.outstanding,
                  overdue: a.overdue,
                  status: a.status,
                })),
              );
              toast("Accounts exported to CSV");
            }}
            className="inline-flex h-10 items-center gap-2 rounded-xl border bg-card px-4 text-sm font-medium hover:bg-muted"
          >
            <Download className="size-4" /> Export
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Total Outstanding"
          value={fmtL(totalOutstanding)}
          hint="Across all accounts"
          icon={IndianRupee}
          tone="primary"
        />
        <Kpi
          label="Overdue Amount"
          value={fmtL(totalOverdue)}
          hint="Past due date"
          icon={AlertTriangle}
          tone="danger"
        />
        <Kpi
          label="Active Accounts"
          value={accounts.length - onHold}
          hint={`${onHold} on hold / blocked`}
          icon={ShieldCheck}
          tone="success"
        />
        <Kpi
          label="Credit Extended"
          value={fmtL(accounts.reduce((s, a) => s + a.limit, 0))}
          hint="Combined limits"
          icon={Wallet}
          tone="info"
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b px-5 py-4">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, ID or contact..."
              className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <NativeSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={["All", "Active", "On Hold", "Blocked"]}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className={th}>Account</th>
                <th className={th}>Contact</th>
                <th className={th}>Credit Limit</th>
                <th className={th}>Outstanding</th>
                <th className={th}>Overdue</th>
                <th className={th}>Utilisation</th>
                <th className={th}>Fleet & Commission</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const pct = utilisation(a);
                const split = a.commissionSplit || {
                  platformPercentage: 15,
                  companyPercentage: 70,
                  driverPercentage: 15,
                };
                return (
                  <tr
                    key={a.id}
                    onClick={() => setSelected(a)}
                    className="cursor-pointer border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className={td}>
                      <p className="font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.id} · GSTIN {a.gstin}
                      </p>
                    </td>
                    <td className={td}>{a.contact}</td>
                    <td className={td}>{fmtL(a.limit)}</td>
                    <td className={td}>{fmtL(a.outstanding)}</td>
                    <td className={cn(td, a.overdue > 0 && "font-medium text-danger")}>
                      {a.overdue > 0 ? fmtL(a.overdue) : "—"}
                    </td>
                    <td className={td}>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn("h-full rounded-full", utilBar(pct))}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{pct}%</span>
                      </div>
                    </td>
                    <td className={td}>
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Truck className="size-3 text-primary" /> {a.fleetCount || 24} trucks
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSplitModalAccount(a);
                          }}
                          className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary hover:bg-primary/20"
                        >
                          <Percent className="size-2.5" />
                          Split: {split.platformPercentage}/{split.companyPercentage}/
                          {split.driverPercentage}
                        </button>
                      </div>
                    </td>
                    <td className={td}>
                      <Pill tone={statusTone[a.status]}>{a.status}</Pill>
                    </td>
                  </tr>
                );
              })}
              {!filtered.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No accounts match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold">{selected.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {selected.id} · GSTIN {selected.gstin} · {selected.contact}
                </p>
              </div>
              <Pill tone={statusTone[selected.status]}>{selected.status}</Pill>
            </div>

            <div className="grid gap-4 border-b px-6 py-5 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Credit Limit</p>
                <p className="mt-1 text-lg font-semibold">{fmtL(selected.limit)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Outstanding</p>
                <p className="mt-1 text-lg font-semibold">{fmtL(selected.outstanding)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p
                  className={cn(
                    "mt-1 text-lg font-semibold",
                    selected.overdue > 0 && "text-danger",
                  )}
                >
                  {selected.overdue > 0 ? fmtL(selected.overdue) : "—"}
                </p>
              </div>
              <div className="sm:col-span-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Credit utilisation</span>
                  <span>{utilisation(selected)}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", utilBar(utilisation(selected)))}
                    style={{ width: `${Math.min(utilisation(selected), 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Fleet & Commission Configuration Section */}
            <div className="border-b px-6 py-4 bg-muted/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Truck className="size-3.5 text-primary" />
                    Fleet & Revenue Split Agreement
                  </h4>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Dedicated Fleet:{" "}
                    <strong className="text-foreground">
                      {selected.fleetCount || 24} vehicles
                    </strong>{" "}
                    · Corridors:{" "}
                    {selected.primaryRoutes?.join(", ") || "Delhi → Mumbai, Jaipur → Ahmedabad"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Active Commission Split: Platform{" "}
                    <strong className="text-primary">
                      {selected.commissionSplit?.platformPercentage || 15}%
                    </strong>{" "}
                    · Transporter{" "}
                    <strong className="text-foreground">
                      {selected.commissionSplit?.companyPercentage || 70}%
                    </strong>{" "}
                    · Driver{" "}
                    <strong className="text-foreground">
                      {selected.commissionSplit?.driverPercentage || 15}%
                    </strong>
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSplitModalAccount(selected)}
                  className="gap-1.5 text-xs"
                >
                  <Percent className="size-3.5" />
                  Configure Split
                </Button>
              </div>
            </div>

            <div className="px-6 py-5">
              <h3 className="mb-3 text-sm font-semibold">Account Activity</h3>
              {events.length ? (
                <ul className="space-y-3">
                  {events.map((e) => (
                    <li key={e.id} className="flex items-center gap-3 rounded-xl border p-3">
                      <Pill tone={eventTone[e.type]}>{e.type}</Pill>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{e.detail}</p>
                        <p className="text-xs text-muted-foreground">{e.date}</p>
                      </div>
                      {e.amount !== undefined && (
                        <span
                          className={cn(
                            "text-sm font-medium",
                            e.amount < 0 ? "text-success" : "text-foreground",
                          )}
                        >
                          {e.amount < 0 ? "−" : "+"}
                          {fmtL(Math.abs(e.amount))}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t px-6 py-4">
              <button
                onClick={() => toast("Reminder sent (demo only)")}
                className="h-9 rounded-lg border bg-card px-4 text-sm font-medium hover:bg-muted"
              >
                Send Reminder
              </button>
              <button
                onClick={() => setSelected(null)}
                className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <CommissionSplitModal
        company={splitModalAccount}
        open={!!splitModalAccount}
        onOpenChange={(o) => !o && setSplitModalAccount(null)}
        onSuccess={(updated) => {
          setSelected(updated);
        }}
      />
    </div>
  );
}
