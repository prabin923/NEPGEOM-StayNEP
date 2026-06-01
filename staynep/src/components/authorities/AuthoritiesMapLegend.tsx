"use client";

import { useState } from "react";
import { Search, Eye, LayoutGrid, Maximize2 } from "lucide-react";

export default function AuthoritiesMapLegend() {
  const [searchValue, setSearchValue] = useState("");

  const items = [
    { color: "bg-pink-500", ring: "ring-pink-200", label: "Travelers (GPS)" },
    { color: "bg-blue-600", ring: "ring-blue-300", label: "Registered hotels" },
    { color: "bg-amber-500", ring: "ring-amber-200", label: "Top rated (4★+)" },
    { color: "bg-cyan-500", ring: "ring-cyan-200", label: "Traffic corridors" },
    { color: "bg-red-600", ring: "ring-red-200", label: "Open reports" },
    {
      color: "bg-red-700",
      ring: "ring-red-400",
      label: "Emergency SOS",
      pulse: true,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Search + Controls bar (Shopify-style) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search location"
            className="w-full rounded-[12px] border border-fog bg-snow py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-steel/60 transition focus:border-obsidian/30 focus:outline-none focus:ring-2 focus:ring-obsidian/10 font-cosmica"
          />
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            className="rounded-[10px] border border-fog bg-snow p-2.5 text-steel transition hover:bg-mist hover:text-ink"
            aria-label="Toggle view"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-[10px] border border-fog bg-snow p-2.5 text-steel transition hover:bg-mist hover:text-ink"
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-[10px] border border-fog bg-snow p-2.5 text-steel transition hover:bg-mist hover:text-ink"
            aria-label="Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[12px] border border-fog bg-mist/50 px-3 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-steel">
          Legend
        </span>
        {items.map((item) => (
          <span
            key={item.label}
            className="inline-flex items-center gap-2 text-xs text-graphite"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${item.color} ring-2 ${item.ring} ${
                item.pulse ? "animate-pulse" : ""
              }`}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
