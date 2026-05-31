"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import {
  createTravelerBooking,
  type TravelerBookingActionState,
} from "@/actions/traveler-bookings";
import { AuthError } from "@/components/auth/AuthField";
import { PortalSectionTitle } from "@/components/portal/PortalUI";
import { hotelInputClass, hotelSubmitClass } from "@/components/hotel/hotel-form-styles";
import type { BookableProperty, TravelerBookingRow } from "@/lib/traveler-bookings";
import { formatNpr } from "@/lib/traveler-bookings";

const initial: TravelerBookingActionState = {};

interface TravelerBookStayProps {
  bookableProperties: BookableProperty[];
  myBookings: TravelerBookingRow[];
  defaultCheckIn: string;
  defaultCheckOut: string;
}

export default function TravelerBookStay({
  bookableProperties,
  myBookings,
  defaultCheckIn,
  defaultCheckOut,
}: TravelerBookStayProps) {
  const [state, action, pending] = useActionState(createTravelerBooking, initial);
  const formRef = useRef<HTMLFormElement>(null);
  const [propertyId, setPropertyId] = useState(bookableProperties[0]?.id ?? "");
  const [roomId, setRoomId] = useState("");

  const selectedProperty = useMemo(
    () => bookableProperties.find((p) => p.id === propertyId),
    [bookableProperties, propertyId]
  );

  useEffect(() => {
    setRoomId(selectedProperty?.rooms[0]?.id ?? "");
  }, [selectedProperty]);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  const selectedRoom = selectedProperty?.rooms.find((r) => r.id === roomId);
  const estimatedTotal =
    selectedRoom && defaultCheckIn && defaultCheckOut
      ? selectedRoom.ratePerNight * 3
      : null;

  return (
    <div>
      <PortalSectionTitle
        title="Book a registered stay"
        subtitle="Partner hotels on StayNEP — appears on the hotel front desk instantly"
        icon={Building2}
      />

      {bookableProperties.length === 0 ? (
        <p className="rounded-[16px] border border-dashed border-fog bg-mist/40 px-4 py-6 text-sm text-steel">
          No rooms available for the default dates. Adjust check-in below or try
          again later.
        </p>
      ) : (
        <form ref={formRef} action={action} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-graphite">Check-in</span>
              <input
                type="date"
                name="checkIn"
                defaultValue={defaultCheckIn}
                required
                className={hotelInputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-graphite">Check-out</span>
              <input
                type="date"
                name="checkOut"
                defaultValue={defaultCheckOut}
                required
                className={hotelInputClass}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-graphite">Units</span>
              <input
                type="number"
                name="units"
                min={1}
                max={selectedRoom?.availableUnits ?? 1}
                defaultValue={1}
                className={hotelInputClass}
              />
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-graphite">Hotel</span>
              <select
                name="propertyId"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className={hotelInputClass}
                required
              >
                {bookableProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.district}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-graphite">Room type</span>
              <select
                name="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className={hotelInputClass}
                required
              >
                {selectedProperty?.rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} · {formatNpr(r.ratePerNight)}/night · {r.availableUnits}{" "}
                    free
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block max-w-sm text-sm">
            <span className="mb-1 block font-medium text-graphite">Phone (optional)</span>
            <input
              type="tel"
              name="guestPhone"
              placeholder="+977 …"
              className={hotelInputClass}
            />
          </label>

          {selectedRoom && (
            <p className="text-sm text-steel">
              From{" "}
              <span className="font-semibold text-obsidian">
                {formatNpr(selectedRoom.ratePerNight)}
              </span>{" "}
              per night
              {estimatedTotal != null && (
                <>
                  {" "}
                  · est. {formatNpr(estimatedTotal)} for sample 3-night stay
                </>
              )}
            </p>
          )}

          {state.error && <AuthError message={state.error} />}
          {state.success && (
            <p className="rounded-[12px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
              Booking confirmed — check &quot;Next stay&quot; in the sidebar.
            </p>
          )}

          <button type="submit" disabled={pending} className={hotelSubmitClass}>
            {pending ? (
              <>
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                Booking…
              </>
            ) : (
              "Confirm booking"
            )}
          </button>
        </form>
      )}

      {myBookings.length > 0 && (
        <p className="mt-4 text-xs text-steel">
          {myBookings.length} booking{myBookings.length === 1 ? "" : "s"} on your
          account — full history in the sidebar.
        </p>
      )}
    </div>
  );
}
