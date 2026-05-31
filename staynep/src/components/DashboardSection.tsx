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
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#C9A24A]/30 hover:bg-white/[0.08]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C9A24A]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A24A]/10 ring-1 ring-[#C9A24A]/20">
            <Icon className="h-5 w-5 text-[#C9A24A]" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/20">
            <ArrowUpRight className="h-3 w-3" />
            {change}
          </span>
        </div>
        <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
        <p className="mt-1 text-sm text-gray-400">{label}</p>
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
    <div className="rounded-xl border border-white/10 bg-[#0D1B3E]/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="mb-1 text-xs font-medium text-gray-400">{label}</p>
      <p className="text-lg font-bold text-white">
        {payload[0].value.toLocaleString()}
        <span className="ml-1.5 text-xs font-normal text-gray-400">tourists</span>
      </p>
    </div>
  );
}

function BarChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0D1B3E]/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="mb-1 text-xs font-medium text-gray-400">{label}</p>
      <p className="text-lg font-bold text-white">
        {payload[0].value.toLocaleString()}
        <span className="ml-1.5 text-xs font-normal text-gray-400">tourists</span>
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
      className="relative overflow-hidden bg-[#0D1B3E] py-24"
    >
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#C9A24A]/[0.03] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-blue-500/[0.03] blur-3xl" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9A24A]/20 bg-[#C9A24A]/10 px-4 py-1.5">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#C9A24A]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
              Live Analytics
            </span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Tourism Intelligence Dashboard
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Real-time analytics and insights powering smarter tourism decisions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Area Chart - Monthly Tourist Arrivals */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Monthly Tourist Arrivals
                </h3>
                <p className="mt-0.5 text-sm text-gray-400">
                  Visitor trends over the past 12 months
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                <ArrowUpRight className="h-3 w-3" />
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
                    id="goldGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#C9A24A"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="#C9A24A"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value: number) =>
                    value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
                  }
                  dx={-5}
                />
                <Tooltip
                  content={<AreaChartTooltip />}
                  cursor={{
                    stroke: 'rgba(201,162,74,0.2)',
                    strokeWidth: 1,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tourists"
                  stroke="#C9A24A"
                  strokeWidth={2.5}
                  fill="url(#goldGradient)"
                  dot={false}
                  activeDot={{
                    r: 5,
                    fill: '#C9A24A',
                    stroke: '#0D1B3E',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Regional Distribution */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Regional Distribution
                </h3>
                <p className="mt-0.5 text-sm text-gray-400">
                  Tourist traffic by region
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#C9A24A]/10 px-3 py-1 text-xs font-medium text-[#C9A24A] ring-1 ring-[#C9A24A]/20">
                6 Regions
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={regionalData}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="barGoldGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#C9A24A"
                      stopOpacity={0.9}
                    />
                    <stop
                      offset="100%"
                      stopColor="#C9A24A"
                      stopOpacity={0.4}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="region"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  dy={10}
                  interval={0}
                  angle={-20}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value: number) =>
                    value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
                  }
                  dx={-5}
                />
                <Tooltip
                  content={<BarChartTooltip />}
                  cursor={{
                    fill: 'rgba(201,162,74,0.06)',
                    radius: 4,
                  }}
                />
                <Bar
                  dataKey="tourists"
                  fill="url(#barGoldGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
