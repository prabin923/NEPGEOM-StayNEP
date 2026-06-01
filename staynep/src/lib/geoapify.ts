import type { ReportMapMarker } from "@/lib/report-map-markers";
import {
  computeTrafficCorridors,
  type TrafficCorridor,
  type TrafficStatus,
} from "@/lib/map-traffic";
import type { CatalogMapHotel } from "@/lib/map-hotels";

const publicApiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY ?? "";
const serverApiKey =
  process.env.GEOAPIFY_API_KEY ?? process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY ?? "";

const NEPAL_BOUNDS = {
  west: 80.0,
  south: 26.0,
  east: 89.0,
  north: 31.0,
} as const;

const HOTEL_CATEGORIES = [
  "accommodation.hotel",
  "accommodation.hostel",
  "accommodation.motel",
  "accommodation.guest_house",
  "accommodation.apartment",
  "accommodation.chalet",
];

type GeoapifyFeature = {
  properties?: {
    place_id?: string;
    name?: string;
    lat?: number;
    lon?: number;
    city?: string;
    district?: string;
    county?: string;
    state?: string;
    formatted?: string;
    categories?: string[];
    distance?: number;
    time?: number;
  };
  geometry?: {
    coordinates?: unknown;
  };
};

type GeoapifyFeatureCollection = {
  features?: GeoapifyFeature[];
};

let hotelCache:
  | {
      expiresAt: number;
      hotels: CatalogMapHotel[];
    }
  | undefined;

export const NEPAL_MAP_CENTER = {
  longitude: 84.124,
  latitude: 28.3949,
} as const;

export const NEPAL_DEFAULT_ZOOM = 7;

export function hasGeoapifyKey(): boolean {
  return publicApiKey.length > 8;
}

export function hasGeoapifyServerKey(): boolean {
  return serverApiKey.length > 8;
}

export function geoapifyStyleUrl(): string {
  return `https://maps.geoapify.com/v1/styles/osm-bright-smooth/style.json?apiKey=${publicApiKey}`;
}

/** Approximate circle polygon for fill layers (lng, lat order). */
export function circlePolygonGeoJson(
  lat: number,
  lng: number,
  radiusKm: number,
  points = 64
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coords: [number, number][] = [];
  const distanceX = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const distanceY = radiusKm / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * 2 * Math.PI;
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([lng + x, lat + y]);
  }
  coords.push(coords[0]);

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [coords],
    },
  };
}

function geoapifyUrl(path: string, params: Record<string, string | number>) {
  const url = new URL(path, "https://api.geoapify.com");
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  url.searchParams.set("apiKey", serverApiKey);
  return url;
}

async function fetchGeoapify<T>(
  path: string,
  params: Record<string, string | number>
): Promise<T | null> {
  if (!hasGeoapifyServerKey()) return null;

  const res = await fetch(geoapifyUrl(path, params), {
    next: { revalidate: 600 },
  });
  if (!res.ok) {
    console.warn("[geoapify]", path, res.status, await res.text());
    return null;
  }
  return (await res.json()) as T;
}

