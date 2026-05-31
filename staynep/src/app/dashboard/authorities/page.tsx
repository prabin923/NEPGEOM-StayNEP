import PortalShell from "@/components/portal/PortalShell";
import AuthoritiesDashboard from "@/components/dashboards/AuthoritiesDashboard";
import { roleMeta } from "@/lib/auth-helpers";
import { requireRole } from "@/lib/require-role";
import { fetchTouristMapMarkers } from "@/lib/traveler-locations";
import { fetchRegisteredHotelMarkers } from "@/lib/registered-hotels";
import {
  fetchAuthorityLiveStats,
  fetchTouristReports,
  fetchTransparencySnapshot,
} from "@/lib/tourist-reports";
import { fetchOpenReportMarkers } from "@/lib/report-map-markers";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Tourism Authority — StayNEP",
  description: "National tourism intelligence command center",
};

export default async function AuthoritiesPortalPage() {
  const session = await requireRole("AUTHORITIES");
  const user = session.user;

  const [dbUser, tourists, registeredHotels, reportMarkers, reports, transparency] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: { organization: true, name: true },
      }),
      fetchTouristMapMarkers(),
      fetchRegisteredHotelMarkers(),
      fetchOpenReportMarkers(),
      fetchTouristReports(),
      fetchTransparencySnapshot(),
    ]);

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
        reports={reports}
        transparency={transparency}
        liveStats={liveStats}
      />
    </PortalShell>
  );
}
