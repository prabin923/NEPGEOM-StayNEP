import type { LucideIcon } from "lucide-react";

interface HotelMetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  badge?: string;
  icon?: LucideIcon;
}

export default function HotelMetricCard({
  label,
  value,
  subtitle,
  badge,
  icon: Icon,
}: HotelMetricCardProps) {
  return (
    <div className="rounded-[16px] border border-fog bg-snow p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-steel">{label}</p>
        {badge && (
          <span className="shrink-0 rounded-full border border-fog bg-mist px-2 py-0.5 text-[10px] font-medium text-graphite">
            {badge}
          </span>
        )}
        {Icon && !badge && (
          <Icon className="h-4 w-4 shrink-0 text-steel" strokeWidth={1.75} />
        )}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-obsidian font-cosmica">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-steel">{subtitle}</p>
      )}
    </div>
  );
}
