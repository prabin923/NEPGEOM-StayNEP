import { hotels, type Hotel } from "@/data/hotels";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";

export type ReviewSource = "Google" | "StayNEP" | "Combined";

export type SearchableHotel = {
  key: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  type: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  reviewSource: ReviewSource;
  isStayNepPartner: boolean;
  propertyId: string | null;
  availableUnits?: number;
  totalUnits?: number;
  rankScore: number;
};

function catalogReviewCount(hotel: Hotel): number {
  return Math.round(120 + hotel.rating * 180 + hotel.id * 12);
}

function catalogToSearchable(h: Hotel): SearchableHotel {
  const reviewCount = catalogReviewCount(h);
  const rating = h.rating;
  return {
    key: `static-${h.id}`,
    name: h.name,
    district: h.district,
    lat: h.lat,
    lng: h.lng,
    type: h.type,
    priceRange: h.priceRange,
    rating,
    reviewCount,
    reviewSource: "Google",
    isStayNepPartner: false,
    propertyId: null,
    availableUnits: h.availableRooms,
    totalUnits: h.totalRooms,
    rankScore: rating * Math.log10(reviewCount + 10),
  };
}

function distanceApprox(lat1: number, lng1: number, lat2: number, lng2: number) {
  return Math.hypot(lat1 - lat2, lng1 - lng2) * 111;
}

function registeredToSearchable(h: RegisteredHotelMarker): SearchableHotel {
  const reviewCount = h.reviewCount ?? 0;
  const stayRating = h.avgRating ?? 0;
  const catalogMatch = hotels.find(
    (c) =>
      c.name.toLowerCase() === h.name.toLowerCase() ||
      (c.district.toLowerCase() === h.district.toLowerCase() &&
        distanceApprox(c.lat, c.lng, h.lat, h.lng) < 3)
  );
  const googleRating = catalogMatch?.rating ?? 4.2;
  const googleCount = catalogMatch ? catalogReviewCount(catalogMatch) : 80;

  let rating: number;
  let reviewSource: ReviewSource;
  let totalReviews: number;

  if (reviewCount > 0 && catalogMatch) {
    rating =
      Math.round(
        ((googleRating * googleCount + stayRating * reviewCount) /
          (googleCount + reviewCount)) *
          10
      ) / 10;
    totalReviews = googleCount + reviewCount;
    reviewSource = "Combined";
  } else if (reviewCount > 0) {
    rating = stayRating;
    totalReviews = reviewCount;
    reviewSource = "StayNEP";
  } else if (catalogMatch) {
    rating = googleRating;
    totalReviews = googleCount;
    reviewSource = "Google";
  } else {
    rating = stayRating || 4.3;
    totalReviews = reviewCount || 24;
    reviewSource = reviewCount > 0 ? "StayNEP" : "Google";
  }

  return {
    key: h.id,
    name: h.name,
    district: h.district,
    lat: h.lat,
    lng: h.lng,
    type: "StayNEP Partner",
    priceRange: "Book direct",
    rating,
    reviewCount: totalReviews,
    reviewSource,
    isStayNepPartner: true,
    propertyId: h.id,
    availableUnits: h.availableUnits,
    totalUnits: h.totalUnits,
    rankScore: rating * Math.log10(totalReviews + 10) + 0.15,
  };
}

export function buildSearchableHotels(
  registered: RegisteredHotelMarker[]
): SearchableHotel[] {
  const registeredNames = new Set(registered.map((r) => r.name.toLowerCase()));
  const fromCatalog = hotels
    .filter((h) => !registeredNames.has(h.name.toLowerCase()))
    .map(catalogToSearchable);
  const fromRegistered = registered.map(registeredToSearchable);
  return [...fromRegistered, ...fromCatalog];
}

export type TravelerHotelSearchParams = {
  query?: string;
  district?: string;
  minRating?: number;
  sort?: "rating" | "reviews" | "name";
};

export function searchHotels(
  all: SearchableHotel[],
  params: TravelerHotelSearchParams
): SearchableHotel[] {
  const q = params.query?.trim().toLowerCase() ?? "";
  const district = params.district?.trim().toLowerCase() ?? "";
  const minRating = params.minRating ?? 0;

  let results = all.filter((h) => {
    if (h.rating < minRating) return false;
    if (district && !h.district.toLowerCase().includes(district)) return false;
    if (!q) return true;
    return (
      h.name.toLowerCase().includes(q) ||
      h.district.toLowerCase().includes(q) ||
      h.type.toLowerCase().includes(q)
    );
  });

  switch (params.sort) {
    case "reviews":
      results = [...results].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "name":
      results = [...results].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "rating":
    default:
      results = [...results].sort((a, b) => b.rankScore - a.rankScore);
  }

  return results;
}

export const NEPAL_HOTEL_DISTRICTS = [
  "All districts",
  ...Array.from(new Set(hotels.map((h) => h.district))).sort(),
];
