"use client";

import { Copy, Check, MapPin, Building2, Compass } from "lucide-react";
import { useState } from "react";
import type { AuthorityLiveStats, TransparencySnapshot } from "@/lib/tourist-reports";

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md p-1 text-steel transition hover:bg-fog hover:text-graphite"
      aria-label="Copy"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

interface AuthoritiesAnalyticsCardsProps {
  stats: AuthorityLiveStats;
  transparency?: TransparencySnapshot;
}

export default function AuthoritiesAnalyticsCards({
  stats,
  transparency,
}: AuthoritiesAnalyticsCardsProps) {
  const topDistricts = transparency?.byDistrict?.slice(0, 5) ?? [];

  return (
    <div className="space-y-3">
      {/* Top Districts */}
      <div className="rounded-[16px] border border-fog bg-snow px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-ink font-cosmica">
          <MapPin className="h-4 w-4 text-steel" />
          Top districts
        </div>
        {topDistricts.length === 0 ? (
          <p className="mt-2 text-sm text-steel">No district data</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {topDistricts.map((d) => (
              <li
                key={d.district}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-graphite">{d.district}</span>
                <span className="tabular-nums font-semibold text-ink">
                  {d.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Registered Hotels */}
      <div className="rounded-[16px] border border-fog bg-snow px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-ink font-cosmica">
            <Building2 className="h-4 w-4 text-steel" />
            Registered hotels
          </div>
          <CopyBtn value={String(stats.registeredHotels)} />
        </div>
        {stats.registeredHotels === 0 ? (
          <p className="mt-2 text-sm text-steel">No registered hotels</p>
        ) : (
          <p className="mt-1 text-2xl font-bold tracking-tight text-ink tabular-nums font-cosmica">
            {stats.registeredHotels}
          </p>
        )}
      </div>

      {/* Top Attractions */}
      <div className="rounded-[16px] border border-fog bg-snow px-4 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-ink font-cosmica">
          <Compass className="h-4 w-4 text-steel" />
          Top attractions
        </div>
        <ul className="mt-3 space-y-2">
          {[
            { name: "Pashupatinath Temple", visitors: "12.4k" },
            { name: "Phewa Lake", visitors: "9.8k" },
            { name: "Chitwan National Park", visitors: "7.2k" },
            { name: "Boudhanath Stupa", visitors: "6.9k" },
          ].map((a) => (
            <li
              key={a.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-graphite">{a.name}</span>
              <span className="tabular-nums font-semibold text-ink">
                {a.visitors}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
