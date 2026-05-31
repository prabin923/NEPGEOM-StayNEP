'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Loader2,
  RefreshCw,
  Sun,
  Wind,
  CloudFog,
  Snowflake,
} from 'lucide-react';
import type { WeatherForecast } from '@/lib/weather';
import { weatherCodeLabel, weatherTravelHint } from '@/lib/weather';

interface TouristWeatherWidgetProps {
  lat: number;
  lng: number;
  label: string;
  compact?: boolean;
  className?: string;
}

function WeatherIcon({ code, className }: { code: number; className?: string }) {
  const cn = className ?? 'h-8 w-8 text-graphite';
  if (code === 0) return <Sun className={cn} />;
  if (code <= 3) return <CloudSun className={cn} />;
  if (code <= 48) return <CloudFog className={cn} />;
  if (code <= 67) return <CloudRain className={cn} />;
  if (code <= 77) return <Snowflake className={cn} />;
  if (code >= 95) return <CloudRain className={cn} />;
  return <Cloud className={cn} />;
}

function formatDay(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export default function TouristWeatherWidget({
  lat,
  lng,
  label,
  compact = false,
  className = '',
}: TouristWeatherWidgetProps) {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
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
      const res = await fetch(`/api/weather?${params.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Weather unavailable');
      }
      const data = (await res.json()) as WeatherForecast;
      setForecast(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Weather unavailable');
      setForecast(null);
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
        className={`flex items-center justify-center gap-2 rounded-[28px] border border-fog bg-snow p-5 text-sm text-steel font-cosmica ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading weather for {label}…
      </div>
    );
  }

  if (error || !forecast) {
    return (
      <div
        className={`rounded-[28px] border border-fog bg-snow p-5 ${className}`}
      >
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

  const { current, daily } = forecast;
  const today = daily[0];
  const hint = weatherTravelHint(
    current.weatherCode,
    today?.precipProbability
  );

  if (compact) {
    return (
      <div
        className={`rounded-[20px] border border-fog bg-mist/80 px-4 py-3 ${className}`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <WeatherIcon code={current.weatherCode} className="h-6 w-6 shrink-0 text-graphite" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-steel">{label}</p>
              <p className="text-lg font-bold text-obsidian font-cosmica leading-none">
                {Math.round(current.temperature)}°C
                <span className="ml-1.5 text-xs font-normal text-steel">
                  {weatherCodeLabel(current.weatherCode)}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={load}
            className="shrink-0 rounded-[10px] p-1.5 text-steel hover:bg-fog"
            aria-label="Refresh weather"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-[28px] border border-fog bg-snow p-5 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-steel">
            Weather update
          </p>
          <p className="mt-1 text-base font-semibold text-obsidian font-cosmica">
            {label}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-[10px] border border-fog p-2 text-steel transition hover:bg-fog"
          aria-label="Refresh weather"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <WeatherIcon code={current.weatherCode} className="h-12 w-12 text-graphite" />
        <div>
          <p className="text-4xl font-bold leading-none text-obsidian font-cosmica">
            {Math.round(current.temperature)}°
            <span className="text-2xl text-steel">C</span>
          </p>
          <p className="mt-1 text-sm text-graphite">
            {weatherCodeLabel(current.weatherCode)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-steel font-cosmica">
        <span className="inline-flex items-center gap-1">
          <Droplets className="h-3.5 w-3.5" />
          {current.humidity}% humidity
        </span>
        <span className="inline-flex items-center gap-1">
          <Wind className="h-3.5 w-3.5" />
          {Math.round(current.windSpeed)} km/h wind
        </span>
        {today && (
          <span className="inline-flex items-center gap-1">
            <CloudRain className="h-3.5 w-3.5" />
            {today.precipProbability}% rain chance today
          </span>
        )}
      </div>

      <p className="mt-3 rounded-[12px] bg-mist px-3 py-2 text-xs leading-relaxed text-graphite font-cosmica">
        {hint}
      </p>

      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {daily.slice(0, 5).map((day) => (
          <div
            key={day.date}
            className="flex flex-col items-center rounded-[12px] border border-fog bg-mist/50 px-1 py-2 text-center"
          >
            <span className="text-[10px] font-medium text-steel">
              {formatDay(day.date)}
            </span>
            <WeatherIcon
              code={day.weatherCode}
              className="my-1 h-5 w-5 text-graphite"
            />
            <span className="text-[11px] font-semibold text-obsidian">
              {Math.round(day.tempMax)}°
            </span>
            <span className="text-[10px] text-steel">
              {Math.round(day.tempMin)}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
