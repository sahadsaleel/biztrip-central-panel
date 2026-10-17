import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Inbox,
  Truck,
  Building2,
  Receipt,
  TrendingUp,
  Users,
  CarFront,
  Bell,
  Activity,
  Settings2,
  HelpCircle,
  Plus,
  LogOut,
  Menu,
  X,
  ChevronRight,
  UserRound,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HireDLogo } from "@/components/atoms";
import { TripFormDialog } from "./TripFormDialog";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationDropdown } from "./NotificationDropdown";
import { RoleSwitcher } from "@/features/auth";

type NavTo =
  | "/"
  | "/enquiries"
  | "/trips"
  | "/accounts"
  | "/invoicing"
  | "/reports"
  | "/users"
  | "/fleet"
  | "/notifications"
  | "/activity"
  | "/settings";

export function AppLayout({ children }: { children: ReactNode }) {
  const { enquiries, trips, notifications, tripDialogOpen, setTripDialogOpen } = useStore();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const openEnq = enquiries.filter((e) => e.stage !== "Converted").length;
  const activeTrips = trips.filter(
    (t) => t.status !== "Completed" && t.status !== "Cancelled",
  ).length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  type NavItem = {
    to: NavTo;
    label: string;
    icon: typeof Inbox;
    badge?: number | undefined;
  };

  const ops: NavItem[] = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/enquiries", label: "Enquiries / CRM", icon: Inbox, badge: openEnq },
    { to: "/trips", label: "B2B Trips", icon: Truck, badge: activeTrips },
    { to: "/accounts", label: "Accounts & Credit", icon: Building2 },
    { to: "/invoicing", label: "Invoicing", icon: Receipt },
    { to: "/reports", label: "Reports", icon: TrendingUp },
  ];

  const admin: typeof ops = [
    { to: "/users", label: "Users & Roles", icon: Users },
    { to: "/fleet", label: "Drivers & Fleet", icon: CarFront },
    {
      to: "/notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
    },
    { to: "/activity", label: "Activity Logs", icon: Activity },
    { to: "/settings", label: "Settings", icon: Settings2 },
  ];

  const renderGroup = (title: string, items: typeof ops) => (
    <div className="mt-5">
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((i) => {
          const active = i.to === "/" ? path === "/" : path.startsWith(i.to);
          return (
            <li key={i.to}>
              <Link
                to={i.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                    : "text-foreground/80 hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <i.icon className="size-5 shrink-0" />
                <span className="flex-1 truncate">{i.label}</span>
                {i.badge !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      active
                        ? "bg-primary-foreground/20 text-white"
                        : "bg-primary-soft text-primary",
                    )}
                  >
                    {i.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar: ~270px width on desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r bg-sidebar transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link to="/" onClick={() => setOpen(false)}>
            <HireDLogo size="lg" src="/logo.svg" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3.5 pb-4">
          {renderGroup("Operations", ops)}
          {renderGroup("Administration", admin)}
        </nav>

        {/* Sidebar Footer: AO avatar, Admin / Ops, ops@hired.in, Sign out */}
        <div className="border-t p-3">
          <Link
            to="/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg bg-primary-soft/60 p-2.5 transition-colors hover:bg-primary-soft"
          >
            <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary">
              <img
                src="/avatar.png"
                alt="Admin"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
                className="size-full object-cover"
              />
              <span className="absolute inset-0 grid place-items-center">AO</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground">Admin / Ops</p>
              <p className="truncate text-[10px] text-muted-foreground">ops@hired.in</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast("Signed out (frontend simulation)")}
            className="mt-2 w-full justify-start text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-[270px]">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>

          <Link to="/" className="lg:hidden flex items-center">
            <HireDLogo size="sm" showText={false} />
          </Link>

          {/* Left: Functional Global Search */}
          <div className="flex-1 max-w-md">
            <GlobalSearch />
          </div>

          {/* Right: Settings, Help, Notification Bell, + Create New Trip */}
          <div className="ml-auto flex items-center gap-1.5">
            <Link
              to="/settings"
              aria-label="Settings"
              className="hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block"
            >
              <SlidersHorizontal className="size-4" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Help"
              onClick={() => toast("Help centre documentation (demo only)")}
              className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
            >
              <HelpCircle className="size-4" />
            </Button>
            <RoleSwitcher />
            <NotificationDropdown />
            <Button
              onClick={() => setTripDialogOpen(true)}
              className="ml-2 h-9 px-3.5 text-xs font-semibold shadow-sm"
            >
              <Plus className="size-3.5 mr-1.5" />
              <span className="hidden sm:inline">Create New Trip</span>
              <span className="sm:hidden">Trip</span>
            </Button>
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="relative ml-1 size-8 overflow-hidden rounded-full border"
            >
              <Link to="/settings" aria-label="Your profile">
                <img
                  src="/avatar.png"
                  alt="Profile"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                  className="size-full object-cover"
                />
                <UserRound className="size-4 text-foreground" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] p-4 md:p-6">{children}</main>
      </div>

      <TripFormDialog open={tripDialogOpen} onOpenChange={setTripDialogOpen} />
    </div>
  );
}
