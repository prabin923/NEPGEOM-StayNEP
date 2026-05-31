import { prisma } from "@/lib/prisma";

/** Rough bounds for Nepal (same as weather API). */
export function isWithinNepal(lat: number, lng: number) {
  return lat >= 26 && lat <= 31 && lng >= 80 && lng <= 89;
}

export interface TouristMapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  label: string | null;
  updatedAt: string;
}

export async function fetchTouristMapMarkers(): Promise<TouristMapMarker[]> {
  const rows = await prisma.travelerLocation.findMany({
    where: {
      user: { role: "TRAVELER" },
    },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.userId,
    name: row.user.name,
    lat: row.latitude,
    lng: row.longitude,
    label: row.label,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function upsertTravelerLocation(
  userId: string,
  latitude: number,
  longitude: number,
  label?: string | null
) {
  if (!isWithinNepal(latitude, longitude)) {
    throw new Error("Location must be within Nepal.");
  }

  return prisma.travelerLocation.upsert({
    where: { userId },
    create: {
      userId,
      latitude,
      longitude,
      label: label ?? null,
    },
    update: {
      latitude,
      longitude,
      label: label ?? null,
    },
  });
}
