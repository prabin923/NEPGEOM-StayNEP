"use client";

import { useActionState, useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { updateProperty, type HotelActionState } from "@/actions/hotel-ops";
import { AuthError } from "@/components/auth/AuthField";
import { PortalSectionTitle } from "@/components/portal/PortalUI";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";

const SUGGESTED_AMENITIES = [
  "WiFi",
  "Parking",
  "Restaurant",
  "Pool",
  "Spa",
  "Gym",
  "Room Service",
  "Laundry",
  "Airport Shuttle",
  "AC",
  "Hot Water",
  "Garden",
  "Bar",
  "Conference Room",
  "Mountain View",
];

const initial: HotelActionState = {};

interface HotelSettingsSectionProps {
  property: {
    name: string;
    district: string;
    address: string | null;
    phone: string | null;
    latitude: number | null;
    longitude: number | null;
    amenities: string[];
  };
}

export default function HotelSettingsSection({
  property,
}: HotelSettingsSectionProps) {
  const [state, action, pending] = useActionState(updateProperty, initial);
  const [amenities, setAmenities] = useState<string[]>(property.amenities ?? []);
  const [customAmenity, setCustomAmenity] = useState("");

  useEffect(() => {
    if (state.success) {
      // page revalidates
    }
  }, [state.success]);

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities((prev) => [...prev, trimmed]);
      setCustomAmenity("");
    }
  };

  const removeAmenity = (name: string) => {
    setAmenities((prev) => prev.filter((a) => a !== name));
  };

  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Property profile"
        subtitle="Hotel details and map pin for StayNEP tourism maps"
        icon={Settings}
      />
      {state.error && <AuthError message={state.error} />}
      {state.success && (
        <p className="rounded-[12px] border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
          Property settings saved.
        </p>
      )}
      <form action={action} className="grid max-w-xl gap-4">
        {/* Hidden amenities input */}
        <input type="hidden" name="amenities" value={JSON.stringify(amenities)} />

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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-obsidian">
              Latitude (map)
            </label>
            <input
              name="latitude"
              type="number"
              step="any"
              defaultValue={property.latitude ?? ""}
              placeholder="28.2096"
              className={hotelInputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-obsidian">
              Longitude (map)
            </label>
            <input
              name="longitude"
              type="number"
              step="any"
              defaultValue={property.longitude ?? ""}
              placeholder="83.9856"
              className={hotelInputClass}
            />
          </div>
        </div>
        <p className="text-xs text-steel">
          Leave blank to place your hotel by district on the map. Set coordinates
          for an exact pin.
        </p>

        {/* Amenities Section */}
        <div className="border-t border-fog/50 pt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-obsidian">
              Amenities
            </label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {amenities.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-1.5 rounded-full border border-fog bg-mist px-3 py-1 text-xs font-medium text-graphite"
                >
                  {a}
                  <button
                    type="button"
                    onClick={() => removeAmenity(a)}
                    className="text-graphite hover:text-obsidian font-bold text-xs shrink-0 cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
              {amenities.length === 0 && (
                <span className="text-xs text-steel italic">No amenities selected.</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomAmenity();
                  }
                }}
                placeholder="Add custom amenity (e.g. Mountain view) and press Enter"
                className={`${hotelInputClass} flex-1`}
              />
              <button
                type="button"
                onClick={addCustomAmenity}
                className="rounded-[12px] border border-fog bg-snow px-4 py-2.5 text-xs font-semibold text-graphite hover:bg-mist cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-steel uppercase tracking-wider mb-2">
              Pre-Suggested Amenities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_AMENITIES.filter((a) => !amenities.includes(a)).map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => setAmenities((prev) => [...prev, suggested])}
                  className="rounded-full bg-snow border border-fog px-2.5 py-1 text-xs font-medium text-graphite hover:border-obsidian/20 hover:bg-mist transition cursor-pointer"
                >
                  + {suggested}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" disabled={pending} className={hotelSubmitClass}>
          {pending ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
