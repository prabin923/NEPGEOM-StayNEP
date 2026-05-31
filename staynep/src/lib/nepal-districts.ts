/** Approximate centroids for common Nepal tourism districts. */
const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  kaski: { lat: 28.2096, lng: 83.9856 },
  pokhara: { lat: 28.2096, lng: 83.9856 },
  kathmandu: { lat: 27.7172, lng: 85.324 },
  lalitpur: { lat: 27.6667, lng: 85.3167 },
  bhaktapur: { lat: 27.671, lng: 85.4298 },
  chitwan: { lat: 27.5291, lng: 84.3542 },
  solukhumbu: { lat: 27.8056, lng: 86.7103 },
  mustang: { lat: 28.8333, lng: 83.875 },
  lumbini: { lat: 27.4833, lng: 83.2833 },
  rupandehi: { lat: 27.4833, lng: 83.2833 },
  parsa: { lat: 27.103, lng: 84.864 },
  morang: { lat: 26.661, lng: 87.274 },
  sunsari: { lat: 26.66, lng: 87.2 },
  dolpa: { lat: 28.9, lng: 82.9 },
  nepal: { lat: 28.3949, lng: 84.124 },
};

export function coordsForDistrict(district: string): { lat: number; lng: number } {
  const normalized = district.toLowerCase().trim();
  if (DISTRICT_COORDS[normalized]) {
    return DISTRICT_COORDS[normalized];
  }
  for (const [key, coords] of Object.entries(DISTRICT_COORDS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }
  return DISTRICT_COORDS.nepal;
}
