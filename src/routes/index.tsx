import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Inbox, IndianRupee, AlertTriangle, RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import { STAGES, fmtL, utilisation, type Account } from "@/lib/mock-data";
import { Kpi, Card, Pill, PageHeader, stageTone, slaTone, statusTone, th, td } from "@/components/hired/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — HireD Ops" },
      { name: "description", content: "Live snapshot of B2B trips, enquiries and receivables." },
      { property: "og:title", content: "Dashboard — HireD Ops" },
      { property: "og:description", content: "Live snapshot of B2B trips, enquiries and receivables." },
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
      <PageHeader title="B2B Operations Overview" subtitle="Live snapshot across trips, enquiries and receivables." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Active B2B Trips" value={48} hint="+6 vs last week" icon={Truck} />
        <Kpi label="Pending Enquiries" value={12} hint="3 need follow-up today" icon={Inbox} tone="info" />
        <Kpi label="Outstanding Receivables" value="₹1.42 Cr" hint="₹25.1 L overdue" icon={IndianRupee} tone="success" />
        <Kpi label="Credit Alerts" value={5} hint="Accounts above 85% utilisation" icon={AlertTriangle} tone="danger" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Enquiries Pipeline" action={<Link to="/enquiries" className="inline-flex items-center gap-1 text-sm font-medium text-primary">View all <ArrowRight className="size-3.5" /></Link>}>
          <div className="flex flex-wrap gap-2 px-5 pt-4">
            {["All", ...STAGES].map((s) => (
              <button key={s} onClick={() => setStage(s)} className={cn("rounded-full border px-3 py-1 text-xs font-medium", stage === s ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}>{s}</button>
            ))}
          </div>
          <ul className="divide-y p-2">
            {rows.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{e.company}</p>
                  <p className="text-xs text-muted-foreground">{e.origin} → {e.destination} · {e.owner}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{fmtL(e.value)}/mo</span>
                  <Pill tone={stageTone[e.stage]}>{e.stage}</Pill>
                </div>
              </li>
            ))}
            {!rows.length && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No enquiries in this stage.</li>}
          </ul>
        </Card>

        <Card title="Active Trip SLA Status" action={<div className="flex gap-3"><button onClick={refresh} className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><RefreshCw className="size-3.5" />Refresh</button><Link to="/trips" className="inline-flex items-center gap-1 text-sm font-medium text-primary">Trips <ArrowRight className="size-3.5" /></Link></div>}>
          <ul className="divide-y p-2">
            {active.map((t) => (
              <li key={t.id} className="px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{t.id} <span className="font-normal text-muted-foreground">· {t.origin} → {t.destination}</span></p>
                  <div className="flex gap-2"><Pill tone={statusTone[t.status]}>{t.status}</Pill><Pill tone={slaTone[t.sla]}>{t.sla}</Pill></div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full transition-all", t.sla === "Breached" ? "bg-danger" : t.sla === "At Risk" ? "bg-warning" : "bg-primary")} style={{ width: `${t.progress}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Accounts Requiring Attention" className="mt-6" action={<Link to="/accounts" className="inline-flex items-center gap-1 text-sm font-medium text-primary">Accounts <ArrowRight className="size-3.5" /></Link>}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50"><tr><th className={th}>Account</th><th className={th}>Credit limit</th><th className={th}>Outstanding</th><th className={th}>Utilisation</th><th className={th}>Overdue</th><th className={th}>Status</th></tr></thead>
            <tbody className="divide-y">
              {accounts.map((a) => {
                const u = utilisation(a);
                return (
                  <tr key={a.id} onClick={() => setAcc(a)} className="cursor-pointer hover:bg-muted/40">
                    <td className={cn(td, "font-medium")}>{a.name}</td>
                    <td className={td}>{fmtL(a.limit)}</td>
                    <td className={td}>{fmtL(a.outstanding)}</td>
                    <td className={td}>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted"><div className={cn("h-full", u > 85 ? "bg-danger" : u > 70 ? "bg-warning" : "bg-success")} style={{ width: `${u}%` }} /></div>
                        <span className="text-xs">{u}%</span>
                      </div>
                    </td>
                    <td className={cn(td, a.overdue ? "text-danger" : "text-muted-foreground")}>{a.overdue ? fmtL(a.overdue) : "—"}</td>
                    <td className={td}><Pill tone={a.status === "Active" ? "success" : a.status === "On Hold" ? "warning" : "danger"}>{a.status}</Pill></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Sheet open={!!acc} onOpenChange={(o) => !o && setAcc(null)}>
        <SheetContent>
          {acc && (
            <>
              <SheetHeader><SheetTitle>{acc.name}</SheetTitle></SheetHeader>
              <dl className="grid grid-cols-2 gap-4 px-4 text-sm">
                {[["Account ID", acc.id], ["GSTIN", acc.gstin], ["Contact", acc.contact], ["Status", acc.status], ["Credit limit", fmtL(acc.limit)], ["Outstanding", fmtL(acc.outstanding)], ["Available", fmtL(acc.limit - acc.outstanding)], ["Overdue", fmtL(acc.overdue)]].map(([k, v]) => (
                  <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
                ))}
              </dl>
              <div className="px-4 pt-4"><Link to="/trips" search={{ customer: acc.name }} className="text-sm font-medium text-primary">View trips for this account →</Link></div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
