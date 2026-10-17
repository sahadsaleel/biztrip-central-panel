import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Truck,
  Inbox,
  Wallet,
  FileText,
  Car,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  Check,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import type { NotificationCategory, AppNotification } from "@/lib/mock-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — HireD Ops" },
      { name: "description", content: "Operational alerts, SLA breach notices, and reminders." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, setNotifications, markNotificationRead, markAllNotificationsRead } =
    useStore();
  const [activeTab, setActiveTab] = useState<"All" | "Unread" | NotificationCategory>("All");
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "All") return true;
    if (activeTab === "Unread") return !n.read;
    return n.category === activeTab;
  });

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case "Trips":
        return <Truck className="size-4 text-primary" />;
      case "Enquiries":
        return <Inbox className="size-4 text-info" />;
      case "Credit":
        return <Wallet className="size-4 text-warning" />;
      case "Invoices":
        return <FileText className="size-4 text-danger" />;
      case "Fleet":
        return <Car className="size-4 text-primary" />;
      default:
        return <Bell className="size-4 text-primary" />;
    }
  };

  const getSeverityBadge = (sev: AppNotification["severity"]) => {
    switch (sev) {
      case "danger":
        return "bg-danger/15 text-danger border-danger/30";
      case "warning":
        return "bg-warning/15 text-warning border-warning/30";
      case "success":
        return "bg-success/15 text-success border-success/30";
      default:
        return "bg-info/15 text-info border-info/30";
    }
  };

  const handleNavigate = (n: AppNotification) => {
    markNotificationRead(n.id);
    navigate({ to: n.linkTo as never });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-danger/15 px-2 py-0.5 text-xs font-semibold text-danger">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Live operations alerts, trip delays, credit utilisation flags, and invoice dues.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              markAllNotificationsRead();
              toast.success("Marked all as read");
            }}
            disabled={unreadCount === 0}
            className="h-8 gap-1.5 text-xs"
          >
            <CheckCheck className="size-3.5" />
            Mark all read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllNotifications}
            className="h-8 text-xs text-muted-foreground hover:text-danger"
          >
            Clear all
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-border">
        {(["All", "Unread", "Trips", "Enquiries", "Credit", "Invoices"] as const).map((tab) => {
          const count =
            tab === "All"
              ? notifications.length
              : tab === "Unread"
                ? unreadCount
                : notifications.filter((n) => n.category === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  activeTab === tab
                    ? "bg-primary-soft text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((n) => (
          <div
            key={n.id}
            className={`flex flex-col gap-3 rounded-xl border p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
              n.read
                ? "border-border bg-card/60 opacity-80"
                : "border-primary/30 bg-card shadow-xs ring-1 ring-primary/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg border border-border bg-muted/50 p-2">
                {getCategoryIcon(n.category)}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-semibold text-foreground">{n.title}</h4>
                  <span
                    className={`rounded-full border px-2 py-0.2 text-[10px] font-semibold uppercase ${getSeverityBadge(
                      n.severity,
                    )}`}
                  >
                    {n.category}
                  </span>
                  {!n.read && (
                    <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Clock className="size-3" />
                  <span>{n.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center">
              {!n.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markNotificationRead(n.id)}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Check className="size-3.5 mr-1" />
                  Mark read
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate(n)}
                className="h-8 gap-1 text-xs font-medium text-primary hover:bg-primary-soft"
              >
                View record
                <ArrowRight className="size-3" />
              </Button>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
            <Bell className="mx-auto size-8 text-muted-foreground/50" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">
              No alerts in this category
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              All system metrics and operations are currently within normal thresholds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
