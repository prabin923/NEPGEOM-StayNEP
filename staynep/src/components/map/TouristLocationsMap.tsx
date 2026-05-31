"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { TouristMapMarker } from "@/lib/traveler-locations";
import { hotels } from "@/data/hotels";
import { attractions } from "@/data/attractions";
import { emergencyServices } from "@/data/emergency";
import type { FilterType } from "@/components/LeafletMap";
import { Loader2, Users } from "lucide-react";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center bg-mist text-sm text-steel">
      Loading map…
    </div>
  ),
});

interface TouristLocationsMapProps {
  /** Pre-loaded markers (authorities SSR). If omitted, fetches from API. */
  initialTourists?: TouristMapMarker[];
  defaultFilter?: FilterType;
  heightClass?: string;
  showTouristCount?: boolean;
}

export default function TouristLocationsMap({
  initialTourists,
  defaultFilter = "tourists",
  showTouristCount = true,
}: TouristLocationsMapProps) {
  const [tourists, setTourists] = useState<TouristMapMarker[]>(
    initialTourists ?? []
  );
  const [loading, setLoading] = useState(!initialTourists);
  const [filter, setFilter] = useState<FilterType>(defaultFilter);

  useEffect(() => {
    if (initialTourists) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/travelers/locations");
        const data = await res.json();
        if (!cancelled && res.ok) {
          setTourists(data.tourists ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialTourists]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {showTouristCount && (
          <p className="flex items-center gap-2 text-sm text-steel">
            <Users className="h-4 w-4 text-graphite" />
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading registered travelers…
              </>
            ) : (
              <>
                <span className="font-semibold text-obsidian">{tourists.length}</span>
                signed-in traveler{tourists.length === 1 ? "" : "s"} on map
              </>
            )}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["tourists", "Travelers"],
              ["all", "All layers"],
              ["hotels", "Hotels"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filter === key
                  ? "bg-obsidian text-snow"
                  : "border border-fog bg-snow text-graphite hover:bg-fog"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-fog bg-snow shadow-sm">
        <LeafletMap
          hotels={hotels}
          attractions={attractions}
          emergencyServices={emergencyServices}
          filter={filter}
          tourists={tourists}
          enableHotelExplore={filter !== "tourists"}
        />
      </div>
    </div>
  );
}
