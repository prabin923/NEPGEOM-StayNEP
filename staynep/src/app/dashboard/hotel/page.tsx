import PortalShell from "@/components/portal/PortalShell";
import HotelDashboard from "@/components/dashboards/HotelDashboard";

export const metadata = {
  title: "Hotel Partner — StayNEP",
  description: "Hotel inventory, bookings, and analytics",
};

export default function HotelPortalPage() {
  return (
    <PortalShell
      role="hotel"
      userLabel="Fishtail Lodge"
      userMeta="Hotel Partner · Pro"
    >
      <HotelDashboard />
    </PortalShell>
  );
}
