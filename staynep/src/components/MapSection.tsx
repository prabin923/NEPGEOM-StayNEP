'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Hotel as HotelIcon,
  Landmark,
  Cross,
  Shield,
  Tent,
  Layers,
  Navigation,
  Users,
} from 'lucide-react';
import type { TouristMapMarker } from '@/lib/traveler-locations';
import type { RegisteredHotelMarker } from '@/lib/registered-hotels';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { hotels } from '@/data/hotels';
import { attractions } from '@/data/attractions';
import { emergencyServices } from '@/data/emergency';
import type { Hotel } from '@/data/hotels';
import type { Attraction } from '@/data/attractions';
import {
  getWithinRadiusKm,
  TRAVELER_NEARBY_RADIUS_KM,
} from '@/lib/geo';
import NearbyDestinationsPanel from '@/components/map/NearbyDestinationsPanel';
import TouristWeatherWidget from '@/components/weather/TouristWeatherWidget';
import type { FilterType } from './LeafletMap';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <MapLoadingSkeleton />,
});

const filters: {
  key: FilterType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  markerColor: string;
  description: string;
}[] = [
  {
    key: 'all',
    label: 'All locations',
    shortLabel: 'All',
    icon: Layers,
    markerColor: 'bg-obsidian',
    description: 'Hotels, attractions & emergency services',
  },
  {
    key: 'hotels',
    label: 'Hotels',
    shortLabel: 'Hotels',
    icon: HotelIcon,
    markerColor: 'bg-blue-500',
    description: 'Listings + StayNEP registered hotels',
  },
  {
    key: 'attractions',
    label: 'Attractions',
    shortLabel: 'Attractions',
    icon: Landmark,
    markerColor: 'bg-emerald-500',
    description: 'Destinations & landmarks',
  },
  {
    key: 'hospitals',
    label: 'Hospitals',
    shortLabel: 'Hospitals',
    icon: Cross,
    markerColor: 'bg-red-500',
    description: 'Medical emergency services',
  },
  {
    key: 'police',
    label: 'Police',
    shortLabel: 'Police',
    icon: Shield,
    markerColor: 'bg-orange-500',
    description: 'Law enforcement stations',
  },
  {
    key: 'shelters',
    label: 'Shelters',
    shortLabel: 'Shelters',
    icon: Tent,
    markerColor: 'bg-violet-500',
    description: 'Emergency shelter network',
  },
  {
    key: 'tourists',
    label: 'Travelers',
    shortLabel: 'Travelers',
    icon: Users,
    markerColor: 'bg-pink-500',
    description: 'Signed-in StayNEP tourists (live GPS)',
  },
];

function countForFilter(
  key: FilterType,
  touristCount: number,
  registeredHotelCount: number
): number {
  switch (key) {
    case 'tourists':
      return touristCount;
    case 'hotels':
      return hotels.length + registeredHotelCount;
    case 'attractions':
      return attractions.length;
    case 'hospitals':
      return emergencyServices.filter((e) => e.type === 'hospital').length;
    case 'police':
      return emergencyServices.filter((e) => e.type === 'police').length;
    case 'shelters':
      return emergencyServices.filter((e) => e.type === 'shelter').length;
    default:
      return (
        hotels.length +
        registeredHotelCount +
        attractions.length +
        emergencyServices.length +
        touristCount
      );
  }
}

function MapLoadingSkeleton() {
  return (
    <div className="flex h-[420px] flex-col sm:h-[500px] lg:h-[560px]">
      <div className="flex items-center gap-2 border-b border-fog bg-fog/40 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-pebble animate-pulse" />
        <span className="h-3 w-3 rounded-full bg-pebble animate-pulse" />
        <span className="h-3 w-3 rounded-full bg-pebble animate-pulse" />
        <span className="ml-2 h-3 w-32 rounded-full bg-pebble animate-pulse" />
      </div>
      <div className="flex flex-1 items-center justify-center bg-mist">
        <p className="text-sm text-steel font-cosmica">Loading map…</p>
      </div>
    </div>
  );
}

