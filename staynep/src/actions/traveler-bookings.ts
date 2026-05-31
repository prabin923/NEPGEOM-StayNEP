"use server";

import type { BookingStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { parseDateInput } from "@/lib/hotel";
import { prisma } from "@/lib/prisma";
import { revalidateHotelDashboard } from "@/lib/hotel-revalidate";
import { revalidateTourismPortals } from "@/lib/revalidate-app";

export type TravelerBookingActionState = {
  error?: string;
  success?: boolean;
  bookingId?: string;
};

async function requireTraveler() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "TRAVELER") {
    return { error: "Unauthorized" as const, userId: null, email: null, name: null };
  }
  return {
    error: null,
    userId: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? "Traveler",
  };
}

export async function createTravelerBooking(
  _prev: TravelerBookingActionState,
  formData: FormData
): Promise<TravelerBookingActionState> {
  const ctx = await requireTraveler();
  if (ctx.error || !ctx.userId) return { error: ctx.error ?? "Unauthorized" };

  const propertyId = String(formData.get("propertyId") ?? "").trim();
  const roomId = String(formData.get("roomId") ?? "").trim();
  const checkInRaw = String(formData.get("checkIn") ?? "");
  const checkOutRaw = String(formData.get("checkOut") ?? "");
  const units = Number(formData.get("units") ?? 1);
  const guestPhone = String(formData.get("guestPhone") ?? "").trim();

  if (!propertyId || !roomId) return { error: "Select a hotel and room type." };
  if (!checkInRaw || !checkOutRaw) {
    return { error: "Check-in and check-out dates are required." };
  }

  const checkIn = parseDateInput(checkInRaw);
  const checkOut = parseDateInput(checkOutRaw);
  if (checkOut <= checkIn) {
    return { error: "Check-out must be after check-in." };
  }

  const room = await prisma.room.findFirst({
    where: { id: roomId, propertyId },
    include: { property: { select: { name: true } } },
  });
  if (!room) return { error: "Room not found for this hotel." };

  if (!Number.isInteger(units) || units < 1) {
    return { error: "Units must be at least 1." };
  }
  if (units > room.totalUnits) {
    return { error: `This room type only has ${room.totalUnits} unit(s).` };
  }

  const overlapping = await prisma.booking.findMany({
    where: {
      roomId,
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

  const booking = await prisma.booking.create({
    data: {
      propertyId,
      roomId,
      guestName: ctx.name!,
      guestEmail: ctx.email || null,
      guestPhone: guestPhone || null,
      checkIn,
      checkOut,
      units,
      status: "CONFIRMED" satisfies BookingStatus,
      notes: "Booked via StayNEP traveler portal",
    },
  });

  await prisma.notification.upsert({
    where: { sourceKey: `traveler-booking:${booking.id}` },
    create: {
      propertyId,
      sourceKey: `traveler-booking:${booking.id}`,
      title: "New online booking",
      message: `${ctx.name} booked ${room.name} (${units} unit${units === 1 ? "" : "s"}) via StayNEP.`,
    },
    update: {
      title: "New online booking",
      message: `${ctx.name} booked ${room.name} (${units} unit${units === 1 ? "" : "s"}) via StayNEP.`,
      read: false,
    },
  });

  revalidateHotelDashboard();
  revalidateTourismPortals();
  return { success: true, bookingId: booking.id };
}
