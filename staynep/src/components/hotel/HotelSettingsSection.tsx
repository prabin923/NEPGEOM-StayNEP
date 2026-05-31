"use client";

import { useActionState, useEffect } from "react";
import { Settings } from "lucide-react";
import { updateProperty, type HotelActionState } from "@/actions/hotel-ops";
import { AuthError } from "@/components/auth/AuthField";
import { PortalSectionTitle } from "@/components/portal/PortalUI";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";

const initial: HotelActionState = {};

interface HotelSettingsSectionProps {
  property: {
    name: string;
    district: string;
    address: string | null;
    phone: string | null;
  };
}

export default function HotelSettingsSection({
  property,
}: HotelSettingsSectionProps) {
  const [state, action, pending] = useActionState(updateProperty, initial);

  useEffect(() => {
    if (state.success) {
      // page revalidates
    }
  }, [state.success]);

  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Property profile"
        subtitle="Hotel details shown across your management portal"
        icon={Settings}
      />
      {state.error && <AuthError message={state.error} />}
      {state.success && (
        <p className="rounded-[12px] border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
          Property settings saved.
        </p>
      )}
      <form action={action} className="grid max-w-xl gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">
            Property name
          </label>
          <input
            name="name"
            required
            defaultValue={property.name}
            className={hotelInputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">
            District / region
          </label>
          <input
            name="district"
            required
            defaultValue={property.district}
            className={hotelInputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">
            Address
          </label>
          <input
            name="address"
            defaultValue={property.address ?? ""}
            placeholder="Street, city"
            className={hotelInputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-obsidian">
            Phone
          </label>
          <input
            name="phone"
            defaultValue={property.phone ?? ""}
            placeholder="+977 …"
            className={hotelInputClass}
          />
        </div>
        <button type="submit" disabled={pending} className={hotelSubmitClass}>
          {pending ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
