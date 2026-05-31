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
  Active: 'bg-obsidian text-snow',
  Planned: 'bg-fog text-graphite',
  Vision: 'bg-fog text-ash',
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
          <div className="group ml-auto mr-8 max-w-md rounded-[28px] bg-snow p-6 border-none transition-transform duration-250 ease-out hover:translate-y-[-2px] select-none">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-fog">
                  <Icon className="h-5 w-5 text-graphite" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wider text-steel font-cosmica">
                    Phase {phase.number} — {phase.period}
                  </p>
                  <h3 className="text-[18px] font-semibold text-ink font-cosmica leading-tight">
                    {phase.title}
                  </h3>
                </div>
              </div>
            </div>
            <p className="mb-4 text-[14px] leading-relaxed text-steel font-cosmica">
              {phase.description}
            </p>
            <span
              className={`inline-block rounded-[10000px] px-3 py-1 text-[11px] font-medium leading-none font-cosmica ${statusStyles[phase.status]}`}
            >
              {phase.status}
            </span>
          </div>
        )}
      </div>

      {/* Center timeline node - desktop */}
      <div className="relative z-10 hidden flex-col items-center md:flex">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-obsidian bg-obsidian text-snow">
          <span className="text-sm font-bold font-cosmica">
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
          <div className="group ml-8 max-w-md rounded-[28px] bg-snow p-6 border-none transition-transform duration-250 ease-out hover:translate-y-[-2px] select-none">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-fog">
                  <Icon className="h-5 w-5 text-graphite" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wider text-steel font-cosmica">
                    Phase {phase.number} — {phase.period}
                  </p>
                  <h3 className="text-[18px] font-semibold text-ink font-cosmica leading-tight">
                    {phase.title}
                  </h3>
                </div>
              </div>
            </div>
            <p className="mb-4 text-[14px] leading-relaxed text-steel font-cosmica">
              {phase.description}
            </p>
            <span
              className={`inline-block rounded-[10000px] px-3 py-1 text-[11px] font-medium leading-none font-cosmica ${statusStyles[phase.status]}`}
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-obsidian bg-obsidian text-snow">
            <span className="text-xs font-bold font-cosmica">
              {phase.number}
            </span>
          </div>
        </div>

        {/* Mobile card */}
        <div className="group flex-1 rounded-[28px] bg-snow p-5 border-none transition-transform duration-250 ease-out hover:translate-y-[-2px]">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-fog">
              <Icon className="h-4 w-4 text-graphite" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase tracking-wider text-steel font-cosmica">
                Phase {phase.number} — {phase.period}
              </p>
              <h3 className="text-base font-semibold text-ink font-cosmica">
                {phase.title}
              </h3>
            </div>
          </div>
          <p className="mb-3 text-[14px] leading-relaxed text-steel font-cosmica">
            {phase.description}
          </p>
          <span
            className={`inline-block rounded-[10000px] px-3 py-1 text-[11px] font-medium leading-none font-cosmica ${statusStyles[phase.status]}`}
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
    <section id="roadmap" className="relative bg-mist py-20 sm:py-28">
      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-steel font-cosmica">
            Roadmap
          </p>
          <h2 className="text-[32px] font-bold tracking-tight text-obsidian leading-none font-cosmica">
            Our Roadmap
          </h2>
          <p className="mt-4 text-[16px] leading-[1.5] text-steel font-cosmica">
            Building the future of tourism intelligence in Nepal.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mt-20">
          {/* Vertical line — desktop */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block bg-pebble" />

          {/* Vertical line — mobile */}
          <div className="absolute left-[19px] top-0 h-full w-px md:hidden bg-pebble" />

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
