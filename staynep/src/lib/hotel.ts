import type { Booking, BookingStatus, Room } from "@prisma/client";

export type RoomWithAvailability = Room & {
  bookedUnits: number;
  availableUnits: number;
};

export type BookingWithRoom = Booking & {
  room: { id: string; name: string };
};

export function formatNpr(amount: number): string {
  return `NPR ${amount.toLocaleString("en-NP")}`;
}

export function formatRs(amount: number): string {
  return `Rs${amount.toLocaleString("en-NP")}`;
}

export function parseDateInput(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Nights between check-in and check-out (minimum 1). */
export function bookingNights(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** Units booked for a room on overlapping active reservations. */
/** Statuses that reserve room inventory for a date range. */
export function isBookingOccupying(status: BookingStatus): boolean {
  return status === "CONFIRMED" || status === "CHECKED_IN" || status === "PENDING";
}

export function countBookedUnits(
  roomId: string,
  totalUnits: number,
  bookings: Pick<Booking, "roomId" | "checkIn" | "checkOut" | "units" | "status">[],
  windowStart: Date,
  windowEnd: Date
): number {
  let booked = 0;
  for (const b of bookings) {
    if (b.roomId !== roomId) continue;
    if (!isBookingOccupying(b.status)) continue;
    if (!rangesOverlap(b.checkIn, b.checkOut, windowStart, windowEnd)) continue;
    booked += b.units;
  }
  return Math.min(booked, totalUnits);
}

export function roomsWithAvailability(
  rooms: Room[],
  bookings: Pick<Booking, "roomId" | "checkIn" | "checkOut" | "units" | "status">[],
  asOf: Date = new Date()
): RoomWithAvailability[] {
  const dayStart = new Date(asOf);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  return rooms.map((room) => {
    const bookedUnits = countBookedUnits(
      room.id,
      room.totalUnits,
      bookings,
      dayStart,
      dayEnd
    );
    return {
      ...room,
      bookedUnits,
      availableUnits: Math.max(0, room.totalUnits - bookedUnits),
    };
  });
}

export function propertyStats(
  rooms: RoomWithAvailability[],
  bookings: Booking[]
) {
  const totalRooms = rooms.reduce((s, r) => s + r.totalUnits, 0);
  const availableRooms = rooms.reduce((s, r) => s + r.availableUnits, 0);
  const occupied = totalRooms - availableRooms;
  const occupancyRate =
    totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayBookings = bookings.filter(
    (b) =>
      b.status !== "CANCELLED" &&
      b.checkIn >= today &&
      b.checkIn < tomorrow
  ).length;

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyRevenue = bookings
    .filter((b) => b.status !== "CANCELLED" && b.createdAt >= monthStart)
    .reduce((sum, b) => {
      const room = rooms.find((r) => r.id === b.roomId);
      if (!room) return sum;
      return sum + room.ratePerNight * bookingNights(b.checkIn, b.checkOut) * b.units;
    }, 0);

  return {
    totalRooms,
    availableRooms,
    occupancyRate,
    todayBookings,
    monthlyRevenue,
    monthlyRevenueLabel: formatNpr(monthlyRevenue),
  };
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CHECKED_IN: "checked-in",
  CHECKED_OUT: "checked-out",
  CANCELLED: "cancelled",
};

export function calculateBookingTotal(
  booking: Pick<Booking, "checkIn" | "checkOut" | "units" | "status">,
  ratePerNight: number
): number {
  if (booking.status === "CANCELLED") return 0;
  return ratePerNight * bookingNights(booking.checkIn, booking.checkOut) * booking.units;
}

export function statusBadgeTone(
  status: BookingStatus
): "success" | "warning" | "info" | "neutral" {
  switch (status) {
    case "CHECKED_IN":
      return "success";
    case "CONFIRMED":
      return "info";
    case "PENDING":
      return "warning";
    case "CHECKED_OUT":
      return "neutral";
    default:
      return "neutral";
  }
}
