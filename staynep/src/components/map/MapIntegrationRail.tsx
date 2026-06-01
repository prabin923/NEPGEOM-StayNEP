"use client";

import { Building2, MessageSquare, Route, Star } from "lucide-react";
import type { CatalogMapHotel } from "@/lib/map-hotels";
import type { MapHotelReview } from "@/lib/map-hotels";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import type { TrafficCorridor } from "@/lib/map-traffic";
import { trafficStatusColor } from "@/lib/map-traffic";
import type { FilterType } from "@/lib/map-types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MapIntegrationRail({
  filter,
  catalogHotels,
  registeredHotels,
  recentReviews,
  traffic,
  trafficUpdatedAt,
  onSelectHotel,
  onSelectTraffic,
}: {
  filter: FilterType;
  catalogHotels: CatalogMapHotel[];
  registeredHotels: RegisteredHotelMarker[];
  recentReviews: MapHotelReview[];
  traffic: TrafficCorridor[];
  trafficUpdatedAt?: string;
  onSelectHotel?: (lat: number, lng: number) => void;
  onSelectTraffic?: (corridorId: string) => void;
}) {
  const showHotels =
    filter === "all" || filter === "hotels" || filter === "rated";
  const showTraffic = filter === "all" || filter === "traffic";
  const showReviews =
    filter === "all" || filter === "hotels" || filter === "rated";

  const topRegistered = [...registeredHotels]
    .sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
    .slice(0, 6);
  const topCatalog = [...catalogHotels]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="flex max-h-[min(420px,calc(100vh-18rem))] flex-col gap-3 overflow-y-auto overscroll-contain pr-0.5">
      {showTraffic && traffic.length > 0 && (
        <div className="shrink-0 rounded-[20px] border border-fog bg-snow px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-steel">
              <Route className="h-3.5 w-3.5" />
              Traffic updates
            </p>
            {trafficUpdatedAt && (
              <span className="text-[10px] text-steel">
                {formatTime(trafficUpdatedAt)}
              </span>
            )}
          </div>
          <ul className="space-y-2">
            {traffic.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelectTraffic?.(c.id)}
                  className="w-full rounded-[12px] border border-fog bg-mist/50 px-3 py-2 text-left transition hover:border-graphite hover:bg-mist"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium text-obsidian">
                      {c.routeLabel}
                    </span>
                    <span
                      className="shrink-0 text-[10px] font-semibold capitalize"
                      style={{ color: trafficStatusColor(c.status) }}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-steel">
                    {c.name}
                    {c.delayMin > 0 ? ` · +${c.delayMin} min` : ""} · ~
                    {c.avgSpeedKmh} km/h
                  </p>
                  {c.note && (
                    <p className="mt-1 line-clamp-2 text-[10px] text-graphite">
                      {c.note}
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showHotels && (topRegistered.length > 0 || topCatalog.length > 0) && (
        <div className="shrink-0 rounded-[20px] border border-fog bg-snow px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-steel">
            <Building2 className="h-3.5 w-3.5" />
            Hotels on map
          </p>
          <ul className="space-y-1.5">
            {topRegistered.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => onSelectHotel?.(h.lat, h.lng)}
                  className="flex w-full items-start justify-between gap-2 rounded-[10px] px-2 py-1.5 text-left hover:bg-mist"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-obsidian">
                      {h.name}
                    </span>
                    <span className="text-[10px] text-amber-700">StayNEP</span>
                  </span>
                  <span className="shrink-0 text-[10px] text-graphite">
                    {h.avgRating !== undefined ? (
                      <>
                        <Star className="mr-0.5 inline h-3 w-3 text-amber-500" />
                        {h.avgRating}
                        {h.reviewCount ? ` (${h.reviewCount})` : ""}
                      </>
                    ) : (
                      "New"
                    )}
                  </span>
                </button>
              </li>
            ))}
            {topCatalog.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => onSelectHotel?.(h.lat, h.lng)}
                  className="flex w-full items-start justify-between gap-2 rounded-[10px] px-2 py-1.5 text-left hover:bg-mist"
                >
                  <span className="min-w-0 truncate text-xs font-medium text-obsidian">
                    {h.name}
                  </span>
                  <span className="shrink-0 text-[10px] text-graphite">
                    ★{h.rating}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showReviews && recentReviews.length > 0 && (
        <div className="shrink-0 rounded-[20px] border border-fog bg-snow px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-steel">
            <MessageSquare className="h-3.5 w-3.5" />
            Latest StayNEP reviews
          </p>
          <ul className="space-y-2">
            {recentReviews.slice(0, 5).map((r) => (
              <li
                key={r.id}
                className="rounded-[12px] border border-fog bg-mist/40 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-medium text-obsidian">
                    {r.propertyName}
                  </span>
                  <span className="shrink-0 text-[10px] font-semibold text-amber-600">
                    ★{r.rating}
                  </span>
                </div>
                {r.comment && (
                  <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-steel">
                    &ldquo;{r.comment}&rdquo;
                  </p>
                )}
                <p className="mt-1 text-[10px] text-steel">
                  {r.authorName} · {r.district}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
