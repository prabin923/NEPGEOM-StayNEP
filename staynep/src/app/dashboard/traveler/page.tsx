import PortalShell from "@/components/portal/PortalShell";
import TravelerDashboard from "@/components/dashboards/TravelerDashboard";
import { roleMeta } from "@/lib/auth-helpers";
import { requireRole } from "@/lib/require-role";

export const metadata = {
  title: "Traveler Portal — StayNEP",
  description: "Your personal tourism dashboard for Nepal",
};

export default async function TravelerPortalPage() {
  const session = await requireRole("TRAVELER");
  const user = session.user;

  return (
    <PortalShell
      role="traveler"
      userLabel={user.name ?? "Traveler"}
      userMeta={roleMeta("TRAVELER")}
    >
      <TravelerDashboard />
    </PortalShell>
  );
}
