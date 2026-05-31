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

function splitTitle(title: string) {
  const parts = title.split(' ');
  if (parts.length <= 2) {
    return { lead: parts[0], rest: parts.slice(1).join(' ') };
  }
  return { lead: parts.slice(0, 2).join(' '), rest: parts.slice(2).join(' ') };
}

function ChallengeListItem({
  challenge,
  index,
  isVisible,
}: {
  challenge: ChallengeCard;
  index: number;
  isVisible: boolean;
}) {
  const Icon = challenge.icon;
  const { lead, rest } = splitTitle(challenge.title);

  return (
    <div
      className={`flex gap-4 items-start transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      style={{
        transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
      }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-graphite">
        <Icon className="h-5 w-5 text-ash" strokeWidth={1.8} />
      </div>
      <div>
        <h3 className="text-[18px] leading-tight text-snow">
          <span className="font-light text-ash mr-1">{lead}</span>
          <span className="font-semibold">{rest}</span>
        </h3>
        <p className="mt-1.5 text-[14px] leading-relaxed text-steel">
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
      { threshold: 0.1 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-obsidian rounded-[36px] mx-4 lg:mx-8 py-20 sm:py-28 overflow-hidden my-8"
    >
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8">
        {/* Section header */}
        <div
          className={`mb-16 max-w-3xl transition-all duration-700 ease-out sm:mb-20 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-[12px] border border-white/20 px-3 py-1 text-[12px] font-medium text-snow">
            The Problem
          </div>

          <h2 className="mb-6 text-[32px] font-bold tracking-tight text-snow leading-none">
            The Challenges in Nepal&apos;s Tourism Landscape
          </h2>

          <p className="text-[16px] leading-[1.5] text-ash max-w-2xl font-light">
            Nepal&apos;s tourism ecosystem remains fragmented — with disconnected
            listings, limited safety infrastructure, and no centralized
            intelligence platform to unify the travel experience.
          </p>
        </div>

        {/* Challenges list */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, index) => (
            <ChallengeListItem
              key={challenge.title}
              challenge={challenge}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Bottom callout */}
        <div
          className={`mt-16 flex transition-all duration-700 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: isVisible ? '600ms' : '0ms' }}
        >
          <div className="inline-flex items-center gap-3 rounded-[12px] border border-white/10 bg-transparent px-4 py-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            <p className="text-[14px] text-ash font-light">
              These challenges cost Nepal&apos;s tourism industry an estimated{' '}
              <span className="font-semibold text-snow">$200M+ annually</span> in lost revenue.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
