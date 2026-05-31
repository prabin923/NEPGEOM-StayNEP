'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Hotel,
  Landmark,
  Cross,
  Shield,
  Tent,
} from 'lucide-react';
import { hotels } from '@/data/hotels';
import { attractions } from '@/data/attractions';
import { emergencyServices } from '@/data/emergency';
import type { FilterType } from './LeafletMap';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-[36px] border border-fog bg-snow animate-pulse flex items-center justify-center">
      <span className="text-steel">Loading map...</span>
    </div>
  ),
});

const filters: { key: FilterType; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'All', icon: MapPin },
  { key: 'hotels', label: 'Hotels', icon: Hotel },
  { key: 'attractions', label: 'Attractions', icon: Landmark },
  { key: 'hospitals', label: 'Hospitals', icon: Cross },
  { key: 'police', label: 'Police', icon: Shield },
  { key: 'shelters', label: 'Shelters', icon: Tent },
];

const dotColors: Record<FilterType, string> = {
  all: 'bg-obsidian',
  hotels: 'bg-blue-500',
  attractions: 'bg-green-500',
  hospitals: 'bg-red-500',
  police: 'bg-orange-500',
  shelters: 'bg-purple-500',
};

export default function MapSection() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const totalCount = useMemo(() => {
    switch (activeFilter) {
      case 'hotels':
        return hotels.length;
      case 'attractions':
        return attractions.length;
      case 'hospitals':
        return emergencyServices.filter((e) => e.type === 'hospital').length;
      case 'police':
        return emergencyServices.filter((e) => e.type === 'police').length;
      case 'shelters':
        return emergencyServices.filter((e) => e.type === 'shelter').length;
      default:
        return hotels.length + attractions.length + emergencyServices.length;
    }
  }, [activeFilter]);

  return (
    <section
      id="map"
      className="relative bg-mist py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-[1200px]">
        {/* ── Heading ───────────────────────────────────────────────────── */}
        <div className="text-center mb-12" data-gsap-reveal>
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-fog bg-snow px-4 py-1.5">
            <MapPin className="h-4 w-4 text-steel" />
            <span className="text-[12px] font-medium tracking-tight text-steel uppercase">
              Interactive Explorer
            </span>
          </div>
          <h2 className="text-[32px] font-bold text-obsidian mb-4 tracking-tight font-cosmica leading-none">
            Explore Nepal&apos;s Tourism <span className="text-ash">Network</span>
          </h2>
          <p className="mx-auto max-w-2xl text-[16px] text-steel leading-relaxed font-cosmica">
            Interactive map showing hotels, attractions, and emergency services across all 7 provinces.
          </p>
        </div>

        {/* ── Filter Bar ────────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {filters.map(({ key, label, icon: Icon }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                aria-pressed={isActive}
                className={`
                  group inline-flex items-center gap-2 rounded-[36px] px-4 py-2 text-sm font-medium
                  transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? 'bg-obsidian text-snow shadow-button'
                      : 'bg-snow text-graphite border border-fog hover:bg-fog'
                  }
                `}
              >
                <Icon className="h-4 w-4 text-current" />
                {label}
                {isActive && (
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-snow/20 px-1.5 py-0.5 text-[10px] font-bold leading-none text-snow">
                    {totalCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Map ───────────────────────────────────────────────────────── */}
        <div
          data-gsap="map-panel"
          className="rounded-[36px] overflow-hidden border border-fog"
        >
          <LeafletMap
            hotels={hotels}
            attractions={attractions}
            emergencyServices={emergencyServices}
            filter={activeFilter}
          />
        </div>

        {/* ── Summary Bar ───────────────────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-snow px-6 py-4 border-none">
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${dotColors[activeFilter]} animate-pulse-dot`} />
            <p className="text-sm text-steel font-cosmica">
              Showing{' '}
              <span className="font-semibold text-obsidian">{totalCount}</span>{' '}
              {activeFilter === 'all' ? 'locations' : activeFilter} on the map
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-[12px] text-steel font-cosmica">
            {[
              { label: 'Hotels', color: 'bg-blue-500' },
              { label: 'Attractions', color: 'bg-green-500' },
              { label: 'Hospitals', color: 'bg-red-500' },
              { label: 'Police', color: 'bg-orange-500' },
              { label: 'Shelters', color: 'bg-purple-500' },
            ].map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
