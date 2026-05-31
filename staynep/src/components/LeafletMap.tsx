'use client';

import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Hotel } from '@/data/hotels';
import type { Attraction } from '@/data/attractions';
import type { EmergencyService } from '@/data/emergency';

// ── Custom colored div icons ────────────────────────────────────────────────
function createColorIcon(color: string, glow: string) {
  return L.divIcon({
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
    html: `<div style="
      width:24px;height:24px;border-radius:50%;
      background:${color};
      border:3px solid #fff;
      box-shadow:0 0 8px ${glow}, 0 2px 6px rgba(0,0,0,.35);
      transition:transform .15s;
    "></div>`,
  });
}

const icons = {
  hotel: createColorIcon('#3B82F6', 'rgba(59,130,246,.5)'),
  attraction: createColorIcon('#22C55E', 'rgba(34,197,94,.5)'),
  hospital: createColorIcon('#EF4444', 'rgba(239,68,68,.5)'),
  police: createColorIcon('#F97316', 'rgba(249,115,22,.5)'),
  shelter: createColorIcon('#A855F7', 'rgba(168,85,247,.5)'),
} as const;

// ── Types ───────────────────────────────────────────────────────────────────
export type FilterType =
  | 'all'
  | 'hotels'
  | 'attractions'
  | 'hospitals'
  | 'police'
  | 'shelters';

interface LeafletMapProps {
  hotels: Hotel[];
  attractions: Attraction[];
  emergencyServices: EmergencyService[];
  filter: FilterType;
}

// ── Stars helper ────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-[1px]" aria-label={`${rating} stars`}>
      {Array.from({ length: full }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
      {half && (
        <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      )}
      <span className="ml-1 text-xs text-gray-500">{rating}</span>
    </span>
  );
}

// ── Component ───────────────────────────────────────────────────────────────
export default function LeafletMap({
  hotels: hotelData,
  attractions: attractionData,
  emergencyServices: emergencyData,
  filter,
}: LeafletMapProps) {
  const showHotels = filter === 'all' || filter === 'hotels';
  const showAttractions = filter === 'all' || filter === 'attractions';
  const showHospitals = filter === 'all' || filter === 'hospitals';
  const showPolice = filter === 'all' || filter === 'police';
  const showShelters = filter === 'all' || filter === 'shelters';

  const filteredEmergency = emergencyData.filter((e) => {
    if (filter === 'all') return true;
    if (filter === 'hospitals') return e.type === 'hospital';
    if (filter === 'police') return e.type === 'police';
    if (filter === 'shelters') return e.type === 'shelter';
    return false;
  });

  return (
    <div className="relative rounded-xl border border-white/10 shadow-2xl overflow-hidden">
      <MapContainer
        center={[28.3949, 84.124]}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: '500px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Hotels */}
        {showHotels &&
          hotelData.map((hotel) => (
            <Marker
              key={`hotel-${hotel.id}`}
              position={[hotel.lat, hotel.lng]}
              icon={icons.hotel}
            >
              <Popup>
                <div className="min-w-[200px] font-sans">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {hotel.name}
                    </h3>
                  </div>
                  <div className="space-y-1 mt-2 text-xs text-gray-600">
                    <p>
                      <span className="font-medium text-gray-700">Available Rooms:</span>{' '}
                      <span className="text-blue-600 font-semibold">{hotel.availableRooms}</span>
                      <span className="text-gray-400"> / {hotel.totalRooms}</span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Type:</span> {hotel.type}
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">District:</span> {hotel.district}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">Rating:</span>
                      <Stars rating={hotel.rating} />
                    </div>
                    <p>
                      <span className="font-medium text-gray-700">Price:</span>{' '}
                      <span className="text-amber-600 font-semibold">{hotel.priceRange}</span>
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Attractions */}
        {showAttractions &&
          attractionData.map((attr) => (
            <Marker
              key={`attr-${attr.id}`}
              position={[attr.lat, attr.lng]}
              icon={icons.attraction}
            >
              <Popup>
                <div className="min-w-[200px] max-w-[260px] font-sans">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {attr.name}
                    </h3>
                  </div>
                  <div className="space-y-1 mt-2 text-xs text-gray-600">
                    <p>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium capitalize text-[10px]">
                        {attr.category}
                      </span>
                    </p>
                    <p className="leading-relaxed">{attr.description}</p>
                    <p>
                      <span className="font-medium text-gray-700">District:</span> {attr.district}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        {/* Emergency Services */}
        {filteredEmergency.map((svc) => {
          const icon =
            svc.type === 'hospital'
              ? icons.hospital
              : svc.type === 'police'
                ? icons.police
                : icons.shelter;

          const dotColor =
            svc.type === 'hospital'
              ? 'bg-red-500'
              : svc.type === 'police'
                ? 'bg-orange-500'
                : 'bg-purple-500';

          const badgeBg =
            svc.type === 'hospital'
              ? 'bg-red-100 text-red-700'
              : svc.type === 'police'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-purple-100 text-purple-700';

          return (
            <Marker
              key={`emer-${svc.id}`}
              position={[svc.lat, svc.lng]}
              icon={icon}
            >
              <Popup>
                <div className="min-w-[200px] font-sans">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${dotColor} shrink-0`} />
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {svc.name}
                    </h3>
                  </div>
                  <div className="space-y-1 mt-2 text-xs text-gray-600">
                    <p>
                      <span className={`inline-block px-1.5 py-0.5 rounded font-medium capitalize text-[10px] ${badgeBg}`}>
                        {svc.type}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">Contact:</span>{' '}
                      <a
                        href={`tel:${svc.contact}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {svc.contact}
                      </a>
                    </p>
                    <p>
                      <span className="font-medium text-gray-700">District:</span> {svc.district}
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
