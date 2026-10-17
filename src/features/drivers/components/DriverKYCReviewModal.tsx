import { useState } from "react";
import {
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  BadgeCheck,
  Building,
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
import type { Driver, KYCStatus } from "@/lib/mock-data";

export interface DriverKYCReviewModalProps {
  driver: Driver | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updatedDriver: Driver) => void;
}

export function DriverKYCReviewModal({
  driver,
  open,
  onOpenChange,
  onSuccess,
}: DriverKYCReviewModalProps) {
  const { setDrivers, logActivity } = useStore();
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!driver) return null;

  const currentKYC: KYCStatus =
    driver.kycStatus || (driver.rating >= 4.5 ? "Verified" : "Pending Review");

  const handleApprove = () => {
    const updated: Driver = {
      ...driver,
      kycStatus: "Verified",
      reviewedBy: "Fleet Admin",
      reviewedAt: new Date().toISOString().slice(0, 10),
      rejectionReason: undefined,
    };

    setDrivers((prev) => prev.map((d) => (d.id === driver.id ? updated : d)));

    logActivity({
      user: "Fleet Manager",
      module: "Fleet",
      action: "KYC Verified",
      recordId: driver.id,
      description: `Approved KYC documents and verified credentials for driver ${driver.name}`,
      badgeTone: "success",
    });

    toast.success(`Driver ${driver.name} KYC approved and verified!`);
    onOpenChange(false);
    onSuccess?.(updated);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejecting the driver application");
      return;
    }

    const updated: Driver = {
      ...driver,
      kycStatus: "Rejected",
      rejectionReason: rejectReason.trim(),
      reviewedBy: "Fleet Admin",
      reviewedAt: new Date().toISOString().slice(0, 10),
    };

    setDrivers((prev) => prev.map((d) => (d.id === driver.id ? updated : d)));

    logActivity({
      user: "Fleet Manager",
      module: "Fleet",
      action: "KYC Application Rejected",
      recordId: driver.id,
      description: `Rejected KYC for ${driver.name}. Reason: ${rejectReason}`,
      badgeTone: "danger",
    });

    toast.warning(`Driver application ${driver.name} marked as Rejected.`);
    setRejecting(false);
    setRejectReason("");
    onOpenChange(false);
    onSuccess?.(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <DialogTitle>Driver KYC & Verification Dossier</DialogTitle>
                <DialogDescription className="text-xs">
                  Review submitted government identification, commercial licences and background
                  verification.
                </DialogDescription>
              </div>
            </div>

            <StatusBadge
              tone={
                currentKYC === "Verified"
                  ? "success"
                  : currentKYC === "Rejected"
                    ? "danger"
                    : "warning"
              }
              dot
            >
              {currentKYC}
            </StatusBadge>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Driver identity summary */}
          <div className="flex flex-wrap items-center justify-between rounded-lg border border-border bg-muted/40 p-3 text-xs">
            <div>
              <p className="font-semibold text-foreground">{driver.name}</p>
              <p className="text-muted-foreground">
                {driver.phone} · ID: {driver.id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">
                Experience:{" "}
                <span className="font-medium text-foreground">{driver.experienceYears} Years</span>
              </p>
              <p className="text-muted-foreground">
                Rating: <span className="font-medium text-foreground">★ {driver.rating} / 5.0</span>
              </p>
            </div>
          </div>

          {/* KYC Documents Preview Grid */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Verified Compliance Documents (Dummy Preview)
            </Label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {/* Commercial Licence */}
              <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Commercial Driving Licence
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        DL-142021008892 (HMV / Transport)
                      </p>
                    </div>
                  </div>
                  <BadgeCheck className="size-4 text-success" />
                </div>
                <div className="mt-2.5 flex items-center justify-between rounded bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground">
                  <span>Expires: {driver.licenseExpiry}</span>
                  <span className="text-success font-medium">Valid</span>
                </div>
              </div>

              {/* Aadhaar Card */}
              <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="size-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Aadhaar National Identity
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        XXXX-XXXX-7142 (UIDAI Authenticated)
                      </p>
                    </div>
                  </div>
                  <BadgeCheck className="size-4 text-success" />
                </div>
                <div className="mt-2.5 flex items-center justify-between rounded bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground">
                  <span>Biometric: Linked</span>
                  <span className="text-success font-medium">Verified</span>
                </div>
              </div>

              {/* Police Clearance */}
              <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="size-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Police Clearance Certificate
                      </p>
                      <p className="text-[11px] text-muted-foreground">PCC-2026-DEL-04192</p>
                    </div>
                  </div>
                  <BadgeCheck className="size-4 text-success" />
                </div>
                <div className="mt-2.5 flex items-center justify-between rounded bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground">
                  <span>Background: Clear</span>
                  <span className="text-success font-medium">Issued 2026</span>
                </div>
              </div>

              {/* Commercial Badge */}
              <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Heavy Vehicle Public Badge
                      </p>
                      <p className="text-[11px] text-muted-foreground">Badge No: BDG-9941-TR</p>
                    </div>
                  </div>
                  <BadgeCheck className="size-4 text-success" />
                </div>
                <div className="mt-2.5 flex items-center justify-between rounded bg-muted/50 px-2 py-1 text-[11px] text-muted-foreground">
                  <span>State RTO: Verified</span>
                  <span className="text-success font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rejection input area if in reject mode */}
          {rejecting && (
            <div className="rounded-lg border border-danger/30 bg-danger/5 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-danger">
                <AlertTriangle className="size-3.5" />
                <span>Specify Application Rejection Reason *</span>
              </div>
              <Textarea
                placeholder="e.g. Driving licence expired, image unreadable, or failed background check..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={2}
                className="text-xs bg-background"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRejecting(false)}
                >
                  Cancel
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={handleReject}>
                  Confirm Reject
                </Button>
              </div>
            </div>
          )}

          {driver.rejectionReason && !rejecting && (
            <div className="rounded-lg border border-danger/30 bg-danger/5 p-2.5 text-xs text-danger">
              <span className="font-semibold">Rejection Note: </span>
              {driver.rejectionReason}
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>

          {!rejecting && (
            <div className="flex items-center gap-2">
              {currentKYC !== "Rejected" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRejecting(true)}
                  className="text-danger hover:bg-danger/10 hover:text-danger"
                >
                  <XCircle className="size-3.5" />
                  Reject Application
                </Button>
              )}
              {currentKYC !== "Verified" && (
                <Button type="button" size="sm" onClick={handleApprove} className="gap-1.5">
                  <CheckCircle2 className="size-3.5" />
                  Approve Driver KYC
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
