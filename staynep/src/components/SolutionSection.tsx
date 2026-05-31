'use client';

import { useEffect, useRef } from 'react';
import { LogoImage } from '@/components/Logo';
import {
  Hotel,
  Brain,
  ShieldCheck,
  Compass,
  PieChart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

interface SolutionNode {
  icon: LucideIcon;
  label: string;
  angle: number;
}

const ORBIT_R = 200;
const INNER_R = 130;
const HUB_R = 72;
const CX = 260;
const CY = 260;
const SIZE = 520;

const nodes: SolutionNode[] = [
  { icon: Hotel, label: 'Live Hotel Availability', angle: -90 },
  { icon: Brain, label: 'Tourism Intelligence', angle: -18 },
  { icon: PieChart, label: 'Occupancy Insights', angle: 54 },
  { icon: Compass, label: 'Destination Discovery', angle: 126 },
  { icon: ShieldCheck, label: 'Safety Monitoring', angle: 198 },
];

const metrics = [
  { value: '72%', label: 'Faster Discovery' },
  { value: '3x', label: 'Better Coordination' },
  { value: '90%', label: 'Safety Coverage' },
];

function nodePosition(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + Math.cos(rad) * radius,
    y: CY + Math.sin(rad) * radius,
  };
}

function EcosystemDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray<SVGLineElement>('[data-eco-line]');
      lines.forEach((line) => {
        const len = line.getTotalLength();
        gsap.set(line, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 0.85,
        });
      });

      const enterTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      });

      enterTl
        .from('[data-eco-ring-inner]', {
          attr: { r: 0 },
          opacity: 0,
          duration: 0.85,
        })
        .from(
          '[data-eco-ring-outer]',
          {
            attr: { r: 0 },
            opacity: 0,
            duration: 0.95,
          },
          '-=0.6'
        )
        .from(
          '[data-eco-hub-pulse]',
          { scale: 0.5, opacity: 0, duration: 0.7 },
          '-=0.55'
        )
        .from(
          '[data-eco-hub]',
          {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.6)',
          },
          '-=0.5'
        )
        .to(
          lines,
          {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.07,
            ease: 'power2.inOut',
          },
          '-=0.2'
        )
        .from(
          '[data-eco-anchor]',
          {
            attr: { r: 0 },
            opacity: 0,
            duration: 0.35,
            stagger: 0.07,
          },
          '-=0.35'
        )
        .from(
          '[data-eco-node-inner]',
          {
            scale: 0.88,
            opacity: 0,
            y: 14,
            duration: 0.5,
            stagger: 0.09,
            ease: 'back.out(1.35)',
          },
          '-=0.3'
        );

      gsap.to('[data-eco-ring-outer]', {
        rotation: 360,
        duration: 100,
        repeat: -1,
        ease: 'none',
        transformOrigin: '0px 0px',
      });

      gsap.to('[data-eco-hub-pulse]', {
        scale: 1.18,
        opacity: 0.35,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: '50% 50%',
      });

      gsap.utils.toArray<HTMLElement>('[data-eco-node-inner]').forEach((node, i) => {
        gsap.to(node, {
          y: -5,
          duration: 2.2 + i * 0.12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.4,
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-eco-pulse]').forEach((pulse, i) => {
        gsap.fromTo(
          pulse,
          { left: '6%', opacity: 0.3 },
          {
            left: '94%',
            opacity: 1,
            duration: 2.4,
            repeat: -1,
            ease: 'none',
            delay: i * 0.48,
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative mx-auto flex items-center justify-center">
      <div
        className="relative"
        style={{ width: SIZE, height: SIZE }}
        data-ecosystem
      >
        {/* SVG rings + spokes */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          aria-hidden
        >
          <circle
            data-eco-ring-inner
            cx={CX}
            cy={CY}
            r={INNER_R}
            fill="none"
            stroke="#d4d4d8"
            strokeWidth="1.5"
          />

          <g transform={`translate(${CX} ${CY})`}>
            <circle
              data-eco-ring-outer
              cx={0}
              cy={0}
              r={ORBIT_R}
              fill="none"
              stroke="#d4d4d8"
              strokeWidth="1.5"
              strokeDasharray="10 10"
            />
          </g>

          {nodes.map((node) => {
            const inner = nodePosition(node.angle, INNER_R);
            const outer = nodePosition(node.angle, ORBIT_R - 52);
            const hubEdge = nodePosition(node.angle, HUB_R + 4);

            return (
              <g key={node.label}>
                <line
                  data-eco-line
                  x1={hubEdge.x}
                  y1={hubEdge.y}
                  x2={inner.x}
                  y2={inner.y}
                  stroke="url(#ecoLineGrad)"
                  strokeWidth="1.5"
                  strokeDasharray="200"
                  strokeDashoffset="0"
                />
                <line
                  data-eco-line
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="#ececee"
                  strokeWidth="1.5"
                  strokeDasharray="120"
                  strokeDashoffset="0"
                  opacity="0.9"
                />
                <circle
                  data-eco-anchor
                  cx={inner.x}
                  cy={inner.y}
                  r="4"
                  fill="#09090b"
                />
              </g>
            );
          })}

          <defs>
            <linearGradient id="ecoLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4d4d8" />
              <stop offset="100%" stopColor="#ececee" />
            </linearGradient>
          </defs>
        </svg>

        {/* HTML spokes with traveling dots (overlay on hub→inner segment) */}
        {nodes.map((node) => {
          const lineAngle = node.angle;
          const lineLength = INNER_R - HUB_R;

          return (
            <div
              key={`pulse-${node.label}`}
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 overflow-hidden"
              style={{
                width: lineLength,
                height: 2,
                transform: `translate(-50%, -50%) rotate(${lineAngle}deg) translateX(${HUB_R}px)`,
              }}
            >
              <div
                data-eco-pulse
                className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-obsidian shadow-sm"
              />
            </div>
          );
        })}

        {/* Hub pulse ring */}
        <div
          data-eco-hub-pulse
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pebble/80"
          style={{ width: HUB_R * 2 + 28, height: HUB_R * 2 + 28 }}
        />

        {/* Center hub */}
        <div
          data-eco-hub
          className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-fog bg-snow shadow-md"
          style={{ width: HUB_R * 2, height: HUB_R * 2 }}
        >
          <LogoImage size="sm" className="!h-[4.5rem]" />
        </div>

        {/* Node cards */}
        {nodes.map((node) => {
          const { x, y } = nodePosition(node.angle, ORBIT_R);
          const Icon = node.icon;

          return (
            <div
              key={node.label}
              className="absolute z-20"
              style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                data-eco-node-inner
                className="group flex w-[148px] flex-col items-center gap-2.5 rounded-[16px] border border-fog bg-snow p-3.5 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-fog">
                  <Icon className="h-5 w-5 text-graphite" strokeWidth={1.8} />
                </div>
                <span className="text-center text-xs font-medium leading-snug text-ink font-cosmica">
                  {node.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileEcosystem() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        defaults: { ease: 'power3.out' },
      })
        .from('[data-eco-mobile-hub]', {
          scale: 0.6,
          opacity: 0,
          duration: 0.6,
          ease: 'back.out(1.5)',
        })
        .from(
          '[data-eco-mobile-node]',
          { y: 20, opacity: 0, duration: 0.45, stagger: 0.08 },
          '-=0.2'
        );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex flex-col items-center gap-4">
      <div
        data-eco-mobile-hub
        className="flex h-28 w-28 items-center justify-center rounded-full border border-fog bg-snow shadow-md"
      >
        <LogoImage size="sm" className="!h-16" />
      </div>
      <div className="h-6 w-px bg-pebble" />
      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        {nodes.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.label}
              data-eco-mobile-node
              className="flex items-center gap-3 rounded-[16px] border border-fog bg-snow p-3 shadow-sm"
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
  return (
    <section
      id="solution"
      className="relative overflow-hidden bg-mist py-20 sm:py-28"
    >
      <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8">
        <div
          data-gsap-reveal
          className="mx-auto mb-16 max-w-3xl text-center sm:mb-20"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fog bg-snow px-4 py-1.5 text-[12px] font-medium tracking-tight text-steel">
            The Solution
          </div>

          <h2 className="mb-6 text-[32px] font-bold leading-none tracking-tight text-obsidian font-cosmica">
            When Location Becomes <span className="text-ash">the Solution</span>
          </h2>

          <p className="mx-auto max-w-2xl text-[16px] leading-[1.5] text-steel font-cosmica">
            StayNEP brings together real-time hotel data, tourism analytics, and
            safety monitoring into one integrated geospatial platform — creating
            an intelligent tourism ecosystem.
          </p>
        </div>

        <div className="mb-20 sm:mb-24">
          <div className="hidden md:flex md:justify-center">
            <EcosystemDiagram />
          </div>
          <div className="md:hidden">
            <MobileEcosystem />
          </div>
        </div>

        <div
          data-gsap-stagger
          className="grid grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {metrics.map((metric) => (
            <div
              key={metric.label}
              data-gsap-stagger-item
              className="group relative overflow-hidden rounded-[36px] border border-fog bg-snow p-8 text-center transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div className="text-[40px] font-bold leading-none text-obsidian font-cosmica">
                {metric.value}
              </div>
              <div className="mt-2 text-[13px] font-medium uppercase tracking-wider text-steel font-cosmica">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
