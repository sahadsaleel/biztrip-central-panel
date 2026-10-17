import { useState } from "react";
import { XCircle, AlertTriangle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { REJECTION_REASONS } from "@/constants/app.constants";
import { useStore } from "@/lib/store";
import type { Enquiry } from "@/lib/mock-data";

export interface OrderRejectModalProps {
  order: Enquiry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (rejectedOrder: Enquiry) => void;
}

export function OrderRejectModal({ order, open, onOpenChange, onSuccess }: OrderRejectModalProps) {
  const { setEnquiries, logActivity } = useStore();
  const [selectedReason, setSelectedReason] = useState<string>(REJECTION_REASONS[0]);
  const [customNotes, setCustomNotes] = useState("");

  if (!order) return null;

  const handleReject = () => {
    if (!selectedReason) {
      toast.error("Please specify a reason for rejecting this order");
      return;
    }

    const fullReason = customNotes.trim()
      ? `${selectedReason}: ${customNotes.trim()}`
      : selectedReason;

    const now = new Date().toISOString().slice(0, 10);

    const updatedOrder: Enquiry = {
      ...order,
      stage: "Rejected",
      rejectionReason: fullReason,
      rejectedAt: now,
      lastContact: now,
    };

    setEnquiries((prev) => prev.map((e) => (e.id === order.id ? updatedOrder : e)));

    logActivity({
      user: "Admin / Ops",
      module: "Enquiries",
      action: "Order Rejected",
      recordId: order.id,
      description: `Order ${order.id} for ${order.company} rejected. Reason: ${fullReason}`,
      badgeTone: "danger",
    });

    toast.warning(`Order ${order.id} rejected with reason: ${selectedReason}`);
    onOpenChange(false);
    onSuccess?.(updatedOrder);
    setCustomNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-danger">
            <div className="flex size-8 items-center justify-center rounded-lg bg-danger/10 text-danger">
              <AlertTriangle className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-foreground">Reject Order / Enquiry</DialogTitle>
              <DialogDescription className="text-xs">
                Provide a business reason for declining booking {order.id} ({order.company}).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID:</span>
              <span className="font-semibold text-foreground">{order.id}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">Route:</span>
              <span className="font-medium text-foreground">
                {order.origin} → {order.destination}
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">Value:</span>
              <span className="font-medium text-foreground">₹{order.value} L</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Rejection Reason *</Label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Additional Context / Audit Note</Label>
            <Textarea
              placeholder="e.g. Carrier fleet unavailable on this corridor until next week..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              rows={3}
              className="resize-none text-xs"
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleReject}
            className="gap-1.5"
          >
            <XCircle className="size-3.5" />
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
