import PortalShell from "@/components/portal/PortalShell";
import TravelerDashboard from "@/components/dashboards/TravelerDashboard";

export const metadata = {
  title: "Traveler Portal — StayNEP",
  description: "Your personal tourism dashboard for Nepal",
};

export default function TravelerPortalPage() {
  return (
    <PortalShell
      role="traveler"
      userLabel="Prabin Sharma"
      userMeta="Traveler · Free plan"
    >
      <TravelerDashboard />
    </PortalShell>
  );
}
