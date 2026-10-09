import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore, nextId } from "@/lib/store";
import { DRIVERS, TRIP_STATUSES, type Trip } from "@/lib/mock-data";
import { NativeSelect } from "./ui";

const blank = (): Omit<Trip, "id"> => ({
  customer: "", type: "FTL", origin: "", destination: "", pickup: "2026-10-10", eta: "2026-10-11",
  driver: "Unassigned", vehicle: "—", status: "Scheduled", sla: "On Track", progress: 0,
});

export function TripFormDialog({ open, onOpenChange, trip, prefill }: { open: boolean; onOpenChange: (v: boolean) => void; trip?: Trip | undefined; prefill?: Partial<Trip> | undefined }) {
  const { trips, setTrips, accounts } = useStore();
  const [f, setF] = useState(blank());
  useEffect(() => {
    if (open) setF(trip ? { ...trip } : { ...blank(), ...prefill });
  }, [open, trip, prefill]);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    if (!f.customer || !f.origin || !f.destination) return toast.error("Customer, origin and destination are required");
    if (trip) {
      setTrips((ts) => ts.map((t) => (t.id === trip.id ? { ...t, ...f } : t)));
      toast.success(`${trip.id} updated`);
    } else {
      const id = nextId("TRP", trips.map((t) => t.id));
      setTrips((ts) => [{ id, ...f }, ...ts]);
      toast.success(`Trip ${id} created`);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{trip ? `Edit ${trip.id}` : "Create New Trip"}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 space-y-1.5">
            <Label>Customer</Label>
            <Input list="hired-customers" value={f.customer} onChange={(e) => set("customer", e.target.value)} />
            <datalist id="hired-customers">{accounts.map((a) => <option key={a.id} value={a.name} />)}</datalist>
          </div>
          <div className="space-y-1.5"><Label>Origin</Label><Input value={f.origin} onChange={(e) => set("origin", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Destination</Label><Input value={f.destination} onChange={(e) => set("destination", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Pickup</Label><Input type="date" value={f.pickup} onChange={(e) => set("pickup", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>ETA</Label><Input type="date" value={f.eta} onChange={(e) => set("eta", e.target.value)} /></div>
          <div className="space-y-1.5 flex flex-col"><Label>Trip type</Label><NativeSelect label="Trip type" value={f.type} onChange={(v) => set("type", v as Trip["type"])} options={["FTL", "PTL", "Express"]} /></div>
          <div className="space-y-1.5 flex flex-col"><Label>Status</Label><NativeSelect label="Status" value={f.status} onChange={(v) => set("status", v as Trip["status"])} options={TRIP_STATUSES} /></div>
          <div className="space-y-1.5 flex flex-col"><Label>Driver</Label><NativeSelect label="Driver" value={f.driver} onChange={(v) => set("driver", v)} options={["Unassigned", ...DRIVERS]} /></div>
          <div className="space-y-1.5"><Label>Vehicle</Label><Input value={f.vehicle} onChange={(e) => set("vehicle", e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save}>{trip ? "Save changes" : "Create trip"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
