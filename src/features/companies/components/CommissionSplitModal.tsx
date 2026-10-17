import { useState, useEffect } from "react";
import { Percent, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
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
import { validateCommissionSplit } from "@/utils/validators";
import { useStore } from "@/lib/store";
import type { Account, CommissionSplit } from "@/types/company.types";

export interface CommissionSplitModalProps {
  company: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updated: Account) => void;
}

export function CommissionSplitModal({
  company,
  open,
  onOpenChange,
  onSuccess,
}: CommissionSplitModalProps) {
  const { setAccounts, logActivity } = useStore();

  const [platform, setPlatform] = useState<number>(15);
  const [transporter, setTransporter] = useState<number>(70);
  const [driver, setDriver] = useState<number>(15);

  // Sync initial values when company opens
  useEffect(() => {
    if (company?.commissionSplit) {
      setPlatform(company.commissionSplit.platformPercentage);
      setTransporter(company.commissionSplit.companyPercentage);
      setDriver(company.commissionSplit.driverPercentage);
    } else {
      setPlatform(15);
      setTransporter(70);
      setDriver(15);
    }
  }, [company, open]);

  if (!company) return null;

  const validation = validateCommissionSplit(platform, transporter, driver);

  const handleSave = () => {
    if (!validation.valid) {
      toast.error(validation.error || "Commission percentages must total exactly 100%");
      return;
    }

    const newSplit: CommissionSplit = {
      platformPercentage: platform,
      companyPercentage: transporter,
      driverPercentage: driver,
      lastUpdated: new Date().toISOString().slice(0, 10),
      updatedBy: "Finance Admin",
    };

    const updatedAccount: Account = {
      ...company,
      commissionSplit: newSplit,
    };

    setAccounts((prev) => prev.map((a) => (a.id === company.id ? updatedAccount : a)));

    logActivity({
      user: "Finance Admin",
      module: "Accounts",
      action: "Commission Split Updated",
      recordId: company.id,
      description: `Updated revenue share for ${company.name}: Platform ${platform}%, Company ${transporter}%, Driver ${driver}% (Total: 100%)`,
      badgeTone: "info",
    });

    toast.success(`Commission split configured for ${company.name}!`);
    onOpenChange(false);
    onSuccess?.(updatedAccount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Percent className="size-4" />
            </div>
            <div>
              <DialogTitle>Commission Split Configuration</DialogTitle>
              <DialogDescription className="text-xs">
                Configure payout breakdown for {company.name}. Total must equal exactly 100%.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Live Validation Banner */}
          <div
            className={`flex items-center justify-between rounded-lg border p-3 text-xs ${
              validation.valid
                ? "border-success/30 bg-success/10 text-success"
                : "border-danger/30 bg-danger/10 text-danger"
            }`}
          >
            <div className="flex items-center gap-2">
              {validation.valid ? (
                <CheckCircle2 className="size-4 shrink-0" />
              ) : (
                <AlertTriangle className="size-4 shrink-0" />
              )}
              <span className="font-semibold">
                {validation.valid
                  ? "Split Validated (100.0%)"
                  : `Invalid Total: ${validation.sum}%`}
              </span>
            </div>
            <span className="text-[11px] font-medium">
              {validation.valid
                ? "Ready to apply"
                : `${100 - validation.sum > 0 ? `+${(100 - validation.sum).toFixed(1)}% needed` : `${(validation.sum - 100).toFixed(1)}% excess`}`}
            </span>
          </div>

          {/* Input 1: Platform Fee */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <Label className="font-medium">HireD Platform Share (%)</Label>
              <span className="font-semibold text-primary">{platform}%</span>
            </div>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={platform}
              onChange={(e) => setPlatform(parseFloat(e.target.value) || 0)}
              className="h-9 text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              Direct platform take rate covering tech infrastructure, GPS tracking and insurance.
            </p>
          </div>

          {/* Input 2: Transporter / Partner Company */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <Label className="font-medium">Company / Transporter Share (%)</Label>
              <span className="font-semibold text-foreground">{transporter}%</span>
            </div>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={transporter}
              onChange={(e) => setTransporter(parseFloat(e.target.value) || 0)}
              className="h-9 text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              Fleet operating costs, vehicle EMI, depreciation and enterprise margin.
            </p>
          </div>

          {/* Input 3: Driver Payout */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <Label className="font-medium">Driver Freight Payout (%)</Label>
              <span className="font-semibold text-foreground">{driver}%</span>
            </div>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.5"
              value={driver}
              onChange={(e) => setDriver(parseFloat(e.target.value) || 0)}
              className="h-9 text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              Driver trip incentive and fuel allowance settlement.
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center gap-1.5 border-t pt-3 text-[11px] text-muted-foreground">
            <span>Presets:</span>
            <button
              type="button"
              onClick={() => {
                setPlatform(15);
                setTransporter(70);
                setDriver(15);
              }}
              className="rounded bg-muted px-2 py-0.5 font-medium hover:bg-muted/80 text-foreground"
            >
              Standard (15/70/15)
            </button>
            <button
              type="button"
              onClick={() => {
                setPlatform(10);
                setTransporter(75);
                setDriver(15);
              }}
              className="rounded bg-muted px-2 py-0.5 font-medium hover:bg-muted/80 text-foreground"
            >
              Enterprise (10/75/15)
            </button>
            <button
              type="button"
              onClick={() => {
                setPlatform(20);
                setTransporter(60);
                setDriver(20);
              }}
              className="rounded bg-muted px-2 py-0.5 font-medium hover:bg-muted/80 text-foreground"
            >
              Express (20/60/20)
            </button>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!validation.valid}
            onClick={handleSave}
            className="gap-1.5"
          >
            <CheckCircle2 className="size-3.5" />
            Save Commission Split
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
