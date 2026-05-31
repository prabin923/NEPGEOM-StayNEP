import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { ensureHotelProperty } from "@/lib/hotel-property";
import {
  roomsWithAvailability,
  propertyStats,
  bookingNights,
  formatRs,
  type BookingWithRoom,
  type RoomWithAvailability,
} from "@/lib/hotel";
import type { Booking, DiningOrder } from "@prisma/client";
import { syncHotelNotifications } from "@/lib/hotel-notifications";

export interface BusinessDashboardStats {
  totalRevenue: number;
  roomRevenue: number;
  diningRevenue: number;
  totalRevenueLabel: string;
  bookingsCount: number;
  paidBookings: number;
  pendingBookings: number;
  roomListings: number;
  totalUnits: number;
  guestsCount: number;
  occupancyRate: number;
  occupiedUnits: number;
  todayArrivals: number;
  todayDepartures: number;
}

export interface RevenueMonth {
  month: string;
  rooms: number;
  dining: number;
  total: number;
}

function bookingRevenue(
  b: Booking,
  rooms: RoomWithAvailability[]
): number {
  if (b.status === "CANCELLED") return 0;
  const room = rooms.find((r) => r.id === b.roomId);
  if (!room) return 0;
  return room.ratePerNight * bookingNights(b.checkIn, b.checkOut) * b.units;
}

function diningRevenueTotal(orders: Pick<DiningOrder, "amount">[]) {
  return orders.reduce((s, o) => s + o.amount, 0);
}

export function computeBusinessStats(
  rooms: RoomWithAvailability[],
  bookings: Booking[],
  diningOrders: Pick<DiningOrder, "amount">[] = []
): BusinessDashboardStats {
  const base = propertyStats(rooms, bookings);
  const active = bookings.filter((b) => b.status !== "CANCELLED");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayArrivals = active.filter(
    (b) => b.checkIn >= today && b.checkIn < tomorrow
  ).length;

  const todayDepartures = active.filter(
    (b) => b.checkOut >= today && b.checkOut < tomorrow
  ).length;

  const paidBookings = active.filter(
    (b) =>
      b.status === "CONFIRMED" ||
      b.status === "CHECKED_IN" ||
      b.status === "CHECKED_OUT"
  ).length;

  const pendingBookings = active.filter((b) => b.status === "PENDING").length;

  const guestKeys = new Set(
    active.map((b) => (b.guestEmail || b.guestName).toLowerCase())
  );

  const roomRevenue = active.reduce(
    (sum, b) => sum + bookingRevenue(b, rooms),
    0
  );
  const diningRevenue = diningRevenueTotal(diningOrders);
  const totalRevenue = roomRevenue + diningRevenue;

  return {
    totalRevenue,
    roomRevenue,
    diningRevenue,
    totalRevenueLabel: formatRs(totalRevenue),
    bookingsCount: active.length,
    paidBookings,
    pendingBookings,
    roomListings: rooms.length,
    totalUnits: base.totalRooms,
    guestsCount: guestKeys.size,
    occupancyRate: base.occupancyRate,
    occupiedUnits: base.totalRooms - base.availableRooms,
    todayArrivals,
    todayDepartures,
  };
}

export function computeRevenueTrend(
  rooms: RoomWithAvailability[],
  bookings: Booking[],
  diningOrders: DiningOrder[] = []
): RevenueMonth[] {
  const months: RevenueMonth[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const label = monthStart.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });

    const roomRev = bookings
      .filter(
        (b) =>
          b.status !== "CANCELLED" &&
          b.checkIn >= monthStart &&
          b.checkIn < monthEnd
      )
      .reduce((sum, b) => sum + bookingRevenue(b, rooms), 0);

    const diningRev = diningOrders
      .filter((o) => o.orderedAt >= monthStart && o.orderedAt < monthEnd)
      .reduce((sum, o) => sum + o.amount, 0);

    months.push({
      month: label,
      rooms: roomRev,
      dining: diningRev,
      total: roomRev + diningRev,
    });
  }

  return months;
}

export const loadHotelPropertyForUser = cache(async function loadHotelPropertyForUser(
  userId: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, organization: true },
  });

  if (!user) return null;

  const property = await ensureHotelProperty(userId, user.organization);
  const full = await prisma.property.findUnique({
    where: { id: property.id },
    include: {
      rooms: { orderBy: { createdAt: "asc" } },
      bookings: {
        orderBy: { checkIn: "desc" },
        include: { room: { select: { id: true, name: true } } },
      },
      diningOrders: { orderBy: { orderedAt: "desc" } },
      inventoryItems: { orderBy: { name: "asc" } },
      housekeepingTasks: {
        orderBy: { createdAt: "desc" },
        include: { room: { select: { name: true } } },
      },
      staffMembers: {
        orderBy: { name: "asc" },
        include: {
          attendances: {
            where: {
              date: {
                gte: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1
                ),
              },
            },
          },
        },
      },
      invoices: { orderBy: { createdAt: "desc" } },
      notifications: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  if (!full) return null;

  await syncHotelNotifications({
    propertyId: full.id,
    bookings: full.bookings,
    inventory: full.inventoryItems,
    tasks: full.housekeepingTasks,
  });

  const notifications = await prisma.notification.findMany({
    where: { propertyId: full.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const rooms = roomsWithAvailability(full.rooms, full.bookings);
  const stats = propertyStats(rooms, full.bookings);
  const business = computeBusinessStats(
    rooms,
    full.bookings,
    full.diningOrders
  );
  const revenueTrend = computeRevenueTrend(
    rooms,
    full.bookings,
    full.diningOrders
  );

  return {
    user,
    property: full,
    propertyName: full.name,
    rooms,
    bookings: full.bookings as BookingWithRoom[],
    diningOrders: full.diningOrders,
    inventoryItems: full.inventoryItems,
    housekeepingTasks: full.housekeepingTasks,
    staffMembers: full.staffMembers,
    invoices: full.invoices,
    notifications,
    stats,
    business,
    revenueTrend,
  };
});
