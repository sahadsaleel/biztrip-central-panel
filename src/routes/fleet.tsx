import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Car,
  UserCheck,
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  Phone,
  FileCheck,
  Calendar,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore, nextId } from "@/lib/store";
import type { Driver, Vehicle } from "@/lib/mock-data";
import { DriverKYCReviewModal } from "@/features/drivers";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Drivers & Fleet — HireD Ops" },
      { name: "description", content: "Manage drivers, vehicles, and fleet assignments." },
    ],
  }),
  component: FleetPage,
});

function FleetPage() {
  const { drivers, setDrivers, vehicles, setVehicles, logActivity } = useStore();
  const [activeTab, setActiveTab] = useState<"drivers" | "vehicles">("drivers");
  const [query, setQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");

  // Modals & Drawers
  const [addDriverOpen, setAddDriverOpen] = useState(false);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [viewDriver, setViewDriver] = useState<Driver | null>(null);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  const [kycModalDriver, setKycModalDriver] = useState<Driver | null>(null);

  // New Driver Form state
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [driverVehicle, setDriverVehicle] = useState("");
  const [driverExp, setDriverExp] = useState(5);
  const [driverExpiry, setDriverExpiry] = useState("2028-06-30");

  // New Vehicle Form state
  const [vehReg, setVehReg] = useState("");
  const [vehType, setVehType] = useState<Vehicle["type"]>("32ft Multi-Axle");
  const [vehCapacity, setVehCapacity] = useState("18 Tonnes");
  const [vehDriver, setVehDriver] = useState("");
  const [vehExpiry, setVehExpiry] = useState("2028-01-15");
  const [vehFuel, setVehFuel] = useState<Vehicle["fuelType"]>("Diesel");

  // Filtered lists
  const filteredDrivers = drivers.filter((d) => {
    const matchesQ =
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.id.toLowerCase().includes(query.toLowerCase()) ||
      d.phone.includes(query) ||
      d.assignedVehicle.toLowerCase().includes(query.toLowerCase());
    const matchesAvail = availabilityFilter === "All" || d.availability === availabilityFilter;
    return matchesQ && matchesAvail;
  });

  const filteredVehicles = vehicles.filter((v) => {
    const matchesQ =
      v.regNumber.toLowerCase().includes(query.toLowerCase()) ||
      v.id.toLowerCase().includes(query.toLowerCase()) ||
      v.type.toLowerCase().includes(query.toLowerCase()) ||
      v.assignedDriver.toLowerCase().includes(query.toLowerCase());
    const matchesAvail = availabilityFilter === "All" || v.availability === availabilityFilter;
    return matchesQ && matchesAvail;
  });

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !driverPhone) {
      toast.error("Please fill in required driver details");
      return;
    }

    const newDriver: Driver = {
      id: nextId(
        "DRV",
        drivers.map((d) => d.id),
      ),
      name: driverName,
      phone: driverPhone,
      assignedVehicle: driverVehicle || "Unassigned",
      currentTrip: "—",
      availability: "Available",
      licenseExpiry: driverExpiry,
      experienceYears: Number(driverExp) || 3,
      rating: 4.8,
    };

    setDrivers([newDriver, ...drivers]);
    logActivity({
      user: "Admin / Ops",
      module: "Fleet",
      action: "Driver Added",
      recordId: newDriver.id,
      description: `Added driver ${newDriver.name} (${newDriver.id}).`,
      badgeTone: "success",
    });

    toast.success(`Driver ${newDriver.name} added`);
    setAddDriverOpen(false);
    setDriverName("");
    setDriverPhone("");
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehReg) {
      toast.error("Please provide vehicle registration number");
      return;
    }

    const newVeh: Vehicle = {
      id: nextId(
        "VEH",
        vehicles.map((v) => v.id),
      ),
      regNumber: vehReg.toUpperCase(),
      type: vehType,
      capacity: vehCapacity,
      assignedDriver: vehDriver || "Unassigned",
      currentTrip: "—",
      availability: "Available",
      documentExpiry: vehExpiry,
      fuelType: vehFuel,
    };

    setVehicles([newVeh, ...vehicles]);
    logActivity({
      user: "Admin / Ops",
      module: "Fleet",
      action: "Vehicle Added",
      recordId: newVeh.id,
      description: `Registered vehicle ${newVeh.regNumber} (${newVeh.type}).`,
      badgeTone: "success",
    });

    toast.success(`Vehicle ${newVeh.regNumber} registered`);
    setAddVehicleOpen(false);
    setVehReg("");
  };

  const updateDriverStatus = (d: Driver, availability: Driver["availability"]) => {
    setDrivers(drivers.map((item) => (item.id === d.id ? { ...item, availability } : item)));
    logActivity({
      user: "Admin / Ops",
      module: "Fleet",
      action: "Driver Status",
      recordId: d.id,
      description: `Updated availability of ${d.name} to ${availability}.`,
      badgeTone: "info",
    });
    toast.success(`${d.name} availability: ${availability}`);
  };

  const updateVehicleStatus = (v: Vehicle, availability: Vehicle["availability"]) => {
    setVehicles(vehicles.map((item) => (item.id === v.id ? { ...item, availability } : item)));
    logActivity({
      user: "Admin / Ops",
      module: "Fleet",
      action: "Vehicle Status",
      recordId: v.id,
      description: `Updated vehicle ${v.regNumber} status to ${availability}.`,
      badgeTone: "info",
    });
    toast.success(`${v.regNumber} status: ${availability}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Drivers & Fleet</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage drivers, heavy vehicles, trip assignments, and compliance documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "drivers" ? (
            <Button
              size="sm"
              onClick={() => setAddDriverOpen(true)}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Plus className="size-3.5" />
              Add Driver
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => setAddVehicleOpen(true)}
              className="h-8 gap-1.5 text-xs font-semibold"
            >
              <Plus className="size-3.5" />
              Add Vehicle
            </Button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards (Total Drivers: 32, Available: 12, On Trip: 18, Inactive: 2) */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Drivers</span>
            <UserCheck className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">32</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Active fleet operators</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Available Drivers</span>
            <CheckCircle className="size-4 text-success" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">12</p>
          <p className="mt-1 text-[11px] text-success">Ready for assignment</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">On Active Trip</span>
            <Truck className="size-4 text-info" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">18</p>
          <p className="mt-1 text-[11px] text-muted-foreground">In-transit across corridors</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Inactive / Off Duty</span>
            <AlertTriangle className="size-4 text-warning" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">2</p>
          <p className="mt-1 text-[11px] text-muted-foreground">Leave or licence renewal</p>
        </div>
      </div>

      {/* Switchable Tabs: Drivers vs Vehicles */}
      <div className="flex items-center justify-between border-b border-border">
        <div className="flex">
          <button
            onClick={() => {
              setActiveTab("drivers");
              setAvailabilityFilter("All");
            }}
            className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "drivers"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Drivers ({drivers.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("vehicles");
              setAvailabilityFilter("All");
            }}
            className={`px-5 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === "vehicles"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Vehicles ({vehicles.length})
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              activeTab === "drivers"
                ? "Search driver name, ID, or vehicle..."
                : "Search registration no, type, or driver..."
            }
            className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Filter className="size-3.5" />
                Availability: {availabilityFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["All", "Available", "On Trip", "Off Duty", "Maintenance", "Inactive"].map((s) => (
                <DropdownMenuItem key={s} onClick={() => setAvailabilityFilter(s)}>
                  {s} {availabilityFilter === s ? "✓" : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tab 1: DRIVERS TABLE */}
      {activeTab === "drivers" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Driver Name & ID</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Assigned Vehicle</th>
                  <th className="px-4 py-3">Current Trip</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3">KYC Status</th>
                  <th className="px-4 py-3">Licence Expiry</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDrivers.map((d) => {
                  const kyc = d.kycStatus || (d.rating >= 4.5 ? "Verified" : "Pending Review");
                  return (
                    <tr key={d.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{d.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {d.id} · ★ {d.rating}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{d.phone}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{d.assignedVehicle}</td>
                      <td className="px-4 py-3">
                        {d.currentTrip !== "—" ? (
                          <span className="font-semibold text-primary">{d.currentTrip}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            d.availability === "Available"
                              ? "bg-success/15 text-success"
                              : d.availability === "On Trip"
                                ? "bg-primary-soft text-primary"
                                : d.availability === "Off Duty"
                                  ? "bg-warning/15 text-warning"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          ● {d.availability}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setKycModalDriver(d)}
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border transition-colors ${
                            kyc === "Verified"
                              ? "bg-success/10 text-success border-success/30 hover:bg-success/20"
                              : kyc === "Rejected"
                                ? "bg-danger/10 text-danger border-danger/30 hover:bg-danger/20"
                                : "bg-warning/10 text-warning border-warning/30 hover:bg-warning/20"
                          }`}
                        >
                          <ShieldCheck className="size-3" />
                          {kyc}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{d.licenseExpiry}</td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7">
                              <MoreVertical className="size-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem onClick={() => setViewDriver(d)}>
                              View Driver Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setKycModalDriver(d)}>
                              Review KYC Documents
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditDriver(d)}>
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateDriverStatus(d, "Available")}>
                              Set Available
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateDriverStatus(d, "On Trip")}>
                              Set On Trip
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateDriverStatus(d, "Off Duty")}>
                              Set Off Duty
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
                {filteredDrivers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs text-muted-foreground">
                      No drivers match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: VEHICLES TABLE */}
      {activeTab === "vehicles" && (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Reg Number & ID</th>
                  <th className="px-4 py-3">Vehicle Type</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Assigned Driver</th>
                  <th className="px-4 py-3">Current Trip</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3">Document Expiry</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{v.regNumber}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {v.id} · {v.fuelType}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">{v.type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.capacity}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{v.assignedDriver}</td>
                    <td className="px-4 py-3">
                      {v.currentTrip !== "—" ? (
                        <span className="font-semibold text-primary">{v.currentTrip}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          v.availability === "Available"
                            ? "bg-success/15 text-success"
                            : v.availability === "On Trip"
                              ? "bg-primary-soft text-primary"
                              : v.availability === "Maintenance"
                                ? "bg-warning/15 text-warning"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        ● {v.availability}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{v.documentExpiry}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7">
                            <MoreVertical className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem onClick={() => setViewVehicle(v)}>
                            View Vehicle Info
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditVehicle(v)}>
                            Edit Registration
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateVehicleStatus(v, "Available")}>
                            Set Available
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateVehicleStatus(v, "Maintenance")}>
                            Mark Maintenance
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredVehicles.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs text-muted-foreground">
                      No vehicles match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      <Dialog open={addDriverOpen} onOpenChange={setAddDriverOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add New Fleet Driver</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDriver} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Driver Full Name *</label>
              <input
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g. Balwinder Singh"
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Phone Number *</label>
              <input
                required
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Assigned Vehicle</label>
                <input
                  value={driverVehicle}
                  onChange={(e) => setDriverVehicle(e.target.value)}
                  placeholder="e.g. DL 01 AB 4521"
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Experience (Years)</label>
                <input
                  type="number"
                  value={driverExp}
                  onChange={(e) => setDriverExp(Number(e.target.value))}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">
                Commercial Licence Expiry
              </label>
              <input
                type="date"
                value={driverExpiry}
                onChange={(e) => setDriverExpiry(e.target.value)}
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
              />
            </div>
            <DialogFooter className="mt-5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddDriverOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save Driver
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Vehicle Modal */}
      <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Register New Vehicle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground">Registration Number *</label>
              <input
                required
                value={vehReg}
                onChange={(e) => setVehReg(e.target.value)}
                placeholder="e.g. KA 01 MJ 8820"
                className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none uppercase focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Vehicle Type</label>
                <select
                  value={vehType}
                  onChange={(e) => setVehType(e.target.value as Vehicle["type"])}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                >
                  <option value="32ft Multi-Axle">32ft Multi-Axle</option>
                  <option value="20ft Container">20ft Container</option>
                  <option value="14ft Eicher">14ft Eicher</option>
                  <option value="Trailer 40ft">Trailer 40ft</option>
                  <option value="Tata Ace">Tata Ace</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Payload Capacity</label>
                <input
                  value={vehCapacity}
                  onChange={(e) => setVehCapacity(e.target.value)}
                  placeholder="e.g. 15 Tonnes"
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground">Fuel Type</label>
                <select
                  value={vehFuel}
                  onChange={(e) => setVehFuel(e.target.value as Vehicle["fuelType"])}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground">Fitness Expiry</label>
                <input
                  type="date"
                  value={vehExpiry}
                  onChange={(e) => setVehExpiry(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                />
              </div>
            </div>
            <DialogFooter className="mt-5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddVehicleOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Register Vehicle
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Driver Detail Drawer */}
      <Sheet open={!!viewDriver} onOpenChange={(o) => !o && setViewDriver(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {viewDriver && (
            <div className="space-y-5">
              <SheetHeader>
                <SheetTitle className="text-base font-bold">
                  Driver Profile: {viewDriver.name}
                </SheetTitle>
              </SheetHeader>
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Driver ID</span>
                  <span className="font-semibold">{viewDriver.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-semibold">{viewDriver.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold text-warning">★ {viewDriver.rating} / 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-semibold">{viewDriver.experienceYears} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Vehicle</span>
                  <span className="font-semibold">{viewDriver.assignedVehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Trip</span>
                  <span className="font-semibold text-primary">{viewDriver.currentTrip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Licence Expiry</span>
                  <span className="font-semibold">{viewDriver.licenseExpiry}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={() => setKycModalDriver(viewDriver)} className="w-full gap-1.5">
                  <ShieldCheck className="size-4" />
                  Review KYC Documents & Dossier
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Vehicle Detail Drawer */}
      <Sheet open={!!viewVehicle} onOpenChange={(o) => !o && setViewVehicle(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {viewVehicle && (
            <div className="space-y-5">
              <SheetHeader>
                <SheetTitle className="text-base font-bold">
                  Vehicle: {viewVehicle.regNumber}
                </SheetTitle>
              </SheetHeader>
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle ID</span>
                  <span className="font-semibold">{viewVehicle.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle Type</span>
                  <span className="font-semibold">{viewVehicle.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-semibold">{viewVehicle.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fuel</span>
                  <span className="font-semibold">{viewVehicle.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Driver</span>
                  <span className="font-semibold">{viewVehicle.assignedDriver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Status</span>
                  <span className="font-semibold">{viewVehicle.availability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fitness Certificate</span>
                  <span className="font-semibold">{viewVehicle.documentExpiry}</span>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <DriverKYCReviewModal
        driver={kycModalDriver}
        open={!!kycModalDriver}
        onOpenChange={(o) => !o && setKycModalDriver(null)}
        onSuccess={(updated) => {
          setViewDriver(updated);
        }}
      />
    </div>
  );
}
