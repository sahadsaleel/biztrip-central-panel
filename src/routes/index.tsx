import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Truck,
  Inbox,
  IndianRupee,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Download,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStore, downloadCsv } from "@/lib/store";
import { STAGES, fmtL, utilisation, type Account } from "@/lib/mock-data";
import { Pill, stageTone, slaTone } from "@/components/hired/ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OverviewHeader, OverviewMetric, OverviewPanel } from "@/components/hired/OverviewUI";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — HireD Ops" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "description", content: "Live snapshot of B2B trips, enquiries and receivables." },
      { property: "og:title", content: "Dashboard — HireD Ops" },
      {
        property: "og:description",
        content: "Live snapshot of B2B trips, enquiries and receivables.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { enquiries, trips, setTrips, accounts } = useStore();
  const [stage, setStage] = useState<string>("All");
  const [acc, setAcc] = useState<Account | null>(null);
  const rows = enquiries.filter((e) => stage === "All" || e.stage === stage).slice(0, 6);
  const active = trips.filter((t) => t.status === "In Progress" || t.status === "Delayed");

  const refresh = () => {
    setTrips((ts) =>
      ts.map((t) =>
        t.status === "In Progress" || t.status === "Delayed"
          ? { ...t, progress: Math.min(99, t.progress + Math.floor(Math.random() * 12)) }
          : t,
      ),
    );
    toast.success("Trip data refreshed");
  };

  return (
    <>
      <div className="overview-page">
        <OverviewHeader
          title="B2B Operations Overview"
          badge={<Pill tone="success">● Live Feed</Pill>}
          subtitle="Live snapshot across trips, enquiries and receivables."
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                downloadCsv("hired-overview.csv", accounts as unknown as Record<string, unknown>[]);
                toast.success("Overview exported");
              }}
            >
              <Download />
              Quick Export
            </Button>
          }
        />
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <OverviewMetric
            label="Active B2B Trips"
            value={
              <>
                48 <span className="text-[11px] font-normal text-muted-foreground">in transit</span>
              </>
            }
            icon={Truck}
            detail="32 in progress · 16 scheduled"
            trend="↗ +8.2%"
          />
          <OverviewMetric
            label="Pending Enquiries"
            value={
              <>
                12 <span className="text-[11px] font-normal text-muted-foreground">unassigned</span>
              </>
            }
            icon={Inbox}
            tone="info"
            detail="3 need follow-up today"
            trend="+3 new"
          />
          <OverviewMetric
            label="Outstanding Receivables"
            value="₹1.42 Cr"
            icon={IndianRupee}
            tone="success"
            detail="₹25.1 L overdue"
            trend="↘ −2.4%"
          />
          <OverviewMetric
            label="Credit Alerts"
            value={
              <>
                5 <span className="text-[11px] font-normal">credit alerts</span>
              </>
            }
            icon={AlertTriangle}
            tone="danger"
            detail="Accounts above 85% utilisation"
            trend="Action required"
            alert
          />
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <OverviewPanel
            title="Enquiries Pipeline"
            subtitle={`${enquiries.filter((e) => e.stage !== "Converted").length} open leads · 3 awaiting follow-up`}
            actions={
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="secondary">
                    <Filter />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["All", ...STAGES].map((s) => (
                    <DropdownMenuItem key={s} onClick={() => setStage(s)}>
                      {s}
                      {stage === s ? " ✓" : ""}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            }
          >
            <ul className="divide-y divide-background">
              {rows.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold">{e.company}</p>
                      <Pill tone={stageTone[e.stage]}>{e.stage}</Pill>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {e.source} · {e.owner} · est. {fmtL(e.value)}/mo
                    </p>
                  </div>
                  <Button asChild variant="secondary" size="sm" className="shrink-0 text-primary">
                    <Link to="/enquiries">
                      View lead <ArrowRight />
                    </Link>
                  </Button>
                </li>
              ))}
              {!rows.length && (
                <li className="p-8 text-center text-xs text-muted-foreground">
                  No enquiries in this stage.
                </li>
              )}
            </ul>
            <div className="border-t border-background p-3 text-center">
              <Button asChild variant="link" size="sm">
                <Link to="/enquiries">
                  View all enquiries ({enquiries.length}) <ArrowRight />
                </Link>
              </Button>
            </div>
          </OverviewPanel>
          <OverviewPanel
            title="Active Trip SLA Status"
            subtitle="Live · current trip activity"
            actions={
              <Button size="sm" variant="secondary" onClick={refresh}>
                <RefreshCw />
                Refresh
              </Button>
            }
          >
            <ul className="divide-y divide-background">
              {active.slice(0, 6).map((t) => (
                <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      t.sla === "Breached"
                        ? "bg-danger"
                        : t.sla === "At Risk"
                          ? "bg-info"
                          : "bg-success",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Button asChild variant="link" className="h-auto p-0 text-xs text-foreground">
                        <Link to="/trips">{t.id}</Link>
                      </Button>
                      <span className="rounded bg-primary-soft px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {t.type}
                      </span>
                      <span className="truncate text-[11px]">
                        {t.customer} · {t.origin} → {t.destination}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {t.driver} · {t.status}
                    </p>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full transition-all",
                          t.sla === "Breached" ? "bg-danger" : "bg-primary",
                        )}
                        style={{ width: `${t.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <Pill tone={slaTone[t.sla]}>{t.sla}</Pill>
                    <p className="mt-1 text-[10px] text-muted-foreground">ETA {t.eta.slice(5)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-background p-3 text-center">
              <Button asChild variant="link" size="sm">
                <Link to="/trips">
                  Open trip control room <ArrowRight />
                </Link>
              </Button>
            </div>
          </OverviewPanel>
        </div>
        <OverviewPanel
          title="Accounts Requiring Attention"
          icon={AlertTriangle}
          subtitle="Credit utilisation, outstanding balances and overdue amounts"
          className="mt-5"
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                downloadCsv(
                  "hired-account-ledger.csv",
                  accounts as unknown as Record<string, unknown>[],
                );
                toast.success("Ledger exported");
              }}
            >
              <Download />
              Export Ledger
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr>
                  {[
                    "Account",
                    "Credit limit",
                    "Outstanding",
                    "Utilisation",
                    "Overdue",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounts.map((a) => {
                  const u = utilisation(a);
                  return (
                    <tr
                      key={a.id}
                      className="cursor-pointer hover:bg-background"
                      onClick={() => setAcc(a)}
                    >
                      <td>
                        <p className="font-semibold">{a.name}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">{a.gstin}</p>
                      </td>
                      <td className="whitespace-nowrap">{fmtL(a.limit)}</td>
                      <td className="whitespace-nowrap font-semibold">{fmtL(a.outstanding)}</td>
                      <td>
                        <span
                          className={cn(
                            "text-[11px] font-medium",
                            u > 85 ? "text-danger" : "text-info",
                          )}
                        >
                          {u}% utilised
                        </span>
                        <div className="mt-1.5 h-1 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              "h-full",
                              u > 85 ? "bg-danger" : u > 70 ? "bg-warning" : "bg-success",
                            )}
                            style={{ width: `${Math.min(u, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td
                        className={cn(
                          "whitespace-nowrap",
                          a.overdue ? "text-danger" : "text-muted-foreground",
                        )}
                      >
                        {a.overdue ? fmtL(a.overdue) : "—"}
                      </td>
                      <td>
                        <Pill
                          tone={
                            a.status === "Active"
                              ? "success"
                              : a.status === "On Hold"
                                ? "warning"
                                : "danger"
                          }
                        >
                          ● {a.status}
                        </Pill>
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            setAcc(a);
                          }}
                        >
                          View ledger
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-background px-5 py-3">
            <span className="text-[11px] text-muted-foreground">
              Showing {accounts.length} customer accounts
            </span>
            <Button asChild variant="link" size="sm">
              <Link to="/accounts">
                Manage credit policies <ArrowRight />
              </Link>
            </Button>
          </div>
        </OverviewPanel>
      </div>

      <Sheet open={!!acc} onOpenChange={(o) => !o && setAcc(null)}>
        <SheetContent>
          {acc && (
            <>
              <SheetHeader>
                <SheetTitle>{acc.name}</SheetTitle>
              </SheetHeader>
              <dl className="grid grid-cols-2 gap-4 px-4 text-sm">
                {[
                  ["Account ID", acc.id],
                  ["GSTIN", acc.gstin],
                  ["Contact", acc.contact],
                  ["Status", acc.status],
                  ["Credit limit", fmtL(acc.limit)],
                  ["Outstanding", fmtL(acc.outstanding)],
                  ["Available", fmtL(acc.limit - acc.outstanding)],
                  ["Overdue", fmtL(acc.overdue)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="px-4 pt-4">
                <Link
                  to="/trips"
                  search={{ customer: acc.name }}
                  className="text-sm font-medium text-primary"
                >
                  View trips for this account →
                </Link>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
