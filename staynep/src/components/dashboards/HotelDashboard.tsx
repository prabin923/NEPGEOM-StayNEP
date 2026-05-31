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
import { PORTALS } from "@/lib/roles";
import {
  hotelStats,
  recentBookings,
  roomInventory,
  occupancyTrend,
  revenueBySource,
} from "@/data/saas-hotel";

const accent = PORTALS.hotel.accent;
const PIE_COLORS = ["#3B82F6", "#C9A24A", "#6B7280"];

export default function HotelDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-400">Property dashboard</p>
        <h2 className="text-2xl font-bold text-white">Fishtail Lodge — Pokhara</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PortalStatCard
          icon={TrendingUp}
          value={`${hotelStats.occupancyRate}%`}
          label="Occupancy rate"
          accent={accent}
          change="+6% vs last week"
        />
        <PortalStatCard
          icon={BedDouble}
          value={`${hotelStats.availableRooms}/${hotelStats.totalRooms}`}
          label="Rooms available"
          accent={accent}
        />
        <PortalStatCard
          icon={Calendar}
          value={String(hotelStats.todayBookings)}
          label="Bookings today"
          accent={accent}
        />
        <PortalStatCard
          icon={DollarSign}
          value={hotelStats.monthlyRevenue}
          label="Revenue (MTD)"
          accent={accent}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="analytics" className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 font-semibold text-white">Occupancy trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={occupancyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: "#0D1B3E",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
              <Line type="monotone" dataKey="occupancy" stroke={accent} strokeWidth={2.5} dot={{ fill: accent }} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 font-semibold text-white">Revenue by channel</h3>
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
              <Tooltip
                contentStyle={{
                  background: "#0D1B3E",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            {revenueBySource.map((s, i) => (
              <span key={s.source} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                {s.source} ({s.value}%)
              </span>
            ))}
          </div>
        </section>
      </div>

      <section id="rooms" className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-4 font-semibold text-white">Room inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-500">
                <th className="pb-3 pr-4 font-medium">Room type</th>
                <th className="pb-3 pr-4 font-medium">Available</th>
                <th className="pb-3 pr-4 font-medium">Total</th>
                <th className="pb-3 font-medium">Rate / night</th>
              </tr>
            </thead>
            <tbody>
              {roomInventory.map((room) => (
                <tr key={room.type} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-medium text-white">{room.type}</td>
                  <td className="py-3 pr-4 text-gray-300">{room.available}</td>
                  <td className="py-3 pr-4 text-gray-400">{room.total}</td>
                  <td className="py-3" style={{ color: accent }}>
                    {room.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="bookings" className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-white">Recent bookings</h3>
          <Users className="h-4 w-4 text-gray-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-500">
                <th className="pb-3 pr-4 font-medium">ID</th>
                <th className="pb-3 pr-4 font-medium">Guest</th>
                <th className="pb-3 pr-4 font-medium">Room</th>
                <th className="pb-3 pr-4 font-medium">Check-in</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b.id} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-mono text-xs text-gray-400">{b.id}</td>
                  <td className="py-3 pr-4 text-white">{b.guest}</td>
                  <td className="py-3 pr-4 text-gray-300">{b.room}</td>
                  <td className="py-3 pr-4 text-gray-400">{b.checkIn}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        b.status === "checked-in"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : b.status === "confirmed"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="guests" className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-4 font-semibold text-white">Guest volume (weekly)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={occupancyTrend.map((w) => ({ ...w, guests: Math.round(w.occupancy * 1.1) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "#0D1B3E",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
              }}
            />
            <Bar dataKey="guests" fill={accent} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