export default function MapSection() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(
    null
  );
  const [tourists, setTourists] = useState<TouristMapMarker[]>([]);
  const [registeredHotels, setRegisteredHotels] = useState<RegisteredHotelMarker[]>(
    []
  );
  const sectionRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/travelers/locations").then((r) => r.json()),
      fetch("/api/hotels/locations").then((r) => r.json()),
    ])
      .then(([travelersData, hotelsData]) => {
        setTourists(travelersData.tourists ?? []);
        setRegisteredHotels(hotelsData.hotels ?? []);
      })
      .catch(() => {
        setTourists([]);
        setRegisteredHotels([]);
      });
  }, []);

  const totalCount = useMemo(
    () =>
      countForFilter(activeFilter, tourists.length, registeredHotels.length),
    [activeFilter, tourists.length, registeredHotels.length]
  );
  const activeMeta = filters.find((f) => f.key === activeFilter)!;

  const nearbyDestinations = useMemo(() => {
    if (!selectedHotel) return [];
    return getWithinRadiusKm(
      selectedHotel,
      attractions,
      TRAVELER_NEARBY_RADIUS_KM
    );
  }, [selectedHotel]);

  const handleFilterChange = (key: FilterType) => {
    setActiveFilter(key);
    if (key !== 'all' && key !== 'hotels') {
      setSelectedHotel(null);
      setFlyToPosition(null);
    }
    if (key === 'tourists') {
      setSelectedHotel(null);
      setFlyToPosition(null);
    }
  };

  const handleHotelSelect = (hotel: Hotel | null) => {
    setSelectedHotel(hotel);
    setFlyToPosition(null);
    if (hotel && activeFilter !== 'all' && activeFilter !== 'hotels') {
      setActiveFilter('hotels');
    }
  };

  const provinceStats = useMemo(
    () => [
      { label: 'Provinces', value: '7' },
      { label: 'Hotels', value: String(hotels.length) },
      { label: 'Attractions', value: String(attractions.length) },
      { label: 'Emergency', value: String(emergencyServices.length) },
    ],
    []
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-map-filter]', {
        scrollTrigger: {
          trigger: '[data-map-sidebar]',
          start: 'top 85%',
          once: true,
        },
        x: -12,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: 'power2.out',
      });

      gsap.from('[data-map-stat]', {
        scrollTrigger: {
          trigger: '[data-map-stats]',
          start: 'top 90%',
          once: true,
        },
        y: 12,
        opacity: 0,
        duration: 0.4,
        stagger: 0.07,
        ease: 'power2.out',
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!countRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      countRef.current,
      { scale: 0.85, opacity: 0.5 },
      { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' }
    );
  }, [activeFilter]);

  return (
    <section
      ref={sectionRef}
      id="map"
      className="relative bg-mist py-20 sm:py-28"
    >
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center" data-gsap-reveal>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fog bg-snow px-4 py-1.5">
            <MapPin className="h-4 w-4 text-steel" />
            <span className="text-[12px] font-medium uppercase tracking-widest text-steel">
              Interactive Explorer
            </span>
          </div>
          <h2 className="text-[32px] font-bold leading-none tracking-tight text-obsidian font-cosmica">
            Explore Nepal&apos;s Tourism{' '}
            <span className="text-ash">Network</span>
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-steel font-cosmica">
            Zoom in for street-level detail, then select a hotel to discover
            travel destinations within {TRAVELER_NEARBY_RADIUS_KM} km of your
            stay.
          </p>
        </div>

        {/* Quick stats */}
        <div
          data-map-stats
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {provinceStats.map((stat) => (
            <div
              key={stat.label}
              data-map-stat
              className="rounded-[20px] border border-fog bg-snow px-4 py-3 text-center"
            >
              <p className="text-xl font-bold text-obsidian font-cosmica">
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-steel">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile filters */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {filters.map(({ key, shortLabel, icon: Icon }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleFilterChange(key)}
                aria-pressed={isActive}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-[36px] px-3.5 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-obsidian text-snow shadow-button'
                    : 'border border-fog bg-snow text-graphite'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {shortLabel}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[272px_1fr]">
          {/* Sidebar — desktop */}
          <aside
            data-map-sidebar
            className="hidden flex-col gap-4 lg:flex"
          >
            {selectedHotel ? (
              <div className="space-y-4">
                <TouristWeatherWidget
                  lat={selectedHotel.lat}
                  lng={selectedHotel.lng}
                  label={`${selectedHotel.name}, ${selectedHotel.district}`}
                  compact
                />
                <NearbyDestinationsPanel
                  hotel={selectedHotel}
                  nearby={nearbyDestinations}
                  radiusKm={TRAVELER_NEARBY_RADIUS_KM}
                  onClear={() => handleHotelSelect(null)}
                  onSelectAttraction={(attr) =>
                    setFlyToPosition([attr.lat, attr.lng])
                  }
                />
              </div>
            ) : (
              <div className="rounded-[28px] border border-fog bg-snow p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-steel">
                  Traveler tip
                </p>
                <p className="mt-2 text-sm leading-relaxed text-steel font-cosmica">
                  Click any hotel on the map to see destinations within{' '}
                  {TRAVELER_NEARBY_RADIUS_KM} km. Zoom up to level 18 for
                  neighbourhood detail.
                </p>
              </div>
            )}

            <div className="rounded-[28px] border border-fog bg-snow p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-steel">
                Active layer
              </p>
              <p className="mt-2 text-lg font-semibold text-obsidian font-cosmica">
                {activeMeta.label}
              </p>
              <p className="mt-1 text-sm text-steel">{activeMeta.description}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span
                  ref={countRef}
                  className="text-3xl font-bold text-obsidian font-cosmica"
                >
                  {selectedHotel
                    ? nearbyDestinations.length
                    : totalCount}
                </span>
                <span className="text-sm text-steel">
                  {selectedHotel ? 'nearby destinations' : 'on map'}
                </span>
              </div>
            </div>

            <nav className="flex flex-col gap-1.5" aria-label="Map filters">
              {filters.map(({ key, label, icon: Icon, markerColor }) => {
                const isActive = activeFilter === key;
                const count = countForFilter(
                  key,
                  tourists.length,
                  registeredHotels.length
                );
                return (
                  <button
                    key={key}
                    type="button"
                    data-map-filter
                    onClick={() => handleFilterChange(key)}
                    aria-pressed={isActive}
                    className={`flex w-full items-center gap-3 rounded-[16px] border px-3.5 py-3 text-left transition ${
                      isActive
                        ? 'border-obsidian bg-obsidian text-snow shadow-button'
                        : 'border-fog bg-snow text-ink hover:border-graphite hover:bg-fog/50'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] ${
                        isActive ? 'bg-snow/15' : 'bg-fog'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${isActive ? 'text-snow' : 'text-graphite'}`}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{label}</span>
                      <span
                        className={`text-xs ${isActive ? 'text-snow/70' : 'text-steel'}`}
                      >
                        {count} locations
                      </span>
                    </span>
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${markerColor} ${
                        isActive ? 'ring-2 ring-snow/40' : ''
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            <div className="rounded-[28px] border border-fog bg-fog/60 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-steel">
                Legend
              </p>
              <ul className="space-y-2.5">
                {filters.slice(1).map(({ label, markerColor }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-xs text-graphite font-cosmica"
                  >
                    <span className={`h-2 w-2 rounded-full ${markerColor}`} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Map panel */}
          <div
            data-gsap="map-panel"
            className="overflow-hidden rounded-[36px] border border-fog bg-snow shadow-sm"
          >
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-fog bg-fog/30 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-pebble" />
                <span className="h-2.5 w-2.5 rounded-full bg-pebble" />
                <span className="h-2.5 w-2.5 rounded-full bg-pebble" />
                <span className="ml-2 text-xs font-medium text-steel font-cosmica">
                  StayNEP — Tourism Intelligence Map
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${activeMeta.markerColor} animate-pulse-dot`}
                />
                <span className="text-xs font-medium text-graphite font-cosmica">
                  {activeMeta.label}
                  <span className="mx-1 text-steel">·</span>
                  <span className="text-obsidian">{totalCount}</span>
                </span>
              </div>
            </div>

            <div className="relative">
              <LeafletMap
                hotels={hotels}
                attractions={attractions}
                emergencyServices={emergencyServices}
                filter={activeFilter}
                selectedHotelId={selectedHotel?.id ?? null}
                onHotelSelect={handleHotelSelect}
                flyToPosition={flyToPosition}
                nearbyRadiusKm={TRAVELER_NEARBY_RADIUS_KM}
                enableHotelExplore={activeFilter !== 'tourists'}
                tourists={tourists}
                registeredHotels={registeredHotels}
              />

              <div className="pointer-events-none absolute bottom-4 left-4 z-[400] max-w-[min(100%,280px)] rounded-[16px] border border-fog bg-snow/95 px-3 py-2 shadow-sm backdrop-blur-md">
                <p className="flex items-center gap-2 text-[11px] font-medium text-steel font-cosmica">
                  <Navigation className="h-3.5 w-3.5 shrink-0 text-graphite" />
                  {selectedHotel
                    ? `${nearbyDestinations.length} destinations within ${TRAVELER_NEARBY_RADIUS_KM} km · zoom to explore`
                    : 'Select a hotel · scroll to zoom in (up to 18×)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {selectedHotel && (
          <div className="mt-4 space-y-3 lg:hidden">
            <TouristWeatherWidget
              lat={selectedHotel.lat}
              lng={selectedHotel.lng}
              label={`${selectedHotel.name}, ${selectedHotel.district}`}
              compact
            />
            <NearbyDestinationsPanel
              hotel={selectedHotel}
              nearby={nearbyDestinations}
              radiusKm={TRAVELER_NEARBY_RADIUS_KM}
              onClear={() => handleHotelSelect(null)}
              onSelectAttraction={(attr) =>
                setFlyToPosition([attr.lat, attr.lng])
              }
              compact
            />
          </div>
        )}

        {/* Mobile summary */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-fog bg-snow px-5 py-4 lg:hidden">
          <p className="text-sm text-steel font-cosmica">
            {selectedHotel ? (
              <>
                <span className="font-semibold text-obsidian">
                  {nearbyDestinations.length}
                </span>{' '}
                destinations near {selectedHotel.name}
              </>
            ) : (
              <>
                Showing{' '}
                <span className="font-semibold text-obsidian">{totalCount}</span>{' '}
                {activeMeta.label.toLowerCase()}
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-3 text-[11px] text-steel">
            {filters.slice(1).map(({ label, markerColor }) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${markerColor}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
