import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileText, CheckCircle2, Clock, AlertTriangle, Search, Download, Eye, Printer, Wallet, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { downloadCsv, useStore } from "@/lib/store";
import { INVOICE_STATUSES, applyPayment, inr, invoices as seed, type Invoice } from "@/lib/invoices";
import { Kpi, Card, Pill, PageHeader, NativeSelect, th, td, type Tone } from "@/components/hired/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/invoicing")({
  head: () => ({
    meta: [
      { title: "Invoicing — HireD Ops" },
      { name: "description", content: "Manage sample invoices, payment records and outstanding balances." },
      { property: "og:title", content: "Invoicing — HireD Ops" },
      { property: "og:description", content: "Manage sample invoices, payment records and outstanding balances." },
    ],
  }),
  component: InvoicingPage,
});

const tone: Record<string, Tone> = { Draft: "muted", Issued: "info", "Partially Paid": "warning", Paid: "success", Overdue: "danger", Cancelled: "muted" };

function InvoicingPage() {
  const { accounts, trips } = useStore();
  const [list, setList] = useState(seed);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [view, setView] = useState<Invoice | null>(null);
  const [pay, setPay] = useState<Invoice | null>(null);
  const [amt, setAmt] = useState(0);
  const [form, setForm] = useState<Invoice | null>(null);

  const rows = useMemo(() => {
    const s = q.toLowerCase();
    return list.filter((i) => (status === "All" || i.status === status) && (!s || [i.id, i.customer, i.trip].some((v) => v.toLowerCase().includes(s))));
  }, [list, q, status]);

  const save = (inv: Invoice, msg: string) => {
    setList((l) => (l.some((x) => x.id === inv.id) ? l.map((x) => (x.id === inv.id ? inv : x)) : [inv, ...l]));
    setView((v) => (v && v.id === inv.id ? inv : v));
    toast.success(msg);
  };

  const newInvoice = (): Invoice => {
    const n = Math.max(...list.map((i) => parseInt(i.id.split("-")[2], 10))) + 1;
    return { id: `INV-24-${String(n).padStart(4, "0")}`, customer: accounts[0].name, trip: trips[0]?.id ?? "", issued: "2026-10-09", due: "2026-10-24", amount: 0, paid: 0, status: "Draft" };
  };

  const print = (i: Invoice) => {
    const w = window.open("", "_blank", "width=720,height=900");
    if (!w) return toast.error("Allow pop-ups to print");
    w.document.write(`<html><head><title>${i.id}</title></head><body style="font-family:Inter,sans-serif;padding:40px"><h1>HireD — Tax Invoice (Sample)</h1><p><b>${i.id}</b><br/>Billed to: ${i.customer}<br/>Trip: ${i.trip}<br/>Issued: ${i.issued} · Due: ${i.due}</p><hr/><p>Freight charges: ${inr(Math.round(i.amount / 1.18))}<br/>GST 18%: ${inr(i.amount - Math.round(i.amount / 1.18))}<br/><b>Total: ${inr(i.amount)}</b><br/>Paid: ${inr(i.paid)}<br/>Balance: ${inr(i.amount - i.paid)}</p><p style="color:#888">Sample document — not a real invoice.</p></body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <>
      <PageHeader
        title="Invoicing"
        subtitle="Manage sample invoices, payment records and outstanding balances."
        actions={
          <>
            <Button variant="outline" onClick={() => { downloadCsv("hired-invoices.csv", rows as unknown as Record<string, unknown>[]); toast.success(`Exported ${rows.length} invoices`); }}><Download className="size-4" />Export</Button>
            <Button onClick={() => setForm(newInvoice())}>+ Create Invoice</Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total Invoiced" value="₹85.4 L" icon={FileText} />
        <Kpi label="Paid" value="₹46.8 L" icon={CheckCircle2} tone="success" />
        <Kpi label="Outstanding" value="₹38.6 L" icon={Clock} tone="warning" />
        <Kpi label="Overdue" value="₹12.4 L" icon={AlertTriangle} tone="danger" />
      </div>

      <Card className="mt-6">
        <div className="flex flex-wrap items-center gap-2 border-b p-4">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invoice, customer or trip" className="h-9 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["All", ...INVOICE_STATUSES].map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={cn("rounded-full border px-3 py-1 text-xs font-medium", status === s ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}>
                {s} <span className="opacity-70">{s === "All" ? list.length : list.filter((i) => i.status === s).length}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50"><tr>{["Invoice", "Customer", "Trip", "Issued", "Due", "Amount", "Paid", "Balance", "Status", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {rows.map((i) => (
                <tr key={i.id} className="hover:bg-muted/40">
                  <td className={cn(td, "font-medium text-primary")}><button onClick={() => setView(i)}>{i.id}</button></td>
                  <td className={td}>{i.customer}</td>
                  <td className={cn(td, "text-muted-foreground")}>{i.trip}</td>
                  <td className={td}>{i.issued}</td>
                  <td className={cn(td, i.status === "Overdue" && "text-danger")}>{i.due}</td>
                  <td className={cn(td, "font-medium")}>{inr(i.amount)}</td>
                  <td className={td}>{inr(i.paid)}</td>
                  <td className={cn(td, "font-medium")}>{inr(i.amount - i.paid)}</td>
                  <td className={td}><Pill tone={tone[i.status]}>{i.status}</Pill></td>
                  <td className={td}>
                    <div className="flex gap-1">
                      <button aria-label="View" onClick={() => setView(i)} className="rounded-md p-1.5 hover:bg-muted"><Eye className="size-4" /></button>
                      {i.status === "Draft" && <button aria-label="Edit draft" onClick={() => setForm(i)} className="rounded-md p-1.5 hover:bg-muted"><Pencil className="size-4" /></button>}
                      {["Issued", "Partially Paid", "Overdue"].includes(i.status) && <button aria-label="Record payment" onClick={() => { setPay(i); setAmt(i.amount - i.paid); }} className="rounded-md p-1.5 text-success hover:bg-success-soft"><Wallet className="size-4" /></button>}
                      <button aria-label="Print" onClick={() => print(i)} className="rounded-md p-1.5 hover:bg-muted"><Printer className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={10} className="py-10 text-center text-sm text-muted-foreground">No invoices match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      <Sheet open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {view && (
            <>
              <SheetHeader><SheetTitle>{view.id}</SheetTitle><Pill tone={tone[view.status]}>{view.status}</Pill></SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <div className="rounded-xl border p-5">
                  <div className="flex items-start justify-between">
                    <div><p className="text-lg font-bold">Hire<span className="text-primary">D</span></p><p className="text-xs text-muted-foreground">Tax invoice · sample preview</p></div>
                    <div className="text-right text-xs text-muted-foreground"><p>Issued {view.issued}</p><p>Due {view.due}</p></div>
                  </div>
                  <div className="mt-4 text-sm"><p className="text-xs text-muted-foreground">Billed to</p><p className="font-medium">{view.customer}</p><p className="text-xs text-muted-foreground">GSTIN {accounts.find((a) => a.name === view.customer)?.gstin ?? "—"}</p></div>
                  <table className="mt-4 w-full text-sm">
                    <tbody className="divide-y">
                      <tr><td className="py-2">Freight charges · {view.trip}</td><td className="py-2 text-right">{inr(Math.round(view.amount / 1.18))}</td></tr>
                      <tr><td className="py-2">GST @ 18%</td><td className="py-2 text-right">{inr(view.amount - Math.round(view.amount / 1.18))}</td></tr>
                      <tr className="font-semibold"><td className="py-2">Total</td><td className="py-2 text-right">{inr(view.amount)}</td></tr>
                      <tr><td className="py-2 text-muted-foreground">Paid</td><td className="py-2 text-right text-success">{inr(view.paid)}</td></tr>
                      <tr className="font-semibold"><td className="py-2">Balance due</td><td className="py-2 text-right">{inr(view.amount - view.paid)}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Update status</Label>
                  <NativeSelect label="Status" value={view.status} onChange={(v) => save({ ...view, status: v as Invoice["status"] }, `${view.id} → ${v}`)} options={INVOICE_STATUSES} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Issued", "Partially Paid", "Overdue"].includes(view.status) && <Button onClick={() => { setPay(view); setAmt(view.amount - view.paid); }}><Wallet className="size-4" />Record payment</Button>}
                  {view.status === "Draft" && <Button variant="outline" onClick={() => { setForm(view); setView(null); }}>Edit draft</Button>}
                  <Button variant="outline" onClick={() => print(view)}><Printer className="size-4" />Print / Download</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!pay} onOpenChange={(o) => !o && setPay(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record payment · {pay?.id}</DialogTitle>
            <DialogDescription>Simulation only — no real money moves. Balance {pay && inr(pay.amount - pay.paid)}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" value={amt} onChange={(e) => setAmt(Number(e.target.value))} /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPay(null)}>Cancel</Button>
            <Button onClick={() => { if (pay) save(applyPayment(pay, amt), `Simulated payment of ${inr(amt)} recorded`); setPay(null); }}>Record (simulated)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent>
          {form && (
            <>
              <DialogHeader><DialogTitle>{list.some((i) => i.id === form.id) ? `Edit ${form.id}` : "Create Invoice"}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 flex flex-col gap-1.5"><Label>Customer</Label><NativeSelect label="Customer" value={form.customer} onChange={(v) => setForm({ ...form, customer: v })} options={accounts.map((a) => a.name)} /></div>
                <div className="flex flex-col gap-1.5"><Label>Related trip</Label><NativeSelect label="Trip" value={form.trip} onChange={(v) => setForm({ ...form, trip: v })} options={trips.map((t) => t.id)} /></div>
                <div className="space-y-1.5"><Label>Amount incl. GST (₹)</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></div>
                <div className="space-y-1.5"><Label>Issue date</Label><Input type="date" value={form.issued} onChange={(e) => setForm({ ...form, issued: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Due date</Label><Input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { save(form, `${form.id} saved as draft`); setForm(null); }}>Save draft</Button>
                <Button onClick={() => { if (form.amount <= 0) { toast.error("Enter an amount"); return; } save({ ...form, status: "Issued" }, `${form.id} issued`); setForm(null); }}>Issue invoice</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
