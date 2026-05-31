"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { TouristMapMarker } from "@/lib/traveler-locations";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import { hotels } from "@/data/hotels";
import { attractions } from "@/data/attractions";
import { emergencyServices } from "@/data/emergency";
import type { FilterType } from "@/components/LeafletMap";
import { Loader2, Users, Building2 } from "lucide-react";

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
  initialHotels?: RegisteredHotelMarker[];
  defaultFilter?: FilterType;
  heightClass?: string;
  showTouristCount?: boolean;
}

export default function TouristLocationsMap({
  initialTourists,
  initialHotels,
  defaultFilter = "tourists",
  showTouristCount = true,
}: TouristLocationsMapProps) {
  const [tourists, setTourists] = useState<TouristMapMarker[]>(
    initialTourists ?? []
  );
  const [registeredHotels, setRegisteredHotels] = useState<RegisteredHotelMarker[]>(
    initialHotels ?? []
  );
  const [loading, setLoading] = useState(!(initialTourists && initialHotels));
  const [filter, setFilter] = useState<FilterType>(defaultFilter);

  useEffect(() => {
    if (initialTourists && initialHotels) return;

    let cancelled = false;
    (async () => {
      try {
        const [travelersRes, hotelsRes] = await Promise.all([
          initialTourists
            ? Promise.resolve(null)
            : fetch("/api/travelers/locations"),
          initialHotels ? Promise.resolve(null) : fetch("/api/hotels/locations"),
        ]);
        if (cancelled) return;
        if (travelersRes) {
          const data = await travelersRes.json();
          if (travelersRes.ok) setTourists(data.tourists ?? []);
        }
        if (hotelsRes) {
          const data = await hotelsRes.json();
          if (hotelsRes.ok) setRegisteredHotels(data.hotels ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialTourists, initialHotels]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {showTouristCount && (
          <div className="flex flex-wrap items-center gap-4 text-sm text-steel">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading map data…
              </span>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-graphite" />
                  <span className="font-semibold text-obsidian">{tourists.length}</span>
                  traveler{tourists.length === 1 ? "" : "s"}
                </span>
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-obsidian">
                    {registeredHotels.length}
                  </span>
                  registered hotel{registeredHotels.length === 1 ? "" : "s"}
                </span>
              </>
            )}
          </div>
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
          registeredHotels={registeredHotels}
          enableHotelExplore={filter !== "tourists"}
        />
      </div>
    </div>
  );
}
