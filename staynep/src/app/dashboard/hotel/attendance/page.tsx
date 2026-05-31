import HotelAttendanceSection from "@/components/hotel/HotelAttendanceSection";
import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Attendance — StayNEP Hotel" };

export default async function HotelAttendancePage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Attendance"
        description="Record daily present, absent, or leave status for staff."
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelAttendanceSection staff={data.staffMembers} />
      </div>
    </div>
  );
}
