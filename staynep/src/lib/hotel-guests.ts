import type { BookingWithRoom } from "@/lib/hotel";
import { bookingNights, formatDisplayDate, formatNpr } from "@/lib/hotel";
import type { RoomWithAvailability } from "@/lib/hotel";

export interface GuestProfile {
  key: string;
  name: string;
  email: string | null;
  stays: number;
  totalSpent: number;
  lastStay: Date;
  lastRoom: string;
}

export function aggregateGuests(
  bookings: BookingWithRoom[],
  rooms: RoomWithAvailability[]
): GuestProfile[] {
  const map = new Map<string, GuestProfile>();

  for (const b of bookings) {
    if (b.status === "CANCELLED") continue;
    const key = (b.guestEmail || b.guestName).toLowerCase().trim();
    const room = rooms.find((r) => r.id === b.roomId);
    const spent =
      (room?.ratePerNight ?? 0) *
      bookingNights(b.checkIn, b.checkOut) *
      b.units;

    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        key,
        name: b.guestName,
        email: b.guestEmail,
        stays: 1,
        totalSpent: spent,
        lastStay: b.checkOut,
        lastRoom: b.room.name,
      });
    } else {
      existing.stays += 1;
      existing.totalSpent += spent;
      if (b.checkOut > existing.lastStay) {
        existing.lastStay = b.checkOut;
        existing.lastRoom = b.room.name;
      }
      if (!existing.email && b.guestEmail) {
        existing.email = b.guestEmail;
      }
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.lastStay.getTime() - a.lastStay.getTime()
  );
}

export function formatGuestLastStay(date: Date) {
  return formatDisplayDate(date);
}

export function formatGuestSpent(amount: number) {
  return formatNpr(amount);
}
