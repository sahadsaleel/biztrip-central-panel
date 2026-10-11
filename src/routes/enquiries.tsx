import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Inbox, PhoneCall, Target, UserX, Search, Download, LayoutList, Pencil, Plus, Sparkles, Route as RouteIcon, ArrowRightLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, nextId, downloadCsv } from "@/lib/store";
import { OWNERS, SOURCES, STAGES, fmtL, type Enquiry, type Stage } from "@/lib/mock-data";
import { Pill, NativeSelect, stageTone } from "@/components/hired/ui";
import { cn } from "@/lib/utils";
import { inr } from "@/lib/invoices";
import { OverviewHeader, OverviewMetric, OverviewPanel } from "@/components/hired/OverviewUI";

export const Route = createFileRoute("/enquiries")({
  head: () => ({
    meta: [
      { title: "Enquiries / CRM — HireD Ops" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      <div className="overview-page">
      <OverviewHeader title="Enquiries / CRM" badge={<Pill tone="primary">{open.length} active</Pill>} subtitle="B2B lead pipeline from first touch to converted trip." actions={<><NativeSelect label="Date" value={date} onChange={setDate} options={["Any date", "Last 7 days", "Last 30 days"]} /><Button onClick={() => setForm("new")}><Plus />Add Enquiry</Button></>} />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <OverviewMetric label="Open Enquiries" value={open.length} icon={Inbox} detail="across all sources" />
        <OverviewMetric label="Needs Follow-Up" value={open.filter((e) => e.nextFollowUp <= TODAY).length} icon={PhoneCall} tone="warning" detail="to contact, awaiting reply" trend="Action required" />
        <OverviewMetric label="Qualified Pipeline" value={enquiries.filter((e) => e.stage === "Qualified").length} icon={Target} tone="success" detail="ready to convert" trend={`${fmtL(enquiries.filter((e) => e.stage === "Qualified").reduce((sum, e) => sum + e.value, 0))}/mo`} />
        <OverviewMetric label="Unassigned Owner" value={open.filter((e) => e.owner === "Unassigned").length} icon={UserX} tone="danger" detail="assign an ops owner" trend="Needs attention" />
      </div>
      <OverviewPanel title="Lead Pipeline" icon={Sparkles} subtitle={`${rows.length} shown`} className="mt-5" actions={<div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search enquiries" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Company, contact or lane" className="h-8 border-0 bg-primary-soft pl-9 text-xs" /></div>}>
        <div className="flex flex-wrap gap-2 px-5 pb-4">{["All sources", ...SOURCES].map((s) => <Button key={s} size="sm" variant={source === s ? "default" : "secondary"} className="h-7 rounded-full px-3 text-[11px]" onClick={() => setSource(s)}>{s}</Button>)}</div>
        <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2 xl:grid-cols-4">{STAGES.map((s) => { const col = rows.filter((e) => e.stage === s); return <div key={s} className="min-w-0 rounded-lg bg-background p-3"><div className="mb-3 flex items-center justify-between"><h3 className="flex items-center gap-2 text-[10px] font-semibold uppercase"><span className={cn("size-1.5 rounded-full", s === "Converted" ? "bg-success" : s === "Qualified" ? "bg-primary" : s === "Contacted" ? "bg-warning" : "bg-info")} />{s}</h3><span className="grid size-5 place-items-center rounded-full bg-card text-[10px] text-muted-foreground">{col.length}</span></div><div className="space-y-3">{col.map((e) => <div key={e.id} className="rounded-lg border border-border/50 bg-card p-3"><Button variant="link" onClick={() => setView(e)} className="h-auto w-full justify-start overflow-hidden p-0 text-xs font-semibold text-foreground"><span className="truncate">{e.company}</span></Button><p className="mt-2 flex items-start gap-1.5 text-[10px] text-muted-foreground"><RouteIcon className="mt-0.5 size-3 shrink-0" />{e.origin} → {e.destination}</p><p className="mt-2 text-base font-semibold">{inr(e.value * 100000)}<span className="ml-1 text-[10px] font-normal text-muted-foreground">/ mo</span></p><div className="mt-2 flex items-center justify-between gap-1 text-[10px] text-muted-foreground"><span>{e.source}</span><span>{e.lastContact.slice(5)}</span></div><p className={cn("mt-2 truncate text-[10px]", e.owner === "Unassigned" ? "text-danger" : "text-muted-foreground")}>{e.owner}</p>{s === "Qualified" ? <Button variant="secondary" size="sm" className="mt-3 h-7 w-full text-[10px] text-primary" onClick={() => convert(e)}><ArrowRightLeft />Convert to Trip</Button> : s === "Converted" ? <div className="mt-3 flex h-7 items-center justify-center gap-1 rounded bg-success-soft text-[10px] text-success"><CheckCircle2 className="size-3" />Converted</div> : <Button variant="secondary" size="sm" className="mt-3 h-7 w-full text-[10px] text-primary" onClick={() => patch(e.id, { stage: s === "New" ? "Contacted" : "Qualified" }, `Moved to ${s === "New" ? "Contacted" : "Qualified"}`)}><ArrowRight />{s === "New" ? "Mark contacted" : "Qualify lead"}</Button>}</div>)}{!col.length && <p className="py-8 text-center text-[11px] text-muted-foreground">No enquiries</p>}</div></div>; })}</div>
      </OverviewPanel>
      <OverviewPanel title="All Enquiries" icon={LayoutList} subtitle={`${rows.length} total`} className="mt-5" actions={<Button variant="secondary" size="sm" onClick={() => { downloadCsv("hired-enquiries.csv", rows as unknown as Record<string, unknown>[]); toast.success(`Exported ${rows.length} enquiries`); }}><Download />Export CSV</Button>}>
        <div className="flex flex-wrap gap-2 border-t border-background px-5 py-3"><NativeSelect label="Stage" value={stage} onChange={setStage} options={["All stages", ...STAGES]} /><NativeSelect label="Owner" value={owner} onChange={setOwner} options={["All owners", ...OWNERS]} /><NativeSelect label="Sort" value={sort} onChange={setSort} options={["Newest", "Highest value"]} /></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[800px]"><thead><tr>{["Enquiry", "Contact", "Lane & rate", "Source", "Owner", "Stage", "Action"].map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((e) => <tr key={e.id} className="hover:bg-background"><td><Button variant="link" className="h-auto p-0 text-xs font-semibold text-foreground" onClick={() => setView(e)}>{e.id}</Button><p className="mt-1 max-w-32 text-[11px] text-muted-foreground">{e.company}</p></td><td><p className="text-xs font-medium">{e.contact}</p><p className="mt-1 text-[10px] text-muted-foreground">Last contact {e.lastContact.slice(5)}</p></td><td><p className="text-xs">{e.origin} → {e.destination}</p><p className="mt-1 text-[10px] text-muted-foreground">{inr(e.value * 100000)} / mo</p></td><td>{e.source}</td><td><select aria-label={`Owner for ${e.id}`} value={e.owner} onChange={(ev) => patch(e.id, { owner: ev.target.value }, `Owner set to ${ev.target.value}`)} className={cn("max-w-32 rounded border-0 bg-transparent py-1 text-[11px]", e.owner === "Unassigned" && "font-semibold text-danger")}>{OWNERS.map((o) => <option key={o}>{o}</option>)}</select></td><td><select aria-label={`Stage for ${e.id}`} value={e.stage} onChange={(ev) => patch(e.id, { stage: ev.target.value as Stage }, `Moved to ${ev.target.value}`)} className="max-w-28 rounded-full border-0 bg-primary-soft px-2 py-1 text-[10px] text-primary">{STAGES.map((s) => <option key={s}>{s}</option>)}</select></td><td><div className="flex items-center gap-1">{e.stage === "Qualified" ? <Button size="sm" onClick={() => convert(e)}><ArrowRightLeft />Convert to Trip</Button> : e.stage === "Converted" ? <span className="text-[11px] text-muted-foreground">Converted</span> : <Button variant="secondary" size="sm" onClick={() => setView(e)}>View lead</Button>}<Button variant="ghost" size="icon" className="size-7" aria-label={`Edit ${e.id}`} title="Edit enquiry" onClick={() => setForm(e)}><Pencil /></Button></div></td></tr>)}{!rows.length && <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">No enquiries match your filters.</td></tr>}</tbody></table></div>
        <div className="border-t border-background px-5 py-4 text-[11px] text-muted-foreground">Showing {rows.length} of {enquiries.length} total CRM enquiries</div>
      </OverviewPanel>
      </div>

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
