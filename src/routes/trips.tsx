import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Truck, Activity, CalendarClock, AlertTriangle, Search, Pencil, Eye, XCircle, MapPin, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store";
import { DRIVERS, TRIP_STATUSES, type Trip } from "@/lib/mock-data";
import { Kpi, Card, Pill, PageHeader, NativeSelect, statusTone, slaTone, th, td } from "@/components/hired/ui";
import { TripFormDialog } from "@/components/hired/TripFormDialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/trips")({
  validateSearch: (s: Record<string, unknown>): { customer?: string } => (typeof s.customer === "string" ? { customer: s.customer } : {}),
  head: () => ({
    meta: [
      { title: "B2B Trips — HireD Ops" },
      { name: "description", content: "Manage scheduled, active and completed logistics trips." },
      { property: "og:title", content: "B2B Trips — HireD Ops" },
      { property: "og:description", content: "Manage scheduled, active and completed logistics trips." },
    ],
  }),
  component: TripsPage,
});

function TripsPage() {
  const { trips, setTrips, setTripDialogOpen } = useStore();
  const { customer } = Route.useSearch();
  const [q, setQ] = useState(customer ?? "");
  const [status, setStatus] = useState("All statuses");
  const [type, setType] = useState("All types");
  const [sort, setSort] = useState("Pickup: newest");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [edit, setEdit] = useState<Trip | undefined>();
  const [view, setView] = useState<Trip | null>(null);
  const [cancel, setCancel] = useState<Trip | null>(null);

  const rows = useMemo(() => {
    const s = q.toLowerCase();
    const r = trips.filter(
      (t) =>
        (!s || [t.id, t.customer, t.origin, t.destination, t.driver].some((v) => v.toLowerCase().includes(s))) &&
        (status === "All statuses" || t.status === status) &&
        (type === "All types" || t.type === type) &&
        (!from || t.pickup >= from) &&
        (!to || t.pickup <= to),
    );
    return [...r].sort((a, b) => (sort === "Pickup: newest" ? b.pickup.localeCompare(a.pickup) : sort === "Pickup: oldest" ? a.pickup.localeCompare(b.pickup) : a.eta.localeCompare(b.eta)));
  }, [trips, q, status, type, sort, from, to]);

  const update = (id: string, patch: Partial<Trip>, msg: string) => {
    setTrips((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setView((v) => (v && v.id === id ? { ...v, ...patch } : v));
    toast.success(msg);
  };

  return (
    <>
      <PageHeader title="B2B Trips" subtitle="Manage scheduled, active and completed logistics trips." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total Trips" value={48} icon={Truck} />
        <Kpi label="In Progress" value={32} icon={Activity} tone="info" />
        <Kpi label="Scheduled" value={16} icon={CalendarClock} tone="success" />
        <Kpi label="Delayed" value={5} icon={AlertTriangle} tone="warning" />
      </div>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center gap-2 border-b p-4">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search trip, customer, city, driver" className="h-9 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <NativeSelect label="Status" value={status} onChange={setStatus} options={["All statuses", ...TRIP_STATUSES]} />
          <NativeSelect label="Type" value={type} onChange={setType} options={["All types", "FTL", "PTL", "Express"]} />
          <NativeSelect label="Sort" value={sort} onChange={setSort} options={["Pickup: newest", "Pickup: oldest", "ETA: soonest"]} />
          <input aria-label="From date" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 rounded-lg border bg-card px-2 text-sm" />
          <input aria-label="To date" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9 rounded-lg border bg-card px-2 text-sm" />
          <button onClick={() => setTripDialogOpen(true)} className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">+ New Trip</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>{["Trip ID", "Customer", "Type", "Origin", "Destination", "Pickup", "ETA", "Driver", "Vehicle", "Status", "SLA", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((t) => (
                <tr key={t.id} className="hover:bg-muted/40">
                  <td className={cn(td, "font-medium text-primary")}><button onClick={() => setView(t)}>{t.id}</button></td>
                  <td className={td}>{t.customer}</td>
                  <td className={td}>{t.type}</td>
                  <td className={td}>{t.origin}</td>
                  <td className={td}>{t.destination}</td>
                  <td className={td}>{t.pickup}</td>
                  <td className={td}>{t.eta}</td>
                  <td className={cn(td, t.driver === "Unassigned" && "text-warning")}>{t.driver}</td>
                  <td className={cn(td, "text-muted-foreground")}>{t.vehicle}</td>
                  <td className={td}><Pill tone={statusTone[t.status]}>{t.status}</Pill></td>
                  <td className={td}><Pill tone={slaTone[t.sla]}>{t.sla}</Pill></td>
                  <td className={td}>
                    <div className="flex items-center gap-1">
                      <button aria-label="View" onClick={() => setView(t)} className="rounded-md p-1.5 hover:bg-muted"><Eye className="size-4" /></button>
                      <button aria-label="Edit" onClick={() => setEdit(t)} className="rounded-md p-1.5 hover:bg-muted"><Pencil className="size-4" /></button>
                      <DropdownMenu>
                        <DropdownMenuTrigger aria-label="Assign driver" className="rounded-md p-1.5 hover:bg-muted"><UserPlus className="size-4" /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Assign driver</DropdownMenuLabel>
                          {DRIVERS.map((d) => <DropdownMenuItem key={d} onClick={() => update(t.id, { driver: d }, `${d} assigned to ${t.id}`)}>{d}</DropdownMenuItem>)}
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change status</DropdownMenuLabel>
                          {TRIP_STATUSES.filter((s) => s !== "Cancelled").map((s) => <DropdownMenuItem key={s} onClick={() => update(t.id, { status: s, progress: s === "Completed" ? 100 : t.progress }, `${t.id} → ${s}`)}>{s}</DropdownMenuItem>)}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <button aria-label="Cancel trip" disabled={t.status === "Cancelled"} onClick={() => setCancel(t)} className="rounded-md p-1.5 text-danger hover:bg-danger-soft disabled:opacity-30"><XCircle className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={12} className="py-10 text-center text-sm text-muted-foreground">No trips match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <TripFormDialog open={!!edit} onOpenChange={(o) => !o && setEdit(undefined)} trip={edit} />

      <AlertDialog open={!!cancel} onOpenChange={(o) => !o && setCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel {cancel?.id}?</AlertDialogTitle>
            <AlertDialogDescription>This marks the trip for {cancel?.customer} as cancelled. Sample data only.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep trip</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => cancel && update(cancel.id, { status: "Cancelled" }, `${cancel.id} cancelled`)}>Cancel trip</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {view && (
            <>
              <SheetHeader>
                <SheetTitle>Trip Control Room · {view.id}</SheetTitle>
                <div className="flex gap-2"><Pill tone={statusTone[view.status]}>{view.status}</Pill><Pill tone={slaTone[view.sla]}>{view.sla}</Pill></div>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <div className="rounded-xl border bg-muted/40 p-4">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="flex items-center gap-1"><MapPin className="size-4 text-primary" />{view.origin}</span>
                    <span className="flex items-center gap-1"><MapPin className="size-4 text-success" />{view.destination}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${view.progress}%` }} /></div>
                  <p className="mt-2 text-xs text-muted-foreground">{view.progress}% of route covered · ETA {view.eta}</p>
                </div>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  {[["Customer", view.customer], ["Trip type", view.type], ["Pickup", view.pickup], ["ETA", view.eta], ["Driver", view.driver], ["Vehicle", view.vehicle]].map(([k, v]) => (
                    <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
                  ))}
                </dl>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Timeline</p>
                  <ol className="space-y-2 border-l pl-4 text-sm">
                    <li>Trip created · {view.pickup}</li>
                    <li>Driver {view.driver} assigned</li>
                    {view.progress > 0 && <li>Picked up at {view.origin}</li>}
                    {view.status === "Delayed" && <li className="text-warning">Delay reported on route</li>}
                    {view.status === "Completed" && <li className="text-success">Delivered at {view.destination}</li>}
                  </ol>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setEdit(view); setView(null); }} className="h-9 rounded-lg border px-3 text-sm font-medium hover:bg-muted">Edit trip</button>
                  <Link to="/accounts" className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground">Open customer account</Link>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
