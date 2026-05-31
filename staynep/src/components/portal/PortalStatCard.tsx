import type { LucideIcon } from "lucide-react";

interface PortalStatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  change?: string;
  accent?: string;
}

export default function PortalStatCard({
  icon: Icon,
  value,
  label,
  change,
  accent = "#C9A24A",
}: PortalStatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-white/20">
      <div className="mb-3 flex items-center justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl ring-1"
          style={{ backgroundColor: `${accent}20`, borderColor: `${accent}40` }}
        >
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
        {change && (
          <span className="text-xs font-medium text-emerald-400">{change}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-0.5 text-sm text-gray-400">{label}</p>
    </div>
  );
}
