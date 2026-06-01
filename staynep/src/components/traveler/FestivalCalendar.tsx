"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plane } from "lucide-react";
import type { NepalFestival } from "@/data/nepal-festivals";
import { nepalFestivals, getUpcomingFestivals } from "@/data/nepal-festivals";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const impactColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700",
};

const categoryColors: Record<string, string> = {
  national: "bg-violet-100 text-violet-700",
  cultural: "bg-pink-100 text-pink-700",
  religious: "bg-amber-100 text-amber-700",
  seasonal: "bg-sky-100 text-sky-700",
};

function FestivalCard({
  festival,
  compact = false,
}: {
  festival: NepalFestival;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-[14px] border border-fog bg-snow transition hover:shadow-sm ${
        compact ? "px-3 py-2.5" : "px-4 py-3.5"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left"
      >
        <div className="flex items-start gap-3">
          <span className="shrink-0 text-2xl leading-none">{festival.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-ink font-cosmica">
                {festival.name}
              </p>
              <span className="text-xs text-steel">
                ({festival.nepaliName})
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-steel">{festival.dayRange}</span>
              <span className="text-[11px] text-steel">·</span>
              <span className="text-[11px] text-steel">{festival.region}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                  impactColors[festival.travelImpact]
                }`}
              >
                {festival.travelImpact} impact
              </span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold capitalize ${
                  categoryColors[festival.category]
                }`}
              >
                {festival.category}
              </span>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 border-t border-fog pt-3">
            <p className="text-sm text-graphite leading-relaxed">
              {festival.description}
            </p>
            <div className="mt-2.5 flex items-start gap-2 rounded-[10px] bg-mist px-3 py-2">
              <Plane className="mt-0.5 h-3.5 w-3.5 shrink-0 text-steel" />
              <p className="text-xs text-ink leading-relaxed">
                {festival.travelTip}
              </p>
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

export default function FestivalCalendar() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
  const [view, setView] = useState<"upcoming" | "calendar">("upcoming");

  const upcoming = useMemo(() => getUpcomingFestivals(5), []);

  const monthFestivals = useMemo(
    () => nepalFestivals.filter((f) => f.month === selectedMonth + 1),
    [selectedMonth]
  );

  const prevMonth = () =>
    setSelectedMonth((m) => (m === 0 ? 11 : m - 1));
  const nextMonth = () =>
    setSelectedMonth((m) => (m === 11 ? 0 : m + 1));

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-graphite" />
          <div>
            <h3 className="text-[18px] font-semibold text-ink font-cosmica">
              Festival &amp; event calendar
            </h3>
            <p className="text-[14px] text-steel font-cosmica">
              Plan around Nepal&apos;s festivals and seasonal events
            </p>
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="mb-4 flex gap-2">
        {(["upcoming", "calendar"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition ${
              view === v
                ? "bg-obsidian text-snow"
                : "border border-fog bg-snow text-graphite hover:bg-mist"
            }`}
          >
            {v === "upcoming" ? "Coming up" : "By month"}
          </button>
        ))}
      </div>

      {view === "upcoming" ? (
        <div className="space-y-2.5">
          {upcoming.map((f) => (
            <FestivalCard key={f.id} festival={f} />
          ))}
        </div>
      ) : (
        <div>
          {/* Month navigation */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-[10px] border border-fog bg-snow p-2 text-steel transition hover:bg-mist"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-base font-semibold text-ink font-cosmica">
              {MONTHS[selectedMonth]}
            </p>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-[10px] border border-fog bg-snow p-2 text-steel transition hover:bg-mist"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {monthFestivals.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-fog bg-mist/30 px-4 py-8 text-center">
              <p className="text-sm text-steel">
                No major festivals in {MONTHS[selectedMonth]}.
              </p>
              <p className="mt-1 text-xs text-steel">
                Check nearby months for events.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {monthFestivals.map((f) => (
                <FestivalCard key={f.id} festival={f} compact />
              ))}
            </div>
          )}

          {/* Month overview dots */}
          <div className="mt-4 flex justify-center gap-1">
            {MONTHS.map((m, i) => {
              const count = nepalFestivals.filter(
                (f) => f.month === i + 1
              ).length;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMonth(i)}
                  title={`${m} (${count} events)`}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    i === selectedMonth
                      ? "bg-obsidian ring-2 ring-obsidian/20"
                      : count > 0
                      ? "bg-steel/50 hover:bg-steel"
                      : "bg-fog"
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
