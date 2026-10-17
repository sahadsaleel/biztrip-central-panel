import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  detail?: string;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  detail,
  trend,
  trendPositive = true,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {Icon && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" />
          </div>
        )}
      </div>

      <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{value}</div>

      {(detail || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          {detail && <span>{detail}</span>}
          {trend && (
            <span className={cn("font-medium", trendPositive ? "text-success" : "text-danger")}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
