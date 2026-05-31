import HotelInventorySection from "@/components/hotel/HotelInventorySection";
import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Inventory — StayNEP Hotel" };

export default async function HotelInventoryPage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Inventory"
        description="Track supplies and get low-stock alerts in Notifications."
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelInventorySection items={data.inventoryItems} />
      </div>
    </div>
  );
}
