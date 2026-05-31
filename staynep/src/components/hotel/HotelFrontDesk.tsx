"use client";

import Link from "next/link";
import {
  checkInBookingForm,
  checkOutBookingForm,
  createInvoiceFromBookingForm,
} from "@/actions/hotel";
import { formatDisplayDate } from "@/lib/hotel";
import type { BookingWithRoom } from "@/lib/hotel";
import { getFrontDeskBookings, toFrontDeskRow } from "@/lib/hotel-front-desk";
import { LogIn, LogOut, FileText, ArrowRight } from "lucide-react";

interface HotelFrontDeskProps {
  bookings: BookingWithRoom[];
  propertyName: string;
}

function DeskList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: ReturnType<typeof toFrontDeskRow>[];
  empty: string;
}) {
  return (
    <div className="rounded-[16px] border border-fog bg-snow p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-obsidian font-cosmica">{title}</h3>
      {rows.length === 0 ? (
        <p className="mt-3 text-xs text-steel">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {rows.map((b) => (
            <li
              key={b.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-fog/80 pb-3 last:border-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{b.guestName}</p>
                <p className="text-xs text-steel">
                  {b.roomName} · {formatDisplayDate(b.checkIn)} –{" "}
                  {formatDisplayDate(b.checkOut)}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {b.canCheckIn && (
                  <form action={checkInBookingForm}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-[8px] bg-obsidian px-2.5 py-1 text-[11px] font-medium text-snow"
                    >
                      <LogIn className="h-3 w-3" />
                      Check in
                    </button>
                  </form>
                )}
                {b.canCheckOut && (
                  <form action={checkOutBookingForm}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-[8px] border border-fog bg-snow px-2.5 py-1 text-[11px] font-medium text-obsidian hover:bg-fog"
                    >
                      <LogOut className="h-3 w-3" />
                      Check out
                    </button>
                  </form>
                )}
                <form action={createInvoiceFromBookingForm}>
                  <input type="hidden" name="bookingId" value={b.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 rounded-[8px] border border-fog px-2.5 py-1 text-[11px] font-medium text-graphite hover:bg-fog"
                    title="Create invoice"
                  >
                    <FileText className="h-3 w-3" />
                    Invoice
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function HotelFrontDesk({
  bookings,
  propertyName,
}: HotelFrontDeskProps) {
  const desk = getFrontDeskBookings(bookings);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-obsidian font-cosmica">
            Front desk · {propertyName}
          </h2>
          <p className="text-sm text-steel">
            Today&apos;s arrivals, in-house guests, and departures
          </p>
        </div>
        <Link
          href="/dashboard/hotel/bookings"
          className="inline-flex items-center gap-1 text-sm font-medium text-obsidian hover:underline"
        >
          All bookings
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <DeskList
          title={`Arrivals (${desk.arrivals.length})`}
          rows={desk.arrivals.map(toFrontDeskRow)}
          empty="No check-ins scheduled today."
        />
        <DeskList
          title={`In-house (${desk.inHouse.length})`}
          rows={desk.inHouse.map(toFrontDeskRow)}
          empty="No guests currently checked in."
        />
        <DeskList
          title={`Departures (${desk.departures.length})`}
          rows={desk.departures.map(toFrontDeskRow)}
          empty="No check-outs scheduled today."
        />
      </div>
      {desk.pending.length > 0 && (
        <p className="rounded-[12px] border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          {desk.pending.length} booking(s) pending confirmation — review in{" "}
          <Link href="/dashboard/hotel/bookings" className="font-medium underline">
            Bookings
          </Link>
          .
        </p>
      )}
    </section>
  );
}
