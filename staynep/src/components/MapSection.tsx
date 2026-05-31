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
    <div className="h-[500px] rounded-xl bg-white/5 animate-pulse flex items-center justify-center">
      <span className="text-gray-400">Loading map...</span>
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
  all: 'bg-white',
  hotels: 'bg-blue-400',
  attractions: 'bg-green-400',
  hospitals: 'bg-red-400',
  police: 'bg-orange-400',
  shelters: 'bg-purple-400',
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
      className="relative py-24 px-4 sm:px-6 lg:px-8"
      style={{ background: 'linear-gradient(180deg, #0D1B3E 0%, #091428 100%)' }}
    >
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* ── Heading ───────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 rounded-full border border-[#C9A24A]/30 bg-[#C9A24A]/10 px-4 py-1.5">
            <MapPin className="h-4 w-4 text-[#C9A24A]" />
            <span className="text-xs font-medium tracking-wide text-[#C9A24A] uppercase">
              Interactive Explorer
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Explore Nepal&apos;s Tourism{' '}
            <span className="text-[#C9A24A]">Network</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed">
            Interactive map showing hotels, attractions, and emergency services
            across all 7 provinces
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
                  group relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium
                  transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? 'bg-[#C9A24A] text-[#0D1B3E] shadow-lg shadow-[#C9A24A]/25'
                      : 'border border-white/15 text-gray-300 hover:border-white/30 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {label}
                {isActive && (
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-[#0D1B3E]/20 px-1.5 py-0.5 text-[10px] font-bold leading-none">
                    {totalCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Map ───────────────────────────────────────────────────────── */}
        <LeafletMap
          hotels={hotels}
          attractions={attractions}
          emergencyServices={emergencyServices}
          filter={activeFilter}
        />

        {/* ── Summary Bar ───────────────────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${dotColors[activeFilter]} animate-pulse`} />
            <p className="text-sm text-gray-300">
              Showing{' '}
              <span className="font-semibold text-white">{totalCount}</span>{' '}
              {activeFilter === 'all' ? 'locations' : activeFilter} on the map
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            {[
              { label: 'Hotels', color: 'bg-blue-400' },
              { label: 'Attractions', color: 'bg-green-400' },
              { label: 'Hospitals', color: 'bg-red-400' },
              { label: 'Police', color: 'bg-orange-400' },
              { label: 'Shelters', color: 'bg-purple-400' },
            ].map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${item.color}`} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
