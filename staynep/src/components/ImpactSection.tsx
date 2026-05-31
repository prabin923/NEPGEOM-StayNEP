'use client';

import { Users, Building2, Landmark, Check } from 'lucide-react';

interface Stakeholder {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  benefits: string[];
}

const stakeholders: Stakeholder[] = [
  {
    icon: Users,
    title: 'Tourists',
    subtitle: 'Empowering travelers with intelligence',
    benefits: [
      'Easier travel planning & navigation',
      'Better accommodation discovery',
      'Safer journeys with real-time alerts',
      'Real-time local information access',
    ],
  },
  {
    icon: Building2,
    title: 'Hotels',
    subtitle: 'Maximizing hospitality potential',
    benefits: [
      'Higher occupancy rates',
      'Better demand forecasting',
      'Revenue optimization tools',
      'Market insights & competitive data',
    ],
  },
  {
    icon: Landmark,
    title: 'Authorities',
    subtitle: 'Enabling data-driven governance',
    benefits: [
      'Data-driven tourism planning',
      'Efficient resource allocation',
      'Regional tourism insights',
      'Crisis management coordination',
    ],
  },
];

function StakeholderCard({ stakeholder }: { stakeholder: Stakeholder }) {
  const Icon = stakeholder.icon;

  return (
    <div className="group relative rounded-[36px] bg-snow p-7 transition-transform duration-250 ease-out hover:translate-y-[-2px] select-none">
      <div className="relative z-10">
        {/* Icon Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-fog shrink-0">
            <Icon className="h-5 w-5 text-graphite" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-[20px] font-semibold text-obsidian font-cosmica leading-none">
              {stakeholder.title}
            </h3>
            <p className="text-[14px] text-steel font-cosmica mt-1.5">{stakeholder.subtitle}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-fog" />

        {/* Benefits List */}
        <ul className="space-y-4">
          {stakeholder.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fog">
                <Check className="h-3 w-3 text-graphite" strokeWidth={3} />
              </div>
              <span className="text-[14px] leading-relaxed text-steel font-cosmica">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ImpactSection() {
  return (
    <section id="impact" className="relative bg-mist py-20 sm:py-28">
      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-steel font-cosmica">
            Impact
          </p>
          <h2 className="text-[32px] font-bold tracking-tight text-obsidian leading-none font-cosmica">
            Impact Across the Tourism Ecosystem
          </h2>
          <p className="mt-4 text-[16px] leading-[1.5] text-steel font-cosmica">
            StayNEP creates value for every participant in Nepal&apos;s tourism industry.
          </p>
        </div>

        {/* Stakeholder Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stakeholders.map((stakeholder) => (
            <StakeholderCard
              key={stakeholder.title}
              stakeholder={stakeholder}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
