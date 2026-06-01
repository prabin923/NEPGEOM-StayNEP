import PortalShell from "@/components/portal/PortalShell";
import AuthoritiesDashboard from "@/components/dashboards/AuthoritiesDashboard";
import { roleMeta } from "@/lib/auth-helpers";
import { requireRole } from "@/lib/require-role";
import { fetchMapOverview } from "@/lib/map-overview";
import {
  fetchAuthorityLiveStats,
  fetchTouristReports,
  fetchTransparencySnapshot,
} from "@/lib/tourist-reports";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Tourism Authority — StayNEP",
  description: "National tourism intelligence command center",
};

export default async function AuthoritiesPortalPage() {
  const session = await requireRole("AUTHORITIES");
  const user = session.user;

  const [dbUser, mapOverview, reports, transparency] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { organization: true, name: true },
    }),
    fetchMapOverview(),
    fetchTouristReports(),
    fetchTransparencySnapshot(),
  ]);

  const {
    tourists,
    catalogHotels,
    registeredHotels,
    reports: reportMarkers,
    traffic,
    recentReviews,
  } = mapOverview;

  const liveStats = await fetchAuthorityLiveStats(
    tourists.length,
    registeredHotels.length
  );

  return (
    <PortalShell
      role="authorities"
      userLabel={dbUser?.organization ?? user.name ?? "Tourism Authority"}
      userMeta={roleMeta("AUTHORITIES")}
    >
      <AuthoritiesDashboard
        tourists={tourists}
        registeredHotels={registeredHotels}
        reportMarkers={reportMarkers}
        trafficCorridors={traffic}
        catalogHotels={catalogHotels}
        recentReviews={recentReviews}
        reports={reports}
        transparency={transparency}
        liveStats={liveStats}
      />
    </PortalShell>
  );
}
