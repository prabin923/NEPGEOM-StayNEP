'use client';

import { Landmark, X, Navigation } from 'lucide-react';
import type { Hotel } from '@/data/hotels';
import type { Attraction } from '@/data/attractions';
import type { WithDistance } from '@/lib/geo';
import { formatDistanceKm } from '@/lib/geo';

interface NearbyDestinationsPanelProps {
  hotel: Hotel;
  nearby: WithDistance<Attraction>[];
  radiusKm: number;
  onClear: () => void;
  onSelectAttraction?: (attraction: Attraction) => void;
  compact?: boolean;
}

export default function NearbyDestinationsPanel({
  hotel,
  nearby,
  radiusKm,
  onClear,
  onSelectAttraction,
  compact = false,
}: NearbyDestinationsPanelProps) {
  return (
    <div
      className={`rounded-[28px] border border-fog bg-snow ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-steel">
            Selected stay
          </p>
          <p className="mt-1 truncate text-base font-semibold text-obsidian font-cosmica">
            {hotel.name}
          </p>
          <p className="text-xs text-steel">{hotel.district}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 rounded-[10px] border border-fog p-1.5 text-steel transition hover:bg-fog hover:text-obsidian"
          aria-label="Clear hotel selection"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-[12px] bg-mist px-3 py-2">
        <Navigation className="h-4 w-4 shrink-0 text-graphite" />
        <p className="text-xs text-graphite font-cosmica">
          <span className="font-semibold text-obsidian">{nearby.length}</span>{' '}
          destination{nearby.length === 1 ? '' : 's'} within{' '}
          <span className="font-semibold text-obsidian">{radiusKm} km</span>
        </p>
      </div>

      {nearby.length === 0 ? (
        <p className="mt-4 text-sm leading-relaxed text-steel font-cosmica">
          No mapped destinations within {radiusKm} km yet. Try another hotel or
          zoom out to explore wider regions.
        </p>
      ) : (
        <ul className={`mt-3 space-y-2 ${compact ? 'max-h-48' : 'max-h-64'} overflow-y-auto`}>
          {nearby.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => onSelectAttraction?.(place)}
                className="flex w-full items-start gap-2.5 rounded-[12px] border border-fog bg-mist/50 px-3 py-2.5 text-left transition hover:border-graphite hover:bg-fog/80"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-snow">
                  <Landmark className="h-4 w-4 text-emerald-600" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">
                    {place.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] capitalize text-steel">
                    {place.category} · {formatDistanceKm(place.distanceKm)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
