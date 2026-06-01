import { hotels, type Hotel } from "@/data/hotels";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";

/** Catalog hotel prepared for map markers & API. */
export type CatalogMapHotel = Hotel & {
  source: "catalog";
  reviewCount: number;
  reviewLabel: string;
};

export type MapHotelReview = {
  id: string;
  propertyId: string;
  propertyName: string;
  district: string;
  rating: number;
  comment: string | null;
  authorName: string;
  createdAt: string;
};

export function catalogHotelsForMap(): CatalogMapHotel[] {
  return hotels.map((h) => ({
    ...h,
    source: "catalog" as const,
    reviewCount: Math.round(h.rating * 120 + h.id * 17),
    reviewLabel: "Reference rating",
  }));
}

export function reviewsByPropertyId(
  reviews: MapHotelReview[]
): Map<string, MapHotelReview[]> {
  const map = new Map<string, MapHotelReview[]>();
  for (const r of reviews) {
    const list = map.get(r.propertyId) ?? [];
    list.push(r);
    map.set(r.propertyId, list);
  }
  return map;
}

export function mergeHotelLayers(
  registered: RegisteredHotelMarker[]
): {
  catalog: CatalogMapHotel[];
  registered: RegisteredHotelMarker[];
  totalHotels: number;
  withStayNepReviews: number;
} {
  const catalog = catalogHotelsForMap();
  const regNames = new Set(registered.map((r) => r.name.toLowerCase().trim()));
  const uniqueCatalog = catalog.filter(
    (c) => !regNames.has(c.name.toLowerCase().trim())
  );
  const withReviews = registered.filter(
    (r) => r.reviewCount !== undefined && r.reviewCount > 0
  ).length;

  return {
    catalog: uniqueCatalog,
    registered,
    totalHotels: uniqueCatalog.length + registered.length,
    withStayNepReviews: withReviews,
  };
}
