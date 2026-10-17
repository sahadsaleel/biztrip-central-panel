import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2,
  Briefcase,
  FileText,
  AlertTriangle,
  Bell,
  ShieldCheck,
  Palette,
  Save,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { defaultSettings, type AppSettings } from "@/lib/mock-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — HireD Ops" },
      {
        name: "description",
        content: "Configure enterprise application preferences and system defaults.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, setSettings, logActivity } = useStore();
  const [form, setForm] = useState<AppSettings>(settings);
  const [activeSection, setActiveSection] = useState<
    "company" | "business" | "invoices" | "credit" | "notifications" | "security" | "appearance"
  >("company");

  const handleChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(form);
    try {
      localStorage.setItem("hired_settings", JSON.stringify(form));
    } catch {
      // Local storage fallback
    }

    logActivity({
      user: "Admin / Ops",
      module: "Settings",
      action: "Preferences Saved",
      recordId: "CFG-MAIN",
      description: "Updated administrative system settings and local preferences.",
      badgeTone: "info",
    });

    toast.success("Settings saved successfully (persisted in local state)");
  };

  const handleResetDefaults = () => {
    setForm(defaultSettings);
    setSettings(defaultSettings);
    localStorage.removeItem("hired_settings");
    toast.info("Reset to default demonstration settings");
  };

  const navItems = [
    { id: "company", label: "Company Profile", icon: Building2 },
    { id: "business", label: "Business & Dispatch", icon: Briefcase },
    { id: "invoices", label: "Invoice & Billing", icon: FileText },
    { id: "credit", label: "Credit Alert Thresholds", icon: AlertTriangle },
    { id: "notifications", label: "Notification Channels", icon: Bell },
    { id: "security", label: "Security & Team", icon: ShieldCheck },
    { id: "appearance", label: "Appearance & Theme", icon: Palette },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Settings</h1>
            <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
              Demo Preferences
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Configure enterprise company details, billing policies, dispatch automation, and alert
            thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="h-8 gap-1.5 text-xs"
          >
            <RotateCcw className="size-3.5" />
            Reset Defaults
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            <Save className="size-3.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Navigation Tabs, Right Form Card */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Left Section Navigation */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-foreground/80 hover:bg-muted"
                }`}
              >
                <item.icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSave}
            className="rounded-xl border border-border bg-card p-6 shadow-xs"
          >
            {/* Section 1: Company Profile */}
            {activeSection === "company" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Company Profile</h3>
                  <p className="text-xs text-muted-foreground">
                    Official business registration and support contact details
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Company Legal Name
                    </label>
                    <input
                      value={form.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">GSTIN Number</label>
                    <input
                      value={form.gstin}
                      onChange={(e) => handleChange("gstin", e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none uppercase focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">
                      Operations Helpline
                    </label>
                    <input
                      value={form.supportPhone}
                      onChange={(e) => handleChange("supportPhone", e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Support & Billing Email
                    </label>
                    <input
                      type="email"
                      value={form.supportEmail}
                      onChange={(e) => handleChange("supportEmail", e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-foreground">
                      Registered Office Address
                    </label>
                    <textarea
                      rows={2}
                      value={form.registeredAddress}
                      onChange={(e) => handleChange("registeredAddress", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Business & Dispatch */}
            {activeSection === "business" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Business Preferences</h3>
                  <p className="text-xs text-muted-foreground">
                    Operational corridor defaults, currency, and dispatch automation rules
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-foreground">Default Currency</label>
                    <input
                      disabled
                      value={form.defaultCurrency}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-muted px-3 text-xs text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Timezone</label>
                    <input
                      disabled
                      value={form.timezone}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-muted px-3 text-xs text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">
                      Low SLA Breach Notice Threshold (Minutes)
                    </label>
                    <input
                      type="number"
                      value={form.slaBreachAlertMins}
                      onChange={(e) => handleChange("slaBreachAlertMins", Number(e.target.value))}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.autoAssignDrivers}
                      onChange={(e) => handleChange("autoAssignDrivers", e.target.checked)}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-medium text-foreground">
                        Enable Automatic Fleet Driver Suggestion
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Recommend available drivers based on proximity and vehicle capacity
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Section 3: Invoicing & Billing */}
            {activeSection === "invoices" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Invoice Preferences</h3>
                  <p className="text-xs text-muted-foreground">
                    Default credit terms, numbering sequence, and tax configuration
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-medium text-foreground">
                      Default Payment Terms
                    </label>
                    <select
                      value={form.defaultPaymentTerms}
                      onChange={(e) => handleChange("defaultPaymentTerms", e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none"
                    >
                      <option value="Net 7">Net 7 Days</option>
                      <option value="Net 15">Net 15 Days</option>
                      <option value="Net 30">Net 30 Days</option>
                      <option value="Due on Receipt">Due on Receipt</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">
                      Invoice Number Prefix
                    </label>
                    <input
                      value={form.invoicePrefix}
                      onChange={(e) => handleChange("invoicePrefix", e.target.value)}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">
                      Default GST Rate (%)
                    </label>
                    <input
                      type="number"
                      value={form.defaultGstRate}
                      onChange={(e) => handleChange("defaultGstRate", Number(e.target.value))}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Credit Alert Thresholds */}
            {activeSection === "credit" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Credit Alert Thresholds</h3>
                  <p className="text-xs text-muted-foreground">
                    Account risk controls and automatic booking suspension
                  </p>
                </div>
                <div className="max-w-xs">
                  <label className="text-xs font-medium text-foreground">
                    High Utilisation Warning Threshold (%)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={form.creditUtilisationAlertThreshold}
                    onChange={(e) =>
                      handleChange("creditUtilisationAlertThreshold", Number(e.target.value))
                    }
                    className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Accounts exceeding this limit will trigger operational dashboard warnings
                  </p>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.autoHoldCreditExceeded}
                      onChange={(e) => handleChange("autoHoldCreditExceeded", e.target.checked)}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-medium text-foreground">
                        Require Finance Override for Exceeded Credit Limits
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Prevent dispatching new trips if overdue balance exceeds approved limit
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Section 5: Notification Channels */}
            {activeSection === "notifications" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Notification Channels</h3>
                  <p className="text-xs text-muted-foreground">
                    Choose how operational alerts and dispatch updates are communicated
                  </p>
                </div>
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.emailAlerts}
                      onChange={(e) => handleChange("emailAlerts", e.target.checked)}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-medium text-foreground">
                        Email Notifications
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Receive daily digest of trips, overdue receivables, and new enquiries
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.smsCriticalAlerts}
                      onChange={(e) => handleChange("smsCriticalAlerts", e.target.checked)}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-medium text-foreground">SMS Urgent Alerts</span>
                      <p className="text-[11px] text-muted-foreground">
                        Instant SMS for severe transit delays (&gt;3 hours) and vehicle breakdowns
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.browserNotifications}
                      onChange={(e) => handleChange("browserNotifications", e.target.checked)}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-medium text-foreground">
                        Browser Push Alerts
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Desktop notifications when live trips or invoices update
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Section 6: Security & Team */}
            {activeSection === "security" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Security & Access Policies
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Authentication requirements and session security
                  </p>
                </div>
                <div className="space-y-4 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.twoFactorAuth}
                      onChange={(e) => handleChange("twoFactorAuth", e.target.checked)}
                      className="size-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-xs font-medium text-foreground">
                        Enforce Two-Factor Authentication (2FA) for Admins
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Mandatory OTP verification for users with Super Admin or Finance roles
                      </p>
                    </div>
                  </label>

                  <div className="max-w-xs">
                    <label className="text-xs font-medium text-foreground">
                      Session Idle Timeout (Hours)
                    </label>
                    <select
                      value={form.sessionTimeoutHours}
                      onChange={(e) => handleChange("sessionTimeoutHours", Number(e.target.value))}
                      className="mt-1 h-9 w-full rounded-lg border border-border bg-background px-3 text-xs outline-none"
                    >
                      <option value={2}>2 Hours</option>
                      <option value={4}>4 Hours</option>
                      <option value={8}>8 Hours (Full Shift)</option>
                      <option value={24}>24 Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Section 7: Appearance */}
            {activeSection === "appearance" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Appearance & Interface</h3>
                  <p className="text-xs text-muted-foreground">
                    Customize display theme and layout preferences
                  </p>
                </div>
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-medium text-foreground">Color Scheme</label>
                    <div className="mt-2 flex gap-3">
                      {(["light", "dark", "system"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            handleChange("theme", t);
                            if (t === "dark") {
                              document.documentElement.classList.add("dark");
                            } else {
                              document.documentElement.classList.remove("dark");
                            }
                          }}
                          className={`rounded-lg border px-4 py-2 text-xs font-semibold capitalize transition-all ${
                            form.theme === t
                              ? "border-primary bg-primary text-primary-foreground shadow-xs"
                              : "border-border bg-muted/40 text-foreground hover:bg-muted"
                          }`}
                        >
                          {t} Theme
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-8 flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button type="button" variant="outline" size="sm" onClick={handleResetDefaults}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gap-1.5 font-semibold">
                <Save className="size-3.5" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
