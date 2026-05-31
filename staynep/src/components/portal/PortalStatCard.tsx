import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PortalStatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  change?: string;
}

export default function PortalStatCard({
  icon: Icon,
  value,
  label,
  change,
}: PortalStatCardProps) {
  return (
    <div className="rounded-[28px] bg-fog p-6 transition hover:shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-snow">
          <Icon className="h-5 w-5 text-graphite" />
        </div>
        {change && (
          <span className="inline-flex items-center gap-1 rounded-full border border-fog bg-snow px-2.5 py-1 text-xs font-medium text-obsidian">
            <ArrowUpRight className="h-3 w-3" />
            {change}
          </span>
        )}
      </div>
      <p className="text-[28px] font-bold leading-none tracking-tight text-obsidian font-cosmica">
        {value}
      </p>
      <p className="mt-2 text-[13px] text-steel">{label}</p>
    </div>
  );
}
