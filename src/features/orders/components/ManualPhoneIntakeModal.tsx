import React, { useState } from "react";
import { PhoneCall, Sparkles } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { nextId } from "@/utils/formatters";
import { validatePhone } from "@/utils/validators";
import { VEHICLE_CLASSES } from "@/constants/app.constants";
import type { Enquiry } from "@/lib/mock-data";

export interface ManualPhoneIntakeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (order: Enquiry) => void;
}

export function ManualPhoneIntakeModal({
  open,
  onOpenChange,
  onSuccess,
}: ManualPhoneIntakeModalProps) {
  const { enquiries, setEnquiries, accounts, logActivity } = useStore();

  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleReq, setVehicleReq] = useState<string>(VEHICLE_CLASSES[0]);
  const [cargoType, setCargoType] = useState("General Merchandise");
  const [valueLakhs, setValueLakhs] = useState("3.5");
  const [notes, setNotes] = useState("");
  const [owner, setOwner] = useState("Riya Mehta");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim() || !contact.trim()) {
      toast.error("Please enter the caller's company and contact name");
      return;
    }
    if (!origin.trim() || !destination.trim()) {
      toast.error("Origin and Destination are required for route scheduling");
      return;
    }
    if (phone && !validatePhone(phone)) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return;
    }

    const val = parseFloat(valueLakhs) || 2.5;
    const newId = nextId(
      "ENQ",
      enquiries.map((e) => e.id),
    );

    const newEnquiry: Enquiry = {
      id: newId,
      company: company.trim(),
      contact: contact.trim(),
      phone: phone.trim() || "+91 98000 11223",
      origin: origin.trim(),
      destination: destination.trim(),
      value: val,
      source: "Phone Intake",
      owner,
      stage: "New",
      lastContact: new Date().toISOString().slice(0, 10),
      nextFollowUp: new Date(Date.now() + 864e5 * 2).toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10),
      vehicleRequirement: vehicleReq,
      cargoType,
      notes: notes.trim() || "Manual phone order intake logged by dispatcher.",
    };

    setEnquiries((prev) => [newEnquiry, ...prev]);

    logActivity({
      user: "Dispatcher / Ops",
      module: "Enquiries",
      action: "Phone Order Intake",
      recordId: newId,
      description: `Manual phone order logged for ${company} (${origin} → ${destination}, ${vehicleReq})`,
      badgeTone: "success",
    });

    toast.success(`Phone order ${newId} logged successfully!`);
    onOpenChange(false);
    onSuccess?.(newEnquiry);

    // Reset form
    setCompany("");
    setContact("");
    setPhone("");
    setOrigin("");
    setDestination("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PhoneCall className="size-4" />
            </div>
            <div>
              <DialogTitle>Manual Phone Order Intake</DialogTitle>
              <DialogDescription className="text-xs">
                Log a fast phone inquiry or direct customer booking into the active CRM pipeline.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Customer / Company *</Label>
              <Input
                placeholder="e.g. Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="h-8 text-xs"
                list="accounts-list"
              />
              <datalist id="accounts-list">
                {accounts.map((a) => (
                  <option key={a.id} value={a.name} />
                ))}
              </datalist>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Caller Contact Person *</Label>
              <Input
                placeholder="e.g. Ramesh Kumar"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Contact Phone</Label>
              <Input
                placeholder="+91 98000 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Est. Value (₹ Lakhs)</Label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 4.5"
                value={valueLakhs}
                onChange={(e) => setValueLakhs(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Origin City *</Label>
              <Input
                placeholder="e.g. Mumbai"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Destination City *</Label>
              <Input
                placeholder="e.g. Delhi NCR"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Vehicle Class Required</Label>
              <select
                value={vehicleReq}
                onChange={(e) => setVehicleReq(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {VEHICLE_CLASSES.map((vc) => (
                  <option key={vc} value={vc}>
                    {vc}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Cargo Category</Label>
              <Input
                placeholder="e.g. Auto Spare Parts"
                value={cargoType}
                onChange={(e) => setCargoType(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Assigned Sales Owner</Label>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {["Riya Mehta", "Arjun Nair", "Karan Shah", "Unassigned"].map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Dispatch & SLA Notes</Label>
            <Input
              placeholder="Immediate dispatch requested, loading ramp needed..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="gap-1.5">
              <Sparkles className="size-3.5" />
              Save Order Intake
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
