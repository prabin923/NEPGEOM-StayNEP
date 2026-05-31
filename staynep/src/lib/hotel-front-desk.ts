import type { BookingWithRoom } from "@/lib/hotel";
import type { BookingStatus } from "@prisma/client";

export interface FrontDeskBooking {
  id: string;
  guestName: string;
  guestEmail: string | null;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  status: BookingStatus;
  canCheckIn: boolean;
  canCheckOut: boolean;
}

function dayBounds() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return { today, tomorrow };
}

export function getFrontDeskBookings(bookings: BookingWithRoom[]) {
  const { today, tomorrow } = dayBounds();

  const arrivals = bookings.filter(
    (b) =>
      b.status !== "CANCELLED" &&
      b.status !== "CHECKED_OUT" &&
      b.checkIn >= today &&
      b.checkIn < tomorrow
  );

  const inHouse = bookings.filter(
    (b) => b.status === "CHECKED_IN"
  );

  const departures = bookings.filter(
    (b) =>
      (b.status === "CHECKED_IN" || b.status === "CONFIRMED") &&
      b.checkOut >= today &&
      b.checkOut < tomorrow
  );

  const pending = bookings.filter((b) => b.status === "PENDING");

  return { arrivals, inHouse, departures, pending };
}

export function toFrontDeskRow(b: BookingWithRoom): FrontDeskBooking {
  return {
    id: b.id,
    guestName: b.guestName,
    guestEmail: b.guestEmail,
    roomName: b.room.name,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    status: b.status,
    canCheckIn: b.status === "CONFIRMED" || b.status === "PENDING",
    canCheckOut: b.status === "CHECKED_IN",
  };
}
