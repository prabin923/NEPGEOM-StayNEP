"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { TouristMapMarker } from "@/lib/traveler-locations";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import type { ReportMapMarker } from "@/lib/report-map-markers";
import { hotels } from "@/data/hotels";
import { attractions } from "@/data/attractions";
import { emergencyServices } from "@/data/emergency";
import type { FilterType } from "@/components/LeafletMap";
import { AlertTriangle, Building2, Loader2, Users } from "lucide-react";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center bg-mist text-sm text-steel">
      Loading map…
    </div>
  ),
});

interface TouristLocationsMapProps {
  initialTourists?: TouristMapMarker[];
  initialHotels?: RegisteredHotelMarker[];
  initialReports?: ReportMapMarker[];
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
  const [loading, setLoading] = useState(
    !(initialTourists && initialHotels && initialReports)
  );
  const [filter, setFilter] = useState<FilterType>(defaultFilter);

  useEffect(() => {
    if (initialTourists && initialHotels && initialReports) return;

    let cancelled = false;
    (async () => {
      try {
        const [travelersRes, hotelsRes, reportsRes] = await Promise.all([
          initialTourists
            ? Promise.resolve(null)
            : fetch("/api/travelers/locations"),
          initialHotels ? Promise.resolve(null) : fetch("/api/hotels/locations"),
          initialReports ? Promise.resolve(null) : fetch("/api/reports/locations"),
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
        if (reportsRes) {
          const data = await reportsRes.json();
          if (reportsRes.ok) setReportMarkers(data.reports ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialTourists, initialHotels, initialReports]);

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
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-semibold text-obsidian">
                    {reportMarkers.length}
                  </span>
                  open report{reportMarkers.length === 1 ? "" : "s"}
                </span>
              </>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Map layers">
          {(
            [
              ["all", "All layers", null],
              ["incidents", "Incidents", "border-red-200 text-red-800"],
              ["tourists", "Travelers", "border-pink-200 text-pink-800"],
              ["hotels", "Hotels", "border-blue-200 text-blue-800"],
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
        <LeafletMap
          hotels={hotels}
          attractions={attractions}
          emergencyServices={emergencyServices}
          filter={filter}
          tourists={tourists}
          registeredHotels={registeredHotels}
          reportMarkers={reportMarkers}
          enableHotelExplore={filter !== "tourists" && filter !== "incidents"}
        />
      </div>
    </div>
  );
}
