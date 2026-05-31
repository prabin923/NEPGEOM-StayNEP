"use server";

import { revalidateHotelDashboard } from "@/lib/hotel-revalidate";
import type { BookingStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ensureHotelProperty } from "@/lib/hotel-property";
import { parseDateInput, bookingNights } from "@/lib/hotel";
import { prisma } from "@/lib/prisma";

export type HotelActionState = {
  error?: string;
  success?: boolean;
};

async function requireHotelOwner() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "HOTEL") {
    return { error: "Unauthorized" as const, session: null, property: null };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, organization: true },
  });

  if (!dbUser) {
    return { error: "User not found" as const, session: null, property: null };
  }

  const property = await ensureHotelProperty(dbUser.id, dbUser.organization);
  return { error: null, session, property };
}

export async function createRoom(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const name = String(formData.get("name") ?? "").trim();
  const totalUnits = Number(formData.get("totalUnits"));
  const ratePerNight = Number(formData.get("ratePerNight"));

  if (!name) return { error: "Room type name is required." };
  if (!Number.isInteger(totalUnits) || totalUnits < 1) {
    return { error: "Total units must be at least 1." };
  }
  if (!Number.isFinite(ratePerNight) || ratePerNight < 0) {
    return { error: "Rate per night must be a valid amount." };
  }

  await prisma.room.create({
    data: {
      propertyId: ctx.property.id,
      name,
      totalUnits,
      ratePerNight: Math.round(ratePerNight),
    },
  });

  revalidateHotelDashboard();
  return { success: true };
}

export async function deleteRoom(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const roomId = String(formData.get("roomId") ?? "");
  const room = await prisma.room.findFirst({
    where: { id: roomId, propertyId: ctx.property.id },
  });
  if (!room) return { error: "Room not found." };

  const activeBookings = await prisma.booking.count({
    where: {
      roomId,
      status: { not: "CANCELLED" },
      checkOut: { gt: new Date() },
    },
  });
  if (activeBookings > 0) {
    return { error: "Cannot delete a room with active or upcoming bookings." };
  }

  await prisma.room.delete({ where: { id: roomId } });
  revalidateHotelDashboard();
  return { success: true };
}

export async function createBooking(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const roomId = String(formData.get("roomId") ?? "");
  const guestName = String(formData.get("guestName") ?? "").trim();
  const guestEmail = String(formData.get("guestEmail") ?? "").trim();
  const guestPhone = String(formData.get("guestPhone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const checkInRaw = String(formData.get("checkIn") ?? "");
  const checkOutRaw = String(formData.get("checkOut") ?? "");
  const units = Number(formData.get("units") ?? 1);
  const status = String(formData.get("status") ?? "CONFIRMED") as BookingStatus;

  if (!guestName) return { error: "Guest name is required." };
  if (!checkInRaw || !checkOutRaw) {
    return { error: "Check-in and check-out dates are required." };
  }

  const checkIn = parseDateInput(checkInRaw);
  const checkOut = parseDateInput(checkOutRaw);
  if (checkOut <= checkIn) {
    return { error: "Check-out must be after check-in." };
  }

  const room = await prisma.room.findFirst({
    where: { id: roomId, propertyId: ctx.property.id },
  });
  if (!room) return { error: "Select a valid room." };

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

  const validStatuses: BookingStatus[] = [
    "PENDING",
    "CONFIRMED",
    "CHECKED_IN",
    "CHECKED_OUT",
    "CANCELLED",
  ];
  if (!validStatuses.includes(status)) {
    return { error: "Invalid booking status." };
  }

  await prisma.booking.create({
    data: {
      propertyId: ctx.property.id,
      roomId,
      guestName,
      guestEmail: guestEmail || null,
      guestPhone: guestPhone || null,
      notes: notes || null,
      checkIn,
      checkOut,
      units,
      status,
    },
  });

  revalidateHotelDashboard();
  return { success: true };
}

export async function updateBookingStatus(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const bookingId = String(formData.get("bookingId") ?? "");
  const status = String(formData.get("status") ?? "") as BookingStatus;

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, propertyId: ctx.property.id },
  });
  if (!booking) return { error: "Booking not found." };

  const validStatuses: BookingStatus[] = [
    "PENDING",
    "CONFIRMED",
    "CHECKED_IN",
    "CHECKED_OUT",
    "CANCELLED",
  ];
  if (!validStatuses.includes(status)) {
    return { error: "Invalid status." };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });

  if (status === "CHECKED_OUT") {
    await createTurnoverTask(ctx.property.id, booking);
  }

  revalidateHotelDashboard();
  return { success: true };
}

