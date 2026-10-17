import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  History,
  Search,
  Filter,
  Download,
  Calendar,
  Layers,
  User,
  ArrowRight,
  Shield,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore, downloadCsv } from "@/lib/store";
import type { ActivityLog } from "@/lib/mock-data";

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity Logs — HireD Ops" },
      { name: "description", content: "System audit trails and admin change log." },
    ],
  }),
  component: ActivityLogsPage,
});

function ActivityLogsPage() {
  const { activityLogs } = useStore();
  const [query, setQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("All Modules");
  const [viewLog, setViewLog] = useState<ActivityLog | null>(null);

  const modules = [
    "All Modules",
    "Trips",
    "Enquiries",
    "Accounts",
    "Invoicing",
    "Users",
    "Fleet",
    "Settings",
  ];

  const filteredLogs = activityLogs.filter((log) => {
    const matchesQ =
      log.description.toLowerCase().includes(query.toLowerCase()) ||
      log.user.toLowerCase().includes(query.toLowerCase()) ||
      log.recordId.toLowerCase().includes(query.toLowerCase()) ||
      log.action.toLowerCase().includes(query.toLowerCase());
    const matchesModule = moduleFilter === "All Modules" || log.module === moduleFilter;
    return matchesQ && matchesModule;
  });

  const handleExportCsv = () => {
    downloadCsv("hired-activity-audit.csv", filteredLogs as unknown as Record<string, unknown>[]);
    toast.success("Activity logs exported to CSV");
  };

  const getModuleBadge = (mod: ActivityLog["module"]) => {
    switch (mod) {
      case "Trips":
        return "bg-primary-soft text-primary";
      case "Enquiries":
        return "bg-info/15 text-info";
      case "Accounts":
        return "bg-success/15 text-success";
      case "Invoicing":
        return "bg-warning/15 text-warning";
      case "Fleet":
        return "bg-primary-soft text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Activity Logs</h1>
            <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
              Immutable Audit Trail
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Review detailed operational events, status modifications, and administrative actions.
          </p>
        </div>

        <Button size="sm" onClick={handleExportCsv} className="h-8 gap-1.5 text-xs font-semibold">
          <Download className="size-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logs by action, user, record ID, or description..."
            className="h-8 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Module Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                <Layers className="size-3.5" />
                {moduleFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {modules.map((m) => (
                <DropdownMenuItem key={m} onClick={() => setModuleFilter(m)}>
                  {m} {moduleFilter === m ? "✓" : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Record ID</th>
                <th className="px-4 py-3">Event Description</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${getModuleBadge(
                        log.module,
                      )}`}
                    >
                      {log.module}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-primary">{log.recordId}</td>
                  <td className="px-4 py-3 max-w-md truncate text-muted-foreground">
                    {log.description}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewLog(log)}
                      className="h-7 text-xs text-primary hover:bg-primary-soft"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-muted-foreground">
                    No activity logs match the search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Drawer */}
      <Sheet open={!!viewLog} onOpenChange={(o) => !o && setViewLog(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {viewLog && (
            <div className="space-y-5">
              <SheetHeader>
                <SheetTitle className="text-base font-bold">Audit Event: {viewLog.id}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 rounded-xl border border-border bg-card p-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Event Timestamp</span>
                  <p className="font-semibold text-foreground mt-0.5">{viewLog.timestamp}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Author / User</span>
                  <p className="font-semibold text-foreground mt-0.5">{viewLog.user}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Module Affected</span>
                  <p className="font-semibold text-primary mt-0.5">{viewLog.module}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Action Triggered</span>
                  <p className="font-semibold text-foreground mt-0.5">{viewLog.action}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Target Record ID</span>
                  <p className="font-mono font-semibold text-primary mt-0.5">{viewLog.recordId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Full Event Narrative</span>
                  <p className="mt-1 leading-relaxed text-foreground bg-muted/40 p-3 rounded-lg border border-border">
                    {viewLog.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
