import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pill, type Tone } from "./ui";

export function OverviewHeader({ title, badge, subtitle, actions }: { title: string; badge?: ReactNode; subtitle: string; actions?: ReactNode }) {
  return <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-[22px] font-semibold">{title}</h1>{badge}</div><p className="mt-1 text-xs text-muted-foreground">{subtitle}</p></div><div className="flex gap-2">{actions}</div></div>;
}

export function OverviewMetric({ label, value, icon: Icon, tone = "primary", detail, trend, alert = false }: { label: string; value: ReactNode; icon: LucideIcon; tone?: Tone; detail: string; trend?: string; alert?: boolean }) {
  const colors = { primary: "bg-primary-soft text-primary", success: "bg-success-soft text-success", warning: "bg-warning-soft text-warning", danger: "bg-danger-soft text-danger", info: "bg-info-soft text-info", muted: "bg-muted text-muted-foreground" };
  return <div className={cn("overview-metric rounded-lg border border-card bg-card p-4", alert && "border-danger-soft bg-danger-soft")}><div className="flex items-start justify-between gap-2"><p className={cn("max-w-36 text-[10px] font-semibold uppercase leading-relaxed text-muted-foreground", alert && "text-danger")}>{label}</p><span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", colors[tone])}><Icon className="size-4" /></span></div><div className={cn("mt-3 flex items-baseline gap-2 text-[28px] font-semibold", alert && "text-danger")}>{value}</div><div className="mt-3 min-h-5">{trend && <Pill tone={tone}>{trend}</Pill>}</div><p className={cn("mt-1 text-[11px] text-muted-foreground", alert && "text-danger")}>{detail}</p></div>;
}

export function OverviewPanel({ title, subtitle, icon: Icon, actions, children, className }: { title: string; subtitle?: string; icon?: LucideIcon; actions?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={cn("overflow-hidden rounded-lg bg-card", className)}><div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"><div><h2 className="flex items-center gap-2 text-sm font-semibold">{Icon && <Icon className="size-4 text-primary" />}{title}</h2>{subtitle && <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>}</div>{actions}</div>{children}</section>;
}