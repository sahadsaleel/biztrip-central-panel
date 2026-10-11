import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Inbox, Truck, Wallet, FileText, BarChart3, Users, Car, Bell, History, Settings,
  Search, HelpCircle, Plus, LogOut, Menu, X, ChevronRight, UserRound, SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TripFormDialog } from "./TripFormDialog";

type NavTo = "/" | "/enquiries" | "/trips" | "/accounts" | "/invoicing" | "/reports" | "/users" | "/fleet" | "/notifications" | "/activity" | "/settings";

export function AppLayout({ children }: { children: ReactNode }) {
  const { enquiries, trips, tripDialogOpen, setTripDialogOpen } = useStore();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const openEnq = enquiries.filter((e) => e.stage !== "Converted").length;
  const activeTrips = trips.filter((t) => t.status !== "Completed" && t.status !== "Cancelled").length;

  const ops: { to: NavTo; label: string; icon: typeof Inbox; badge?: number }[] = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/enquiries", label: "Enquiries / CRM", icon: Inbox, badge: openEnq },
    { to: "/trips", label: "B2B Trips", icon: Truck, badge: activeTrips },
    { to: "/accounts", label: "Accounts & Credit", icon: Wallet },
    { to: "/invoicing", label: "Invoicing", icon: FileText },
    { to: "/reports", label: "Reports", icon: BarChart3 },
  ];
  const admin: typeof ops = [
    { to: "/users", label: "Users & Roles", icon: Users },
    { to: "/fleet", label: "Drivers & Fleet", icon: Car },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/activity", label: "Activity Logs", icon: History },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const renderGroup = (title: string, items: typeof ops) => (
    <div className="mt-5">
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-normal text-muted-foreground">{title}</p>
      <ul className="space-y-1">
        {items.map((i) => {
          const active = i.to === "/" ? path === "/" : path.startsWith(i.to);
          return (
            <li key={i.to}>
              <Link
                to={i.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/80 hover:bg-sidebar-accent",
                )}
              >
                <i.icon className="size-4" />
                <span className="flex-1">{i.label}</span>
                {i.badge !== undefined && (
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", active ? "bg-primary-foreground/20" : "bg-primary-soft text-primary")}>{i.badge}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen">
      {open && <div className="fixed inset-0 z-30 bg-foreground/30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[228px] flex-col border-r bg-sidebar transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-14 items-center gap-2 border-b px-5">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">H</span>
          <span className="text-lg font-bold tracking-normal">Hire<span className="text-primary">D</span></span>
          <span className="rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-bold text-primary">OPS</span>
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X /></Button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {renderGroup("Operations", ops)}
          {renderGroup("Administration", admin)}
        </nav>
        <div className="border-t p-3"><Link to="/settings" className="flex items-center gap-2 rounded-lg bg-primary-soft p-2.5"><span className="grid size-9 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">AO</span><div className="min-w-0 flex-1"><p className="text-xs font-medium">Admin / Ops</p><p className="truncate text-[10px] text-muted-foreground">ops@hired.in</p></div><ChevronRight className="size-4 text-muted-foreground" /></Link><Button variant="ghost" size="sm" onClick={() => toast("Signed out (demo only)")} className="mt-2 justify-start text-muted-foreground"><LogOut />Sign out</Button></div>
      </aside>

      <div className="lg:pl-[228px]">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></Button>
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search trips, accounts, or invoices..." className="h-8 w-full rounded-lg border border-primary/5 bg-primary-soft pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-ring/30" />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Link to="/settings" aria-label="Settings" className="hidden rounded-lg p-2 text-muted-foreground hover:bg-muted sm:block"><SlidersHorizontal className="size-4" /></Link>
            <Button variant="ghost" size="icon" aria-label="Help" onClick={() => toast("Help centre coming soon")} className="hidden text-muted-foreground sm:inline-flex"><HelpCircle /></Button>
            <Link to="/notifications" aria-label="Notifications" className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted">
              <Bell className="size-5" />
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-danger text-[10px] font-bold text-destructive-foreground">3</span>
            </Link>
            <Button onClick={() => setTripDialogOpen(true)} className="ml-2 h-8 px-3 text-xs"><Plus /><span className="hidden sm:inline">Create New Trip</span></Button>
            <Button asChild size="icon" className="ml-1 size-8 rounded-full"><Link to="/settings" aria-label="Your profile"><UserRound /></Link></Button>
          </div>
        </header>
        <main className="mx-auto max-w-[1600px] p-4 md:p-5">{children}</main>
      </div>
      <TripFormDialog open={tripDialogOpen} onOpenChange={setTripDialogOpen} />
    </div>
  );
}
