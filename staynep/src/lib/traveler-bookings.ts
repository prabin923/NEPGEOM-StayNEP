import { prisma } from "@/lib/prisma";
import {
  formatDisplayDate,
  formatNpr,
  bookingNights,
  isBookingOccupying,
} from "@/lib/hotel";
import { resolvePropertyCoords } from "@/lib/registered-hotels";

export type TravelerBookingRow = {
  id: string;
  propertyName: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  units: number;
  totalNpr: number;
};

export type BookableProperty = {
  id: string;
  name: string;
  district: string;
  address: string | null;
  rooms: {
    id: string;
    name: string;
    ratePerNight: number;
    availableUnits: number;
    totalUnits: number;
  }[];
};

export async function fetchTravelerBookings(
  guestEmail: string
): Promise<TravelerBookingRow[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      guestEmail: guestEmail,
      status: { not: "CANCELLED" },
    },
    include: {
      property: { select: { name: true } },
      room: { select: { name: true, ratePerNight: true } },
    },
    orderBy: { checkIn: "desc" },
    take: 20,
  });

  return bookings.map((b) => ({
    id: b.id,
    propertyName: b.property.name,
    roomName: b.room.name,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    status: b.status.toLowerCase(),
    units: b.units,
    totalNpr: b.room.ratePerNight * bookingNights(b.checkIn, b.checkOut) * b.units,
  }));
}

export async function fetchBookableProperties(
  checkIn: Date,
  checkOut: Date
): Promise<BookableProperty[]> {
  const properties = await prisma.property.findMany({
    include: {
      rooms: true,
      bookings: {
        where: { status: { not: "CANCELLED" } },
        select: {
          roomId: true,
          checkIn: true,
          checkOut: true,
          units: true,
          status: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return properties
    .map((property) => {
      const rangeBookings = property.bookings.filter(
        (b) =>
          isBookingOccupying(b.status) &&
          b.checkIn < checkOut &&
          b.checkOut > checkIn
      );

      const rooms = property.rooms
        .map((room) => {
          const booked = rangeBookings
            .filter((b) => b.roomId === room.id)
            .reduce((s, b) => s + b.units, 0);
          const availableUnits = Math.max(0, room.totalUnits - booked);
          return { ...room, availableUnits };
        })
        .filter((r) => r.availableUnits > 0);

      if (rooms.length === 0) return null;

      return {
        id: property.id,
        name: property.name,
        district: property.district,
        address: property.address,
        rooms: rooms.map((r) => ({
          id: r.id,
          name: r.name,
          ratePerNight: r.ratePerNight,
          availableUnits: r.availableUnits,
          totalUnits: r.totalUnits,
        })),
      };
    })
    .filter((p): p is BookableProperty => p != null);
}

export function defaultBookingWindow() {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 1);
  checkIn.setHours(12, 0, 0, 0);
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + 3);
  return { checkIn, checkOut };
}

export function formatBookingDates(checkIn: Date, checkOut: Date) {
  return `${formatDisplayDate(checkIn)} – ${formatDisplayDate(checkOut)}`;
}

export { formatNpr, resolvePropertyCoords };
