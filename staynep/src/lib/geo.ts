/** Haversine distance between two coordinates in kilometres. */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export type WithDistance<T> = T & { distanceKm: number };

export function getWithinRadiusKm<T extends { lat: number; lng: number }>(
  origin: { lat: number; lng: number },
  items: T[],
  radiusKm: number
): WithDistance<T>[] {
  return items
    .map((item) => ({
      ...item,
      distanceKm: distanceKm(origin.lat, origin.lng, item.lat, item.lng),
    }))
    .filter((item) => item.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export const TRAVELER_NEARBY_RADIUS_KM = 20;
