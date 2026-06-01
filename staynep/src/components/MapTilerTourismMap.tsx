"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, { NavigationControl, Popup } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Hotel } from "@/data/hotels";
import type { CatalogMapHotel, MapHotelReview } from "@/lib/map-hotels";
import { reviewsByPropertyId } from "@/lib/map-hotels";
import type { Attraction } from "@/data/attractions";
import type { EmergencyService } from "@/data/emergency";
import type { TouristMapMarker } from "@/lib/traveler-locations";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import type { ReportMapMarker } from "@/lib/report-map-markers";
import type { TrafficCorridor } from "@/lib/map-traffic";
import type { FilterType } from "@/lib/map-types";
import {
  fromCatalogHotel,
  fromRegisteredHotel,
  type MapHotelSelection,
} from "@/lib/map-hotel-selection";
import { REPORT_CATEGORY_LABELS } from "@/lib/tourist-reports";
import {
  getWithinRadiusKm,
  formatDistanceKm,
  distanceKm,
  TRAVELER_NEARBY_RADIUS_KM,
} from "@/lib/geo";
import {
  hasMapTilerKey,
  mapTilerStyleUrl,
  NEPAL_DEFAULT_ZOOM,
  NEPAL_MAP_CENTER,
} from "@/lib/maptiler";
import MapUnavailable from "@/components/map/MapUnavailable";
import MapDotMarker from "@/components/map/MapDotMarker";
import { trafficStatusColor } from "@/lib/map-traffic";
import {
  ExploreRadiusLayer,
  MapFlyController,
  TouristHeatmapLayer,
  TrafficGeoLayer,
} from "@/components/map/maptiler-geo-layers";

function corridorMidpoint(c: TrafficCorridor): { lat: number; lng: number } {
  const mid = c.path[Math.floor(c.path.length / 2)];
  return { lat: mid[0], lng: mid[1] };
}

export type { FilterType } from "@/lib/map-types";

const TOP_RATED_MIN = 4;

const COLORS = {
  hotel: "#3b82f6",
  hotelSelected: "#2563eb",
  hotelDimmed: "#93c5fd",
  topRated: "#ca8a04",
  registered: "#1d4ed8",
  attraction: "#10b981",
  attractionNearby: "#059669",
  hospital: "#ef4444",
  police: "#f97316",
  shelter: "#8b5cf6",
  tourist: "#ec4899",
  incident: "#dc2626",
  incidentEmergency: "#b91c1c",
} as const;

type PopupState =
  | { kind: "catalog"; hotel: Hotel | CatalogMapHotel }
  | { kind: "registered"; hotel: RegisteredHotelMarker }
  | { kind: "attraction"; attraction: Attraction }
  | { kind: "emergency"; service: EmergencyService }
  | { kind: "tourist"; tourist: TouristMapMarker }
  | { kind: "report"; report: ReportMapMarker }
  | { kind: "traffic"; corridor: TrafficCorridor };

export interface MapTilerTourismMapProps {
  hotels: Hotel[];
  attractions: Attraction[];
  emergencyServices: EmergencyService[];
  filter: FilterType;
  selectedHotelId?: number | null;
  onHotelSelect?: (hotel: Hotel | null) => void;
  nearbyRadiusKm?: number;
  enableHotelExplore?: boolean;
  flyToPosition?: [number, number] | null;
  tourists?: TouristMapMarker[];
  registeredHotels?: RegisteredHotelMarker[];
  reportMarkers?: ReportMapMarker[];
  trafficCorridors?: TrafficCorridor[];
  recentReviews?: MapHotelReview[];
  highlightTrafficId?: string | null;
  selectedMapHotelKey?: string | null;
  onMapHotelSelect?: (hotel: MapHotelSelection | null) => void;
  fillContainer?: boolean;
  sectionLayout?: boolean;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <span key={i}>★</span>
      ))}
      <span className="ml-1 text-xs text-steel">{rating}</span>
    </span>
  );
}

function mapRootClassName(fillContainer: boolean, sectionLayout: boolean) {
  return [
    "staynep-map-root",
    fillContainer && "staynep-map-root--fill",
    sectionLayout && "staynep-map-root--section",
  ]
    .filter(Boolean)
    .join(" ");
}

