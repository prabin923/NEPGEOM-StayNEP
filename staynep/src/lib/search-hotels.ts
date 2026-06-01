import { prisma } from "@/lib/prisma";
import { hotels as staticHotels } from "@/data/hotels";

export interface SearchableHotel {
  id: string;
  name: string;
  district: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  minPrice: number;
  maxPrice: number;
  totalRooms: number;
  avgRating: number;
  reviewCount: number;
  isPartner: boolean;
  roomTypes: string[];
}

const STATIC_PRICE_MAP: Record<string, { min: number; max: number }> = {
  "$": { min: 1200, max: 2200 },
  "$$": { min: 2500, max: 4500 },
  "$$$": { min: 6000, max: 9500 },
  "$$$$": { min: 14000, max: 28000 },
};

const STATIC_AMENITIES = ["WiFi", "AC", "Hot Water", "Room Service"];

function staticCatalogHotels(): SearchableHotel[] {
  return staticHotels.map((sh) => {
    const priceRange = STATIC_PRICE_MAP[sh.priceRange] ?? { min: 1500, max: 3000 };
    return {
      id: `static-${sh.id}`,
      name: sh.name,
      district: sh.district,
      latitude: sh.lat,
      longitude: sh.lng,
      amenities: STATIC_AMENITIES,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      totalRooms: sh.totalRooms,
      avgRating: sh.rating,
      reviewCount: Math.floor(sh.rating * 5) + 3,
      isPartner: false,
      roomTypes: [sh.type],
    };
  });
}

export async function fetchSearchableHotels(): Promise<SearchableHotel[]> {
  if (!process.env.DATABASE_URL) {
    return staticCatalogHotels();
  }

  try {
    return await loadSearchableHotels();
  } catch (e) {
    console.error("[fetchSearchableHotels]", e);
    return staticCatalogHotels();
  }
}

async function loadSearchableHotels(): Promise<SearchableHotel[]> {
  const dbProperties = await prisma.property.findMany({
    include: {
      rooms: true,
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  const dbHotels: SearchableHotel[] = dbProperties.map((p) => {
    const totalRooms = p.rooms.reduce((sum, r) => sum + r.totalUnits, 0);
    
    // Find min and max room price
    let minPrice = 0;
    let maxPrice = 0;
    if (p.rooms.length > 0) {
      const prices = p.rooms.map((r) => r.ratePerNight);
      minPrice = Math.min(...prices);
      maxPrice = Math.max(...prices);
    }

    // Calculate average rating
    const reviewCount = p.reviews.length;
    const avgRating =
      reviewCount > 0
        ? Math.round((p.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10
        : 0;

    return {
      id: p.id,
      name: p.name,
      district: p.district,
      address: p.address ?? undefined,
      latitude: p.latitude ?? undefined,
      longitude: p.longitude ?? undefined,
      amenities: p.amenities,
      minPrice,
      maxPrice,
      totalRooms,
      avgRating,
      reviewCount,
      isPartner: true,
      roomTypes: p.rooms.map((r) => r.name),
    };
  });

  // 2. Filter static catalog hotels that are not already present in the DB by name match
  const dbNames = new Set(dbHotels.map((h) => h.name.toLowerCase()));
  
  const mergedStaticHotels = staticCatalogHotels().filter(
    (sh) => !dbNames.has(sh.name.toLowerCase())
  );

  return [...dbHotels, ...mergedStaticHotels];
}
