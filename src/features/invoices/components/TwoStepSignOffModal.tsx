import { useState, useMemo } from "react";
import {
  Stamp,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  Clock,
  Lock,
} from "lucide-react";
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
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { useStore } from "@/lib/store";
import { inr } from "@/utils/formatters";
import type { Invoice, TwoStepSignOff, AdminSignOff } from "@/lib/invoices";

export interface TwoStepSignOffModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updatedInvoice: Invoice) => void;
}

export function TwoStepSignOffModal({
  invoice,
  open,
  onOpenChange,
  onSuccess,
}: TwoStepSignOffModalProps) {
  const { invoices, setInvoices, users, logActivity } = useStore();

  const [selectedAdminId, setSelectedAdminId] = useState<string>("");
  const [signOffNote, setSignOffNote] = useState<string>("");

  // Potential admin approvers from users
  const adminApprovers = useMemo(() => {
    return users.filter(
      (u) => u.role === "Super Admin" || u.role === "Finance" || u.role === "Admin / Ops",
    );
  }, [users]);

  if (!invoice) return null;

  const signOff = invoice.signOff;
  const isStep1Done = !!signOff?.signOff1;
  const isStep2Done = !!signOff?.signOff2;
  const isFullyApproved = isStep1Done && isStep2Done;

  // Selected admin object
  const selectedAdmin = adminApprovers.find((u) => u.id === selectedAdminId);

  // Dual-control enforcement check:
  // Step 2 admin CANNOT be the same as Step 1 admin!
  const isSameAdminAsStep1 =
    isStep1Done && selectedAdmin && signOff?.signOff1?.adminId === selectedAdmin.id;

  const handleSignOff = () => {
    if (!selectedAdmin) {
      toast.error("Please select an administrator to sign off");
      return;
    }

    const now = new Date().toISOString().replace("T", " ").slice(0, 16);

    const newApproval: AdminSignOff = {
      adminId: selectedAdmin.id,
      adminName: selectedAdmin.name,
      adminEmail: selectedAdmin.email,
      role: selectedAdmin.role,
      signedAt: now,
      note: signOffNote.trim() || undefined,
    };

    let updatedSignOff: TwoStepSignOff;
    let nextInvoiceStatus = invoice.status;

    if (!isStep1Done) {
      // Executing Step 1
      updatedSignOff = {
        signOff1: newApproval,
        status: "Pending Second Approval",
      };
    } else {
      // Executing Step 2: Enforce dual control rule
      if (isSameAdminAsStep1) {
        toast.error(
          `Dual-control compliance: The second sign-off must come from a different administrator than ${signOff?.signOff1?.adminName}.`,
        );
        return;
      }

      updatedSignOff = {
        signOff1: signOff?.signOff1,
        signOff2: newApproval,
        status: "Fully Approved",
      };
      if (invoice.status === "Draft") {
        nextInvoiceStatus = "Issued";
      }
    }

    const updatedInvoice: Invoice = {
      ...invoice,
      signOff: updatedSignOff,
      status: nextInvoiceStatus,
    };

    setInvoices((prev) => prev.map((i) => (i.id === invoice.id ? updatedInvoice : i)));

    logActivity({
      user: selectedAdmin.name,
      module: "Invoicing",
      action: !isStep1Done ? "Invoice Sign-Off #1" : "Invoice Sign-Off #2 (Final)",
      recordId: invoice.id,
      description: `${!isStep1Done ? "First" : "Second & Final"} dual-control approval completed for invoice ${invoice.id} (${inr(invoice.amount)}) by ${selectedAdmin.name}`,
      badgeTone: !isStep1Done ? "info" : "success",
    });

    toast.success(
      !isStep1Done
        ? `Sign-off 1 completed by ${selectedAdmin.name}. Awaiting second sign-off.`
        : `Invoice ${invoice.id} is now fully dual-approved!`,
    );

    setSelectedAdminId("");
    setSignOffNote("");
    onOpenChange(false);
    onSuccess?.(updatedInvoice);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Stamp className="size-4" />
              </div>
              <div>
                <DialogTitle>Two-Step Admin Sign-Off Workflow</DialogTitle>
                <DialogDescription className="text-xs">
                  Dual authorization required for commercial invoice disbursement & client release.
                </DialogDescription>
              </div>
            </div>

            <StatusBadge tone={isFullyApproved ? "success" : isStep1Done ? "warning" : "muted"} dot>
              {isFullyApproved
                ? "Fully Approved"
                : isStep1Done
                  ? "Awaiting Sign-Off 2"
                  : "Draft (No Approvals)"}
            </StatusBadge>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Invoice Summary */}
          <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Invoice ID:</span>{" "}
                <span className="font-semibold text-foreground">{invoice.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Customer:</span>{" "}
                <span className="font-medium text-foreground">{invoice.customer}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Trip Ref:</span>{" "}
                <span className="font-medium text-foreground">{invoice.trip}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Value:</span>{" "}
                <span className="font-bold text-foreground">{inr(invoice.amount)}</span>
              </div>
            </div>
          </div>

          {/* Two-Step Workflow Status Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Step 1 Card */}
            <div
              className={`rounded-lg border p-3 text-xs transition-colors ${
                isStep1Done ? "border-success/30 bg-success/5" : "border-primary/30 bg-primary/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    1
                  </span>
                  <span>Primary Admin Sign-Off</span>
                </div>
                {isStep1Done ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : (
                  <Clock className="size-4 text-muted-foreground" />
                )}
              </div>

              {isStep1Done ? (
                <div className="mt-2.5 space-y-1 text-muted-foreground">
                  <p className="font-medium text-foreground">{signOff?.signOff1?.adminName}</p>
                  <p className="text-[11px]">{signOff?.signOff1?.role}</p>
                  <p className="text-[10px] text-muted-foreground/80">
                    Signed: {signOff?.signOff1?.signedAt}
                  </p>
                  {signOff?.signOff1?.note && (
                    <p className="mt-1 italic text-[11px]">"{signOff?.signOff1?.note}"</p>
                  )}
                </div>
              ) : (
                <div className="mt-3 text-[11px] text-muted-foreground">
                  Pending initial verification by Finance / Ops Administrator.
                </div>
              )}
            </div>

            {/* Step 2 Card */}
            <div
              className={`rounded-lg border p-3 text-xs transition-colors ${
                isFullyApproved
                  ? "border-success/30 bg-success/5"
                  : isStep1Done
                    ? "border-warning/30 bg-warning/5"
                    : "border-border bg-muted/20 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-full bg-muted-foreground text-[10px] text-background">
                    2
                  </span>
                  <span>Secondary Admin Sign-Off</span>
                </div>
                {isFullyApproved ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : isStep1Done ? (
                  <Clock className="size-4 text-warning" />
                ) : (
                  <Lock className="size-4 text-muted-foreground" />
                )}
              </div>

              {isFullyApproved ? (
                <div className="mt-2.5 space-y-1 text-muted-foreground">
                  <p className="font-medium text-foreground">{signOff?.signOff2?.adminName}</p>
                  <p className="text-[11px]">{signOff?.signOff2?.role}</p>
                  <p className="text-[10px] text-muted-foreground/80">
                    Signed: {signOff?.signOff2?.signedAt}
                  </p>
                  {signOff?.signOff2?.note && (
                    <p className="mt-1 italic text-[11px]">"{signOff?.signOff2?.note}"</p>
                  )}
                </div>
              ) : isStep1Done ? (
                <div className="mt-3 text-[11px] text-warning-foreground font-medium">
                  Awaiting sign-off by a *different* admin to finalize authorization.
                </div>
              ) : (
                <div className="mt-3 text-[11px] text-muted-foreground">
                  Locked until Step 1 sign-off is completed.
                </div>
              )}
            </div>
          </div>

          {/* Action Area (if not fully approved yet) */}
          {!isFullyApproved && (
            <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3 pt-3">
              <div className="flex items-center gap-2">
                <UserCheck className="size-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">
                  Execute {!isStep1Done ? "Step 1" : "Step 2"} Sign-Off
                </span>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Select Approving Admin *</Label>
                <select
                  value={selectedAdminId}
                  onChange={(e) => setSelectedAdminId(e.target.value)}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">-- Select Administrator --</option>
                  {adminApprovers.map((u) => {
                    const isStep1 = isStep1Done && u.id === signOff?.signOff1?.adminId;
                    return (
                      <option
                        key={u.id}
                        value={u.id}
                        disabled={isStep1}
                        className={isStep1 ? "text-muted-foreground font-normal" : ""}
                      >
                        {u.name} ({u.role}) {isStep1 ? "— [Disabled: Signed Step 1]" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Dual Control Enforcement Notice */}
              {isSameAdminAsStep1 && (
                <div className="flex items-start gap-2 rounded border border-danger/30 bg-danger/10 p-2 text-xs text-danger">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dual Control Rule Enforced:</strong> The second approval must come from
                    a different administrator than <strong>{signOff?.signOff1?.adminName}</strong>.
                  </span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Approval Audit Note (Optional)</Label>
                <Textarea
                  placeholder="e.g. Verified freight delivery receipt and GST calculation match PO."
                  value={signOffNote}
                  onChange={(e) => setSignOffNote(e.target.value)}
                  rows={2}
                  className="text-xs"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          {!isFullyApproved && (
            <Button
              type="button"
              size="sm"
              disabled={!selectedAdminId || isSameAdminAsStep1}
              onClick={handleSignOff}
              className="gap-1.5"
            >
              <Stamp className="size-3.5" />
              Complete {!isStep1Done ? "Step 1 Sign-Off" : "Final Step 2 Sign-Off"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