function numberFromCoordinate(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function coordinatesFromFeature(feature: GeoapifyFeature) {
  const props = feature.properties;
  const propLat = numberFromCoordinate(props?.lat);
  const propLng = numberFromCoordinate(props?.lon);
  if (propLat !== null && propLng !== null) {
    return { lat: propLat, lng: propLng };
  }

  const coordinates = feature.geometry?.coordinates;
  if (
    Array.isArray(coordinates) &&
    typeof coordinates[0] === "number" &&
    typeof coordinates[1] === "number"
  ) {
    return { lat: coordinates[1], lng: coordinates[0] };
  }

  return null;
}

function hotelType(categories?: string[]) {
  if (!categories?.length) return "Accommodation";
  if (categories.includes("accommodation.hostel")) return "Hostel";
  if (categories.includes("accommodation.guest_house")) return "Guest house";
  if (categories.includes("accommodation.apartment")) return "Apartment";
  if (categories.includes("accommodation.motel")) return "Motel";
  return "Hotel";
}

export async function fetchGeoapifyHotelsForNepal(): Promise<CatalogMapHotel[]> {
  if (!hasGeoapifyServerKey()) return [];
  if (hotelCache && hotelCache.expiresAt > Date.now()) return hotelCache.hotels;

  const data = await fetchGeoapify<GeoapifyFeatureCollection>("/v2/places", {
    categories: HOTEL_CATEGORIES.join(","),
    filter: `rect:${NEPAL_BOUNDS.west},${NEPAL_BOUNDS.north},${NEPAL_BOUNDS.east},${NEPAL_BOUNDS.south}`,
    bias: `proximity:${NEPAL_MAP_CENTER.longitude},${NEPAL_MAP_CENTER.latitude}`,
    limit: 80,
  });

  const hotels =
    data?.features
      ?.map((feature, index): CatalogMapHotel | null => {
        const props = feature.properties;
        const coords = coordinatesFromFeature(feature);
        const name = props?.name?.trim();
        if (!name || !coords) return null;

        const district =
          props?.city ??
          props?.district ??
          props?.county ??
          props?.state ??
          "Nepal";

        return {
          id: -10_000 - index,
          name,
          lat: coords.lat,
          lng: coords.lng,
          availableRooms: 0,
          totalRooms: 0,
          rating: 0,
          priceRange: "Geoapify",
          district,
          type: hotelType(props?.categories),
          source: "geoapify",
          reviewCount: 0,
          reviewLabel: "Geoapify place",
        };
      })
      .filter((hotel): hotel is CatalogMapHotel => hotel !== null) ?? [];

  hotelCache = {
    expiresAt: Date.now() + 10 * 60_000,
    hotels,
  };
  return hotels;
}

export async function reverseGeoapifyLocation(
  lat: number,
  lng: number
): Promise<string | null> {
  const data = await fetchGeoapify<GeoapifyFeatureCollection>(
    "/v1/geocode/reverse",
    {
      lat,
      lon: lng,
      lang: "en",
      format: "geojson",
    }
  );
  const props = data?.features?.[0]?.properties;
  return (
    props?.formatted ??
    props?.city ??
    props?.district ??
    props?.county ??
    props?.state ??
    null
  );
}

function trafficStatusFromAvgSpeed(speedKmh: number): TrafficStatus {
  if (speedKmh < 18) return "congested";
  if (speedKmh < 30) return "slow";
  if (speedKmh < 42) return "moderate";
  return "clear";
}

function maxStatus(a: TrafficStatus, b: TrafficStatus): TrafficStatus {
  const rank = { clear: 0, moderate: 1, slow: 2, congested: 3 };
  return rank[a] >= rank[b] ? a : b;
}

export async function fetchGeoapifyTrafficCorridors(
  reports: ReportMapMarker[] = []
): Promise<TrafficCorridor[]> {
  const base = computeTrafficCorridors(reports);
  if (!hasGeoapifyServerKey()) return base;

  const enriched = await Promise.all(
    base.map(async (corridor) => {
      const first = corridor.path[0];
      const last = corridor.path[corridor.path.length - 1];
      if (!first || !last) return corridor;

      const data = await fetchGeoapify<GeoapifyFeatureCollection>(
        "/v1/routing",
        {
          waypoints: `${first[0]},${first[1]}|${last[0]},${last[1]}`,
          mode: "drive",
          traffic: "approximated",
          type: "short",
          format: "geojson",
        }
      );

      const props = data?.features?.[0]?.properties;
      const distanceMeters = props?.distance;
      const timeSeconds = props?.time;
      if (!distanceMeters || !timeSeconds) return corridor;

      const distanceKm = Math.round(distanceMeters / 1000);
      const hours = timeSeconds / 3600;
      const avgSpeedKmh = Math.round(distanceKm / Math.max(hours, 0.1));
      const status = maxStatus(
        corridor.status,
        trafficStatusFromAvgSpeed(avgSpeedKmh)
      );
      const expectedMinutes = (distanceKm / 45) * 60;
      const actualMinutes = timeSeconds / 60;
      const delayMin = Math.max(
        corridor.delayMin,
        Math.round(actualMinutes - expectedMinutes)
      );

      return {
        ...corridor,
        distanceKm,
        avgSpeedKmh,
        delayMin,
        status,
        updatedAt: new Date().toISOString(),
        note:
          corridor.note ??
          "Geoapify routing with approximated traffic model",
      };
    })
  );

  return enriched;
}
