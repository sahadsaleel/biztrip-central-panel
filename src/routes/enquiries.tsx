import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Inbox, PhoneCall, Target, UserX, Search, Download, LayoutList, Columns3, Pencil, ArrowRightCircle } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, nextId, downloadCsv } from "@/lib/store";
import { OWNERS, SOURCES, STAGES, fmtL, type Enquiry, type Stage } from "@/lib/mock-data";
import { Kpi, Card, Pill, PageHeader, NativeSelect, stageTone, th, td } from "@/components/hired/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries / CRM — HireD Ops" },
      { name: "description", content: "B2B lead pipeline from first touch to converted trip." },
      { property: "og:title", content: "Enquiries / CRM — HireD Ops" },
      { property: "og:description", content: "B2B lead pipeline from first touch to converted trip." },
    ],
  }),
  component: EnquiriesPage,
});

const TODAY = "2026-10-09";

function EnquiriesPage() {
  const { enquiries, setEnquiries, trips, setTrips } = useStore();
  const [mode, setMode] = useState<"table" | "kanban">("table");
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("All stages");
  const [owner, setOwner] = useState("All owners");
  const [source, setSource] = useState("All sources");
  const [date, setDate] = useState("Any date");
  const [sort, setSort] = useState("Newest");
  const [form, setForm] = useState<Enquiry | "new" | null>(null);
  const [view, setView] = useState<Enquiry | null>(null);

  const rows = useMemo(() => {
    const s = q.toLowerCase();
    const days = date === "Last 7 days" ? 7 : date === "Last 30 days" ? 30 : 9999;
    const cutoff = new Date(new Date(TODAY).getTime() - days * 864e5).toISOString().slice(0, 10);
    const r = enquiries.filter(
      (e) =>
        (!s || [e.id, e.company, e.contact, e.origin, e.destination].some((v) => v.toLowerCase().includes(s))) &&
        (stage === "All stages" || e.stage === stage) &&
        (owner === "All owners" || e.owner === owner) &&
        (source === "All sources" || e.source === source) &&
        e.createdAt >= cutoff,
    );
    return [...r].sort((a, b) => (sort === "Newest" ? b.createdAt.localeCompare(a.createdAt) : b.value - a.value));
  }, [enquiries, q, stage, owner, source, date, sort]);

  const patch = (id: string, p: Partial<Enquiry>, msg: string) => {
    setEnquiries((es) => es.map((e) => (e.id === id ? { ...e, ...p, lastContact: TODAY } : e)));
    setView((v) => (v && v.id === id ? { ...v, ...p } : v));
    toast.success(msg);
  };

  const convert = (e: Enquiry) => {
    const id = nextId("TRP", trips.map((t) => t.id));
    setTrips((ts) => [{ id, customer: e.company, type: "FTL", origin: e.origin, destination: e.destination, pickup: "2026-10-12", eta: "2026-10-13", driver: "Unassigned", vehicle: "—", status: "Scheduled", sla: "On Track", progress: 0 }, ...ts]);
    patch(e.id, { stage: "Converted", nextFollowUp: "—" }, `${e.company} converted — trip ${id} created`);
  };

  const open = enquiries.filter((e) => e.stage !== "Converted");

  return (
    <>
      <PageHeader
        title="Enquiries / CRM"
        subtitle="B2B lead pipeline from first touch to converted trip."
        actions={
          <>
            <Button variant="outline" onClick={() => { downloadCsv("hired-enquiries.csv", rows as unknown as Record<string, unknown>[]); toast.success(`Exported ${rows.length} enquiries`); }}><Download className="size-4" />Export</Button>
            <Button onClick={() => setForm("new")}>+ Add Enquiry</Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Open Enquiries" value={open.length} icon={Inbox} />
        <Kpi label="Needs Follow-Up" value={open.filter((e) => e.nextFollowUp <= TODAY).length} icon={PhoneCall} tone="warning" />
        <Kpi label="Qualified Pipeline" value={enquiries.filter((e) => e.stage === "Qualified").length} icon={Target} tone="success" />
        <Kpi label="Unassigned Owner" value={open.filter((e) => e.owner === "Unassigned").length} icon={UserX} tone="danger" />
      </div>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center gap-2 border-b p-4">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search enquiries" className="h-9 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <NativeSelect label="Stage" value={stage} onChange={setStage} options={["All stages", ...STAGES]} />
          <NativeSelect label="Owner" value={owner} onChange={setOwner} options={["All owners", ...OWNERS]} />
          <NativeSelect label="Source" value={source} onChange={setSource} options={["All sources", ...SOURCES]} />
          <NativeSelect label="Date" value={date} onChange={setDate} options={["Any date", "Last 7 days", "Last 30 days"]} />
          <NativeSelect label="Sort" value={sort} onChange={setSort} options={["Newest", "Highest value"]} />
          <div className="flex rounded-lg border p-0.5">
            {([["table", LayoutList], ["kanban", Columns3]] as const).map(([m, I]) => (
              <button key={m} aria-label={`${m} view`} onClick={() => setMode(m)} className={cn("rounded-md p-1.5", mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground")}><I className="size-4" /></button>
            ))}
          </div>
        </div>

        {mode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50"><tr>{["ID", "Company", "Contact", "Route", "Est. value", "Source", "Owner", "Stage", "Last contact", "Next follow-up", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {rows.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/40">
                    <td className={cn(td, "font-medium text-primary")}><button onClick={() => setView(e)}>{e.id}</button></td>
                    <td className={cn(td, "font-medium")}>{e.company}</td>
                    <td className={td}>{e.contact}</td>
                    <td className={td}>{e.origin} → {e.destination}</td>
                    <td className={td}>{fmtL(e.value)}/mo</td>
                    <td className={td}>{e.source}</td>
                    <td className={td}><select aria-label="Owner" value={e.owner} onChange={(ev) => patch(e.id, { owner: ev.target.value }, `Owner set to ${ev.target.value}`)} className={cn("rounded-md border bg-card px-2 py-1 text-xs", e.owner === "Unassigned" && "text-danger")}>{OWNERS.map((o) => <option key={o}>{o}</option>)}</select></td>
                    <td className={td}><select aria-label="Stage" value={e.stage} onChange={(ev) => patch(e.id, { stage: ev.target.value as Stage }, `Moved to ${ev.target.value}`)} className="rounded-md border bg-card px-2 py-1 text-xs">{STAGES.map((s) => <option key={s}>{s}</option>)}</select></td>
                    <td className={td}>{e.lastContact}</td>
                    <td className={cn(td, e.nextFollowUp <= TODAY && e.stage !== "Converted" && "font-medium text-warning")}>{e.nextFollowUp}</td>
                    <td className={td}>
                      <div className="flex gap-1">
                        <button aria-label="Edit" onClick={() => setForm(e)} className="rounded-md p-1.5 hover:bg-muted"><Pencil className="size-4" /></button>
                        {e.stage === "Qualified" && <button aria-label="Convert to trip" onClick={() => convert(e)} className="rounded-md p-1.5 text-success hover:bg-success-soft"><ArrowRightCircle className="size-4" /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan={11} className="py-10 text-center text-sm text-muted-foreground">No enquiries match your filters.</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
            {STAGES.map((s) => {
              const col = rows.filter((e) => e.stage === s);
              return (
                <div key={s} className="rounded-xl bg-muted/50 p-3">
                  <div className="mb-3 flex items-center justify-between"><Pill tone={stageTone[s]}>{s}</Pill><span className="text-xs text-muted-foreground">{col.length} · {fmtL(col.reduce((a, e) => a + e.value, 0))}</span></div>
                  <div className="space-y-2">
                    {col.map((e) => (
                      <div key={e.id} className="rounded-xl border bg-card p-3 shadow-sm">
                        <button onClick={() => setView(e)} className="text-left">
                          <p className="text-sm font-medium">{e.company}</p>
                          <p className="text-xs text-muted-foreground">{e.origin} → {e.destination}</p>
                        </button>
                        <div className="mt-2 flex items-center justify-between text-xs"><span className="font-semibold">{fmtL(e.value)}/mo</span><span className="text-muted-foreground">{e.owner}</span></div>
                        <div className="mt-2 flex gap-1">
                          {STAGES.indexOf(s) < 3 && s !== "Qualified" && <button onClick={() => patch(e.id, { stage: STAGES[STAGES.indexOf(s) + 1] as Stage }, `Moved to ${STAGES[STAGES.indexOf(s) + 1]}`)} className="rounded-md border px-2 py-1 text-xs hover:bg-muted">Advance →</button>}
                          {s === "Qualified" && <button onClick={() => convert(e)} className="rounded-md bg-success px-2 py-1 text-xs font-medium text-primary-foreground">Convert to trip</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <EnquiryForm
        value={form}
        onClose={() => setForm(null)}
        onSave={(e) => {
          if (form === "new") {
            const id = nextId("ENQ", enquiries.map((x) => x.id));
            setEnquiries((es) => [{ ...e, id, createdAt: TODAY, lastContact: TODAY }, ...es]);
            toast.success(`Enquiry ${id} added`);
          } else {
            setEnquiries((es) => es.map((x) => (x.id === e.id ? e : x)));
            toast.success(`${e.id} updated`);
          }
          setForm(null);
        }}
      />

      <Sheet open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {view && (
            <>
              <SheetHeader><SheetTitle>{view.company}</SheetTitle><Pill tone={stageTone[view.stage]}>{view.stage}</Pill></SheetHeader>
              <dl className="grid grid-cols-2 gap-4 px-4 text-sm">
                {[["Enquiry ID", view.id], ["Contact", view.contact], ["Route", `${view.origin} → ${view.destination}`], ["Est. value", `${fmtL(view.value)}/mo`], ["Source", view.source], ["Owner", view.owner], ["Last contact", view.lastContact], ["Next follow-up", view.nextFollowUp]].map(([k, v]) => (
                  <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-2 px-4 pt-4">
                <Button variant="outline" onClick={() => { setForm(view); setView(null); }}>Edit</Button>
                {view.stage === "Qualified" && <Button onClick={() => convert(view)}>Convert to trip</Button>}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

const empty: Enquiry = { id: "", company: "", contact: "", origin: "", destination: "", value: 0, source: "Website", owner: "Unassigned", stage: "New", lastContact: TODAY, nextFollowUp: "2026-10-12", createdAt: TODAY };

function EnquiryForm({ value, onClose, onSave }: { value: Enquiry | "new" | null; onClose: () => void; onSave: (e: Enquiry) => void }) {
  const [f, setF] = useState(empty);
  useEffect(() => { if (value) setF(value === "new" ? empty : value); }, [value]);
  const set = <K extends keyof Enquiry>(k: K, v: Enquiry[K]) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Dialog open={!!value} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{value === "new" ? "Add Enquiry" : `Edit ${f.id}`}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>Company</Label><Input value={f.company} onChange={(e) => set("company", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Contact person</Label><Input value={f.contact} onChange={(e) => set("contact", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Origin</Label><Input value={f.origin} onChange={(e) => set("origin", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Destination</Label><Input value={f.destination} onChange={(e) => set("destination", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Est. value (₹ L/mo)</Label><Input type="number" value={f.value} onChange={(e) => set("value", Number(e.target.value))} /></div>
          <div className="space-y-1.5"><Label>Next follow-up</Label><Input type="date" value={f.nextFollowUp} onChange={(e) => set("nextFollowUp", e.target.value)} /></div>
          <div className="flex flex-col space-y-1.5"><Label>Source</Label><NativeSelect label="Source" value={f.source} onChange={(v) => set("source", v)} options={SOURCES} /></div>
          <div className="flex flex-col space-y-1.5"><Label>Owner</Label><NativeSelect label="Owner" value={f.owner} onChange={(v) => set("owner", v)} options={OWNERS} /></div>
          <div className="flex flex-col space-y-1.5"><Label>Stage</Label><NativeSelect label="Stage" value={f.stage} onChange={(v) => set("stage", v as Stage)} options={STAGES} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => (f.company && f.origin && f.destination ? onSave(f) : toast.error("Company and route are required"))}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
