'use client';

import { useState } from 'react';
import { CloudSun } from 'lucide-react';
import TouristWeatherWidget from '@/components/weather/TouristWeatherWidget';
import AirQualityWidget from '@/components/weather/AirQualityWidget';
import { PortalSectionTitle } from '@/components/portal/PortalUI';

export interface WeatherLocation {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

interface TouristWeatherBoardProps {
  locations: WeatherLocation[];
  title?: string;
  subtitle?: string;
}

export default function TouristWeatherBoard({
  locations,
  title = 'Weather & air quality for your trip',
  subtitle = 'Live weather and air quality from Open-Meteo · updated every 30 minutes',
}: TouristWeatherBoardProps) {
  const [activeId, setActiveId] = useState(locations[0]?.id ?? '');

  const active =
    locations.find((l) => l.id === activeId) ?? locations[0] ?? null;

  if (!locations.length) return null;

  return (
    <div className="rounded-[28px] border border-fog bg-snow p-6">
      <PortalSectionTitle title={title} subtitle={subtitle} icon={CloudSun} />

      <div className="mb-4 flex flex-wrap gap-2">
        {locations.map((loc) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => setActiveId(loc.id)}
            className={`rounded-[36px] px-4 py-2 text-xs font-medium transition ${
              activeId === loc.id
                ? 'bg-obsidian text-snow shadow-button'
                : 'border border-fog bg-mist text-graphite hover:bg-fog'
            }`}
          >
            {loc.label}
          </button>
        ))}
      </div>

      {active && (
        <div className="grid gap-4 lg:grid-cols-2">
          <TouristWeatherWidget
            key={`weather-${active.id}`}
            lat={active.lat}
            lng={active.lng}
            label={active.label}
          />
          <AirQualityWidget
            key={`aqi-${active.id}`}
            lat={active.lat}
            lng={active.lng}
            label={active.label}
          />
        </div>
      )}
    </div>
  );
}

