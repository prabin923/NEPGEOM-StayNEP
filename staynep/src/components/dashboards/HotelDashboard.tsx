"use client";

import {
  BedDouble,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
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
import PortalStatCard from "@/components/portal/PortalStatCard";
import {
  PortalPageHeader,
  PortalCard,
  PortalSectionTitle,
  PortalChartTooltip,
  portalChartAxis,
  StatusBadge,
  portalTableHead,
  portalTableRow,
} from "@/components/portal/PortalUI";
import {
  hotelStats,
  recentBookings,
  roomInventory,
  occupancyTrend,
  revenueBySource,
} from "@/data/saas-hotel";

const PIE_COLORS = ["#09090b", "#71717a", "#d4d4d8"];

export default function HotelDashboard() {
  return (
    <div className="space-y-8">
      <PortalPageHeader
        eyebrow="Property dashboard"
        title="Fishtail Lodge — Pokhara"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PortalStatCard
          icon={TrendingUp}
          value={`${hotelStats.occupancyRate}%`}
          label="Occupancy rate"
          change="+6%"
        />
        <PortalStatCard
          icon={BedDouble}
          value={`${hotelStats.availableRooms}/${hotelStats.totalRooms}`}
          label="Rooms available"
        />
        <PortalStatCard
          icon={Calendar}
          value={String(hotelStats.todayBookings)}
          label="Bookings today"
        />
        <PortalStatCard
          icon={DollarSign}
          value={hotelStats.monthlyRevenue}
          label="Revenue (MTD)"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PortalCard id="analytics" variant="mist">
          <PortalSectionTitle title="Occupancy trend" />
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={occupancyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ececee" vertical={false} />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={portalChartAxis.tick} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={portalChartAxis.tick}
                domain={[0, 100]}
              />
              <Tooltip content={<PortalChartTooltip unit="%" />} />
              <Line
                type="monotone"
                dataKey="occupancy"
                stroke="#09090b"
                strokeWidth={2.5}
                dot={{ fill: "#09090b", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </PortalCard>

        <PortalCard variant="snow">
          <PortalSectionTitle title="Revenue by channel" />
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={revenueBySource}
                dataKey="value"
                nameKey="source"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {revenueBySource.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PortalChartTooltip unit="%" />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-steel">
            {revenueBySource.map((s, i) => (
              <span key={s.source} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: PIE_COLORS[i] }}
                />
                {s.source} ({s.value}%)
              </span>
            ))}
          </div>
        </PortalCard>
      </div>

      <PortalCard id="rooms" variant="snow">
        <PortalSectionTitle title="Room inventory" icon={BedDouble} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={portalTableHead}>
                <th className="pb-3 pr-4">Room type</th>
                <th className="pb-3 pr-4">Available</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3">Rate / night</th>
              </tr>
            </thead>
            <tbody>
              {roomInventory.map((room) => (
                <tr key={room.type} className={portalTableRow}>
                  <td className="py-3 pr-4 font-medium text-ink">{room.type}</td>
                  <td className="py-3 pr-4 text-graphite">{room.available}</td>
                  <td className="py-3 pr-4 text-steel">{room.total}</td>
                  <td className="py-3 font-medium text-obsidian">{room.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PortalCard>

      <PortalCard id="bookings" variant="mist">
        <PortalSectionTitle title="Recent bookings" icon={Users} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={portalTableHead}>
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Guest</th>
                <th className="pb-3 pr-4">Room</th>
                <th className="pb-3 pr-4">Check-in</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className={portalTableRow}>
                  <td className="py-3 pr-4 font-mono text-xs text-steel">{b.id}</td>
                  <td className="py-3 pr-4 text-ink">{b.guest}</td>
                  <td className="py-3 pr-4 text-graphite">{b.room}</td>
                  <td className="py-3 pr-4 text-steel">{b.checkIn}</td>
                  <td className="py-3">
                    <StatusBadge
                      tone={
                        b.status === "checked-in"
                          ? "success"
                          : b.status === "confirmed"
                            ? "info"
                            : "warning"
                      }
                    >
                      {b.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PortalCard>

      <PortalCard id="guests" variant="snow">
        <PortalSectionTitle title="Guest volume (weekly)" />
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={occupancyTrend.map((w) => ({
              ...w,
              guests: Math.round(w.occupancy * 1.1),
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ececee" vertical={false} />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={portalChartAxis.tick} />
            <YAxis axisLine={false} tickLine={false} tick={portalChartAxis.tick} />
            <Tooltip content={<PortalChartTooltip />} />
            <Bar dataKey="guests" fill="#09090b" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      </PortalCard>
    </div>
  );
}
