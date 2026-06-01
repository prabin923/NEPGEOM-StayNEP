import PortalShell from "@/components/portal/PortalShell";
import TravelerDashboard from "@/components/dashboards/TravelerDashboard";
import { roleMeta } from "@/lib/auth-helpers";
import { requireRole } from "@/lib/require-role";
import { fetchReportsForReporter } from "@/lib/tourist-reports";
import {
  defaultBookingWindow,
  fetchBookableProperties,
  fetchTravelerBookings,
} from "@/lib/traveler-bookings";
import { fetchMapOverview } from "@/lib/map-overview";
import { prisma } from "@/lib/prisma";
import { fetchReviewableBookings } from "@/lib/reviews";

export const metadata = {
  title: "Traveler Portal — StayNEP",
  description: "Your personal tourism dashboard for Nepal",
};

export default async function TravelerPortalPage() {
  const session = await requireRole("TRAVELER");
  const user = session.user;
  const email = user.email ?? "";
  const { checkIn, checkOut } = defaultBookingWindow();

  const [
    myReports,
    properties,
    myBookings,
    bookableProperties,
    mapOverview,
    reviewableBookings,
  ] = await Promise.all([
    fetchReportsForReporter(user.id!),
    prisma.property.findMany({
      select: { id: true, name: true, district: true },
      orderBy: { name: "asc" },
      take: 100,
    }),
    fetchTravelerBookings(email),
    fetchBookableProperties(checkIn, checkOut),
    fetchMapOverview(),
    fetchReviewableBookings(user.id!),
  ]);

  return (
    <PortalShell
      role="traveler"
      userLabel={user.name ?? "Traveler"}
      userMeta={roleMeta("TRAVELER")}
    >
      <TravelerDashboard
        myReports={myReports}
        properties={properties}
        myBookings={myBookings}
        bookableProperties={bookableProperties}
        defaultCheckIn={checkIn.toISOString().slice(0, 10)}
        defaultCheckOut={checkOut.toISOString().slice(0, 10)}
        registeredHotels={mapOverview.registeredHotels}
        catalogHotels={mapOverview.catalogHotels}
        recentReviews={mapOverview.recentReviews}
        reportMarkers={mapOverview.reports}
        trafficCorridors={mapOverview.traffic}
        reviewableBookings={reviewableBookings}
      />
    </PortalShell>
  );
}
