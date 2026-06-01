'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

export type CounterStat = {
  label: string;
  /** Animate to this number; omit when using `display` */
  value?: number;
  prefix?: string;
  suffix?: string;
  /** Literal value (e.g. "24/7") — no count animation */
  display?: string;
};

function formatCount(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

function formatDisplay(stat: CounterStat, n: number): string {
  const prefix = stat.prefix ?? '';
  const suffix = stat.suffix ?? '';
  return `${prefix}${formatCount(n)}${suffix}`;
}

function AnimatedValue({ stat }: { stat: CounterStat }) {
  const end = stat.value ?? 0;
  const initial = formatDisplay(stat, prefersReducedMotion() ? end : 0);
  const [text, setText] = useState(initial);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (stat.display != null) return;

    if (prefersReducedMotion()) {
      setText(formatDisplay(stat, end));
      return;
    }

    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: end,
        duration: 2,
        ease: 'power2.out',
        delay: 0.55,
        onUpdate: () => setText(formatDisplay(stat, obj.n)),
      });
    }, rootRef);

    return () => ctx.revert();
  }, [stat, end]);

  if (stat.display != null) {
    return <span>{stat.display}</span>;
  }

  return <span ref={rootRef}>{text}</span>;
}

type NumberCounterProps = {
  stats: CounterStat[];
  className?: string;
  itemClassName?: string;
  valueClassName?: string;
  labelClassName?: string;
  /** Passed to each stat cell (e.g. GSAP hooks) */
  itemDataAttrs?: Record<string, string>;
};

export default function NumberCounter({
  stats,
  className = '',
  itemClassName = '',
  valueClassName = '',
  labelClassName = '',
  itemDataAttrs,
}: NumberCounterProps) {
  return (
    <div className={className}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={itemClassName}
          {...(itemDataAttrs
            ? Object.fromEntries(
                Object.entries(itemDataAttrs).map(([k, v]) => [`data-${k}`, v])
              )
            : {})}
        >
          <span className={valueClassName}>
            <AnimatedValue stat={stat} />
          </span>
          <span className={labelClassName}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
