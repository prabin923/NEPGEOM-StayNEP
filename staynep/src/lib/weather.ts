/** WMO weather interpretation codes (Open-Meteo). */
export function weatherCodeLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorm";
  return "Variable";
}

export function weatherTravelHint(code: number, precipMax?: number): string {
  if (code >= 95) return "Avoid exposed trails; seek shelter if outdoors.";
  if (code >= 61 || (precipMax ?? 0) >= 60)
    return "Pack rain gear and allow extra time on mountain roads.";
  if (code >= 51) return "Light rain possible — layers recommended.";
  if (code <= 3) return "Good conditions for sightseeing and outdoor plans.";
  if (code <= 48) return "Reduced visibility in hills — drive carefully.";
  return "Check again before heading out.";
}

export interface WeatherCurrent {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

export interface WeatherDay {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipProbability: number;
}

export interface WeatherForecast {
  locationLabel: string;
  latitude: number;
  longitude: number;
  fetchedAt: string;
  current: WeatherCurrent;
  daily: WeatherDay[];
}

export interface OpenMeteoResponse {
  current?: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}

export function parseOpenMeteo(
  data: OpenMeteoResponse,
  locationLabel: string,
  latitude: number,
  longitude: number
): WeatherForecast {
  const current = data.current;
  const daily = data.daily;

  if (!current || !daily) {
    throw new Error("Incomplete weather data");
  }

  return {
    locationLabel,
    latitude,
    longitude,
    fetchedAt: new Date().toISOString(),
    current: {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
    },
    daily: daily.time.map((date, i) => ({
      date,
      weatherCode: daily.weather_code[i],
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      precipProbability: daily.precipitation_probability_max[i] ?? 0,
    })),
  };
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number,
  locationLabel: string
): Promise<WeatherForecast> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    timezone: "Asia/Kathmandu",
    forecast_days: "5",
  });

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    { next: { revalidate: 1800 } }
  );

  if (!res.ok) {
    throw new Error(`Weather service unavailable (${res.status})`);
  }

  const json = (await res.json()) as OpenMeteoResponse;
  return parseOpenMeteo(json, locationLabel, latitude, longitude);
}
