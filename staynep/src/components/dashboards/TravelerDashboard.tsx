"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Compass,
  Heart,
  Shield,
  MapPin,
  Calendar,
  Bell,
} from "lucide-react";
import type { Hotel } from "@/data/hotels";
import type { Attraction } from "@/data/attractions";
import {
  getWithinRadiusKm,
  TRAVELER_NEARBY_RADIUS_KM,
} from "@/lib/geo";
import NearbyDestinationsPanel from "@/components/map/NearbyDestinationsPanel";
import TouristWeatherBoard from "@/components/weather/TouristWeatherBoard";
import TouristWeatherWidget from "@/components/weather/TouristWeatherWidget";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PortalStatCard from "@/components/portal/PortalStatCard";
import TravelerLocationReporter from "@/components/traveler/TravelerLocationReporter";
import {
  PortalPageHeader,
  PortalCard,
  PortalSectionTitle,
  PortalInnerCard,
  PortalChartTooltip,
  portalChartAxis,
  StatusBadge,
} from "@/components/portal/PortalUI";
import {
  travelerStats,
  upcomingTrips,
  savedPlaces,
  travelerAlerts,
  exploreActivity,
  travelerWeatherHubs,
} from "@/data/saas-traveler";
import { hotels } from "@/data/hotels";
import { attractions } from "@/data/attractions";
import { emergencyServices } from "@/data/emergency";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-[28px] border border-fog bg-mist text-steel">
      Loading map…
    </div>
  ),
});

export default function TravelerDashboard() {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(
    null
  );

  const nearbyDestinations = useMemo(() => {
    if (!selectedHotel) return [];
    return getWithinRadiusKm(
      selectedHotel,
      attractions,
      TRAVELER_NEARBY_RADIUS_KM
    );
  }, [selectedHotel]);

  const weatherLocations = useMemo(
    () =>
      upcomingTrips.map((trip) => ({
        id: `trip-${trip.id}`,
        label: trip.destination,
        lat: trip.lat,
        lng: trip.lng,
      })),
    []
  );

  return (
    <div className="space-y-8">
      <PortalPageHeader eyebrow="Welcome back" title="Your Nepal journey" />
      <TravelerLocationReporter />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PortalStatCard
          icon={Compass}
          value={String(travelerStats.upcomingTrips)}
          label="Upcoming trips"
          change="+1 new"
        />
        <PortalStatCard
          icon={Heart}
          value={String(travelerStats.savedPlaces)}
          label="Saved places"
        />
        <PortalStatCard
          icon={MapPin}
          value={String(travelerStats.completedTrips)}
          label="Trips completed"
        />
        <PortalStatCard
          icon={Shield}
          value={`${travelerStats.safetyScore}%`}
          label="Safety score"
        />
      </div>

      <TouristWeatherBoard
        locations={
          weatherLocations.length > 0
            ? weatherLocations
            : travelerWeatherHubs
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PortalCard id="trips" variant="snow">
          <PortalSectionTitle title="Upcoming trips" icon={Calendar} />
          <ul className="space-y-3">
            {upcomingTrips.map((trip) => (
              <PortalInnerCard key={trip.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{trip.destination}</p>
                    <p className="text-sm text-steel">{trip.hotel}</p>
                    <p className="mt-1 text-xs text-steel">{trip.dates}</p>
                  </div>
                  <StatusBadge tone={trip.status === "confirmed" ? "success" : "warning"}>
                    {trip.status}
                  </StatusBadge>
                </div>
              </PortalInnerCard>
            ))}
          </ul>
        </PortalCard>

        <PortalCard variant="mist">
          <PortalSectionTitle title="Exploration activity" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={exploreActivity}>
              <defs>
                <linearGradient id="travelerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#09090b" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#09090b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ececee" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={portalChartAxis.tick} />
              <YAxis axisLine={false} tickLine={false} tick={portalChartAxis.tick} />
              <Tooltip content={<PortalChartTooltip unit="visits" />} />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="#09090b"
                fill="url(#travelerGrad)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: "#09090b", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </PortalCard>
      </div>

      <PortalCard id="map" variant="snow">
        <PortalSectionTitle
          title="Explore nearby"
          subtitle={`Select a hotel to see destinations within ${TRAVELER_NEARBY_RADIUS_KM} km`}
          icon={MapPin}
        />
        {selectedHotel && (
          <div className="mb-4 space-y-3">
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
              onClear={() => setSelectedHotel(null)}
              onSelectAttraction={(attr: Attraction) =>
                setFlyToPosition([attr.lat, attr.lng])
              }
              compact
            />
          </div>
        )}
        <div className="overflow-hidden rounded-[28px] border border-fog">
          <LeafletMap
            hotels={hotels}
            attractions={attractions}
            emergencyServices={emergencyServices}
            filter="all"
            selectedHotelId={selectedHotel?.id ?? null}
            onHotelSelect={setSelectedHotel}
            flyToPosition={flyToPosition}
            nearbyRadiusKm={TRAVELER_NEARBY_RADIUS_KM}
            enableHotelExplore
          />
        </div>
      </PortalCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <PortalCard id="saved" variant="mist">
          <PortalSectionTitle title="Saved places" icon={Heart} />
          <ul className="space-y-2">
            {savedPlaces.map((place) => (
              <li
                key={place.id}
                className="flex items-center justify-between rounded-[12px] border border-fog bg-snow px-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{place.name}</p>
                  <p className="text-xs text-steel">{place.district}</p>
                </div>
                <span className="rounded-full border border-fog bg-fog px-2 py-0.5 text-xs text-graphite">
                  {place.type}
                </span>
              </li>
            ))}
          </ul>
        </PortalCard>

        <PortalCard id="alerts" variant="snow">
          <PortalSectionTitle title="Travel alerts" icon={Bell} />
          <ul className="space-y-3">
            {travelerAlerts.map((alert) => (
              <PortalInnerCard key={alert.id}>
                <p className="text-sm text-ink">{alert.message}</p>
                <p className="mt-1 text-xs text-steel">{alert.time}</p>
              </PortalInnerCard>
            ))}
          </ul>
        </PortalCard>
      </div>
    </div>
  );
}
