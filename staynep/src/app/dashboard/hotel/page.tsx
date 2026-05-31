import HotelBusinessDashboard from "@/components/hotel/HotelBusinessDashboard";
import HotelFrontDesk from "@/components/hotel/HotelFrontDesk";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = {
  title: "Business Dashboard — StayNEP",
};

export default async function HotelDashboardPage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-10">
      <HotelFrontDesk bookings={data.bookings} propertyName={data.propertyName} />
      <HotelBusinessDashboard
        userName={data.user.organization ?? data.user.name ?? "Admin"}
        business={data.business}
        revenueTrend={data.revenueTrend}
      />
    </div>
  );
}
