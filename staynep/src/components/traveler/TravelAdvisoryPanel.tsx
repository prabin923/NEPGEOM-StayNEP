"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Info,
  ShieldAlert,
  ChevronDown,
  Route,
  CloudRain,
  HeartPulse,
  Shield,
  CalendarDays,
  Tent,
} from "lucide-react";
import type { TravelAdvisory, AdvisorySeverity, AdvisoryCategory } from "@/data/travel-advisories";

const severityConfig: Record<
  AdvisorySeverity,
  { bg: string; border: string; icon: string; badge: string }
> = {
  critical: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
    badge: "bg-red-100 text-red-700",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
};

const categoryIcons: Record<AdvisoryCategory, typeof Info> = {
  road: Route,
  weather: CloudRain,
  health: HeartPulse,
  safety: Shield,
  seasonal: Tent,
  event: CalendarDays,
};

function SeverityIcon({ severity }: { severity: AdvisorySeverity }) {
  const cn = `h-4 w-4 shrink-0 ${severityConfig[severity].icon}`;
  if (severity === "critical") return <ShieldAlert className={cn} />;
  if (severity === "warning") return <AlertTriangle className={cn} />;
  return <Info className={cn} />;
}

interface TravelAdvisoryPanelProps {
  advisories: TravelAdvisory[];
}

export default function TravelAdvisoryPanel({
  advisories,
}: TravelAdvisoryPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<AdvisorySeverity | "all">("all");

  const filtered =
    filter === "all"
      ? advisories
      : advisories.filter((a) => a.severity === filter);

  const criticalCount = advisories.filter((a) => a.severity === "critical").length;
  const warningCount = advisories.filter((a) => a.severity === "warning").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-graphite" />
          <div>
            <h3 className="text-[18px] font-semibold text-ink font-cosmica">
              Travel advisories
            </h3>
            <p className="text-[14px] text-steel font-cosmica">
              Live alerts and seasonal information for Nepal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {criticalCount > 0 && (
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
              {criticalCount} critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
              {warningCount} warning
            </span>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "critical", "warning", "info"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition ${
              filter === f
                ? "bg-obsidian text-snow"
                : "border border-fog bg-snow text-graphite hover:bg-mist"
            }`}
          >
            {f === "all" ? `All (${advisories.length})` : f}
          </button>
        ))}
      </div>

      {/* Advisory list */}
      {filtered.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-fog bg-mist/30 px-4 py-8 text-center">
          <p className="text-sm text-steel">No advisories in this category.</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((a) => {
            const config = severityConfig[a.severity];
            const CatIcon = categoryIcons[a.category];
            const isExpanded = expandedId === a.id;

            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : a.id)
                  }
                  className={`w-full rounded-[14px] border ${config.border} ${config.bg} px-4 py-3 text-left transition hover:shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <SeverityIcon severity={a.severity} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-ink">
                          {a.title}
                        </p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${config.badge}`}
                        >
                          {a.severity}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-steel">
                        <span className="inline-flex items-center gap-1">
                          <CatIcon className="h-3 w-3" />
                          {a.category}
                        </span>
                        <span>{a.region}</span>
                        <span>{a.validUntil ? `Until ${a.validUntil}` : "Ongoing"}</span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`mt-0.5 h-4 w-4 shrink-0 text-steel transition ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="mt-3 border-t border-current/10 pt-3">
                      <p className="text-sm text-graphite leading-relaxed">
                        {a.description}
                      </p>
                      <div className="mt-3 rounded-[10px] bg-white/70 px-3 py-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-steel">
                          Action required
                        </p>
                        <p className="mt-0.5 text-xs text-ink">
                          {a.actionRequired}
                        </p>
                      </div>
                      <p className="mt-2 text-[10px] text-steel">
                        Source: {a.source}
                      </p>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
