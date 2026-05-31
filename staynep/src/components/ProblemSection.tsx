'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, Users, Shield, TrendingUp, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ChallengeCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

const challenges: ChallengeCard[] = [
  {
    icon: Eye,
    title: 'Limited Accommodation Visibility',
    description:
      'Travelers struggle to find verified accommodations across Nepal\'s diverse regions',
  },
  {
    icon: Users,
    title: 'Poor Tourism Coordination',
    description:
      'Lack of centralized platform connecting tourists, hotels, and authorities',
  },
  {
    icon: Shield,
    title: 'Safety Concerns',
    description:
      'Limited access to emergency services and safety information for tourists',
  },
  {
    icon: TrendingUp,
    title: 'Seasonal Overcrowding',
    description:
      'No data-driven tools to manage tourist flow and seasonal demand',
  },
  {
    icon: BarChart3,
    title: 'Lack of Tourism Intelligence',
    description:
      'Absence of analytics for informed tourism planning and development',
  },
];

function ChallengeCardComponent({
  challenge,
  index,
  isVisible,
}: {
  challenge: ChallengeCard;
  index: number;
  isVisible: boolean;
}) {
  const Icon = challenge.icon;

  return (
    <div
      className={`
        group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm
        transition-all duration-500 ease-out
        hover:scale-[1.03] hover:border-[#C9A24A]/40 hover:bg-white/[0.08]
        hover:shadow-[0_0_30px_rgba(201,162,74,0.12)]
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}
      style={{
        transitionDelay: isVisible ? `${index * 120}ms` : '0ms',
      }}
    >
      {/* Glow effect on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(201,162,74,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#C9A24A]/20 bg-[#C9A24A]/10">
          <Icon className="h-6 w-6 text-[#C9A24A]" strokeWidth={1.8} />
        </div>

        <h3 className="mb-2 text-lg font-semibold text-white">
          {challenge.title}
        </h3>

        <p className="text-sm leading-relaxed text-gray-400">
          {challenge.description}
        </p>
      </div>
    </div>
  );
}

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(section);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-32"
      style={{
        background: 'linear-gradient(180deg, #0D1B3E 0%, #0a1428 100%)',
      }}
    >
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Top-left radial glow */}
        <div
          className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(201,162,74,0.15) 0%, transparent 70%)',
          }}
        />
        {/* Bottom-right radial glow */}
        <div
          className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(13,27,62,0.8) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className={`mx-auto mb-16 max-w-3xl text-center transition-all duration-700 ease-out sm:mb-20 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9A24A]/20 bg-[#C9A24A]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#C9A24A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A24A]" />
            The Problem
          </div>

          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            The Challenges in Nepal&apos;s{' '}
            <span className="bg-gradient-to-r from-[#C9A24A] to-[#e8c96a] bg-clip-text text-transparent">
              Tourism Landscape
            </span>
          </h2>

          <p className="text-base leading-relaxed text-gray-400 sm:text-lg">
            Nepal&apos;s tourism ecosystem remains fragmented — with disconnected
            accommodation listings, limited safety infrastructure, and no
            centralized intelligence platform to unify the travel experience for
            millions of visitors each year.
          </p>
        </div>

        {/* Challenge cards grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, index) => (
            <ChallengeCardComponent
              key={challenge.title}
              challenge={challenge}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Bottom callout */}
        <div
          className={`mt-14 flex items-center justify-center transition-all duration-700 ease-out sm:mt-16 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: isVisible ? '800ms' : '0ms' }}
        >
          <div className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
            <p className="text-sm text-gray-300">
              These challenges cost Nepal&apos;s tourism industry an estimated{' '}
              <span className="font-semibold text-white">$200M+ annually</span>{' '}
              in lost revenue
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
