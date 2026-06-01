import { prisma } from "@/lib/prisma";
import { coordsForDistrict } from "@/lib/nepal-districts";
import { isBookingOccupying, roomsWithAvailability } from "@/lib/hotel";

export interface RegisteredHotelMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  district: string;
  address: string | null;
  phone: string | null;
  roomTypes: number;
  totalUnits: number;
  availableUnits: number;
  registered: true;
  avgRating?: number;
  reviewCount?: number;
}

export function resolvePropertyCoords(property: {
  latitude: number | null;
  longitude: number | null;
  district: string;
}): { lat: number; lng: number } {
  if (
    property.latitude != null &&
    property.longitude != null &&
    Number.isFinite(property.latitude) &&
    Number.isFinite(property.longitude)
  ) {
    return { lat: property.latitude, lng: property.longitude };
  }
  return coordsForDistrict(property.district);
}

async function fetchReviewStatsByProperty(): Promise<
  Map<string, { avgRating: number; reviewCount: number }>
> {
  const stats = new Map<string, { avgRating: number; reviewCount: number }>();

  if (typeof prisma.review?.groupBy !== "function") {
    return stats;
  }

  try {
    const rows = await prisma.review.groupBy({
      by: ["propertyId"],
      _avg: { rating: true },
      _count: { rating: true },
    });

    for (const row of rows) {
      const count = row._count.rating;
      if (count === 0) continue;
      stats.set(row.propertyId, {
        reviewCount: count,
        avgRating:
          Math.round((row._avg.rating ?? 0) * 10) / 10,
      });
    }
  } catch (e) {
    console.warn("[fetchRegisteredHotelMarkers] review stats skipped:", e);
  }

  return stats;
}

export async function fetchRegisteredHotelMarkers(): Promise<
  RegisteredHotelMarker[]
> {
  try {
    const [properties, reviewStats] = await Promise.all([
      prisma.property.findMany({
        include: {
          rooms: true,
          bookings: true,
        },
        orderBy: { name: "asc" },
      }),
      fetchReviewStatsByProperty(),
    ]);

    return properties.map((property) => {
      const activeBookings = property.bookings.filter((b) =>
        isBookingOccupying(b.status)
      );
      const rooms = roomsWithAvailability(property.rooms, activeBookings);
      const totalUnits = rooms.reduce((s, r) => s + r.totalUnits, 0);
      const availableUnits = rooms.reduce((s, r) => s + r.availableUnits, 0);
      const { lat, lng } = resolvePropertyCoords(property);
      const reviews = reviewStats.get(property.id);

      return {
        id: property.id,
        name: property.name,
        lat,
        lng,
        district: property.district,
        address: property.address,
        phone: property.phone,
        roomTypes: rooms.length,
        totalUnits,
        availableUnits,
        registered: true as const,
        avgRating: reviews?.avgRating,
        reviewCount: reviews?.reviewCount,
      };
    });
  } catch (e) {
    console.error("[fetchRegisteredHotelMarkers]", e);
    return [];
  }
}
