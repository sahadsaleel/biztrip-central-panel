import { useState, useMemo } from "react";
import { UserCheck, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import type { Trip } from "@/types/trip.types";

export interface AssignDriverModalProps {
  trip: Trip | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updatedTrip: Trip) => void;
}

export function AssignDriverModal({ trip, open, onOpenChange, onSuccess }: AssignDriverModalProps) {
  const { drivers, setDrivers, vehicles, setVehicles, setTrips, logActivity } = useStore();

  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [vehicleClassFilter, setVehicleClassFilter] = useState<string>("All");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);

  // Available drivers filtered by status
  const eligibleDrivers = useMemo(() => {
    return drivers.filter((d) => {
      if (onlyAvailable && d.availability !== "Available") return false;
      return true;
    });
  }, [drivers, onlyAvailable]);

  // Eligible vehicles filtered by class & availability
  const eligibleVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (onlyAvailable && v.availability !== "Available") return false;
      if (vehicleClassFilter !== "All" && v.type !== vehicleClassFilter) return false;
      return true;
    });
  }, [vehicles, onlyAvailable, vehicleClassFilter]);

  if (!trip) return null;

  const handleAssign = () => {
    const driver = drivers.find((d) => d.id === selectedDriverId);
    const vehicle = vehicles.find((v) => v.id === selectedVehicleId);

    if (!driver) {
      toast.error("Please select a qualified driver");
      return;
    }

    const assignedVehicleReg = vehicle?.regNumber || driver.assignedVehicle || "DL 01 AB 4521";

    const updatedTrip: Trip = {
      ...trip,
      driver: driver.name,
      vehicle: assignedVehicleReg,
      status: trip.status === "Scheduled" ? "Scheduled" : "In Progress",
    };

    // Update trip in store
    setTrips((prev) => prev.map((t) => (t.id === trip.id ? updatedTrip : t)));

    // Mark driver as On Trip
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driver.id
          ? {
              ...d,
              availability: "On Trip",
              currentTrip: trip.id,
              assignedVehicle: assignedVehicleReg,
            }
          : d,
      ),
    );

    // Mark vehicle as On Trip if selected
    if (vehicle) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicle.id
            ? { ...v, availability: "On Trip", currentTrip: trip.id, assignedDriver: driver.name }
            : v,
        ),
      );
    }

    logActivity({
      user: "Ops Dispatcher",
      module: "Trips",
      action: "Driver Assigned",
      recordId: trip.id,
      description: `Assigned driver ${driver.name} and vehicle ${assignedVehicleReg} to trip ${trip.id} (${trip.origin} → ${trip.destination})`,
      badgeTone: "success",
    });

    toast.success(`Driver ${driver.name} successfully assigned to ${trip.id}!`);
    onOpenChange(false);
    onSuccess?.(updatedTrip);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCheck className="size-4" />
            </div>
            <div>
              <DialogTitle>Assign Driver & Fleet Asset</DialogTitle>
              <DialogDescription className="text-xs">
                Dispatch verified driver and vehicle class for trip {trip.id} ({trip.customer}).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Trip Summary Card */}
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Route:</span>{" "}
                <span className="font-semibold text-foreground">
                  {trip.origin} → {trip.destination}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Freight Type:</span>{" "}
                <span className="font-medium text-foreground">{trip.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Scheduled Pickup:</span>{" "}
                <span className="font-medium text-foreground">{trip.pickup}</span>
              </div>
              <div>
                <span className="text-muted-foreground">ETA:</span>{" "}
                <span className="font-medium text-foreground">{trip.eta}</span>
              </div>
            </div>
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              Show only "Available" assets
            </label>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Vehicle Class:</span>
              <select
                value={vehicleClassFilter}
                onChange={(e) => setVehicleClassFilter(e.target.value)}
                className="h-7 rounded border border-input bg-background px-2 text-xs"
              >
                <option value="All">All Classes</option>
                <option value="Tata Ace">Tata Ace</option>
                <option value="14ft Eicher">14ft Eicher</option>
                <option value="20ft Container">20ft Container</option>
                <option value="32ft Multi-Axle">32ft Multi-Axle</option>
                <option value="Trailer 40ft">Trailer 40ft</option>
              </select>
            </div>
          </div>

          {/* Driver Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Select Verified Driver *</Label>
            <select
              value={selectedDriverId}
              onChange={(e) => {
                setSelectedDriverId(e.target.value);
                // Auto-pick driver's default vehicle if available
                const d = drivers.find((x) => x.id === e.target.value);
                if (d && d.assignedVehicle) {
                  const matchVeh = vehicles.find((v) => v.regNumber === d.assignedVehicle);
                  if (matchVeh) setSelectedVehicleId(matchVeh.id);
                }
              }}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">-- Choose Driver --</option>
              {eligibleDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.id}) — {d.availability} · {d.experienceYears}y exp · ★ {d.rating}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Select Assigned Vehicle</Label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">-- Choose Vehicle Asset --</option>
              {eligibleVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.regNumber} — {v.type} ({v.capacity}) · {v.availability} · {v.fuelType}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleAssign}
            disabled={!selectedDriverId}
            className="gap-1.5"
          >
            <CheckCircle2 className="size-3.5" />
            Confirm Dispatch Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
