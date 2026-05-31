'use client';

import 'leaflet/dist/leaflet.css';

import { useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import type { Hotel } from '@/data/hotels';
import type { Attraction } from '@/data/attractions';
import type { EmergencyService } from '@/data/emergency';
import type { TouristMapMarker } from '@/lib/traveler-locations';
import type { RegisteredHotelMarker } from '@/lib/registered-hotels';
import type { ReportMapMarker } from '@/lib/report-map-markers';
import {
  fromCatalogHotel,
  fromRegisteredHotel,
  type MapHotelSelection,
} from '@/lib/map-hotel-selection';
import { REPORT_CATEGORY_LABELS } from '@/lib/tourist-reports';
import {
  getWithinRadiusKm,
  formatDistanceKm,
  distanceKm,
  TRAVELER_NEARBY_RADIUS_KM,
} from '@/lib/geo';

function createColorIcon(
  color: string,
  ring: string,
  size = 22,
  extra = ''
) {
  const half = size / 2;
  return L.divIcon({
    className: 'staynep-marker',
    iconSize: [size, size],
    iconAnchor: [half, half],
    popupAnchor: [0, -half - 2],
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};
      border:2.5px solid #ffffff;
      box-shadow:0 0 0 1px ${ring}, 0 4px 10px rgba(9,9,11,0.12);
      ${extra}
    "></div>`,
  });
}

const icons = {
  hotel: createColorIcon('#3b82f6', 'rgba(59,130,246,0.35)'),
  hotelSelected: createColorIcon(
    '#2563eb',
    'rgba(37,99,235,0.5)',
    30,
    'box-shadow:0 0 0 4px rgba(37,99,235,0.2), 0 0 0 1px rgba(37,99,235,0.5), 0 6px 16px rgba(9,9,11,0.18);'
  ),
  hotelDimmed: createColorIcon('#93c5fd', 'rgba(147,197,253,0.4)', 18, 'opacity:0.55;'),
  attraction: createColorIcon('#10b981', 'rgba(16,185,129,0.35)'),
  attractionNearby: createColorIcon(
    '#059669',
    'rgba(5,150,105,0.45)',
    26,
    'box-shadow:0 0 0 3px rgba(16,185,129,0.25), 0 4px 12px rgba(9,9,11,0.15);'
  ),
  hospital: createColorIcon('#ef4444', 'rgba(239,68,68,0.35)'),
  police: createColorIcon('#f97316', 'rgba(249,115,22,0.35)'),
  shelter: createColorIcon('#8b5cf6', 'rgba(139,92,246,0.35)'),
  tourist: createColorIcon(
    '#ec4899',
    'rgba(236,72,153,0.45)',
    24,
    'box-shadow:0 0 0 3px rgba(236,72,153,0.2), 0 4px 12px rgba(9,9,11,0.12);'
  ),
  registeredHotel: createColorIcon(
    '#1d4ed8',
    'rgba(245,158,11,0.6)',
    26,
    'box-shadow:0 0 0 3px rgba(245,158,11,0.35), 0 4px 12px rgba(9,9,11,0.15);'
  ),
  incident: createColorIcon('#dc2626', 'rgba(220,38,38,0.45)', 24),
  incidentEmergency: createColorIcon(
    '#b91c1c',
    'rgba(220,38,38,0.6)',
    30,
    'box-shadow:0 0 0 4px rgba(239,68,68,0.35), 0 6px 14px rgba(9,9,11,0.2);animation:pulse 1.5s ease-in-out infinite;'
  ),
} as const;

export type FilterType =
  | 'all'
  | 'hotels'
  | 'attractions'
  | 'hospitals'
  | 'police'
  | 'shelters'
  | 'tourists'
  | 'incidents';

