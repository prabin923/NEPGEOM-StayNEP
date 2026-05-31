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
    <div className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#C9A24A]/30 hover:bg-white/[0.06]">
      {/* Glassmorphic inner glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(201,162,74,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10">
        {/* Icon Header */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A24A]/10 ring-1 ring-[#C9A24A]/20">
            <Icon className="h-6 w-6 text-[#C9A24A]" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {stakeholder.title}
            </h3>
            <p className="text-sm text-white/40">{stakeholder.subtitle}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-gradient-to-r from-[#C9A24A]/20 via-[#C9A24A]/10 to-transparent" />

        {/* Benefits List */}
        <ul className="space-y-4">
          {stakeholder.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C9A24A]/10">
                <Check className="h-3 w-3 text-[#C9A24A]" strokeWidth={3} />
              </div>
              <span className="text-sm leading-relaxed text-white/70">
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
    <section className="relative bg-[#0D1B3E] py-24 sm:py-32">
      {/* Background decorative element */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(201,162,74,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(201,162,74,0.04) 0%, transparent 50%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C9A24A]">
            Impact
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Impact Across the Tourism Ecosystem
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/50">
            StayNEP creates value for every participant in Nepal&apos;s tourism
            industry.
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
