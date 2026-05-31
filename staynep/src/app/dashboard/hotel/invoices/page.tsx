import HotelInvoicesSection from "@/components/hotel/HotelInvoicesSection";
import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Invoices — StayNEP Hotel" };

export default async function HotelInvoicesPage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Invoices"
        description="Create and track guest invoices from draft to paid."
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelInvoicesSection invoices={data.invoices} />
      </div>
    </div>
  );
}
