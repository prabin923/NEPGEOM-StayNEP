import { prisma } from "@/lib/prisma";

export async function ensureHotelProperty(
  ownerId: string,
  organization: string | null
) {
  const existing = await prisma.property.findUnique({
    where: { ownerId },
  });

  if (existing) return existing;

  return prisma.property.create({
    data: {
      ownerId,
      name: organization?.trim() || "My Hotel",
      district: "Nepal",
    },
  });
}

export async function getHotelPropertyForOwner(ownerId: string) {
  return prisma.property.findUnique({
    where: { ownerId },
    include: {
      rooms: { orderBy: { createdAt: "asc" } },
      bookings: {
        orderBy: { checkIn: "desc" },
        include: { room: { select: { id: true, name: true } } },
      },
    },
  });
}
