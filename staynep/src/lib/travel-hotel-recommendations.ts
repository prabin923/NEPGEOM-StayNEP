import { hotels } from "@/data/hotels";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import { detectTravelStyle, type TravelStyle } from "@/lib/travel-budget";

export type HotelRecommendation = {
  name: string;
  district: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount?: number;
  availableUnits?: number;
  totalUnits?: number;
  source: "catalog" | "partner";
  propertyId?: string;
  priceRange?: string;
  roomTypes?: number;
  phone?: string | null;
  reason: string;
};

function normalizeDistrict(d: string): string {
  return d.toLowerCase().trim();
}

function districtMatch(a: string, b: string): boolean {
  const x = normalizeDistrict(a);
  const y = normalizeDistrict(b);
  return x.includes(y) || y.includes(x);
}

function priceScore(priceRange: string | undefined, style: TravelStyle): number {
  if (!priceRange) return 1;
  const symbols = (priceRange.match(/\$/g) ?? []).length;
  if (style === "budget") return symbols <= 2 ? 3 : symbols === 3 ? 1 : 0;
  if (style === "comfort") return symbols >= 4 ? 3 : symbols === 3 ? 2 : 1;
  return symbols === 3 ? 3 : symbols === 2 || symbols === 4 ? 2 : 1;
}

function scoreCatalogHotel(
  h: (typeof hotels)[0],
  style: TravelStyle
): number {
  return h.rating * 2 + priceScore(h.priceRange, style) + (h.availableRooms > 0 ? 1 : 0);
}

function scorePartnerHotel(
  h: RegisteredHotelMarker,
  style: TravelStyle
): number {
  const rating = h.avgRating ?? 3.5;
  const avail =
    h.totalUnits > 0 ? h.availableUnits / h.totalUnits : 0;
  const partnerBoost = 2;
  return rating * 2 + avail * 2 + partnerBoost;
}

export function recommendHotelsForDistrict(
  district: string,
  registered: RegisteredHotelMarker[],
  style: TravelStyle = "mid",
  limit = 3
): HotelRecommendation[] {
  const catalog = hotels
    .filter((h) => districtMatch(h.district, district))
    .map((h) => ({
      name: h.name,
      district: h.district,
      lat: h.lat,
      lng: h.lng,
      rating: h.rating,
      availableUnits: h.availableRooms,
      totalUnits: h.totalRooms,
      source: "catalog" as const,
      priceRange: h.priceRange,
      reason: `Highly rated ${h.type.toLowerCase()} · ${h.priceRange}`,
      score: scoreCatalogHotel(h, style),
    }));

  const partners = registered
    .filter((h) => districtMatch(h.district, district))
    .map((h) => ({
      name: h.name,
      district: h.district,
      lat: h.lat,
      lng: h.lng,
      rating: h.avgRating ?? 4,
      reviewCount: h.reviewCount,
      availableUnits: h.availableUnits,
      totalUnits: h.totalUnits,
      source: "partner" as const,
      propertyId: h.id,
      roomTypes: h.roomTypes,
      phone: h.phone,
      reason:
        h.reviewCount && h.reviewCount > 0
          ? `StayNEP partner · ${h.reviewCount} verified review${h.reviewCount === 1 ? "" : "s"} · book on portal`
          : "StayNEP partner · live availability on portal",
      score: scorePartnerHotel(h, style),
    }));

  return [...catalog, ...partners]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score: _s, ...rest }) => rest);
}

export function recommendHotelsForTrip(
  districts: string[],
  registered: RegisteredHotelMarker[],
  userMessage = ""
): HotelRecommendation[] {
  const style = detectTravelStyle(userMessage);
  const seen = new Set<string>();
  const out: HotelRecommendation[] = [];

  for (const d of districts) {
    for (const rec of recommendHotelsForDistrict(d, registered, style, 2)) {
      const key = rec.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(rec);
    }
  }

  return out;
}

export function formatHotelRecommendationsMarkdown(
  recs: HotelRecommendation[],
  title = "### Recommended hotels"
): string {
  if (recs.length === 0) {
    return `${title}\n\n_No matches in our database for that area — try **Search hotels** on the traveler portal._`;
  }

  const lines = [
    title,
    "_Picked from StayNEP catalog + registered partners (book partners in the portal)._",
    "",
  ];

  for (const r of recs) {
    const stars = `★${r.rating.toFixed(1)}`;
    const avail =
      r.availableUnits !== undefined && r.totalUnits !== undefined
        ? ` · ${r.availableUnits}/${r.totalUnits} units free`
        : "";
    const badge = r.source === "partner" ? " **StayNEP**" : "";
    lines.push(
      `- **${r.name}**${badge} (${r.district}) — ${stars}${avail}${r.priceRange ? ` · ${r.priceRange}` : ""}`
    );
    lines.push(`  ${r.reason}`);
  }

  lines.push("");
  lines.push(
    "_Say “book [hotel name]” or use **Search hotels** / the map to reserve a StayNEP partner._"
  );

  return lines.join("\n");
}

export function isHotelRecommendIntent(text: string): boolean {
  return /\b(hotel|hotels|stay|stays|lodg|accommodation|where to stay|recommend.*hotel|best hotel|place to sleep|book a room)\b/i.test(
    text
  );
}

export function hotelsContextForAi(
  registered: RegisteredHotelMarker[]
): string {
  const styleNote =
    "Rank partners first when traveler wants to book; include rating, district, availability.";

  const catalog = [...hotels]
    .sort((a, b) => b.rating - a.rating)
    .map(
      (h) =>
        `CATALOG|${h.name}|${h.district}|${h.lat},${h.lng}|★${h.rating}|${h.priceRange}|${h.type}|rooms ${h.availableRooms}/${h.totalRooms}`
    );

  const partners = registered
    .sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0))
    .map(
      (r) =>
        `PARTNER|${r.name}|${r.district}|${r.lat},${r.lng}|${r.avgRating ? `★${r.avgRating}` : "new"}|${r.reviewCount ?? 0} reviews|units ${r.availableUnits}/${r.totalUnits}|id ${r.id}`
    );

  return `${styleNote}\n${[...partners, ...catalog].join("\n")}`;
}
