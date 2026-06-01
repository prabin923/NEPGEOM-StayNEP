import HotelPageHeader from "@/components/hotel/HotelPageHeader";
import HotelSettingsSection from "@/components/hotel/HotelSettingsSection";
import { loadHotelPageData } from "@/lib/hotel-page";

export const metadata = { title: "Settings — StayNEP Hotel" };

export default async function HotelSettingsPage() {
  const data = await loadHotelPageData();

  return (
    <div className="space-y-6">
      <HotelPageHeader
        title="Settings"
        description="Manage your property profile and contact information."
      />
      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <HotelSettingsSection
          property={{
            name: data.property.name,
            district: data.property.district,
            address: data.property.address,
            phone: data.property.phone,
            latitude: data.property.latitude,
            longitude: data.property.longitude,
            amenities: data.property.amenities,
          }}
        />
      </div>
    </div>
  );
}
