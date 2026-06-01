/** MapTiler Cloud — https://cloud.maptiler.com/account/keys/ */

const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY ?? "";

export function hasMapTilerKey(): boolean {
  return apiKey.length > 8;
}

/** Vector style tuned for tourism (terrain + streets). */
export function mapTilerStyleUrl(): string {
  return `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${apiKey}`;
}

export const NEPAL_MAP_CENTER = {
  longitude: 84.124,
  latitude: 28.3949,
} as const;

export const NEPAL_DEFAULT_ZOOM = 7;

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
