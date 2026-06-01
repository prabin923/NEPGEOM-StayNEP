"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Heart,
  Shield,
  MapPin,
  Bell,
  Building2,
  Calendar,
  FileWarning,
  Star,
  Search,
  Sparkles,
  CloudSun,
  CalendarDays,
  ShieldAlert,
  Globe,
} from "lucide-react";
import type { Hotel } from "@/data/hotels";
import type { Attraction } from "@/data/attractions";
import {
  getWithinRadiusKm,
  TRAVELER_NEARBY_RADIUS_KM,
} from "@/lib/geo";
import NearbyDestinationsPanel from "@/components/map/NearbyDestinationsPanel";
import TouristWeatherWidget from "@/components/weather/TouristWeatherWidget";
import PortalStatCard from "@/components/portal/PortalStatCard";
import TravelerLocationReporter from "@/components/traveler/TravelerLocationReporter";
import TravelerReportSection from "@/components/traveler/TravelerReportSection";
import TravelerBookStay from "@/components/traveler/TravelerBookStay";
import HotelMapAiBooking from "@/components/traveler/HotelMapAiBooking";
import type { BookableProperty, TravelerBookingRow } from "@/lib/traveler-bookings";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import type { ReportMapMarker } from "@/lib/report-map-markers";
import type { TrafficCorridor } from "@/lib/map-traffic";
import type { CatalogMapHotel, MapHotelReview } from "@/lib/map-hotels";
import { catalogHotelsForMap } from "@/lib/map-hotels";
import { fromCatalogHotel, type MapHotelSelection } from "@/lib/map-hotel-selection";
import { formatNpr } from "@/lib/traveler-bookings";
import type { ReportCategory, ReportStatus } from "@prisma/client";
import type { ReviewableBooking } from "@/lib/reviews";
import TravelerReviewSection from "@/components/traveler/TravelerReviewSection";
import HotelSearchPanel from "@/components/traveler/HotelSearchPanel";
import TravelAiAssistant from "@/components/traveler/TravelAiAssistant";
import type { SearchableHotel } from "@/lib/traveler-hotel-search";
import { fromRegisteredHotel } from "@/lib/map-hotel-selection";
import {
  PortalPageHeader,
  PortalCard,
  PortalSectionTitle,
  PortalInnerCard,
  PortalQuickNav,
  PortalEmptyState,
  StatusBadge,
} from "@/components/portal/PortalUI";
import { REPORT_STATUS_LABELS } from "@/lib/tourist-reports";
import { savedPlaces } from "@/data/saas-traveler";
import { travelAdvisories } from "@/data/travel-advisories";
import TravelAdvisoryPanel from "@/components/traveler/TravelAdvisoryPanel";
import TouristWeatherBoard from "@/components/weather/TouristWeatherBoard";
import { travelerWeatherHubs } from "@/data/saas-traveler";
import FestivalCalendar from "@/components/traveler/FestivalCalendar";
import TravelerStepEnrollment from "@/components/traveler/TravelerStepEnrollment";
import ConsularDirectory from "@/components/traveler/ConsularDirectory";
import { hotels } from "@/data/hotels";
import { attractions } from "@/data/attractions";
import { emergencyServices } from "@/data/emergency";

const MapTilerTourismMap = dynamic(
  () => import("@/components/MapTilerTourismMap").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[380px] items-center justify-center rounded-[20px] border border-fog bg-mist text-steel">
        Loading map…
      </div>
    ),
  }
);

interface TravelerDashboardProps {
  myReports: {
    id: string;
    title: string;
    category: ReportCategory;
    status: ReportStatus;
    severity: string;
    isEmergency: boolean;
    createdAt: Date;
    resolutionNote: string | null;
    property: { name: string } | null;
  }[];
  properties: { id: string; name: string; district: string }[];
  myBookings: TravelerBookingRow[];
  bookableProperties: BookableProperty[];
  defaultCheckIn: string;
  defaultCheckOut: string;
  registeredHotels: RegisteredHotelMarker[];
  reportMarkers?: ReportMapMarker[];
  trafficCorridors?: TrafficCorridor[];
  catalogHotels?: CatalogMapHotel[];
  recentReviews?: MapHotelReview[];
  reviewableBookings: ReviewableBooking[];
}

function isOpenReport(status: ReportStatus) {
  return status !== "RESOLVED" && status !== "DISMISSED";
}

