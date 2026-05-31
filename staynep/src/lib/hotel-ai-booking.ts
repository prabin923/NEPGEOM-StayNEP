import type { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  bookingNights,
  formatNpr,
  isBookingOccupying,
  parseDateInput,
} from "@/lib/hotel";
import { defaultBookingWindow } from "@/lib/traveler-bookings";

export type PropertyBookingContext = {
  id: string;
  name: string;
  district: string;
  address: string | null;
  phone: string | null;
  rooms: {
    id: string;
    name: string;
    ratePerNight: number;
    availableUnits: number;
    totalUnits: number;
  }[];
  defaultCheckIn: string;
  defaultCheckOut: string;
};

export type BookingDraft = {
  propertyId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  units: number;
  guestPhone?: string;
};

export async function fetchPropertyBookingContext(
  propertyId: string,
  checkInRaw?: string,
  checkOutRaw?: string
): Promise<PropertyBookingContext | null> {
  const defaults = defaultBookingWindow();
  const checkIn = checkInRaw ? parseDateInput(checkInRaw) : defaults.checkIn;
  const checkOut = checkOutRaw ? parseDateInput(checkOutRaw) : defaults.checkOut;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
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
  });

  if (!property) return null;

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
      return {
        id: room.id,
        name: room.name,
        ratePerNight: room.ratePerNight,
        availableUnits,
        totalUnits: room.totalUnits,
      };
    })
    .filter((r) => r.availableUnits > 0);

  return {
    id: property.id,
    name: property.name,
    district: property.district,
    address: property.address,
    phone: property.phone,
    rooms,
    defaultCheckIn: toDateInput(checkIn),
    defaultCheckOut: toDateInput(checkOut),
  };
}

export function toDateInput(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function describePropertyForAi(ctx: PropertyBookingContext) {
  const roomLines = ctx.rooms.map(
    (r) =>
      `- ${r.name}: ${formatNpr(r.ratePerNight)}/night, ${r.availableUnits} available (id:${r.id})`
  );
  return `Hotel: ${ctx.name}, ${ctx.district}
${ctx.address ? `Address: ${ctx.address}` : ""}
${ctx.phone ? `Phone: ${ctx.phone}` : ""}
Available rooms for ${ctx.defaultCheckIn} → ${ctx.defaultCheckOut}:
${roomLines.length ? roomLines.join("\n") : "(no rooms available for these dates)"}`;
}

export async function executeBookingDraft(
  draft: BookingDraft,
  guest: { name: string; email: string; phone?: string }
) {
  const checkIn = parseDateInput(draft.checkIn);
  const checkOut = parseDateInput(draft.checkOut);
  if (checkOut <= checkIn) {
    return { error: "Check-out must be after check-in." as const };
  }

  const room = await prisma.room.findFirst({
    where: { id: draft.roomId, propertyId: draft.propertyId },
  });
  if (!room) return { error: "Room not found." as const };

  const units = Math.max(1, Math.floor(draft.units));
  if (units > room.totalUnits) {
    return { error: `Only ${room.totalUnits} unit(s) for this room type.` as const };
  }

  const overlapping = await prisma.booking.findMany({
    where: {
      roomId: draft.roomId,
      status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
  });

  const booked = overlapping.reduce((s, b) => s + b.units, 0);
  if (booked + units > room.totalUnits) {
    return {
      error: `Only ${room.totalUnits - booked} unit(s) available for those dates.`,
    };
  }

  const total = room.ratePerNight * bookingNights(checkIn, checkOut) * units;

  const booking = await prisma.booking.create({
    data: {
      propertyId: draft.propertyId,
      roomId: draft.roomId,
      guestName: guest.name,
      guestEmail: guest.email || null,
      guestPhone: guest.phone || null,
      checkIn,
      checkOut,
      units,
      status: "CONFIRMED" satisfies BookingStatus,
      notes: "Booked via StayNEP AI map assistant",
    },
  });

  await prisma.notification.upsert({
    where: { sourceKey: `traveler-booking:${booking.id}` },
    create: {
      propertyId: draft.propertyId,
      sourceKey: `traveler-booking:${booking.id}`,
      title: "New AI booking",
      message: `${guest.name} booked ${room.name} via AI assistant (${units} unit${units === 1 ? "" : "s"}).`,
    },
    update: {
      title: "New AI booking",
      message: `${guest.name} booked ${room.name} via AI assistant (${units} unit${units === 1 ? "" : "s"}).`,
      read: false,
    },
  });

  return {
    bookingId: booking.id,
    propertyName: (await prisma.property.findUnique({
      where: { id: draft.propertyId },
      select: { name: true },
    }))?.name,
    roomName: room.name,
    checkIn: draft.checkIn,
    checkOut: draft.checkOut,
    units,
    totalNpr: total,
  };
}
