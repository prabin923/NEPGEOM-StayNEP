import type {
  Booking,
  InventoryItem,
  HousekeepingTask,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface SyncContext {
  propertyId: string;
  bookings: Booking[];
  inventory: InventoryItem[];
  tasks: HousekeepingTask[];
}

async function upsertAlert(
  propertyId: string,
  sourceKey: string,
  title: string,
  message: string
) {
  await prisma.notification.upsert({
    where: { sourceKey },
    create: { propertyId, sourceKey, title, message },
    update: { title, message, read: false },
  });
}

export async function syncHotelNotifications(ctx: SyncContext) {
  const pending = ctx.bookings.filter((b) => b.status === "PENDING").length;
  if (pending > 0) {
    await upsertAlert(
      ctx.propertyId,
      `pending-bookings:${ctx.propertyId}`,
      "Pending payments",
      `${pending} booking(s) awaiting confirmation or payment.`
    );
  } else {
    await prisma.notification.deleteMany({
      where: { sourceKey: `pending-bookings:${ctx.propertyId}` },
    });
  }

  for (const item of ctx.inventory) {
    if (item.quantity <= item.minQuantity) {
      await upsertAlert(
        ctx.propertyId,
        `low-inventory:${item.id}`,
        "Low stock",
        `${item.name} is at ${item.quantity} ${item.unit} (min ${item.minQuantity}).`
      );
    } else {
      await prisma.notification.deleteMany({
        where: { sourceKey: `low-inventory:${item.id}` },
      });
    }
  }

  const openTasks = ctx.tasks.filter((t) => t.status !== "DONE").length;
  if (openTasks > 0) {
    await upsertAlert(
      ctx.propertyId,
      `housekeeping-open:${ctx.propertyId}`,
      "Housekeeping tasks",
      `${openTasks} task(s) still open.`
    );
  } else {
    await prisma.notification.deleteMany({
      where: { sourceKey: `housekeeping-open:${ctx.propertyId}` },
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const arrivals = ctx.bookings.filter(
    (b) =>
      b.status !== "CANCELLED" &&
      b.checkIn >= today &&
      b.checkIn < tomorrow
  ).length;

  if (arrivals > 0) {
    await upsertAlert(
      ctx.propertyId,
      `arrivals-today:${today.toISOString().slice(0, 10)}`,
      "Today's arrivals",
      `${arrivals} guest(s) checking in today.`
    );
  }
}
