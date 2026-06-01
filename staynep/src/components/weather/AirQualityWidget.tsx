"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, Wind, Sun, ShieldAlert } from "lucide-react";
import type { AirQualityData } from "@/lib/air-quality";
import { aqiLabel, aqiColor, aqiTravelAdvice, uvLabel, uvAdvice } from "@/lib/air-quality";

interface AirQualityWidgetProps {
  lat: number;
  lng: number;
  label: string;
  className?: string;
}

function AqiGauge({ aqi }: { aqi: number }) {
  const color = aqiColor(aqi);
  const pct = Math.min(100, (aqi / 300) * 100);

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-14">
        <svg viewBox="0 0 48 48" className="-rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="var(--c-fog, #ececee)"
            strokeWidth="5"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${pct * 1.256} 125.6`}
            className="transition-all duration-700"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums font-cosmica"
          style={{ color }}
        >
          {aqi}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-ink font-cosmica">{aqiLabel(aqi)}</p>
        <p className="text-[11px] text-steel">US AQI Index</p>
      </div>
    </div>
  );
}

export default function AirQualityWidget({
  lat,
  lng,
  label,
  className = "",
}: AirQualityWidgetProps) {
  const [data, setData] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        label,
      });
      const res = await fetch(`/api/air-quality?${params.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Air quality unavailable");
      }
      const json = (await res.json()) as AirQualityData;
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Air quality unavailable");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [lat, lng, label]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center gap-2 rounded-[20px] border border-fog bg-snow p-5 text-sm text-steel font-cosmica ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading air quality…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={`rounded-[20px] border border-fog bg-snow p-5 ${className}`}>
        <p className="text-sm text-steel font-cosmica">{error}</p>
        <button
          type="button"
          onClick={load}
          className="mt-2 text-xs font-medium text-obsidian underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const { current: c } = data;

  return (
    <div className={`rounded-[20px] border border-fog bg-snow p-5 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-steel">
            Air Quality &amp; UV
          </p>
          <p className="mt-1 text-base font-semibold text-obsidian font-cosmica">
            {label}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-[10px] border border-fog p-2 text-steel transition hover:bg-fog"
          aria-label="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* AQI Gauge + UV */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <AqiGauge aqi={c.aqi} />
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 text-sm font-medium text-ink font-cosmica">
            <Sun className="h-4 w-4 text-amber-500" />
            UV {c.uvIndex.toFixed(1)}
          </div>
          <p className="text-[11px] text-steel">{uvLabel(c.uvIndex)}</p>
          <p className="mt-0.5 text-[11px] text-steel">{uvAdvice(c.uvIndex)}</p>
        </div>
      </div>

      {/* Pollutant breakdown */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "PM2.5", value: c.pm25, unit: "µg/m³" },
          { label: "PM10", value: c.pm10, unit: "µg/m³" },
          { label: "Ozone", value: c.o3, unit: "µg/m³" },
        ].map((p) => (
          <div
            key={p.label}
            className="rounded-[10px] bg-mist/60 px-2 py-2 text-center"
          >
            <p className="text-[10px] uppercase text-steel">{p.label}</p>
            <p className="text-sm font-bold text-ink tabular-nums font-cosmica">
              {p.value.toFixed(1)}
            </p>
            <p className="text-[9px] text-steel">{p.unit}</p>
          </div>
        ))}
      </div>

      {/* Travel advice */}
      <div className="mt-3 flex items-start gap-2 rounded-[12px] bg-mist px-3 py-2.5">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-steel" />
        <p className="text-xs leading-relaxed text-graphite font-cosmica">
          {aqiTravelAdvice(c.aqi)}
        </p>
      </div>

      {/* Secondary stats */}
      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-steel font-cosmica">
        <span className="inline-flex items-center gap-1">
          <Wind className="h-3 w-3" />
          NO₂ {c.no2.toFixed(0)} µg/m³
        </span>
        <span className="inline-flex items-center gap-1">
          SO₂ {c.so2.toFixed(0)} µg/m³
        </span>
      </div>
    </div>
  );
}
