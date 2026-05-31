import type { LucideIcon } from "lucide-react";
import { Building2, Users, AlertTriangle, Shield, Clock } from "lucide-react";
import type { AuthorityLiveStats } from "@/lib/tourist-reports";

function KpiCell({
  icon: Icon,
  label,
  value,
  hint,
  alert,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-3 rounded-[16px] border px-4 py-3 ${
        alert
          ? "border-red-200 bg-red-50/80"
          : "border-fog bg-snow"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${
          alert ? "bg-red-100 text-red-700" : "bg-mist text-graphite"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-steel">{label}</p>
        <p
          className={`truncate text-xl font-bold tabular-nums tracking-tight text-obsidian ${
            alert ? "text-red-800" : ""
          }`}
        >
          {value}
        </p>
        {hint && <p className="text-[11px] text-steel">{hint}</p>}
      </div>
    </div>
  );
}

export default function AuthoritiesKpiStrip({ stats }: { stats: AuthorityLiveStats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <KpiCell
        icon={Users}
        label="Travelers on map"
        value={String(stats.travelersOnMap)}
        hint="Live GPS"
      />
      <KpiCell
        icon={Building2}
        label="Registered hotels"
        value={String(stats.registeredHotels)}
        hint="StayNEP partners"
      />
      <KpiCell
        icon={AlertTriangle}
        label="Open reports"
        value={String(stats.openReports)}
        hint={
          stats.criticalOpen > 0
            ? `${stats.criticalOpen} critical`
            : "Awaiting triage"
        }
        alert={stats.criticalOpen > 0}
      />
      <KpiCell
        icon={Shield}
        label="Resolved (month)"
        value={String(stats.resolvedThisMonth)}
      />
      <KpiCell
        icon={Clock}
        label="Avg. resolution"
        value={
          stats.avgResolutionHours != null
            ? `${stats.avgResolutionHours}h`
            : "—"
        }
      />
    </div>
  );
}
