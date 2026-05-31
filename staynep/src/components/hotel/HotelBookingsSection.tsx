"use client";

import { useActionState, useEffect, useRef } from "react";
import { Calendar, Trash2 } from "lucide-react";
import {
  createBooking,
  updateBookingStatusForm,
  deleteBookingForm,
  checkInBookingForm,
  checkOutBookingForm,
  createInvoiceFromBookingForm,
  type HotelActionState,
} from "@/actions/hotel";
import { AuthError } from "@/components/auth/AuthField";
import {
  type BookingWithRoom,
  type RoomWithAvailability,
  formatDisplayDate,
  formatNpr,
  bookingNights,
  BOOKING_STATUS_LABELS,
} from "@/lib/hotel";
import {
  PortalSectionTitle,
  portalTableHead,
  portalTableRow,
} from "@/components/portal/PortalUI";
import type { BookingStatus } from "@prisma/client";

const initial: HotelActionState = {};

interface HotelBookingsSectionProps {
  bookings: BookingWithRoom[];
  rooms: RoomWithAvailability[];
}

const statusOptions: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
];

export default function HotelBookingsSection({
  bookings,
  rooms,
}: HotelBookingsSectionProps) {
  const [createState, createAction, createPending] = useActionState(
    createBooking,
    initial
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (createState.success) formRef.current?.reset();
  }, [createState.success]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div id="bookings" className="space-y-6">
      <PortalSectionTitle
        title="Bookings"
        subtitle="Record guest reservations and update status"
        icon={Calendar}
      />

      {createState.error && <AuthError message={createState.error} />}

      {rooms.length === 0 ? (
        <p className="text-sm text-steel font-cosmica">
          Add at least one room type before creating bookings.
        </p>
      ) : (
        <form
          ref={formRef}
          action={createAction}
          className="space-y-4 rounded-[20px] border border-fog bg-mist/50 p-4"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-obsidian">
                Guest name
              </label>
              <input
                name="guestName"
                required
                placeholder="Guest full name"
                className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-obsidian">
                Guest email (optional)
              </label>
              <input
                name="guestEmail"
                type="email"
                placeholder="guest@email.com"
                className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-obsidian">
                Phone (optional)
              </label>
              <input
                name="guestPhone"
                placeholder="+977 …"
                className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-obsidian">
                Room type
              </label>
              <select
                name="roomId"
                required
                className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
              >
                <option value="">Select room</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.availableUnits} avail.) — {formatNpr(r.ratePerNight)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-obsidian">
                Check-in
              </label>
              <input
                name="checkIn"
                type="date"
                required
                min={today}
                className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-obsidian">
                Check-out
              </label>
              <input
                name="checkOut"
                type="date"
                required
                className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-obsidian">
                  Units
                </label>
                <input
                  name="units"
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-obsidian">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue="CONFIRMED"
                  className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {BOOKING_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="mb-1.5 block text-xs font-medium text-obsidian">
                Notes (optional)
              </label>
              <input
                name="notes"
                placeholder="Special requests, arrival time…"
                className="w-full rounded-[12px] border border-fog bg-snow px-3 py-2.5 text-sm outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={createPending}
            className="rounded-[36px] bg-obsidian px-6 py-2.5 text-sm font-semibold text-snow shadow-button disabled:opacity-55"
          >
            {createPending ? "Saving…" : "Add booking"}
          </button>
        </form>
      )}

      {bookings.length === 0 ? (
        <p className="text-sm text-steel font-cosmica">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={portalTableHead}>
                <th className="pb-3 pr-4">Guest</th>
                <th className="pb-3 pr-4">Room</th>
                <th className="pb-3 pr-4">Dates</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Actions</th>
                <th className="pb-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const room = rooms.find((r) => r.id === b.roomId);
                const nights = bookingNights(b.checkIn, b.checkOut);
                const total =
                  room && b.status !== "CANCELLED"
                    ? room.ratePerNight * nights * b.units
                    : 0;

                return (
                  <tr key={b.id} className={portalTableRow}>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-ink">{b.guestName}</p>
                      {b.guestEmail && (
                        <p className="text-xs text-steel">{b.guestEmail}</p>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-graphite">
                      {b.room.name}
                      {b.units > 1 && (
                        <span className="text-steel"> ×{b.units}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-steel">
                      {formatDisplayDate(b.checkIn)} →{" "}
                      {formatDisplayDate(b.checkOut)}
                      <span className="block text-xs">{nights} night(s)</span>
                    </td>
                    <td className="py-3 pr-4 font-medium text-obsidian">
                      {b.status === "CANCELLED" ? "—" : formatNpr(total)}
                    </td>
                    <td className="py-3 pr-4">
                      <form action={updateBookingStatusForm} className="inline">
                        <input type="hidden" name="bookingId" value={b.id} />
                        <select
                          name="status"
                          defaultValue={b.status}
                          onChange={(e) => e.currentTarget.form?.requestSubmit()}
                          className="rounded-[10px] border border-fog bg-snow px-2 py-1.5 text-xs capitalize"
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {BOOKING_STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                      </form>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {(b.status === "CONFIRMED" || b.status === "PENDING") && (
                          <form action={checkInBookingForm}>
                            <input type="hidden" name="bookingId" value={b.id} />
                            <button
                              type="submit"
                              className="rounded-[8px] bg-obsidian px-2 py-1 text-[10px] font-medium text-snow"
                            >
                              Check in
                            </button>
                          </form>
                        )}
                        {b.status === "CHECKED_IN" && (
                          <form action={checkOutBookingForm}>
                            <input type="hidden" name="bookingId" value={b.id} />
                            <button
                              type="submit"
                              className="rounded-[8px] border border-fog px-2 py-1 text-[10px] font-medium"
                            >
                              Check out
                            </button>
                          </form>
                        )}
                        {b.status !== "CANCELLED" && (
                          <form action={createInvoiceFromBookingForm}>
                            <input type="hidden" name="bookingId" value={b.id} />
                            <button
                              type="submit"
                              className="rounded-[8px] border border-fog px-2 py-1 text-[10px] font-medium text-steel"
                            >
                              Invoice
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end">
                        <form action={deleteBookingForm}>
                          <input type="hidden" name="bookingId" value={b.id} />
                          <button
                            type="submit"
                            className="rounded-[10px] p-2 text-steel hover:bg-fog hover:text-red-600"
                            aria-label="Delete booking"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
