import HotelHousekeepingSection from "@/components/hotel/HotelHousekeepingSection";
import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Housekeeping — StayNEP Hotel" };

export default async function HotelHousekeepingPage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Housekeeping"
        description="Assign cleaning and turnover tasks by room."
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelHousekeepingSection tasks={data.housekeepingTasks} rooms={data.rooms} />
      </div>
    </div>
  );
}
