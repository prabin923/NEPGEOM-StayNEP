'use client';

import { Rocket, Brain, Globe } from 'lucide-react';

interface Phase {
  number: number;
  icon: React.ElementType;
  period: string;
  title: string;
  description: string;
  status: 'Active' | 'Planned' | 'Vision';
}

const phases: Phase[] = [
  {
    number: 1,
    icon: Rocket,
    period: 'Current',
    title: 'Tourism Intelligence Platform',
    description:
      'Core GIS platform, hotel mapping, tourist discovery, safety network',
    status: 'Active',
  },
  {
    number: 2,
    icon: Brain,
    period: '2026',
    title: 'AI-Powered Forecasting',
    description:
      'Predictive analytics, demand forecasting, dynamic pricing recommendations',
    status: 'Planned',
  },
  {
    number: 3,
    icon: Globe,
    period: '2027',
    title: 'National Tourism Network',
    description:
      'Full national integration, cross-border tourism, government partnership',
    status: 'Vision',
  },
];

const statusStyles: Record<Phase['status'], string> = {
  Active:
    'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
  Planned:
    'bg-[#C9A24A]/10 text-[#C9A24A] ring-1 ring-[#C9A24A]/20',
  Vision:
    'bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20',
};

function TimelineCard({
  phase,
  index,
}: {
  phase: Phase;
  index: number;
}) {
  const Icon = phase.icon;
  const isLeft = index % 2 === 0;

  return (
    <div className="relative flex w-full items-start md:justify-center">
      {/* Desktop: alternating sides */}
      {/* Left content (even indices) */}
      <div
        className={`hidden w-5/12 md:block ${
          isLeft ? '' : 'pointer-events-none opacity-0'
        }`}
      >
        {isLeft && (
          <div className="group ml-auto mr-8 max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-[#0D1B3E] to-[#162550] p-6 transition-all duration-300 hover:border-[#C9A24A]/30 hover:shadow-lg hover:shadow-[#C9A24A]/5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A24A]/10 ring-1 ring-[#C9A24A]/20">
                  <Icon className="h-5 w-5 text-[#C9A24A]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#C9A24A]">
                    Phase {phase.number} — {phase.period}
                  </p>
                  <h3 className="text-lg font-semibold text-white">
                    {phase.title}
                  </h3>
                </div>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-white/60">
              {phase.description}
            </p>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[phase.status]}`}
            >
              {phase.status}
            </span>
          </div>
        )}
      </div>

      {/* Center timeline node - desktop */}
      <div className="relative z-10 hidden flex-col items-center md:flex">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#C9A24A] bg-[#0D1B3E] shadow-lg shadow-[#C9A24A]/20">
          <span className="text-sm font-bold text-[#C9A24A]">
            {phase.number}
          </span>
        </div>
      </div>

      {/* Right content (odd indices) */}
      <div
        className={`hidden w-5/12 md:block ${
          !isLeft ? '' : 'pointer-events-none opacity-0'
        }`}
      >
        {!isLeft && (
          <div className="group ml-8 max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-[#0D1B3E] to-[#162550] p-6 transition-all duration-300 hover:border-[#C9A24A]/30 hover:shadow-lg hover:shadow-[#C9A24A]/5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9A24A]/10 ring-1 ring-[#C9A24A]/20">
                  <Icon className="h-5 w-5 text-[#C9A24A]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#C9A24A]">
                    Phase {phase.number} — {phase.period}
                  </p>
                  <h3 className="text-lg font-semibold text-white">
                    {phase.title}
                  </h3>
                </div>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-white/60">
              {phase.description}
            </p>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[phase.status]}`}
            >
              {phase.status}
            </span>
          </div>
        )}
      </div>

      {/* Mobile layout */}
      <div className="flex gap-4 md:hidden">
        {/* Mobile timeline node */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#C9A24A] bg-[#0D1B3E] shadow-lg shadow-[#C9A24A]/20">
            <span className="text-xs font-bold text-[#C9A24A]">
              {phase.number}
            </span>
          </div>
        </div>

        {/* Mobile card */}
        <div className="group flex-1 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0D1B3E] to-[#162550] p-5 transition-all duration-300 hover:border-[#C9A24A]/30">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A24A]/10 ring-1 ring-[#C9A24A]/20">
              <Icon className="h-4 w-4 text-[#C9A24A]" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#C9A24A]">
                Phase {phase.number} — {phase.period}
              </p>
              <h3 className="text-base font-semibold text-white">
                {phase.title}
              </h3>
            </div>
          </div>
          <p className="mb-3 text-sm leading-relaxed text-white/60">
            {phase.description}
          </p>
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[phase.status]}`}
          >
            {phase.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FutureVision() {
  return (
    <section className="relative overflow-hidden bg-[#080f24] py-24 sm:py-32">
      {/* Background decorative gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 50% 30%, rgba(201,162,74,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#C9A24A]">
            Roadmap
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Our Roadmap
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/50">
            Building the future of tourism intelligence in Nepal
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-20">
          {/* Vertical line — desktop */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block">
            <div className="h-full w-full bg-gradient-to-b from-[#C9A24A]/60 via-[#C9A24A]/30 to-transparent" />
          </div>

          {/* Vertical line — mobile */}
          <div className="absolute left-[19px] top-0 h-full w-px md:hidden">
            <div className="h-full w-full bg-gradient-to-b from-[#C9A24A]/60 via-[#C9A24A]/30 to-transparent" />
          </div>

          {/* Phase Cards */}
          <div className="flex flex-col gap-12 md:gap-16">
            {phases.map((phase, index) => (
              <TimelineCard key={phase.number} phase={phase} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
