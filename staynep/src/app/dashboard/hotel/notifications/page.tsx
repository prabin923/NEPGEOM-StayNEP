import HotelNotificationsSection from "@/components/hotel/HotelNotificationsSection";
import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Notifications — StayNEP Hotel" };

export default async function HotelNotificationsPage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Notifications"
        description="System alerts and manual notices for your property."
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelNotificationsSection notifications={data.notifications} />
      </div>
    </div>
  );
}