export default function TravelerDashboard({
  myReports,
  properties,
  myBookings,
  bookableProperties,
  defaultCheckIn,
  defaultCheckOut,
  registeredHotels,
  reportMarkers = [],
  trafficCorridors = [],
  catalogHotels = catalogHotelsForMap(),
  recentReviews = [],
  reviewableBookings,
}: TravelerDashboardProps) {
  const router = useRouter();
  const now = new Date();
  const upcoming = myBookings.filter(
    (b) => b.checkOut >= now && b.status !== "checked-out"
  );
  const completedCount = myBookings.filter(
    (b) => b.status === "checked-out" || b.checkOut < now
  ).length;
  const openReports = myReports.filter((r) => isOpenReport(r.status)).length;
  const nextTrip = upcoming[0];

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(
    null
  );
  const [selectedMapHotel, setSelectedMapHotel] =
    useState<MapHotelSelection | null>(null);
  const [bookingRefresh, setBookingRefresh] = useState(0);

  const nearbyDestinations = useMemo(() => {
    if (!selectedHotel) return [];
    return getWithinRadiusKm(
      selectedHotel,
      attractions,
      TRAVELER_NEARBY_RADIUS_KM
    );
  }, [selectedHotel]);

  const handleSearchHotelSelect = (h: SearchableHotel) => {
    if (h.propertyId) {
      const reg = registeredHotels.find((r) => r.id === h.propertyId);
      if (reg) {
        setSelectedMapHotel(fromRegisteredHotel(reg));
        setSelectedHotel(null);
        setFlyToPosition([reg.lat, reg.lng]);
      }
    } else {
      const catalog = hotels.find((c) => `static-${c.id}` === h.key);
      if (catalog) {
        setSelectedHotel(catalog);
        setSelectedMapHotel(fromCatalogHotel(catalog, null));
        setFlyToPosition([catalog.lat, catalog.lng]);
      }
    }
    document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <PortalPageHeader
        eyebrow="Traveler portal"
        title="Your Nepal journey"
        subtitle="Book registered stays, share your location for safety maps, and report issues to tourism authorities."
        action={<TravelerLocationReporter />}
      />

      <PortalQuickNav
        items={[
          { label: "Search hotels", href: "#search", icon: Search },
          { label: "Travel AI", href: "#assistant", icon: Sparkles },
          { label: "Book stay", href: "#book", icon: Building2 },
          { label: "Weather & AQI", href: "#weather", icon: CloudSun },
          { label: "Festivals", href: "#festivals", icon: CalendarDays },
          { label: "STEP-Nepal", href: "#step-nepal", icon: ShieldAlert },
          { label: "Embassies", href: "#embassies", icon: Globe },
          { label: "Explore map", href: "#map", icon: MapPin },
          { label: "Safety & reports", href: "#safety", icon: Shield },
          { label: "Reviews", href: "#reviews", icon: Star },
          { label: "Transparency", href: "/transparency", icon: FileWarning },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PortalStatCard
          icon={Compass}
          value={String(upcoming.length)}
          label="Upcoming stays"
          change={upcoming.length > 0 ? "Confirmed" : undefined}
        />
        <PortalStatCard
          icon={MapPin}
          value={String(completedCount)}
          label="Past bookings"
        />
        <PortalStatCard
          icon={Shield}
          value={String(openReports)}
          label="Open safety reports"
          tone={openReports > 0 ? "alert" : "default"}
          change={openReports > 0 ? "Active" : undefined}
        />
        <PortalStatCard
          icon={Building2}
          value={String(bookableProperties.length)}
          label="Hotels available now"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PortalCard id="search" variant="snow">
          <HotelSearchPanel
            registeredHotels={registeredHotels}
            onSelectHotel={handleSearchHotelSelect}
          />
        </PortalCard>
        <PortalCard id="assistant" variant="mist">
          <TravelAiAssistant />
        </PortalCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <PortalCard id="book" variant="snow" className="xl:col-span-2">
          <TravelerBookStay
            bookableProperties={bookableProperties}
            myBookings={myBookings}
            defaultCheckIn={defaultCheckIn}
            defaultCheckOut={defaultCheckOut}
          />
        </PortalCard>

        <div className="space-y-6">
          <PortalCard variant="mist">
            <PortalSectionTitle title="Next stay" icon={Calendar} />
            {nextTrip ? (
              <PortalInnerCard>
                <p className="font-semibold text-ink">{nextTrip.propertyName}</p>
                <p className="text-sm text-steel">{nextTrip.roomName}</p>
                <p className="mt-2 text-xs text-steel">
                  {nextTrip.checkIn.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  –{" "}
                  {nextTrip.checkOut.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="mt-2 text-sm font-medium text-obsidian">
                  {formatNpr(nextTrip.totalNpr)}
                </p>
                <div className="mt-3">
                  <StatusBadge tone="success">{nextTrip.status}</StatusBadge>
                </div>
              </PortalInnerCard>
            ) : (
              <PortalEmptyState
                title="No upcoming stay"
                description="Book a room at a StayNEP partner hotel."
              />
            )}
            <a
              href="#book"
              className="mt-4 inline-block text-sm font-medium text-obsidian hover:underline"
            >
              Browse availability →
            </a>
          </PortalCard>

          <PortalCard id="advisories" variant="snow">
            <TravelAdvisoryPanel advisories={travelAdvisories} />
          </PortalCard>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div id="weather">
          <TouristWeatherBoard locations={travelerWeatherHubs} />
        </div>
        <PortalCard id="festivals" variant="snow">
          <FestivalCalendar />
        </PortalCard>
      </div>

      <PortalCard id="map" variant="snow">
        <PortalSectionTitle
          title="Explore & book on the map"
          subtitle="Click any hotel marker — StayNEP AI books your stay and updates the hotel dashboard"
          icon={MapPin}
        />
        {selectedHotel && !selectedMapHotel && (
          <div className="mb-4 grid gap-3 lg:grid-cols-2">
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
        <div className="grid gap-4 lg:grid-cols-5">
          <div
            className={`overflow-hidden rounded-[20px] border border-fog lg:col-span-3 ${
              selectedMapHotel ? "" : "lg:col-span-5"
            }`}
          >
            <MapTilerTourismMap
              hotels={catalogHotels}
              attractions={attractions}
              emergencyServices={emergencyServices}
              filter="all"
              selectedHotelId={selectedHotel?.id ?? null}
              onHotelSelect={(h) => {
                if (!h) {
                  setSelectedHotel(null);
                  return;
                }
                setSelectedHotel(h);
                setSelectedMapHotel(fromCatalogHotel(h, null));
                setFlyToPosition([h.lat, h.lng]);
              }}
              flyToPosition={
                selectedMapHotel
                  ? [selectedMapHotel.lat, selectedMapHotel.lng]
                  : flyToPosition
              }
              nearbyRadiusKm={TRAVELER_NEARBY_RADIUS_KM}
              enableHotelExplore={!selectedMapHotel}
              registeredHotels={registeredHotels}
              reportMarkers={reportMarkers}
              trafficCorridors={trafficCorridors}
              recentReviews={recentReviews}
              selectedMapHotelKey={selectedMapHotel?.key ?? null}
              onMapHotelSelect={(h) => {
                setSelectedMapHotel(h);
                if (h) {
                  setSelectedHotel(null);
                  setFlyToPosition([h.lat, h.lng]);
                }
              }}
            />
          </div>
          {selectedMapHotel && (
            <div className="lg:col-span-2">
              <HotelMapAiBooking
                key={`${selectedMapHotel.key}-${bookingRefresh}`}
                hotel={selectedMapHotel}
                onClose={() => setSelectedMapHotel(null)}
                onBooked={() => {
                  setBookingRefresh((n) => n + 1);
                  router.refresh();
                }}
              />
            </div>
          )}
        </div>
      </PortalCard>

      <PortalCard id="safety" variant="mist">
        <TravelerReportSection myReports={myReports} properties={properties} />
        {myReports.length > 0 && (
          <div className="mt-6 border-t border-fog pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-steel">
              Recent report status
            </p>
            <ul className="flex flex-wrap gap-2">
              {myReports.slice(0, 5).map((r) => (
                <li
                  key={r.id}
                  className="rounded-full border border-fog bg-snow px-3 py-1 text-xs text-graphite"
                >
                  {r.title.slice(0, 32)}
                  {r.title.length > 32 ? "…" : ""} ·{" "}
                  {REPORT_STATUS_LABELS[r.status]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </PortalCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <PortalCard id="step-nepal" variant="snow">
          <TravelerStepEnrollment />
        </PortalCard>
        <PortalCard id="embassies" variant="snow">
          <ConsularDirectory
            onShowOnMap={(lat, lng) => {
              setFlyToPosition([lat, lng]);
              document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </PortalCard>
      </div>

      <PortalCard id="reviews" variant="snow">
        <PortalSectionTitle
          title="Review your stays"
          subtitle="Share your experiences at accommodations to help other travelers and support verified local hotels."
          icon={Star}
        />
        <TravelerReviewSection initialBookings={reviewableBookings} />
      </PortalCard>

      <PortalCard id="saved" variant="snow">
        <PortalSectionTitle
          title="Curated destinations"
          subtitle="Popular places to pair with your stay"
          icon={Heart}
        />
        <ul className="grid gap-2 sm:grid-cols-2">
          {savedPlaces.map((place) => (
            <li
              key={place.id}
              className="flex items-center justify-between rounded-[12px] border border-fog bg-mist/30 px-3 py-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">{place.name}</p>
                <p className="text-xs text-steel">{place.district}</p>
              </div>
              <span className="rounded-full bg-snow px-2 py-0.5 text-[11px] text-graphite capitalize">
                {place.type}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-steel">
          See live registered hotels on the{" "}
          <Link href="/transparency" className="font-medium text-obsidian hover:underline">
            transparency portal
          </Link>
          .
        </p>
      </PortalCard>
    </div>
  );
}
