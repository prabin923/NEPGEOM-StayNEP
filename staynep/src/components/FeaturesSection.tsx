'use client';

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
  const Icon = feature.icon;

  return (
    <div
      className="group relative rounded-[36px] bg-snow p-7 transition-transform duration-250 ease-out hover:translate-y-[-2px] select-none"
    >
      <div className="relative z-10">
        {/* Icon in fog rounded container */}
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[12px] bg-fog">
          <Icon
            className="h-5 w-5 text-graphite"
            strokeWidth={1.8}
          />
        </div>

        {/* Title */}
        <h3 className="mb-3 text-[18px] font-semibold text-ink font-cosmica">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-[14px] leading-[1.56] text-steel font-cosmica">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-mist py-20 sm:py-28">
      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-steel font-cosmica">
            Features
          </p>
          <h2 className="text-[32px] font-bold tracking-tight text-obsidian leading-none font-cosmica">
            Powerful Features for Every Stakeholder
          </h2>
          <p className="mt-4 text-[16px] leading-[1.5] text-steel font-cosmica">
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
