import HotelBookingsSection from "@/components/hotel/HotelBookingsSection";
import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Bookings — StayNEP Hotel" };

export default async function HotelBookingsPage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Bookings"
        description={`Create and manage guest reservations for ${data.propertyName}.`}
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelBookingsSection bookings={data.bookings} rooms={data.rooms} />
      </div>
    </div>
  );
}
