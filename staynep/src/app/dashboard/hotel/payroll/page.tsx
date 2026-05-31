import HotelPayrollSection from "@/components/hotel/HotelPayrollSection";
import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Payroll — StayNEP Hotel" };

export default async function HotelPayrollPage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Payroll"
        description="Monthly payout estimates based on attendance this month."
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelPayrollSection staff={data.staffMembers} />
      </div>
    </div>
  );
}