interface LeafletMapProps {
  hotels: Hotel[];
  attractions: Attraction[];
  emergencyServices: EmergencyService[];
  filter: FilterType;
  selectedHotelId?: number | null;
  onHotelSelect?: (hotel: Hotel | null) => void;
  nearbyRadiusKm?: number;
  /** When true, clicking a hotel reveals destinations within radiusKm */
  enableHotelExplore?: boolean;
  flyToPosition?: [number, number] | null;
  tourists?: TouristMapMarker[];
  registeredHotels?: RegisteredHotelMarker[];
  reportMarkers?: ReportMapMarker[];
  selectedMapHotelKey?: string | null;
  onMapHotelSelect?: (hotel: MapHotelSelection | null) => void;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <svg
          key={i}
          className="h-3.5 w-3.5 text-obsidian"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-steel">{rating}</span>
    </span>
  );
}

function PopupBadge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'hotel' | 'attraction' | 'hospital' | 'police' | 'shelter' | 'neutral';
}) {
  const tones = {
    hotel: 'bg-blue-50 text-blue-700',
    attraction: 'bg-emerald-50 text-emerald-700',
    hospital: 'bg-red-50 text-red-700',
    police: 'bg-orange-50 text-orange-700',
    shelter: 'bg-violet-50 text-violet-700',
    neutral: 'bg-fog text-graphite',
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function MapViewController({
  selectedHotel,
  nearbyAttractions,
  flyToPosition,
}: {
  selectedHotel: Hotel | null;
  nearbyAttractions: Attraction[];
  flyToPosition: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (flyToPosition) {
      map.flyTo(flyToPosition, 14, { duration: 0.85 });
      return;
    }
    if (!selectedHotel) return;

    if (nearbyAttractions.length > 0) {
      const bounds = L.latLngBounds([
        [selectedHotel.lat, selectedHotel.lng],
        ...nearbyAttractions.map((a) => [a.lat, a.lng] as [number, number]),
      ]);
      map.flyToBounds(bounds, {
        padding: [56, 56],
        maxZoom: 14,
        duration: 1.1,
      });
    } else {
      map.flyTo([selectedHotel.lat, selectedHotel.lng], 12, { duration: 1.1 });
    }
  }, [selectedHotel, nearbyAttractions, flyToPosition, map]);

  return null;
}

function HotelPopupContent({
  hotel,
  nearby,
  radiusKm,
  onExplore,
  onBookWithAi,
  canExplore,
}: {
  hotel: Hotel;
  nearby: { name: string; category: string; distanceKm: number }[];
  radiusKm: number;
  onExplore: () => void;
  onBookWithAi?: () => void;
  canExplore: boolean;
}) {
  return (
    <div className="min-w-[220px] font-cosmica">
      <div className="mb-2 flex items-start gap-2">
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
        <div>
          <h3 className="text-sm font-semibold leading-tight text-obsidian">
            {hotel.name}
          </h3>
          <p className="mt-0.5 text-xs text-steel">{hotel.district}</p>
        </div>
      </div>
      <div className="space-y-2 border-t border-fog pt-2 text-xs">
        <div className="flex items-center justify-between gap-2">
          <PopupBadge tone="hotel">{hotel.type}</PopupBadge>
          <Stars rating={hotel.rating} />
        </div>
        <p className="text-steel">
          <span className="font-medium text-graphite">Rooms </span>
          <span className="font-semibold text-obsidian">{hotel.availableRooms}</span>
          <span className="text-steel"> / {hotel.totalRooms}</span>
        </p>
        <p className="font-medium text-obsidian">{hotel.priceRange}</p>
        {onBookWithAi && (
          <button
            type="button"
            onClick={onBookWithAi}
            className="mt-1 w-full rounded-[36px] bg-violet-700 px-3 py-2 text-xs font-semibold text-snow transition hover:bg-violet-800"
          >
            Book with Gemini AI
          </button>
        )}
        {canExplore && (
          <button
            type="button"
            onClick={onExplore}
            className="mt-1 w-full rounded-[36px] border border-fog bg-snow px-3 py-2 text-xs font-medium text-obsidian transition hover:bg-mist"
          >
            Show destinations within {radiusKm} km
          </button>
        )}
        {nearby.length > 0 && (
          <div className="mt-2 rounded-[12px] bg-mist p-2">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-steel">
              Nearby ({nearby.length})
            </p>
            <ul className="max-h-28 space-y-1 overflow-y-auto">
              {nearby.slice(0, 5).map((place) => (
                <li
                  key={place.name}
                  className="flex justify-between gap-2 text-[11px] text-graphite"
                >
                  <span className="truncate">{place.name}</span>
                  <span className="shrink-0 text-steel">
                    {formatDistanceKm(place.distanceKm)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LeafletMap({
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
  selectedMapHotelKey = null,
  onMapHotelSelect,
}: LeafletMapProps) {
  const selectedHotel = useMemo(
    () => hotelData.find((h) => h.id === selectedHotelId) ?? null,
    [hotelData, selectedHotelId]
  );

  const nearbyAttractions = useMemo(() => {
    if (!selectedHotel) return [];
    return getWithinRadiusKm(
      selectedHotel,
      attractionData,
      nearbyRadiusKm
    );
  }, [selectedHotel, attractionData, nearbyRadiusKm]);

  const nearbyIds = useMemo(
    () => new Set(nearbyAttractions.map((a) => a.id)),
    [nearbyAttractions]
  );

  const exploreMode = enableHotelExplore && selectedHotel !== null;

  const incidentsOnly = filter === 'incidents';
  const touristsOnly = filter === 'tourists';
  const showHotels =
    !incidentsOnly &&
    !touristsOnly &&
    (filter === 'all' || filter === 'hotels');
  const showAttractions =
    !incidentsOnly &&
    !touristsOnly &&
    (filter === 'all' || filter === 'attractions' || exploreMode);
  const showEmergency =
    !incidentsOnly &&
    !touristsOnly &&
    (filter === 'all' ||
      filter === 'hospitals' ||
      filter === 'police' ||
      filter === 'shelters');
  const showTourists =
    !incidentsOnly && (filter === 'all' || filter === 'tourists');
  const showRegisteredHotels =
    !incidentsOnly &&
    !touristsOnly &&
    (filter === 'all' || filter === 'hotels');
  const showReports =
    filter === 'all' || filter === 'incidents';

  const filteredEmergency = emergencyData.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'hospitals') return e.type === 'hospital';
    if (filter === 'police') return e.type === 'police';
    if (filter === 'shelters') return e.type === 'shelter';
    return false;
  });

  const handleHotelClick = (hotel: Hotel) => {
    if (onMapHotelSelect) {
      onMapHotelSelect(fromCatalogHotel(hotel, null));
      return;
    }
    if (!enableHotelExplore || !onHotelSelect) return;
    onHotelSelect(selectedHotelId === hotel.id ? null : hotel);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <MapContainer
        center={[28.3949, 84.124]}
        zoom={7}
        minZoom={6}
        maxZoom={18}
        scrollWheelZoom
        zoomControl={false}
        className="z-0 staynep-map"
        style={{ height: '420px', width: '100%' }}
      >
        <ZoomControl position="topright" />
        <TileLayer
          maxZoom={19}
          maxNativeZoom={19}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {exploreMode && selectedHotel && (
          <>
            <Circle
              center={[selectedHotel.lat, selectedHotel.lng]}
              radius={nearbyRadiusKm * 1000}
              pathOptions={{
                color: '#09090b',
                weight: 1.5,
                opacity: 0.45,
                fillColor: '#09090b',
                fillOpacity: 0.05,
                dashArray: '8 10',
              }}
            />
            <MapViewController
              selectedHotel={selectedHotel}
              nearbyAttractions={nearbyAttractions}
              flyToPosition={flyToPosition}
            />
          </>
        )}

        {showHotels &&
          hotelData.map((hotel) => {
            const mapKey = `static-${hotel.id}`;
            const isMapSelected = selectedMapHotelKey === mapKey;
            const isExploreSelected = selectedHotelId === hotel.id;
            const isSelected = isMapSelected || isExploreSelected;
            const isDimmed = exploreMode && !isExploreSelected && !isMapSelected;

            if (exploreMode && !isSelected && filter === 'hotels') {
              return null;
            }

            const nearbyForHotel = getWithinRadiusKm(
              hotel,
              attractionData,
              nearbyRadiusKm
            );

            return (
              <Marker
                key={`hotel-${hotel.id}`}
                position={[hotel.lat, hotel.lng]}
                icon={
                  isSelected
                    ? icons.hotelSelected
                    : isDimmed
                      ? icons.hotelDimmed
                      : icons.hotel
                }
                zIndexOffset={isSelected ? 1000 : 0}
                eventHandlers={{
                  click: () => handleHotelClick(hotel),
                }}
              >
                <Popup>
                  <HotelPopupContent
                    hotel={hotel}
                    nearby={nearbyForHotel}
                    radiusKm={nearbyRadiusKm}
                    canExplore={enableHotelExplore && !!onHotelSelect}
                    onExplore={() => onHotelSelect?.(hotel)}
                    onBookWithAi={
                      onMapHotelSelect
                        ? () => onMapHotelSelect(fromCatalogHotel(hotel, null))
                        : undefined
                    }
                  />
                </Popup>
              </Marker>
            );
          })}

        {showRegisteredHotels &&
          registeredHotels.map((hotel) => {
            const isRegSelected = selectedMapHotelKey === hotel.id;
            return (
              <Marker
                key={`registered-${hotel.id}`}
                position={[hotel.lat, hotel.lng]}
                icon={
                  isRegSelected
                    ? icons.hotelSelected
                    : icons.registeredHotel
                }
                zIndexOffset={isRegSelected ? 900 : 600}
                eventHandlers={{
                  click: () => onMapHotelSelect?.(fromRegisteredHotel(hotel)),
                }}
              >
                <Popup>
                  <div className="min-w-[220px] font-cosmica">
                    <div className="mb-2 flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600 ring-2 ring-amber-400" />
                      <div>
                        <h3 className="text-sm font-semibold leading-tight text-obsidian">
                          {hotel.name}
                        </h3>
                        <p className="mt-0.5 text-xs font-medium text-amber-700">
                          StayNEP partner · book with AI
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 border-t border-fog pt-2 text-xs text-steel">
                      <p>{hotel.district}</p>
                      {hotel.address && <p>{hotel.address}</p>}
                      {hotel.phone && (
                        <p>
                          <a
                            href={`tel:${hotel.phone}`}
                            className="font-medium text-obsidian hover:underline"
                          >
                            {hotel.phone}
                          </a>
                        </p>
                      )}
                      <p className="font-medium text-obsidian">
                        {hotel.availableUnits} / {hotel.totalUnits} units available ·{' '}
                        {hotel.roomTypes} room type{hotel.roomTypes === 1 ? '' : 's'}
                      </p>
                      {onMapHotelSelect && (
                        <button
                          type="button"
                          onClick={() =>
                            onMapHotelSelect(fromRegisteredHotel(hotel))
                          }
                          className="mt-2 w-full rounded-[36px] bg-violet-700 px-3 py-2 text-xs font-semibold text-snow transition hover:opacity-90"
                        >
                          Book with Gemini AI
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {showAttractions &&
          attractionData.map((attr) => {
            const isNearby = exploreMode && nearbyIds.has(attr.id);
            const isHidden =
              exploreMode && !isNearby && filter !== 'attractions';

            if (isHidden) return null;

            return (
              <Marker
                key={`attr-${attr.id}`}
                position={[attr.lat, attr.lng]}
                icon={isNearby ? icons.attractionNearby : icons.attraction}
                zIndexOffset={isNearby ? 500 : 0}
              >
                <Popup>
                  <div className="min-w-[210px] max-w-[260px] font-cosmica">
                    <div className="mb-2 flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                      <div>
                        <h3 className="text-sm font-semibold leading-tight text-obsidian">
                          {attr.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-steel">{attr.district}</p>
                      </div>
                    </div>
                    <div className="space-y-2 border-t border-fog pt-2 text-xs">
                      <PopupBadge tone="attraction">{attr.category}</PopupBadge>
                      {selectedHotel && (
                        <p className="font-medium text-obsidian">
                          {formatDistanceKm(
                            distanceKm(
                              selectedHotel.lat,
                              selectedHotel.lng,
                              attr.lat,
                              attr.lng
                            )
                          )}{' '}
                          <span className="font-normal text-steel">
                            from {selectedHotel.name}
                          </span>
                        </p>
                      )}
                      <p className="leading-relaxed text-steel">{attr.description}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {showReports &&
          reportMarkers.map((report) => (
            <Marker
              key={`report-${report.id}`}
              position={[report.lat, report.lng]}
              icon={
                report.isEmergency ? icons.incidentEmergency : icons.incident
              }
              zIndexOffset={900}
            >
              <Popup>
                <div className="min-w-[220px] font-cosmica">
                  <div className="mb-2 flex items-start gap-2">
                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        report.isEmergency ? "bg-red-600" : "bg-orange-500"
                      }`}
                    />
                    <div>
                      <h3 className="text-sm font-semibold leading-tight text-obsidian">
                        {report.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-steel">
                        {REPORT_CATEGORY_LABELS[report.category]}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 border-t border-fog pt-2 text-xs text-steel">
                    {report.isEmergency && (
                      <p className="font-semibold text-red-700">Emergency report</p>
                    )}
                    <p className="capitalize">
                      Status: <span className="text-graphite">{report.status.toLowerCase()}</span>
                    </p>
                    <p className="capitalize">
                      Severity: <span className="text-graphite">{report.severity.toLowerCase()}</span>
                    </p>
                    {report.district && <p>{report.district}</p>}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {showTourists &&
          tourists.map((t) => (
            <Marker
              key={`tourist-${t.id}`}
              position={[t.lat, t.lng]}
              icon={icons.tourist}
              zIndexOffset={800}
            >
              <Popup>
                <div className="min-w-[200px] font-cosmica">
                  <div className="mb-2 flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-pink-500" />
                    <div>
                      <h3 className="text-sm font-semibold leading-tight text-obsidian">
                        {t.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-steel">StayNEP traveler</p>
                    </div>
                  </div>
                  <div className="space-y-1 border-t border-fog pt-2 text-xs text-steel">
                    {t.label && (
                      <p>
                        <span className="font-medium text-graphite">Near </span>
                        {t.label}
                      </p>
                    )}
                    <p>
                      Last seen{" "}
                      {new Date(t.updatedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {showEmergency &&
          !exploreMode &&
          filteredEmergency.map((svc) => {
            const icon =
              svc.type === 'hospital'
                ? icons.hospital
                : svc.type === 'police'
                  ? icons.police
                  : icons.shelter;

            const tone =
              svc.type === 'hospital'
                ? 'hospital'
                : svc.type === 'police'
                  ? 'police'
                  : 'shelter';

            const dotColor =
              svc.type === 'hospital'
                ? 'bg-red-500'
                : svc.type === 'police'
                  ? 'bg-orange-500'
                  : 'bg-violet-500';

            return (
              <Marker
                key={`emer-${svc.id}`}
                position={[svc.lat, svc.lng]}
                icon={icon}
              >
                <Popup>
                  <div className="min-w-[210px] font-cosmica">
                    <div className="mb-2 flex items-start gap-2">
                      <span
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${dotColor}`}
                      />
                      <div>
                        <h3 className="text-sm font-semibold leading-tight text-obsidian">
                          {svc.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-steel">{svc.district}</p>
                      </div>
                    </div>
                    <div className="space-y-2 border-t border-fog pt-2 text-xs">
                      <PopupBadge tone={tone}>{svc.type}</PopupBadge>
                      <p className="text-steel">
                        <span className="font-medium text-graphite">Contact </span>
                        <a
                          href={`tel:${svc.contact}`}
                          className="font-medium text-obsidian hover:underline"
                        >
                          {svc.contact}
                        </a>
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}
