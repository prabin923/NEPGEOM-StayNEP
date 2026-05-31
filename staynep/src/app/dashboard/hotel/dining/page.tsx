import HotelDiningSection from "@/components/hotel/HotelDiningSection";
import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Dining — StayNEP Hotel" };

export default async function HotelDiningPage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Dining"
        description="Record restaurant and room-service orders. Revenue appears on your dashboard."
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelDiningSection orders={data.diningOrders} />
      </div>
    </div>
  );
}
