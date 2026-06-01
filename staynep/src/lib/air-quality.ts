export interface AirQualityCurrent {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  o3: number;
  uvIndex: number;
}

export interface AirQualityData {
  locationLabel: string;
  latitude: number;
  longitude: number;
  fetchedAt: string;
  current: AirQualityCurrent;
}

export function aqiLabel(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for sensitive groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very unhealthy";
  return "Hazardous";
}

export function aqiColor(aqi: number): string {
  if (aqi <= 50) return "#22c55e";
  if (aqi <= 100) return "#eab308";
  if (aqi <= 150) return "#f97316";
  if (aqi <= 200) return "#ef4444";
  if (aqi <= 300) return "#7c3aed";
  return "#881337";
}

export function aqiTravelAdvice(aqi: number): string {
  if (aqi <= 50) return "Air quality is excellent — great day for outdoor activities and trekking.";
  if (aqi <= 100) return "Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion.";
  if (aqi <= 150) return "Consider reducing outdoor activities. Wear a mask if trekking in dusty areas.";
  if (aqi <= 200) return "Avoid prolonged outdoor activities. Not recommended for mountain treks.";
  return "Stay indoors when possible. Use air-filtered transportation.";
}

export function uvLabel(uv: number): string {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very high";
  return "Extreme";
}

export function uvAdvice(uv: number): string {
  if (uv <= 2) return "No protection needed";
  if (uv <= 5) return "Wear sunscreen SPF 30+";
  if (uv <= 7) return "Sunscreen + hat required, seek shade midday";
  if (uv <= 10) return "Avoid midday sun, full sun protection needed";
  return "Stay in shade, UV extreme at altitude";
}

// Open-Meteo API response shape
interface OpenMeteoAQIResponse {
  current?: {
    time: string;
    us_aqi: number;
    pm10: number;
    pm2_5: number;
    nitrogen_dioxide: number;
    sulphur_dioxide: number;
    ozone: number;
    uv_index: number;
  };
}

export async function fetchAirQuality(
  latitude: number,
  longitude: number,
  locationLabel: string
): Promise<AirQualityData> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "us_aqi,pm10,pm2_5,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index",
    timezone: "Asia/Kathmandu",
  });

  const res = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`,
    { next: { revalidate: 1800 } }
  );

  if (!res.ok) {
    throw new Error(`Air quality service unavailable (${res.status})`);
  }

  const json = (await res.json()) as OpenMeteoAQIResponse;
  const c = json.current;

  if (!c) throw new Error("Incomplete air quality data");

  return {
    locationLabel,
    latitude,
    longitude,
    fetchedAt: new Date().toISOString(),
    current: {
      aqi: c.us_aqi,
      pm25: c.pm2_5,
      pm10: c.pm10,
      no2: c.nitrogen_dioxide,
      so2: c.sulphur_dioxide,
      o3: c.ozone,
      uvIndex: c.uv_index,
    },
  };
}
