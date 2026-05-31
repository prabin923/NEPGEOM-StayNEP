"use client";

import { BedDouble, Calendar, Users, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import HotelMetricCard from "@/components/hotel/HotelMetricCard";
import type { BusinessDashboardStats, RevenueMonth } from "@/lib/load-hotel-property";
import { formatRs } from "@/lib/hotel";
import { portalChartAxis } from "@/components/portal/PortalUI";

const PIE_COLORS = ["#09090b", "#a1a1aa"];

interface HotelBusinessDashboardProps {
  userName: string;
  business: BusinessDashboardStats;
  revenueTrend: RevenueMonth[];
}

export default function HotelBusinessDashboard({
  userName,
  business,
  revenueTrend,
}: HotelBusinessDashboardProps) {
  const hasRevenue = business.totalRevenue > 0;
  const { roomRevenue, diningRevenue } = business;

  const pieData = hasRevenue
    ? [
        { name: "Rooms", value: roomRevenue },
        { name: "Dining", value: diningRevenue || 0.01 },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-obsidian font-cosmica sm:text-3xl">
          Business Dashboard
        </h1>
        <p className="mt-1 text-sm text-steel">
          Welcome back, {userName} · Monitor your business performance and key
          metrics in real-time.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <HotelMetricCard
          label="Total revenue"
          value={business.totalRevenueLabel}
          subtitle="Rooms + dining combined"
          badge="Live"
        />
        <HotelMetricCard
          label="Bookings"
          value={String(business.bookingsCount)}
          subtitle={`${business.pendingBookings} pending payment`}
          badge={`${business.paidBookings} paid`}
        />
        <HotelMetricCard
          label="Rooms"
          value={String(business.roomListings)}
          subtitle="Active listings"
          icon={BedDouble}
        />
        <HotelMetricCard
          label="Guests"
          value={String(business.guestsCount)}
          subtitle="Registered users"
          icon={Users}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <HotelMetricCard
          label="Current occupancy"
          value={`${business.occupancyRate}%`}
          subtitle={`${business.occupiedUnits} of ${business.totalUnits} rooms occupied`}
          icon={TrendingUp}
        />
        <HotelMetricCard
          label={"Today's arrivals"}
          value={String(business.todayArrivals)}
          subtitle="Check-ins scheduled today"
          icon={Calendar}
        />
        <HotelMetricCard
          label={"Today's departures"}
          value={String(business.todayDepartures)}
          subtitle="Check-outs scheduled today"
          icon={Calendar}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold text-obsidian font-cosmica">
            Revenue trend
          </h2>
          <p className="mt-0.5 text-xs text-steel">
            Room and dining revenue by month (last 12 months)
          </p>
          <div className="mt-6 h-[220px]">
            {revenueTrend.some((m) => m.total > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ececee"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={portalChartAxis.tick}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={portalChartAxis.tick}
                    tickFormatter={(v) => formatRs(Number(v)).replace("Rs", "")}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="rounded-[12px] border border-fog bg-snow px-3 py-2 text-xs shadow-sm">
                          <p className="font-medium text-steel">{label}</p>
                          <p className="text-obsidian font-semibold">
                            {formatRs(Number(payload[0].value))}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#09090b"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center rounded-[12px] border border-dashed border-fog bg-mist/30">
                <svg
                  className="h-24 w-full text-pebble"
                  viewBox="0 0 400 80"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,60 Q50,55 100,58 T200,52 T300,55 T400,50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
          <h2 className="text-base font-semibold text-obsidian font-cosmica">
            Revenue mix
          </h2>
          <p className="mt-0.5 text-xs text-steel">Rooms vs dining (all time)</p>
          <div className="mt-6 flex h-[220px] flex-col items-center justify-center">
            {hasRevenue ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 flex gap-4 text-xs text-steel">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-obsidian" />
                    Rooms{" "}
                    {Math.round(
                      (roomRevenue / (roomRevenue + diningRevenue || 1)) * 100
                    )}
                    %
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-ash" />
                    Dining{" "}
                    {Math.round(
                      (diningRevenue / (roomRevenue + diningRevenue || 1)) * 100
                    )}
                    %
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-steel">No revenue data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