async function createTurnoverTask(
  propertyId: string,
  booking: { roomId: string; guestName: string }
) {
  const room = await prisma.room.findUnique({ where: { id: booking.roomId } });
  await prisma.housekeepingTask.create({
    data: {
      propertyId,
      roomId: booking.roomId,
      title: `Turnover after ${booking.guestName}`,
      priority: "HIGH",
      notes: room ? `Clean and prepare ${room.name}` : undefined,
      dueDate: new Date(),
    },
  });
}

export async function checkInBookingForm(formData: FormData) {
  await checkInBooking({}, formData);
}

export async function checkInBooking(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const bookingId = String(formData.get("bookingId") ?? "");
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, propertyId: ctx.property.id },
  });
  if (!booking) return { error: "Booking not found." };
  if (booking.status !== "CONFIRMED" && booking.status !== "PENDING") {
    return { error: "Only pending or confirmed bookings can be checked in." };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CHECKED_IN" },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function checkOutBookingForm(formData: FormData) {
  await checkOutBooking({}, formData);
}

export async function checkOutBooking(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const bookingId = String(formData.get("bookingId") ?? "");
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, propertyId: ctx.property.id },
  });
  if (!booking) return { error: "Booking not found." };
  if (booking.status !== "CHECKED_IN") {
    return { error: "Guest must be checked in before check-out." };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CHECKED_OUT" },
  });
  await createTurnoverTask(ctx.property.id, booking);
  revalidateHotelDashboard();
  return { success: true };
}

export async function createInvoiceFromBookingForm(formData: FormData) {
  await createInvoiceFromBooking({}, formData);
}

export async function createInvoiceFromBooking(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const bookingId = String(formData.get("bookingId") ?? "");
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, propertyId: ctx.property.id },
    include: { room: true },
  });
  if (!booking) return { error: "Booking not found." };
  if (booking.status === "CANCELLED") {
    return { error: "Cannot invoice a cancelled booking." };
  }

  const existing = await prisma.invoice.findFirst({
    where: { bookingId, propertyId: ctx.property.id },
  });
  if (existing) return { error: "Invoice already exists for this booking." };

  const nights = bookingNights(booking.checkIn, booking.checkOut);
  const amount = booking.room.ratePerNight * nights * booking.units;

  await prisma.invoice.create({
    data: {
      propertyId: ctx.property.id,
      bookingId: booking.id,
      guestName: booking.guestName,
      description: `${booking.room.name} · ${nights} night(s) · ${booking.units} unit(s)`,
      amount,
      status: "SENT",
      dueDate: booking.checkOut,
    },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function updateRoom(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const roomId = String(formData.get("roomId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const totalUnits = Number(formData.get("totalUnits"));
  const ratePerNight = Number(formData.get("ratePerNight"));

  const room = await prisma.room.findFirst({
    where: { id: roomId, propertyId: ctx.property.id },
  });
  if (!room) return { error: "Room not found." };
  if (!name) return { error: "Room name is required." };
  if (!Number.isInteger(totalUnits) || totalUnits < 1) {
    return { error: "Total units must be at least 1." };
  }
  if (!Number.isFinite(ratePerNight) || ratePerNight < 0) {
    return { error: "Invalid rate." };
  }

  await prisma.room.update({
    where: { id: roomId },
    data: { name, totalUnits, ratePerNight: Math.round(ratePerNight) },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function updateRoomForm(formData: FormData) {
  await updateRoom({}, formData);
}

/** For use in plain form actions (no useActionState). */
export async function deleteRoomForm(formData: FormData) {
  await deleteRoom({}, formData);
}

export async function deleteBookingForm(formData: FormData) {
  await deleteBooking({}, formData);
}

export async function updateBookingStatusForm(formData: FormData) {
  await updateBookingStatus({}, formData);
}

export async function deleteBooking(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const bookingId = String(formData.get("bookingId") ?? "");
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, propertyId: ctx.property.id },
  });
  if (!booking) return { error: "Booking not found." };

  await prisma.booking.delete({ where: { id: bookingId } });
  revalidateHotelDashboard();
  return { success: true };
}
