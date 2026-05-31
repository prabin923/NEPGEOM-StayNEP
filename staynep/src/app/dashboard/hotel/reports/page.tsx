import HotelReportsSection from "@/components/hotel/HotelReportsSection";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Reports — StayNEP Hotel" };

export default async function HotelReportsPage() {
  const data = await loadHotelPageData();
  const openTasks = data.housekeepingTasks.filter((t) => t.status !== "DONE").length;
  const unpaidInvoices = data.invoices.filter((i) => i.status !== "PAID").length;

  return (
    <HotelReportsSection
      business={data.business}
      diningOrderCount={data.diningOrders.length}
      inventoryCount={data.inventoryItems.length}
      openTasks={openTasks}
      staffCount={data.staffMembers.length}
      unpaidInvoices={unpaidInvoices}
    />
  );
}
