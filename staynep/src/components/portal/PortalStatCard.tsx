import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PortalStatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  change?: string;
  tone?: "default" | "alert" | "live";
}

export default function PortalStatCard({
  icon: Icon,
  value,
  label,
  change,
  tone = "default",
}: PortalStatCardProps) {
  const shell =
    tone === "alert"
      ? "rounded-[28px] border border-red-200/80 bg-red-50/50 p-6"
      : tone === "live"
        ? "rounded-[28px] border border-emerald-200/60 bg-emerald-50/30 p-6"
        : "rounded-[28px] bg-fog p-6";

  return (
    <div className={`${shell} transition hover:shadow-sm`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-snow">
          <Icon
            className={`h-5 w-5 ${
              tone === "alert" ? "text-red-700" : "text-graphite"
            }`}
          />
        </div>
        {change && (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${
              tone === "live"
                ? "border-emerald-200 bg-snow text-emerald-800"
                : tone === "alert"
                  ? "border-red-200 bg-snow text-red-800"
                  : "border-fog bg-snow text-obsidian"
            }`}
          >
            {tone !== "alert" && <ArrowUpRight className="h-3 w-3" />}
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
