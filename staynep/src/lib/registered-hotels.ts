import { prisma } from "@/lib/prisma";
import { coordsForDistrict } from "@/lib/nepal-districts";
import { roomsWithAvailability } from "@/lib/hotel";

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

export async function fetchRegisteredHotelMarkers(): Promise<
  RegisteredHotelMarker[]
> {
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

  return properties.map((property) => {
    const rooms = roomsWithAvailability(property.rooms, property.bookings);
    const totalUnits = rooms.reduce((s, r) => s + r.totalUnits, 0);
    const availableUnits = rooms.reduce((s, r) => s + r.availableUnits, 0);
    const { lat, lng } = resolvePropertyCoords(property);

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
    };
  });
}
