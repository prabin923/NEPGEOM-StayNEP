'use client';

import { useState } from 'react';
import {
  Search,
  Map,
  Bell,
  BarChart3,
  PieChart,
  Shield,
} from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Search,
    title: 'Smart Accommodation Discovery',
    description:
      'AI-powered search across Nepal\'s entire accommodation network with real-time availability',
  },
  {
    icon: Map,
    title: 'Tourism Heatmaps',
    description:
      'Visual density maps showing tourist flow patterns and popular destinations',
  },
  {
    icon: Bell,
    title: 'Safety Alerts',
    description:
      'Real-time safety notifications and emergency service location for travelers',
  },
  {
    icon: BarChart3,
    title: 'Occupancy Intelligence',
    description:
      'Live occupancy data and predictive analytics for hotels and regions',
  },
  {
    icon: PieChart,
    title: 'Regional Tourism Analytics',
    description:
      'Comprehensive analytics dashboard for tourism authorities and planners',
  },
  {
    icon: Shield,
    title: 'Emergency Accommodation Network',
    description:
      'Rapid emergency shelter allocation during natural disasters and crises',
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0D1B3E] to-[#162550] p-8 transition-all duration-300 hover:border-[#C9A24A]/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C9A24A]/5"
    >
      {/* Subtle glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(201,162,74,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        {/* Icon in gold circle */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#C9A24A]/10 ring-1 ring-[#C9A24A]/20">
          <Icon
            className="h-7 w-7 text-[#C9A24A] transition-transform duration-300 group-hover:scale-110"
            strokeWidth={1.8}
          />
        </div>

        {/* Title */}
        <h3 className="mb-3 text-lg font-semibold text-white">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-white/60">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-[#080f24] py-24 sm:py-32">
      {/* Subtle top gradient blend */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0D1B3E] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C9A24A]">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Powerful Features for Every Stakeholder
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/50">
            A comprehensive suite of tools designed for tourists, hoteliers, and
            government authorities alike.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