function MapPopupBody({
  popup,
  selectedHotel,
  nearbyRadiusKm,
  enableHotelExplore,
  propertyReviews,
  onHotelSelect,
  onMapHotelSelect,
}: {
  popup: PopupState;
  selectedHotel: Hotel | null;
  nearbyRadiusKm: number;
  enableHotelExplore: boolean;
  propertyReviews: Map<string, MapHotelReview[]>;
  onHotelSelect?: (hotel: Hotel | null) => void;
  onMapHotelSelect?: (hotel: MapHotelSelection | null) => void;
}) {
  if (popup.kind === "traffic") {
    const c = popup.corridor;
    return (
      <>
        <h3 className="text-sm font-semibold text-obsidian">{c.routeLabel}</h3>
        <p className="text-steel">{c.name}</p>
        <p className="mt-2 capitalize font-medium text-obsidian">
          Status: <span style={{ color: trafficStatusColor(c.status) }}>{c.status}</span>
        </p>
        <p className="mt-1 text-xs text-steel">
          ~{c.distanceKm} km · {c.avgSpeedKmh} km/h avg
          {c.delayMin > 0 ? ` · +${c.delayMin} min delay` : ""}
        </p>
        {c.note && <p className="mt-2 text-xs text-graphite">{c.note}</p>}
        <p className="mt-2 text-[10px] text-steel">
          Updated {new Date(c.updatedAt).toLocaleTimeString()}
        </p>
      </>
    );
  }

  if (popup.kind === "catalog") {
    const catalog = popup.hotel as CatalogMapHotel;
    const reviewCount =
      "reviewCount" in catalog ? catalog.reviewCount : undefined;
    return (
      <>
        <h3 className="text-sm font-semibold text-obsidian">{popup.hotel.name}</h3>
        <p className="text-steel">{popup.hotel.district}</p>
        <p className="mt-2">
          <Stars rating={popup.hotel.rating} /> · {popup.hotel.priceRange}
        </p>
        {reviewCount !== undefined && (
          <p className="text-[10px] text-steel">
            {reviewCount.toLocaleString()} reference reviews · {catalog.reviewLabel ?? "catalog"}
          </p>
        )}
        <p className="mt-1">
          Rooms {popup.hotel.availableRooms}/{popup.hotel.totalRooms}
        </p>
        {onMapHotelSelect && (
          <button
            type="button"
            className="mt-2 w-full rounded-full bg-violet-700 px-3 py-2 text-xs font-semibold text-white"
            onClick={() => onMapHotelSelect(fromCatalogHotel(popup.hotel, null))}
          >
            Book with Gemini AI
          </button>
        )}
        {enableHotelExplore && onHotelSelect && (
          <button
            type="button"
            className="mt-2 w-full rounded-full border border-fog px-3 py-2 text-xs font-medium"
            onClick={() => onHotelSelect(popup.hotel)}
          >
            Show destinations within {nearbyRadiusKm} km
          </button>
        )}
      </>
    );
  }
  if (popup.kind === "registered") {
    const snippets = propertyReviews.get(popup.hotel.id) ?? [];
    return (
      <>
        <h3 className="text-sm font-semibold text-obsidian">{popup.hotel.name}</h3>
        <p className="text-amber-700">StayNEP partner</p>
        {popup.hotel.avgRating !== undefined && popup.hotel.reviewCount ? (
          <p className="mt-1">
            <Stars rating={popup.hotel.avgRating} /> ({popup.hotel.reviewCount}{" "}
            verified reviews)
          </p>
        ) : (
          <p className="mt-1 italic text-steel">New · no reviews yet</p>
        )}
        {snippets[0]?.comment && (
          <p className="mt-2 rounded-[10px] bg-mist px-2 py-1.5 text-[10px] italic text-graphite">
            &ldquo;{snippets[0].comment}&rdquo;
            <span className="mt-1 block not-italic text-steel">
              — {snippets[0].authorName}
            </span>
          </p>
        )}
        <p className="mt-1">
          {popup.hotel.availableUnits}/{popup.hotel.totalUnits} units
        </p>
        {onMapHotelSelect && (
          <button
            type="button"
            className="mt-2 w-full rounded-full bg-violet-700 px-3 py-2 text-xs font-semibold text-white"
            onClick={() => onMapHotelSelect(fromRegisteredHotel(popup.hotel))}
          >
            Book with Gemini AI
          </button>
        )}
      </>
    );
  }
  if (popup.kind === "attraction") {
    return (
      <>
        <h3 className="text-sm font-semibold text-obsidian">
          {popup.attraction.name}
        </h3>
        <p>{popup.attraction.category}</p>
        {selectedHotel && (
          <p className="mt-1 font-medium">
            {formatDistanceKm(
              distanceKm(
                selectedHotel.lat,
                selectedHotel.lng,
                popup.attraction.lat,
                popup.attraction.lng
              )
            )}{" "}
            from {selectedHotel.name}
          </p>
        )}
      </>
    );
  }
  if (popup.kind === "report") {
    return (
      <>
        <h3 className="text-sm font-semibold text-obsidian">{popup.report.title}</h3>
        <p>{REPORT_CATEGORY_LABELS[popup.report.category]}</p>
        <p className="capitalize">Status: {popup.report.status.toLowerCase()}</p>
      </>
    );
  }
  if (popup.kind === "tourist") {
    return (
      <>
        <h3 className="text-sm font-semibold text-obsidian">{popup.tourist.name}</h3>
        <p>StayNEP traveler</p>
        {popup.tourist.label && <p>Near {popup.tourist.label}</p>}
      </>
    );
  }
  return (
    <>
      <h3 className="text-sm font-semibold text-obsidian">{popup.service.name}</h3>
      <p className="capitalize">{popup.service.type}</p>
      <a href={`tel:${popup.service.contact}`}>{popup.service.contact}</a>
    </>
  );
}

