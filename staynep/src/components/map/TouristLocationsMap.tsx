"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { TouristMapMarker } from "@/lib/traveler-locations";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import type { ReportMapMarker } from "@/lib/report-map-markers";
import type { TrafficCorridor } from "@/lib/map-traffic";
import type { CatalogMapHotel, MapHotelReview } from "@/lib/map-hotels";
import { catalogHotelsForMap } from "@/lib/map-hotels";
import { hotels } from "@/data/hotels";
import { attractions } from "@/data/attractions";
import { emergencyServices } from "@/data/emergency";
import type { FilterType } from "@/lib/map-types";
import {
  AlertTriangle,
  Building2,
  Loader2,
  Route,
  Star,
  Users,
} from "lucide-react";

const MapTilerTourismMap = dynamic(
  () => import("@/components/MapTilerTourismMap").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="staynep-map-root flex items-center justify-center bg-mist text-sm text-steel">
        Loading map…
      </div>
    ),
  }
);

interface TouristLocationsMapProps {
  initialTourists?: TouristMapMarker[];
  initialHotels?: RegisteredHotelMarker[];
  initialReports?: ReportMapMarker[];
  initialTraffic?: TrafficCorridor[];
  initialCatalogHotels?: CatalogMapHotel[];
  initialRecentReviews?: MapHotelReview[];
  defaultFilter?: FilterType;
  heightClass?: string;
  showTouristCount?: boolean;
  /** Taller map + refined filter pills for ministry dashboard */
  variant?: "default" | "ministry";
}

export default function TouristLocationsMap({
  initialTourists,
  initialHotels,
  initialReports,
  initialTraffic,
  initialCatalogHotels,
  initialRecentReviews,
  defaultFilter = "tourists",
  heightClass,
  showTouristCount = true,
  variant = "default",
}: TouristLocationsMapProps) {
  const isMinistry = variant === "ministry";
  const mapHeight =
    heightClass ?? (isMinistry ? "h-[480px]" : "h-[420px]");
  const [tourists, setTourists] = useState<TouristMapMarker[]>(
    initialTourists ?? []
  );
  const [registeredHotels, setRegisteredHotels] = useState<RegisteredHotelMarker[]>(
    initialHotels ?? []
  );
  const [reportMarkers, setReportMarkers] = useState<ReportMapMarker[]>(
    initialReports ?? []
  );
  const [trafficCorridors, setTrafficCorridors] = useState<TrafficCorridor[]>(
    initialTraffic ?? []
  );
  const [catalogHotels, setCatalogHotels] = useState<CatalogMapHotel[]>(
    initialCatalogHotels ?? catalogHotelsForMap()
  );
  const [recentReviews, setRecentReviews] = useState<MapHotelReview[]>(
    initialRecentReviews ?? []
  );
  const [loading, setLoading] = useState(
    !(initialTourists && initialHotels && initialReports && initialTraffic)
  );
  const [filter, setFilter] = useState<FilterType>(defaultFilter);

  useEffect(() => {
    if (
      initialTourists &&
      initialHotels &&
      initialReports &&
      initialTraffic
    ) {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/map/overview", { cache: "no-store" });
        if (cancelled || !res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setTourists(data.tourists ?? []);
        setRegisteredHotels(data.registeredHotels ?? []);
        setReportMarkers(data.reports ?? []);
        setTrafficCorridors(data.traffic ?? []);
        if (data.catalogHotels?.length) setCatalogHotels(data.catalogHotels);
        setRecentReviews(data.recentReviews ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    const interval = window.setInterval(async () => {
      const res = await fetch("/api/map/overview", { cache: "no-store" });
      if (!res.ok || cancelled) return;
      const data = await res.json();
      if (cancelled) return;
      setTourists(data.tourists ?? []);
      setRegisteredHotels(data.registeredHotels ?? []);
      setReportMarkers(data.reports ?? []);
      setTrafficCorridors(data.traffic ?? []);
      if (data.catalogHotels?.length) setCatalogHotels(data.catalogHotels);
      setRecentReviews(data.recentReviews ?? []);
    }, 45_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [initialTourists, initialHotels, initialReports, initialTraffic]);

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
                  registered
                </span>
                <span className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold text-obsidian">
                    {registeredHotels.filter(
                      (h) => h.avgRating !== undefined && h.avgRating >= 4
                    ).length}
                  </span>
                  rated 4★+
                </span>
                <span className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-cyan-600" />
                  <span className="font-semibold text-obsidian">
                    {trafficCorridors.length}
                  </span>
                  corridors
                </span>
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-semibold text-obsidian">
                    {reportMarkers.length}
                  </span>
                  reports
                </span>
              </>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Map layers">
          {(
            [
              ["all", "All layers", null],
              ["hotels", "Hotels", "border-blue-200 text-blue-800"],
              ["rated", "Top rated", "border-amber-200 text-amber-800"],
              ["traffic", "Traffic", "border-cyan-200 text-cyan-800"],
              ["incidents", "Incidents", "border-red-200 text-red-800"],
              ["tourists", "Travelers", "border-pink-200 text-pink-800"],
              ["heatmap", "Heatmap", "border-orange-200 text-orange-800"],
            ] as const
          ).map(([key, label, accent]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                filter === key
                  ? "bg-obsidian text-snow shadow-sm"
                  : isMinistry && accent
                    ? `border bg-snow hover:bg-mist ${accent}`
                    : "border border-fog bg-snow text-graphite hover:bg-fog"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`overflow-hidden rounded-[20px] border border-fog bg-snow shadow-sm ${mapHeight}`}
      >
        <MapTilerTourismMap
          fillContainer
          hotels={catalogHotels}
          attractions={attractions}
          emergencyServices={emergencyServices}
          filter={filter}
          tourists={tourists}
          registeredHotels={registeredHotels}
          reportMarkers={reportMarkers}
          trafficCorridors={trafficCorridors}
          recentReviews={recentReviews}
          enableHotelExplore={
            filter !== "tourists" &&
            filter !== "incidents" &&
            filter !== "traffic" &&
            filter !== "heatmap"
          }
        />
      </div>
    </div>
  );
}
