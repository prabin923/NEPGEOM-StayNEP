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
  const orbitRadiusDesktop = 200;

  return (
    <div className="relative mx-auto flex items-center justify-center">
      {/* Container — sized to fit orbit + node cards */}
      <div
        className="relative"
        style={{ width: '520px', height: '520px' }}
      >
        {/* Orbit ring */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-pebble transition-all duration-1000 ease-out ${
            isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
          style={{ width: orbitRadiusDesktop * 2, height: orbitRadiusDesktop * 2 }}
        />

        {/* Secondary inner ring */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pebble/50 transition-all duration-1000 ease-out ${
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
          className={`absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-fog bg-snow transition-all duration-700 ease-out ${
            isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
          style={{
            width: 120,
            height: 120,
          }}
        >
          <span className="text-xl font-bold text-obsidian font-cosmica">StayNEP</span>
          <span className="mt-0.5 text-[10px] uppercase tracking-widest text-steel">
            Platform
          </span>
        </div>

        {/* Connection lines + Nodes */}
        {nodes.map((node, index) => {
          const angleRad = (node.angle * Math.PI) / 180;
          const useRadius = orbitRadiusDesktop;
          const x = Math.cos(angleRad) * useRadius;
          const y = Math.sin(angleRad) * useRadius;

          const lineLength = useRadius - 60;
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
                  height: '1.5px',
                  transform: `translate(-50%, -50%) rotate(${lineAngle}deg) translateX(60px)`,
                  transitionDelay: `${400 + index * 150}ms`,
                }}
              >
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      'linear-gradient(90deg, #d4d4d8 0%, #ececee 100%)',
                  }}
                />
                {/* Animated traveling dot */}
                <div
                  className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-obsidian"
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
                <div className="group flex w-[130px] flex-col items-center gap-2 rounded-[16px] border border-fog bg-snow p-3 transition-all duration-300">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-fog">
                    <Icon
                      className="h-5 w-5 text-graphite"
                      strokeWidth={1.8}
                    />
                  </div>
                  <span className="text-center text-xs font-medium leading-tight text-ink font-cosmica">
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

function MobileEcosystemList({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Center hub */}
      <div
        className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border border-fog transition-all duration-700 ease-out bg-snow ${
          isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <span className="text-lg font-bold text-obsidian font-cosmica">StayNEP</span>
        <span className="text-[9px] uppercase tracking-widest text-steel">
          Platform
        </span>
      </div>

      {/* Connector line */}
      <div
        className={`h-6 w-px bg-pebble transition-all duration-500 ${
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
              className={`flex items-center gap-3 rounded-[16px] border border-fog bg-snow p-3 transition-all duration-500 ease-out ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-fog">
                <Icon className="h-4 w-4 text-graphite" strokeWidth={1.8} />
              </div>
              <span className="text-xs font-medium leading-tight text-ink font-cosmica">
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
      className="relative overflow-hidden py-20 sm:py-28 bg-mist"
    >
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8">
        {/* Section header */}
        <div
          className={`mx-auto mb-16 max-w-3xl text-center transition-all duration-700 ease-out sm:mb-20 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fog bg-snow px-4 py-1.5 text-[12px] font-medium tracking-tight text-steel">
            The Solution
          </div>

          <h2 className="mb-6 text-[32px] font-bold tracking-tight text-obsidian leading-none font-cosmica">
            When Location Becomes <span className="text-ash">the Solution</span>
          </h2>

          <p className="text-[16px] leading-[1.5] text-steel font-cosmica max-w-2xl mx-auto">
            StayNEP brings together real-time hotel data, tourism analytics, and
            safety monitoring into one integrated geospatial platform — creating
            an intelligent tourism ecosystem.
          </p>
        </div>

        {/* Ecosystem diagram */}
        <div
          className={`mb-20 transition-all duration-700 ease-out sm:mb-24 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="hidden md:block">
            <EcosystemDiagram isVisible={isVisible} />
          </div>
          <div className="md:hidden">
            <MobileEcosystemList isVisible={isVisible} />
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`group relative overflow-hidden rounded-[36px] bg-snow border border-fog p-8 text-center transition-all duration-500 ease-out hover:translate-y-[-2px] ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${400 + index * 150}ms` }}
            >
              <div className="relative z-10">
                <div className="mb-2 text-[40px] font-bold text-obsidian leading-none font-cosmica">
                  {metric.value}
                </div>
                <div className="text-[13px] font-medium uppercase tracking-wider text-steel font-cosmica">
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
