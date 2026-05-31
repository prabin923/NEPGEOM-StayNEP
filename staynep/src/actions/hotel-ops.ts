"use server";

import type {
  AttendanceStatus,
  InvoiceStatus,
  TaskPriority,
  TaskStatus,
} from "@prisma/client";
import { auth } from "@/lib/auth";
import { ensureHotelProperty } from "@/lib/hotel-property";
import { parseDateInput } from "@/lib/hotel";
import { isWithinNepal } from "@/lib/traveler-locations";
import { revalidateHotelDashboard } from "@/lib/hotel-revalidate";
import { prisma } from "@/lib/prisma";

export type HotelActionState = {
  error?: string;
  success?: boolean;
};

async function requireHotelOwner() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "HOTEL") {
    return { error: "Unauthorized" as const, property: null };
  }
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, organization: true },
  });
  if (!dbUser) return { error: "User not found" as const, property: null };
  const property = await ensureHotelProperty(dbUser.id, dbUser.organization);
  return { error: null, property };
}

// ——— Dining ———

export async function createDiningOrder(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const description = String(formData.get("description") ?? "").trim();
  const guestName = String(formData.get("guestName") ?? "").trim();
  const amount = Number(formData.get("amount"));

  if (!description) return { error: "Description is required." };
  if (!Number.isFinite(amount) || amount < 0) {
    return { error: "Amount must be valid." };
  }

  await prisma.diningOrder.create({
    data: {
      propertyId: ctx.property.id,
      description,
      guestName: guestName || null,
      amount: Math.round(amount),
    },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function deleteDiningOrderForm(formData: FormData) {
  await deleteDiningOrder({}, formData);
}

export async function deleteDiningOrder(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };
  const id = String(formData.get("id") ?? "");
  await prisma.diningOrder.deleteMany({
    where: { id, propertyId: ctx.property.id },
  });
  revalidateHotelDashboard();
  return { success: true };
}

// ——— Inventory ———

export async function createInventoryItem(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const name = String(formData.get("name") ?? "").trim();
  const quantity = Number(formData.get("quantity"));
  const minQuantity = Number(formData.get("minQuantity"));
  const unit = String(formData.get("unit") ?? "pcs").trim() || "pcs";

  if (!name) return { error: "Item name is required." };
  if (!Number.isInteger(quantity) || quantity < 0) {
    return { error: "Quantity must be 0 or more." };
  }
  if (!Number.isInteger(minQuantity) || minQuantity < 0) {
    return { error: "Minimum quantity must be 0 or more." };
  }

  await prisma.inventoryItem.create({
    data: {
      propertyId: ctx.property.id,
      name,
      quantity,
      minQuantity,
      unit,
    },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function updateInventoryQuantityForm(formData: FormData) {
  await updateInventoryQuantity({}, formData);
}

export async function updateInventoryQuantity(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };
  const id = String(formData.get("id") ?? "");
  const delta = Number(formData.get("delta"));
  if (!Number.isInteger(delta)) return { error: "Invalid adjustment." };

  const item = await prisma.inventoryItem.findFirst({
    where: { id, propertyId: ctx.property.id },
  });
  if (!item) return { error: "Item not found." };

  await prisma.inventoryItem.update({
    where: { id },
    data: { quantity: Math.max(0, item.quantity + delta) },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function deleteInventoryItemForm(formData: FormData) {
  await deleteInventoryItem({}, formData);
}

export async function deleteInventoryItem(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };
  const id = String(formData.get("id") ?? "");
  await prisma.inventoryItem.deleteMany({
    where: { id, propertyId: ctx.property.id },
  });
  revalidateHotelDashboard();
  return { success: true };
}

// ——— Housekeeping ———

export async function createHousekeepingTask(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const title = String(formData.get("title") ?? "").trim();
  const roomId = String(formData.get("roomId") ?? "").trim();
  const priority = String(formData.get("priority") ?? "NORMAL") as TaskPriority;
  const notes = String(formData.get("notes") ?? "").trim();
  const dueRaw = String(formData.get("dueDate") ?? "").trim();

  if (!title) return { error: "Task title is required." };

  if (roomId) {
    const room = await prisma.room.findFirst({
      where: { id: roomId, propertyId: ctx.property.id },
    });
    if (!room) return { error: "Invalid room." };
  }

  await prisma.housekeepingTask.create({
    data: {
      propertyId: ctx.property.id,
      title,
      roomId: roomId || null,
      priority,
      notes: notes || null,
      dueDate: dueRaw ? parseDateInput(dueRaw) : null,
    },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function updateTaskStatusForm(formData: FormData) {
  await updateTaskStatus({}, formData);
}

export async function updateTaskStatus(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as TaskStatus;

  const valid: TaskStatus[] = ["PENDING", "IN_PROGRESS", "DONE"];
  if (!valid.includes(status)) return { error: "Invalid status." };

  await prisma.housekeepingTask.updateMany({
    where: { id, propertyId: ctx.property.id },
    data: { status },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function deleteHousekeepingTaskForm(formData: FormData) {
  await deleteHousekeepingTask({}, formData);
}

export async function deleteHousekeepingTask(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };
  const id = String(formData.get("id") ?? "");
  await prisma.housekeepingTask.deleteMany({
    where: { id, propertyId: ctx.property.id },
  });
  revalidateHotelDashboard();
  return { success: true };
}

// ——— Staff ———

export async function createStaffMember(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const monthlySalary = Number(formData.get("monthlySalary"));

  if (!name || !role) return { error: "Name and role are required." };
  if (!Number.isFinite(monthlySalary) || monthlySalary < 0) {
    return { error: "Salary must be valid." };
  }

  await prisma.staffMember.create({
    data: {
      propertyId: ctx.property.id,
      name,
      role,
      email: email || null,
      phone: phone || null,
      monthlySalary: Math.round(monthlySalary),
    },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function deleteStaffMemberForm(formData: FormData) {
  await deleteStaffMember({}, formData);
}

export async function deleteStaffMember(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };
  const id = String(formData.get("id") ?? "");
  await prisma.staffMember.deleteMany({
    where: { id, propertyId: ctx.property.id },
  });
  revalidateHotelDashboard();
  return { success: true };
}

// ——— Attendance ———

function dateOnly(d: Date) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x;
}

export async function recordAttendance(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const staffId = String(formData.get("staffId") ?? "");
  const dateRaw = String(formData.get("date") ?? "");
  const status = String(formData.get("status") ?? "PRESENT") as AttendanceStatus;

  const staff = await prisma.staffMember.findFirst({
    where: { id: staffId, propertyId: ctx.property.id },
  });
  if (!staff) return { error: "Staff member not found." };
  if (!dateRaw) return { error: "Date is required." };

  const valid: AttendanceStatus[] = ["PRESENT", "ABSENT", "LEAVE"];
  if (!valid.includes(status)) return { error: "Invalid status." };

  const date = dateOnly(parseDateInput(dateRaw));

  await prisma.attendanceRecord.upsert({
    where: { staffId_date: { staffId, date } },
    create: { staffId, date, status },
    update: { status },
  });
  revalidateHotelDashboard();
  return { success: true };
}

// ——— Invoices ———

export async function createInvoice(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const guestName = String(formData.get("guestName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const dueRaw = String(formData.get("dueDate") ?? "").trim();
  const status = String(formData.get("status") ?? "DRAFT") as InvoiceStatus;

  if (!guestName || !description) {
    return { error: "Guest name and description are required." };
  }
  if (!Number.isFinite(amount) || amount < 0) {
    return { error: "Amount must be valid." };
  }

  const valid: InvoiceStatus[] = ["DRAFT", "SENT", "PAID"];
  if (!valid.includes(status)) return { error: "Invalid status." };

  await prisma.invoice.create({
    data: {
      propertyId: ctx.property.id,
      guestName,
      description,
      amount: Math.round(amount),
      status,
      dueDate: dueRaw ? parseDateInput(dueRaw) : null,
    },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function updateInvoiceStatusForm(formData: FormData) {
  await updateInvoiceStatus({}, formData);
}

export async function updateInvoiceStatus(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as InvoiceStatus;

  const valid: InvoiceStatus[] = ["DRAFT", "SENT", "PAID"];
  if (!valid.includes(status)) return { error: "Invalid status." };

  await prisma.invoice.updateMany({
    where: { id, propertyId: ctx.property.id },
    data: { status },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function deleteInvoiceForm(formData: FormData) {
  await deleteInvoice({}, formData);
}

export async function deleteInvoice(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };
  const id = String(formData.get("id") ?? "");
  await prisma.invoice.deleteMany({
    where: { id, propertyId: ctx.property.id },
  });
  revalidateHotelDashboard();
  return { success: true };
}

// ——— Property ———

export async function updateProperty(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const name = String(formData.get("name") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const latRaw = String(formData.get("latitude") ?? "").trim();
  const lngRaw = String(formData.get("longitude") ?? "").trim();

  if (!name) return { error: "Property name is required." };
  if (!district) return { error: "District is required." };

  let latitude: number | null = null;
  let longitude: number | null = null;
  if (latRaw || lngRaw) {
    latitude = Number(latRaw);
    longitude = Number(lngRaw);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return { error: "Map coordinates must be valid numbers." };
    }
    if (!isWithinNepal(latitude, longitude)) {
      return { error: "Coordinates must be within Nepal." };
    }
  }

  await prisma.property.update({
    where: { id: ctx.property.id },
    data: {
      name,
      district,
      address: address || null,
      phone: phone || null,
      latitude,
      longitude,
    },
  });
  revalidateHotelDashboard();
  return { success: true };
}

// ——— Notifications ———

export async function createNotification(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };

  const title = String(formData.get("title") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!title || !message) return { error: "Title and message are required." };

  await prisma.notification.create({
    data: { propertyId: ctx.property.id, title, message },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function markNotificationReadForm(formData: FormData) {
  await markNotificationRead({}, formData);
}

export async function markNotificationRead(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };
  const id = String(formData.get("id") ?? "");
  await prisma.notification.updateMany({
    where: { id, propertyId: ctx.property.id },
    data: { read: true },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function deleteNotificationForm(formData: FormData) {
  await deleteNotification({}, formData);
}

export async function deleteNotification(
  _prev: HotelActionState,
  formData: FormData
): Promise<HotelActionState> {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return { error: ctx.error ?? "Unauthorized" };
  const id = String(formData.get("id") ?? "");
  await prisma.notification.deleteMany({
    where: { id, propertyId: ctx.property.id },
  });
  revalidateHotelDashboard();
  return { success: true };
}

export async function markAllNotificationsReadForm() {
  await markAllNotificationsRead();
}

export async function markAllNotificationsRead() {
  const ctx = await requireHotelOwner();
  if (ctx.error || !ctx.property) return;
  await prisma.notification.updateMany({
    where: { propertyId: ctx.property.id, read: false },
    data: { read: true },
  });
  revalidateHotelDashboard();
}
