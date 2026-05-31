'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Hotel,
  Brain,
  ShieldCheck,
  Compass,
  PieChart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SolutionNode {
  icon: LucideIcon;
  label: string;
  angle: number; // degrees for positioning around the circle
}

const nodes: SolutionNode[] = [
  { icon: Hotel, label: 'Live Hotel Availability', angle: -90 },
  { icon: Brain, label: 'Tourism Intelligence', angle: -18 },
  { icon: PieChart, label: 'Occupancy Insights', angle: 54 },
  { icon: Compass, label: 'Destination Discovery', angle: 126 },
  { icon: ShieldCheck, label: 'Safety Monitoring', angle: 198 },
];

interface Metric {
  value: string;
  label: string;
}

const metrics: Metric[] = [
  { value: '72%', label: 'Faster Discovery' },
  { value: '3x', label: 'Better Coordination' },
  { value: '90%', label: 'Safety Coverage' },
];

function EcosystemDiagram({ isVisible }: { isVisible: boolean }) {
  // Radius for the orbit of nodes (responsive)
  const orbitRadiusDesktop = 200;
  const orbitRadiusMobile = 140;

  return (
    <div className="relative mx-auto flex items-center justify-center">
      {/* Container — sized to fit orbit + node cards */}
      <div
        className="relative"
        style={{ width: '520px', height: '520px' }}
      >
        {/* Orbit ring */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10 transition-all duration-1000 ease-out ${
            isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
          style={{ width: orbitRadiusDesktop * 2, height: orbitRadiusDesktop * 2 }}
        />

        {/* Secondary inner ring */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 transition-all duration-1000 ease-out ${
            isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
          style={{
            width: orbitRadiusDesktop * 1.3,
            height: orbitRadiusDesktop * 1.3,
            transitionDelay: '200ms',
          }}
        />

        {/* Center hub */}
        <div
          className={`absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#C9A24A]/40 transition-all duration-700 ease-out ${
            isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          style={{
            width: 120,
            height: 120,
            background:
              'radial-gradient(circle, rgba(201,162,74,0.15) 0%, rgba(13,27,62,0.9) 70%)',
            boxShadow: '0 0 60px rgba(201,162,74,0.2), 0 0 120px rgba(201,162,74,0.08)',
          }}
        >
          <span className="text-xl font-bold text-white">StayNEP</span>
          <span className="mt-0.5 text-[10px] uppercase tracking-widest text-[#C9A24A]">
            Platform
          </span>

          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-full border border-[#C9A24A]/20"
            style={{
              animation: 'pulse-ring 3s ease-in-out infinite',
            }}
          />
        </div>

        {/* Connection lines + Nodes */}
        {nodes.map((node, index) => {
          const angleRad = (node.angle * Math.PI) / 180;
          const useRadius = orbitRadiusDesktop;
          const x = Math.cos(angleRad) * useRadius;
          const y = Math.sin(angleRad) * useRadius;

          // Connection line: from center to node
          const lineLength = useRadius - 60; // from edge of center circle to near node
          const lineAngle = node.angle;

          const Icon = node.icon;

          return (
            <div key={node.label}>
              {/* Animated connection line */}
              <div
                className={`absolute left-1/2 top-1/2 z-10 origin-left transition-all duration-700 ease-out ${
                  isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                }`}
                style={{
                  width: lineLength,
                  height: '1px',
                  transform: `translate(-50%, -50%) rotate(${lineAngle}deg) translateX(60px)`,
                  transitionDelay: `${400 + index * 150}ms`,
                }}
              >
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(201,162,74,0.4) 0%, rgba(201,162,74,0.1) 100%)',
                  }}
                />
                {/* Animated traveling dot */}
                <div
                  className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#C9A24A]"
                  style={{
                    animation: `travel-dot-${index} 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.6}s`,
                  }}
                />
              </div>

              {/* Node card */}
              <div
                className={`absolute left-1/2 top-1/2 z-20 transition-all duration-500 ease-out ${
                  isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                }`}
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  transitionDelay: `${600 + index * 150}ms`,
                }}
              >
                <div className="group flex w-[130px] flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all duration-300 hover:border-[#C9A24A]/30 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(201,162,74,0.1)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#C9A24A]/20 bg-[#C9A24A]/10 transition-colors duration-300 group-hover:bg-[#C9A24A]/20">
                    <Icon
                      className="h-5 w-5 text-[#C9A24A]"
                      strokeWidth={1.8}
                    />
                  </div>
                  <span className="text-center text-xs font-medium leading-tight text-gray-300 transition-colors duration-300 group-hover:text-white">
                    {node.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Keyframe styles for traveling dots */}
      <style>{`
        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.3;
          }
        }
        ${nodes
          .map(
            (_, i) => `
          @keyframes travel-dot-${i} {
            0% { left: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { left: 100%; opacity: 0; }
          }
        `
          )
          .join('')}
      `}</style>
    </div>
  );
}

/* ─── Mobile layout: stacked list instead of radial diagram ─── */
function MobileEcosystemList({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Center hub */}
      <div
        className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border border-[#C9A24A]/40 transition-all duration-700 ease-out ${
          isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(201,162,74,0.15) 0%, rgba(13,27,62,0.9) 70%)',
          boxShadow:
            '0 0 40px rgba(201,162,74,0.2), 0 0 80px rgba(201,162,74,0.08)',
        }}
      >
        <span className="text-lg font-bold text-white">StayNEP</span>
        <span className="text-[9px] uppercase tracking-widest text-[#C9A24A]">
          Platform
        </span>
      </div>

      {/* Connector line */}
      <div
        className={`h-6 w-px bg-gradient-to-b from-[#C9A24A]/40 to-transparent transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Nodes as a grid */}
      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <div
              key={node.label}
              className={`flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all duration-500 ease-out ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#C9A24A]/20 bg-[#C9A24A]/10">
                <Icon className="h-4 w-4 text-[#C9A24A]" strokeWidth={1.8} />
              </div>
              <span className="text-xs font-medium leading-tight text-gray-300">
                {node.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SolutionSection() {
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
      className="relative overflow-hidden py-24 sm:py-32"
      style={{
        background: 'linear-gradient(180deg, #0a1428 0%, #0D1B3E 50%, #0a1428 100%)',
      }}
    >
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(201,162,74,0.06) 0%, transparent 60%)',
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
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
            The Solution
          </div>

          <h2 className="mb-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            When Location Becomes{' '}
            <span className="bg-gradient-to-r from-[#C9A24A] to-[#e8c96a] bg-clip-text text-transparent">
              the Solution
            </span>
          </h2>

          <p className="text-base leading-relaxed text-gray-400 sm:text-lg">
            StayNEP brings together real-time hotel data, tourism analytics, and
            safety monitoring into one integrated geospatial platform — creating
            an intelligent tourism ecosystem powered by location.
          </p>
        </div>

        {/* Ecosystem diagram */}
        <div
          className={`mb-20 transition-all duration-700 ease-out sm:mb-24 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {/* Desktop diagram */}
          <div className="hidden md:block">
            <EcosystemDiagram isVisible={isVisible} />
          </div>
          {/* Mobile fallback */}
          <div className="md:hidden">
            <MobileEcosystemList isVisible={isVisible} />
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all duration-500 ease-out hover:border-[#C9A24A]/30 hover:bg-white/[0.08] ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${800 + index * 150}ms` }}
            >
              {/* Background shimmer on hover */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 0%, rgba(201,162,74,0.08) 0%, transparent 60%)',
                }}
              />

              <div className="relative z-10">
                <div className="mb-2 text-4xl font-bold text-[#C9A24A] sm:text-5xl">
                  {metric.value}
                </div>
                <div className="text-sm font-medium uppercase tracking-wider text-gray-400">
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