function MapTilerTourismMapInner(props: MapTilerTourismMapProps) {
  const {
    hotels: hotelData,
    attractions: attractionData,
    emergencyServices: emergencyData,
    filter,
    selectedHotelId = null,
    onHotelSelect,
    nearbyRadiusKm = TRAVELER_NEARBY_RADIUS_KM,
    enableHotelExplore = true,
    flyToPosition = null,
    tourists = [],
    registeredHotels = [],
    reportMarkers = [],
    trafficCorridors = [],
    recentReviews = [],
    highlightTrafficId = null,
    selectedMapHotelKey = null,
    onMapHotelSelect,
    fillContainer = false,
    sectionLayout = false,
  } = props;

  const mapRef = useRef<MapRef>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const propertyReviews = useMemo(
    () => reviewsByPropertyId(recentReviews),
    [recentReviews]
  );

  const selectedHotel = useMemo(
    () => hotelData.find((h) => h.id === selectedHotelId) ?? null,
    [hotelData, selectedHotelId]
  );

  const nearbyAttractions = useMemo(() => {
    if (!selectedHotel) return [];
    return getWithinRadiusKm(selectedHotel, attractionData, nearbyRadiusKm);
  }, [selectedHotel, attractionData, nearbyRadiusKm]);

  const nearbyIds = useMemo(
    () => new Set(nearbyAttractions.map((a) => a.id)),
    [nearbyAttractions]
  );

  const exploreMode = enableHotelExplore && selectedHotel !== null;
  const incidentsOnly = filter === "incidents";
  const touristsOnly = filter === "tourists";
  const trafficOnly = filter === "traffic";
  const ratedOnly = filter === "rated";
  const heatmapMode = filter === "heatmap";

  const showHotels =
    !incidentsOnly &&
    !touristsOnly &&
    !trafficOnly &&
    !heatmapMode &&
    (filter === "all" || filter === "hotels" || filter === "rated");
  const showAttractions =
    !incidentsOnly &&
    !touristsOnly &&
    !trafficOnly &&
    !ratedOnly &&
    (filter === "all" || filter === "attractions" || exploreMode);
  const showEmergency =
    !incidentsOnly &&
    !touristsOnly &&
    !trafficOnly &&
    !ratedOnly &&
    (filter === "all" ||
      filter === "hospitals" ||
      filter === "police" ||
      filter === "shelters");
  const showTourists =
    !incidentsOnly &&
    !trafficOnly &&
    !ratedOnly &&
    (filter === "all" || filter === "tourists");
  const showRegisteredHotels =
    !incidentsOnly &&
    !touristsOnly &&
    !trafficOnly &&
    (filter === "all" || filter === "hotels" || filter === "rated");
  const showReports =
    filter === "all" || filter === "incidents" || filter === "traffic";
  const showTraffic = filter === "all" || filter === "traffic";

  const filteredEmergency = emergencyData.filter((e) => {
    if (filter === "all") return true;
    if (filter === "hospitals") return e.type === "hospital";
    if (filter === "police") return e.type === "police";
    if (filter === "shelters") return e.type === "shelter";
    return false;
  });

  useEffect(() => {
    if (!highlightTrafficId || trafficCorridors.length === 0) return;
    const corridor = trafficCorridors.find((c) => c.id === highlightTrafficId);
    if (!corridor) return;
    const mid = corridorMidpoint(corridor);
    setPopup({ kind: "traffic", corridor });
    mapRef.current?.getMap()?.flyTo({
      center: [mid.lng, mid.lat],
      zoom: 9,
      duration: 900,
    });
  }, [highlightTrafficId, trafficCorridors]);

  const popupLngLat = popup
    ? popup.kind === "traffic"
      ? (() => {
          const mid = corridorMidpoint(popup.corridor);
          return { lng: mid.lng, lat: mid.lat };
        })()
      : popup.kind === "catalog"
      ? { lng: popup.hotel.lng, lat: popup.hotel.lat }
      : popup.kind === "registered"
        ? { lng: popup.hotel.lng, lat: popup.hotel.lat }
        : popup.kind === "attraction"
          ? { lng: popup.attraction.lng, lat: popup.attraction.lat }
          : popup.kind === "emergency"
            ? { lng: popup.service.lng, lat: popup.service.lat }
            : popup.kind === "tourist"
              ? { lng: popup.tourist.lng, lat: popup.tourist.lat }
              : { lng: popup.report.lng, lat: popup.report.lat }
    : null;

  const handleHotelClick = (hotel: Hotel) => {
    setPopup({ kind: "catalog", hotel });
    if (onMapHotelSelect) {
      onMapHotelSelect(fromCatalogHotel(hotel, null));
      return;
    }
    if (!enableHotelExplore || !onHotelSelect) return;
    onHotelSelect(selectedHotelId === hotel.id ? null : hotel);
  };

  const rootClass = mapRootClassName(fillContainer, sectionLayout);

  useEffect(() => {
    const onInvalidate = () => mapRef.current?.resize();
    window.addEventListener("staynep-map-invalidate", onInvalidate);
    return () => window.removeEventListener("staynep-map-invalidate", onInvalidate);
  }, []);

  return (
    <div className={`${rootClass} staynep-map h-full w-full`}>
      <Map
        ref={mapRef}
        mapStyle={mapTilerStyleUrl()}
        initialViewState={{
          ...NEPAL_MAP_CENTER,
          zoom: NEPAL_DEFAULT_ZOOM,
        }}
        style={{ width: "100%", height: "100%" }}
        onClick={() => setPopup(null)}
        onLoad={() => {
          mapRef.current?.resize();
          window.dispatchEvent(new Event("staynep-map-invalidate"));
        }}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {showTraffic && (
          <>
            <TrafficGeoLayer
              corridors={trafficCorridors}
              emphasized={trafficOnly}
            />
            {trafficCorridors.map((c) => {
              const mid = corridorMidpoint(c);
              return (
                <MapDotMarker
                  key={`traffic-pin-${c.id}`}
                  longitude={mid.lng}
                  latitude={mid.lat}
                  color={trafficStatusColor(c.status)}
                  size={trafficOnly ? 16 : 12}
                  title={`${c.routeLabel} — ${c.status}`}
                  onClick={() => setPopup({ kind: "traffic", corridor: c })}
                />
              );
            })}
          </>
        )}

        {heatmapMode && <TouristHeatmapLayer tourists={tourists} />}

        {exploreMode && selectedHotel && (
          <ExploreRadiusLayer
            lat={selectedHotel.lat}
            lng={selectedHotel.lng}
            radiusKm={nearbyRadiusKm}
          />
        )}

        <MapFlyController
          mapRef={mapRef}
          flyToPosition={flyToPosition}
          selectedHotel={selectedHotel}
          nearbyAttractions={nearbyAttractions}
        />

        {showHotels &&
          hotelData.map((hotel) => {
            if (ratedOnly && hotel.rating < TOP_RATED_MIN) return null;
            const mapKey = `static-${hotel.id}`;
            const isExploreSelected = selectedHotelId === hotel.id;
            const isMapSelected = selectedMapHotelKey === mapKey;
            const isSelected = isExploreSelected || isMapSelected;
            const isDimmed = exploreMode && !isSelected;
            if (exploreMode && !isSelected && filter === "hotels") return null;

            const isTopRated = hotel.rating >= TOP_RATED_MIN;
            const color = isSelected
              ? COLORS.hotelSelected
              : isDimmed
                ? COLORS.hotelDimmed
                : isTopRated && (ratedOnly || filter === "all")
                  ? COLORS.topRated
                  : COLORS.hotel;

            return (
              <MapDotMarker
                key={`hotel-${hotel.id}`}
                longitude={hotel.lng}
                latitude={hotel.lat}
                color={color}
                size={isSelected ? 30 : 22}
                title={hotel.name}
                onClick={() => handleHotelClick(hotel)}
              />
            );
          })}

        {showRegisteredHotels &&
          registeredHotels.map((hotel) => {
            const isTopRated =
              hotel.avgRating !== undefined && hotel.avgRating >= TOP_RATED_MIN;
            if (ratedOnly && !isTopRated) return null;
            const isRegSelected = selectedMapHotelKey === hotel.id;
            const color = isRegSelected
              ? COLORS.hotelSelected
              : isTopRated && (ratedOnly || filter === "all")
                ? COLORS.topRated
                : COLORS.registered;

            return (
              <MapDotMarker
                key={`registered-${hotel.id}`}
                longitude={hotel.lng}
                latitude={hotel.lat}
                color={color}
                size={isRegSelected ? 30 : 24}
                title={hotel.name}
                onClick={() => {
                  setPopup({ kind: "registered", hotel });
                  onMapHotelSelect?.(fromRegisteredHotel(hotel));
                }}
              />
            );
          })}

        {showAttractions &&
          attractionData.map((attr) => {
            const isNearby = exploreMode && nearbyIds.has(attr.id);
            const isHidden =
              exploreMode && !isNearby && filter !== "attractions";
            if (isHidden) return null;

            return (
              <MapDotMarker
                key={`attr-${attr.id}`}
                longitude={attr.lng}
                latitude={attr.lat}
                color={isNearby ? COLORS.attractionNearby : COLORS.attraction}
                size={isNearby ? 26 : 22}
                title={attr.name}
                onClick={() => setPopup({ kind: "attraction", attraction: attr })}
              />
            );
          })}

        {showReports &&
          reportMarkers.map((report) => (
            <MapDotMarker
              key={`report-${report.id}`}
              longitude={report.lng}
              latitude={report.lat}
              color={
                report.isEmergency ? COLORS.incidentEmergency : COLORS.incident
              }
              size={report.isEmergency ? 28 : 22}
              title={report.title}
              onClick={() => setPopup({ kind: "report", report })}
            />
          ))}

        {showTourists &&
          tourists.map((t) => (
            <MapDotMarker
              key={`tourist-${t.id}`}
              longitude={t.lng}
              latitude={t.lat}
              color={COLORS.tourist}
              size={24}
              title={t.name}
              onClick={() => setPopup({ kind: "tourist", tourist: t })}
            />
          ))}

        {showEmergency &&
          !exploreMode &&
          filteredEmergency.map((svc) => {
            const color =
              svc.type === "hospital"
                ? COLORS.hospital
                : svc.type === "police"
                  ? COLORS.police
                  : COLORS.shelter;
            return (
              <MapDotMarker
                key={`emer-${svc.id}`}
                longitude={svc.lng}
                latitude={svc.lat}
                color={color}
                title={svc.name}
                onClick={() => setPopup({ kind: "emergency", service: svc })}
              />
            );
          })}

        {popupLngLat && popup && (
          <Popup
            longitude={popupLngLat.lng}
            latitude={popupLngLat.lat}
            anchor="bottom"
            closeOnClick={false}
            onClose={() => setPopup(null)}
            className="staynep-map-popup"
          >
            <div className="min-w-[200px] max-w-[260px] p-1 font-cosmica text-xs text-graphite">
              <MapPopupBody
                popup={popup}
                selectedHotel={selectedHotel}
                nearbyRadiusKm={nearbyRadiusKm}
                enableHotelExplore={enableHotelExplore}
                propertyReviews={propertyReviews}
                onHotelSelect={onHotelSelect}
                onMapHotelSelect={onMapHotelSelect}
              />
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

export default function MapTilerTourismMap(props: MapTilerTourismMapProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const rootClass = mapRootClassName(
    props.fillContainer ?? false,
    props.sectionLayout ?? false
  );

  if (!ready) {
    return (
      <div className={rootClass} aria-hidden>
        <div className="flex h-full w-full items-center justify-center bg-mist">
          <p className="text-sm text-steel font-cosmica">Loading map…</p>
        </div>
      </div>
    );
  }

  if (!hasMapTilerKey()) {
    return (
      <MapUnavailable
        fillContainer={props.fillContainer}
        sectionLayout={props.sectionLayout}
      />
    );
  }

  return <MapTilerTourismMapInner {...props} />;
}
