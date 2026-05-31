import HotelGuestsSection from "@/components/hotel/HotelGuestsSection";
import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import { aggregateGuests } from "@/lib/hotel-guests";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Guests — StayNEP Hotel" };

export default async function HotelGuestsPage() {
  const data = await loadHotelPageData();
  const guests = aggregateGuests(data.bookings, data.rooms);

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Guests"
        description="Guest profiles built from your booking history."
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelGuestsSection guests={guests} />
      </div>
    </div>
  );
}
