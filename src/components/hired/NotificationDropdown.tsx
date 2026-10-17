import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Truck,
  Inbox,
  Wallet,
  FileText,
  Car,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { NotificationCategory, AppNotification } from "@/lib/mock-data";

export function NotificationDropdown() {
  const { notifications, setNotifications, markNotificationRead, markAllNotificationsRead } =
    useStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const recentNotifications = notifications.slice(0, 5);

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case "Trips":
        return <Truck className="size-3.5 text-primary" />;
      case "Enquiries":
        return <Inbox className="size-3.5 text-info" />;
      case "Credit":
        return <Wallet className="size-3.5 text-warning" />;
      case "Invoices":
        return <FileText className="size-3.5 text-danger" />;
      case "Fleet":
        return <Car className="size-3.5 text-primary" />;
      default:
        return <Bell className="size-3.5 text-primary" />;
    }
  };

  const handleItemClick = (n: AppNotification) => {
    markNotificationRead(n.id);
    setOpen(false);
    navigate({ to: n.linkTo as never });
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    toast.success("All notifications marked as read");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("Notifications cleared");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Open notifications"
          className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-danger text-[10px] font-bold text-destructive-foreground animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 shadow-xl border border-border bg-popover rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[10px] font-bold text-danger">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                title="Mark all as read"
              >
                <CheckCheck className="size-3.5 mr-1 text-primary" />
                Read all
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearAll}
                className="size-7 text-muted-foreground hover:text-danger"
                title="Clear all"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border">
          {recentNotifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-3 text-left transition-colors hover:bg-muted/40 cursor-pointer ${
                !n.read ? "bg-primary/5" : ""
              }`}
              onClick={() => handleItemClick(n)}
            >
              <div className="mt-0.5 rounded-md border border-border bg-background p-1.5 shrink-0">
                {getCategoryIcon(n.category)}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-semibold text-foreground truncate">{n.title}</p>
                  {!n.read && <span className="size-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">
                  {n.message}
                </p>
                <div className="flex items-center justify-between pt-0.5 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-2.5" />
                    {n.timestamp}
                  </span>
                  {!n.read && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(n.id);
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              <Bell className="mx-auto size-7 text-muted-foreground/40 mb-2" />
              No notifications at this time
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/20 p-2 text-center">
          <Link
            to="/notifications"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline py-1"
          >
            <span>View all notifications</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
