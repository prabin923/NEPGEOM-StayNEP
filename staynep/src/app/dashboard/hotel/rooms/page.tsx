import HotelRoomsSection from "@/components/hotel/HotelRoomsSection";
import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Rooms — StayNEP Hotel" };

export default async function HotelRoomsPage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Rooms"
        description={`Manage room types, rates, and availability for ${data.propertyName}.`}
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelRoomsSection rooms={data.rooms} />
      </div>
    </div>
  );
}
