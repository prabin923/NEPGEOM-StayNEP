import PortalShell from "@/components/portal/PortalShell";
import AuthoritiesDashboard from "@/components/dashboards/AuthoritiesDashboard";
import { roleMeta } from "@/lib/auth-helpers";
import { requireRole } from "@/lib/require-role";
import { fetchTouristMapMarkers } from "@/lib/traveler-locations";
import { fetchRegisteredHotelMarkers } from "@/lib/registered-hotels";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Tourism Authority — StayNEP",
  description: "National tourism intelligence command center",
};

export default async function AuthoritiesPortalPage() {
  const session = await requireRole("AUTHORITIES");
  const user = session.user;

  const [dbUser, tourists, registeredHotels] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { organization: true, name: true },
    }),
    fetchTouristMapMarkers(),
    fetchRegisteredHotelMarkers(),
  ]);

  return (
    <PortalShell
      role="authorities"
      userLabel={dbUser?.organization ?? user.name ?? "Tourism Authority"}
      userMeta={roleMeta("AUTHORITIES")}
    >
      <AuthoritiesDashboard
        tourists={tourists}
        registeredHotels={registeredHotels}
      />
    </PortalShell>
  );
}
