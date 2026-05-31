'use client';

import {
  Building2,
  BedDouble,
  MapPin,
  Compass,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  dashboardStats,
  monthlyTouristData,
  regionalData,
} from '@/data/dashboard';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  change: string;
}

function StatCard({ icon: Icon, value, label, change }: StatCardProps) {
  return (
    <div data-gsap-stagger-item className="group relative rounded-[28px] bg-fog p-6">
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-snow">
            <Icon className="h-5 w-5 text-graphite" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-snow px-2.5 py-1 text-xs font-medium text-obsidian border border-fog">
            <ArrowUpRight className="h-3 w-3 text-obsidian" />
            {change}
          </span>
        </div>
        <p className="text-[28px] font-bold tracking-tight text-obsidian font-cosmica leading-none">{value}</p>
        <p className="mt-2 text-[13px] text-steel font-cosmica">{label}</p>
      </div>
    </div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function AreaChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[12px] border border-fog bg-snow/95 px-4 py-3 shadow-sm backdrop-blur-md">
      <p className="mb-1 text-xs font-medium text-steel font-cosmica">{label}</p>
      <p className="text-lg font-bold text-obsidian font-cosmica">
        {payload[0].value.toLocaleString()}
        <span className="ml-1.5 text-xs font-normal text-steel"> tourists</span>
      </p>
    </div>
  );
}

function BarChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[12px] border border-fog bg-snow/95 px-4 py-3 shadow-sm backdrop-blur-md">
      <p className="mb-1 text-xs font-medium text-steel font-cosmica">{label}</p>
      <p className="text-lg font-bold text-obsidian font-cosmica">
        {payload[0].value.toLocaleString()}
        <span className="ml-1.5 text-xs font-normal text-steel"> tourists</span>
      </p>
    </div>
  );
}

const statCards: StatCardProps[] = [
  {
    icon: Building2,
    value: dashboardStats.totalHotels.toLocaleString(),
    label: 'Total Hotels',
    change: '+12%',
  },
  {
    icon: BedDouble,
    value: dashboardStats.availableRooms.toLocaleString(),
    label: 'Available Rooms',
    change: '+8%',
  },
  {
    icon: MapPin,
    value: dashboardStats.touristHotspots.toString(),
    label: 'Tourist Hotspots',
    change: '+23%',
  },
  {
    icon: Compass,
    value: dashboardStats.activeDestinations.toString(),
    label: 'Active Destinations',
    change: '+5%',
  },
  {
    icon: TrendingUp,
    value: `${dashboardStats.occupancyRate}%`,
    label: 'Occupancy Rate',
    change: '+3.2%',
  },
];

export default function DashboardSection() {
  return (
    <section
      id="dashboard"
      className="relative bg-snow rounded-[36px] mx-4 lg:mx-8 py-16 px-6 lg:px-12 my-8 border border-fog"
    >
      <div className="relative z-10 mx-auto max-w-[1200px]">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-fog px-4 py-1.5 text-[12px] font-medium text-graphite">
            <div className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-obsidian" />
            Live Analytics
          </div>
          <h2 className="text-[32px] font-bold tracking-tight text-obsidian font-cosmica leading-none">
            Tourism Intelligence Dashboard
          </h2>
          <p className="mx-auto mt-4 text-[16px] text-steel font-cosmica max-w-xl">
            Real-time analytics and insights powering smarter tourism decisions
          </p>
        </div>

        {/* Stats Grid */}
        <div
          data-gsap-stagger
          className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {statCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Area Chart - Monthly Tourist Arrivals */}
          <div data-gsap-chart className="rounded-[28px] bg-mist p-6 border border-fog">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-semibold text-ink font-cosmica">
                  Monthly Tourist Arrivals
                </h3>
                <p className="mt-1 text-[14px] text-steel font-cosmica">
                  Visitor trends over the past 12 months
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-snow px-3 py-1 text-[12px] font-medium text-obsidian border border-fog">
                18.2% YoY
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={monthlyTouristData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="obsidianGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#09090b"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor="#09090b"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ececee"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'var(--font-cosmica)' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'var(--font-cosmica)' }}
                  tickFormatter={(value: number) =>
                    value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
                  }
                  dx={-5}
                />
                <Tooltip
                  content={<AreaChartTooltip />}
                  cursor={{
                    stroke: 'rgba(9,9,11,0.1)',
                    strokeWidth: 1.5,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tourists"
                  stroke="#09090b"
                  strokeWidth={2.5}
                  fill="url(#obsidianGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: '#09090b',
                    stroke: '#ffffff',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Regional Distribution */}
          <div data-gsap-chart className="rounded-[28px] bg-mist p-6 border border-fog">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-semibold text-ink font-cosmica">
                  Regional Distribution
                </h3>
                <p className="mt-1 text-[14px] text-steel font-cosmica">
                  Tourist traffic by region
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-snow px-3 py-1 text-[12px] font-medium text-obsidian border border-fog">
                6 Regions
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={regionalData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#ececee"
                  vertical={false}
                />
                <XAxis
                  dataKey="region"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a1aa', fontSize: 10, fontFamily: 'var(--font-cosmica)' }}
                  dy={10}
                  interval={0}
                  angle={-15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'var(--font-cosmica)' }}
                  tickFormatter={(value: number) =>
                    value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
                  }
                  dx={-5}
                />
                <Tooltip
                  content={<BarChartTooltip />}
                  cursor={{
                    fill: 'rgba(9,9,11,0.02)',
                  }}
                />
                <Bar
                  dataKey="tourists"
                  fill="#09090b"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
