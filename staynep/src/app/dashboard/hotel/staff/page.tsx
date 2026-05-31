import HotelStaffSection from "@/components/hotel/HotelStaffSection";
import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Staff — StayNEP Hotel" };

export default async function HotelStaffPage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Staff"
        description="Add team members for attendance and payroll."
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelStaffSection staff={data.staffMembers} />
      </div>
    </div>
  );
}
