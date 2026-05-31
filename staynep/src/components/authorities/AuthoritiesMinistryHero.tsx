"use client";

import Link from "next/link";
import { Eye, Radio } from "lucide-react";

interface AuthoritiesMinistryHeroProps {
  openReports: number;
  criticalOpen: number;
  travelersOnMap: number;
}

export default function AuthoritiesMinistryHero({
  openReports,
  criticalOpen,
  travelersOnMap,
}: AuthoritiesMinistryHeroProps) {
  const now = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="overflow-hidden rounded-[28px] border border-fog bg-obsidian text-snow shadow-lg">
      <div className="relative px-6 py-7 sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(220,38,38,0.25), transparent 50%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(59,130,246,0.15), transparent 45%)",
          }}
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90">
                <Radio className="h-3 w-3 text-emerald-400" aria-hidden />
                Live operations
              </span>
              <span className="text-xs text-white/50">Updated {now}</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl font-cosmica">
              Tourism Ministry Command Center
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-[15px]">
              Ministry of Culture, Tourism & Civil Aviation — monitor travelers,
              registered accommodation, and tourist safety reports across Nepal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-2 rounded-[16px] border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
              <div className="rounded-[12px] px-4 py-3 text-center">
                <p className="text-2xl font-bold tabular-nums">{travelersOnMap}</p>
                <p className="text-[10px] uppercase tracking-wide text-white/55">
                  On map
                </p>
              </div>
              <div className="rounded-[12px] px-4 py-3 text-center">
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    openReports > 0 ? "text-red-300" : ""
                  }`}
                >
                  {openReports}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-white/55">
                  Open issues
                </p>
              </div>
              {criticalOpen > 0 && (
                <div className="rounded-[12px] bg-red-500/20 px-4 py-3 text-center ring-1 ring-red-400/30">
                  <p className="text-2xl font-bold tabular-nums text-red-200">
                    {criticalOpen}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-red-200/90">
                    Critical
                  </p>
                </div>
              )}
            </div>
            <Link
              href="/transparency"
              className="inline-flex items-center gap-2 rounded-full bg-snow px-5 py-2.5 text-sm font-semibold text-obsidian transition hover:bg-white"
            >
              <Eye className="h-4 w-4" />
              Public portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
