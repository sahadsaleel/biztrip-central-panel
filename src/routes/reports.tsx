import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Download,
  Filter,
  Calendar,
  Truck,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Inbox,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  monthlyTripsData,
  monthlyRevenueData,
  enquiriesBySourceData,
  receivablesAgeingData,
  onTimePerformanceData,
} from "@/lib/mock-data";
import { downloadCsv, useStore } from "@/lib/store";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — HireD Ops" },
      { name: "description", content: "Logistics, sales, and financial performance reports." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { trips, enquiries, accounts } = useStore();
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [selectedCustomer, setSelectedCustomer] = useState("All Customers");
  const [activeCategory, setActiveCategory] = useState<"all" | "logistics" | "sales" | "finance">(
    "all",
  );

  const completedTrips = trips.filter((t) => t.status === "Completed").length;
  const delayedTrips = trips.filter((t) => t.status === "Delayed").length;

  const handleExport = () => {
    const reportSummary = [
      { Metric: "Total Trips", Value: trips.length },
      { Metric: "Completed Trips", Value: completedTrips },
      { Metric: "Delayed Trips", Value: delayedTrips },
      { Metric: "Total Enquiries", Value: enquiries.length },
      { Metric: "Total Accounts", Value: accounts.length },
      { Metric: "Date Range", Value: dateRange },
      { Metric: "Customer Filter", Value: selectedCustomer },
    ];
    downloadCsv(
      "hired-analytics-report.csv",
      reportSummary as unknown as Record<string, unknown>[],
    );
    toast.success("Reports exported to CSV");
  };

  const customerList = ["All Customers", ...Array.from(new Set(accounts.map((a) => a.name)))];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Reports & Analytics
            </h1>
            <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
              Demonstration Data
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Explore sample logistics, sales, and financial performance metrics.
          </p>
        </div>

        {/* Toolbar Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Customer filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Filter className="size-3.5" />
                {selectedCustomer}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {customerList.map((c) => (
                <DropdownMenuItem key={c} onClick={() => setSelectedCustomer(c)}>
                  {c} {selectedCustomer === c ? "✓" : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date range filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Calendar className="size-3.5" />
                {dateRange}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["Last 30 Days", "Last 6 Months", "Year to Date", "Full Year 2026"].map((r) => (
                <DropdownMenuItem key={r} onClick={() => setDateRange(r)}>
                  {r} {dateRange === r ? "✓" : ""}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" onClick={handleExport} className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-border">
        {[
          { id: "all", label: "Overview & Summary" },
          { id: "logistics", label: "Logistics & Trips" },
          { id: "sales", label: "Sales & Pipeline" },
          { id: "finance", label: "Financials & Receivables" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id as typeof activeCategory)}
            className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeCategory === tab.id
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Trips</span>
            <Truck className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">48</p>
          <p className="mt-1 flex items-center text-[11px] text-success">
            <TrendingUp className="mr-1 size-3" /> +12.5% vs previous period
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Completed Trips</span>
            <CheckCircle2 className="size-4 text-success" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">28</p>
          <p className="mt-1 text-[11px] text-muted-foreground">91.4% on-time fulfilment rate</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Sample Revenue</span>
            <IndianRupee className="size-4 text-info" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">₹85.4 L</p>
          <p className="mt-1 flex items-center text-[11px] text-success">
            <TrendingUp className="mr-1 size-3" /> +8.4% monthly growth
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Outstanding Receivables</span>
            <AlertCircle className="size-4 text-warning" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">₹38.6 L</p>
          <p className="mt-1 text-[11px] text-muted-foreground">₹12.4 L overdue beyond 30 days</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Chart 1: Trips Trend (Month by Month) */}
        {(activeCategory === "all" || activeCategory === "logistics") && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Trips by Month</h3>
                <p className="text-[11px] text-muted-foreground">
                  Scheduled, completed, and delayed trips progression
                </p>
              </div>
              <span className="text-xs font-medium text-primary">Volume Analysis</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyTripsData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="completed" name="Completed" fill="#16A34A" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="trips"
                    name="Total Scheduled"
                    fill="#5145F5"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar dataKey="delayed" name="Delayed" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: Revenue & Collections Trend */}
        {(activeCategory === "all" || activeCategory === "finance") && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Revenue & Collections (₹ Lakhs)
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Billed turnover vs received cash collections
                </p>
              </div>
              <span className="text-xs font-medium text-success">Cash Flow</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyRevenueData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5145F5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#5145F5" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorCol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} tick={{ fontSize: 11 }} unit="L" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: 8,
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Invoiced Revenue"
                    stroke="#5145F5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                  <Area
                    type="monotone"
                    dataKey="collections"
                    name="Cash Collections"
                    stroke="#16A34A"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCol)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 3: Enquiries by Source */}
        {(activeCategory === "all" || activeCategory === "sales") && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Enquiries by Lead Source</h3>
                <p className="text-[11px] text-muted-foreground">
                  Channel distribution for inbound enterprise inquiries
                </p>
              </div>
              <span className="text-xs font-medium text-info">Channel Share</span>
            </div>
            <div className="flex h-64 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enquiriesBySourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {enquiriesBySourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 4: Receivables Ageing Breakdown */}
        {(activeCategory === "all" || activeCategory === "finance") && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Receivables Ageing (₹ Lakhs)
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Outstanding ledger balance classified by payment due bucket
                </p>
              </div>
              <span className="text-xs font-medium text-danger">Credit Risk</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={receivablesAgeingData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="bucket" tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} tick={{ fontSize: 11 }} unit="L" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    name="Outstanding (₹ Lakhs)"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                  >
                    {receivablesAgeingData.map((entry, idx) => (
                      <Cell
                        key={`ageing-${idx}`}
                        fill={idx === 3 ? "#EF4444" : idx === 2 ? "#F59E0B" : "#5145F5"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 5: On-Time SLA Fulfilment Rate */}
        {(activeCategory === "all" || activeCategory === "logistics") && (
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  On-Time Delivery SLA Rate (%)
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Monthly percentage of trips completed within guaranteed SLA
                </p>
              </div>
              <span className="text-xs font-medium text-success">Target: 90%</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={onTimePerformanceData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} tick={{ fontSize: 11 }} domain={[80, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="onTimeRate"
                    name="On-Time Rate %"
                    stroke="#16A34A"
                    strokeWidth={3}
                    dot={{ fill: "#16A34A", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Performance Metric Breakdown Table */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <h3 className="text-sm font-semibold text-foreground">
            Operational Efficiency Highlights
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Key operational milestones across logistics and sales pipeline
          </p>

          <div className="mt-4 space-y-3.5">
            <div>
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">
                  Fleet Utilisation (Assigned Vehicles)
                </span>
                <span className="font-semibold text-primary">78%</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: "78%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">Lead-to-Trip Conversion Rate</span>
                <span className="font-semibold text-success">38.2%</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-muted">
                <div className="h-full rounded-full bg-success" style={{ width: "38.2%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">
                  Invoiced Receivables Realisation
                </span>
                <span className="font-semibold text-info">65.4%</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-muted">
                <div className="h-full rounded-full bg-info" style={{ width: "65.4%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">
                  SLA Breach Frequency (Under 5% Target)
                </span>
                <span className="font-semibold text-danger">4.8%</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-muted">
                <div className="h-full rounded-full bg-danger" style={{ width: "4.8%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
