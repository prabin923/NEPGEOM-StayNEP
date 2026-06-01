"use client";

import type { AuthorityLiveStats } from "@/lib/tourist-reports";

function RingIndicator({
  value,
  label,
  gradient,
  size = 80,
}: {
  value: number;
  label: string;
  gradient: [string, string];
  size?: number;
}) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, value > 0 ? Math.min(value * 4, 100) : 0);
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient
              id={`ring-${label}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={gradient[0]} />
              <stop offset="100%" stopColor={gradient[1]} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--c-fog, #ececee)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#ring-${label})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="relative flex h-3 w-3">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"
              style={{ backgroundColor: gradient[0] }}
            />
            <span
              className="relative inline-flex h-3 w-3 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
              }}
            />
          </span>
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight text-ink tabular-nums font-cosmica">
        {value}
      </p>
      <p className="text-xs text-steel font-cosmica">{label}</p>
    </div>
  );
}

export default function AuthoritiesActivityFunnel({
  stats,
}: {
  stats: AuthorityLiveStats;
}) {
  const exploring = stats.travelersOnMap;
  const booking = Math.max(0, Math.floor(stats.travelersOnMap * 0.35));
  const checkedIn = Math.max(0, stats.resolvedThisMonth);

  return (
    <div className="rounded-[16px] border border-fog bg-snow px-6 py-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink font-cosmica">
          Tourist activity
        </p>
        <span className="rounded-md border border-fog bg-mist px-2 py-0.5 text-xs text-steel font-cosmica">
          Live
        </span>
      </div>
      <div className="mt-6 flex items-center justify-around">
        <RingIndicator
          value={exploring}
          label="Exploring"
          gradient={["#67e8f9", "#06b6d4"]}
        />
        <RingIndicator
          value={booking}
          label="Booking"
          gradient={["#f0abfc", "#d946ef"]}
        />
        <RingIndicator
          value={checkedIn}
          label="Checked-in"
          gradient={["#93c5fd", "#3b82f6"]}
        />
      </div>
    </div>
  );
}
