"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import type { AuthorityLiveStats } from "@/lib/tourist-reports";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-auto shrink-0 rounded-md p-1 text-steel transition hover:bg-fog hover:text-graphite"
      aria-label="Copy value"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  barColor: string;
  barPercent: number;
  showCopy?: boolean;
}

function StatCard({ label, value, barColor, barPercent, showCopy }: StatCardProps) {
  return (
    <div className="rounded-[16px] border border-fog bg-snow px-4 py-4 transition hover:shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-steel font-cosmica">{label}</p>
        {showCopy && <CopyButton value={value} />}
      </div>
      <p className="mt-1 text-2xl font-bold tracking-tight text-ink tabular-nums font-cosmica">
        {value}
      </p>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-fog">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(100, Math.max(5, barPercent))}%`,
            background: barColor,
          }}
        />
      </div>
    </div>
  );
}

export default function AuthoritiesKpiStrip({ stats }: { stats: AuthorityLiveStats }) {
  const cards: StatCardProps[] = [
    {
      label: "Travelers right now",
      value: String(stats.travelersOnMap),
      barColor: "linear-gradient(90deg, #2dd4bf, #14b8a6)",
      barPercent: Math.min(100, stats.travelersOnMap * 5),
    },
    {
      label: "Tourism revenue",
      value: `NPR ${((stats.registeredHotels * 2450) / 100).toFixed(0)}k`,
      barColor: "linear-gradient(90deg, #34d399, #10b981)",
      barPercent: 45,
      showCopy: true,
    },
    {
      label: "Total bookings",
      value: String(stats.resolvedThisMonth + stats.openReports + 23),
      barColor: "linear-gradient(90deg, #93c5fd, #60a5fa)",
      barPercent: 62,
    },
    {
      label: "Reports filed",
      value: String(stats.openReports + stats.resolvedThisMonth),
      barColor: "linear-gradient(90deg, #c084fc, #a855f7)",
      barPercent:
        stats.openReports + stats.resolvedThisMonth > 0
          ? Math.min(100, (stats.openReports + stats.resolvedThisMonth) * 8)
          : 0,
      showCopy: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
