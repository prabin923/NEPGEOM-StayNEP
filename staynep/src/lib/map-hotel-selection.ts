import type { Hotel } from "@/data/hotels";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import { prisma } from "@/lib/prisma";
import { distanceKm } from "@/lib/geo";

/** Any hotel on the traveler map — partner (DB) or catalog (static). */
export type MapHotelSelection = {
  key: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  propertyId: string | null;
  /** Set when a catalog hotel is matched to a different partner */
  partnerName?: string | null;
  isStayNepPartner: boolean;
  rating?: number;
  priceRange?: string;
  type?: string;
  availableUnits?: number;
  totalUnits?: number;
  roomTypes?: number;
  address?: string | null;
  phone?: string | null;
};

export function fromRegisteredHotel(h: RegisteredHotelMarker): MapHotelSelection {
  return {
    key: h.id,
    name: h.name,
    district: h.district,
    lat: h.lat,
    lng: h.lng,
    propertyId: h.id,
    isStayNepPartner: true,
    availableUnits: h.availableUnits,
    totalUnits: h.totalUnits,
    roomTypes: h.roomTypes,
    address: h.address,
    phone: h.phone,
  };
}

export function fromCatalogHotel(
  h: Hotel,
  propertyId: string | null
): MapHotelSelection {
  return {
    key: propertyId ?? `static-${h.id}`,
    name: h.name,
    district: h.district,
    lat: h.lat,
    lng: h.lng,
    propertyId,
    isStayNepPartner: !!propertyId,
    rating: h.rating,
    priceRange: h.priceRange,
    type: h.type,
    availableUnits: h.availableRooms,
    totalUnits: h.totalRooms,
  };
}

export async function resolvePropertyIdForCatalogHotel(
  hotel: Pick<Hotel, "name" | "district" | "lat" | "lng">
): Promise<{ propertyId: string | null; partnerName: string | null }> {
  const properties = await prisma.property.findMany({
    select: { id: true, name: true, district: true, latitude: true, longitude: true },
  });

  if (properties.length === 0) {
    return { propertyId: null, partnerName: null };
  }

  const nameLower = hotel.name.toLowerCase();

  const byName = properties.find((p) => {
    const pn = p.name.toLowerCase();
    return pn === nameLower || pn.includes(nameLower) || nameLower.includes(pn);
  });
  if (byName) {
    return { propertyId: byName.id, partnerName: byName.name };
  }

  const sameDistrict = properties.filter(
    (p) => p.district.toLowerCase() === hotel.district.toLowerCase()
  );
  if (sameDistrict.length === 1) {
    return { propertyId: sameDistrict[0].id, partnerName: sameDistrict[0].name };
  }
  if (sameDistrict.length > 1) {
    let best = sameDistrict[0];
    let bestD = Infinity;
    for (const p of sameDistrict) {
      const lat = p.latitude ?? hotel.lat;
      const lng = p.longitude ?? hotel.lng;
      const d = distanceKm(hotel.lat, hotel.lng, lat, lng);
      if (d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return { propertyId: best.id, partnerName: best.name };
  }

  let nearest = properties[0];
  let nearestD = Infinity;
  for (const p of properties) {
    const lat = p.latitude ?? hotel.lat;
    const lng = p.longitude ?? hotel.lng;
    const d = distanceKm(hotel.lat, hotel.lng, lat, lng);
    if (d < nearestD) {
      nearestD = d;
      nearest = p;
    }
  }
  return { propertyId: nearest.id, partnerName: nearest.name };
}

export async function fetchAllPartnerNames(): Promise<
  { id: string; name: string; district: string }[]
> {
  return prisma.property.findMany({
    select: { id: true, name: true, district: true },
    orderBy: { name: "asc" },
  });
}
