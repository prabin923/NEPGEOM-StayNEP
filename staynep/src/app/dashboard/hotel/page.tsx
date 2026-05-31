import PortalShell from "@/components/portal/PortalShell";
import HotelDashboard from "@/components/dashboards/HotelDashboard";
import { roleMeta } from "@/lib/auth-helpers";
import { requireRole } from "@/lib/require-role";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Hotel Partner — StayNEP",
  description: "Hotel inventory, bookings, and analytics",
};

export default async function HotelPortalPage() {
  const session = await requireRole("HOTEL");
  const user = session.user;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { organization: true, name: true },
  });

  return (
    <PortalShell
      role="hotel"
      userLabel={dbUser?.organization ?? user.name ?? "Hotel Partner"}
      userMeta={roleMeta("HOTEL")}
    >
      <HotelDashboard />
    </PortalShell>
  );
}
