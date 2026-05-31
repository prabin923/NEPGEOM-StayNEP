"use client";

import {
  Globe,
  Building2,
  Users,
  AlertTriangle,
  Shield,
  FileText,
  TrendingUp,
} from "lucide-react";
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
} from "recharts";
import PortalStatCard from "@/components/portal/PortalStatCard";
import { PORTALS } from "@/lib/roles";
import {
  authorityStats,
  provinceMetrics,
  nationalTrend,
  incidents,
  policyReports,
} from "@/data/saas-authorities";

const accent = PORTALS.authorities.accent;

export default function AuthoritiesDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-400">Ministry of Culture, Tourism & Civil Aviation</p>
        <h2 className="text-2xl font-bold text-white">National tourism command center</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <PortalStatCard
          icon={Users}
          value={authorityStats.activeTourists.toLocaleString()}
          label="Active tourists"
          accent={accent}
          change="Live estimate"
        />
        <PortalStatCard
          icon={Building2}
          value={authorityStats.registeredHotels.toLocaleString()}
          label="Registered hotels"
          accent={accent}
        />
        <PortalStatCard
          icon={Globe}
          value={String(authorityStats.provincesMonitored)}
          label="Provinces monitored"
          accent={accent}
        />
        <PortalStatCard
          icon={TrendingUp}
          value={`${authorityStats.avgOccupancy}%`}
          label="National occupancy"
          accent={accent}
        />
        <PortalStatCard
          icon={AlertTriangle}
          value={String(authorityStats.openIncidents)}
          label="Open incidents"
          accent={accent}
          change="Needs review"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 font-semibold text-white">Tourist arrivals (national)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={nationalTrend}>
              <defs>
                <linearGradient id="authGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#0D1B3E",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="arrivals"
                stroke={accent}
                fill="url(#authGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        <section id="regions" className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 font-semibold text-white">Regional distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={provinceMetrics} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="province"
                width={80}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#0D1B3E",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
              <Bar dataKey="tourists" fill={accent} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section id="safety" className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" style={{ color: accent }} />
          <h3 className="font-semibold text-white">Province intelligence</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-500">
                <th className="pb-3 pr-4 font-medium">Province</th>
                <th className="pb-3 pr-4 font-medium">Tourists</th>
                <th className="pb-3 pr-4 font-medium">Hotels</th>
                <th className="pb-3 font-medium">Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {provinceMetrics.map((row) => (
                <tr key={row.province} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-medium text-white">{row.province}</td>
                  <td className="py-3 pr-4 text-gray-300">{row.tourists.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-gray-400">{row.hotels}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 max-w-[100px] rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${row.occupancy}%`, backgroundColor: accent }}
                        />
                      </div>
                      <span className="text-gray-400">{row.occupancy}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="incidents" className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 font-semibold text-white">Active incidents</h3>
          <ul className="space-y-3">
            {incidents.map((inc) => (
              <li
                key={inc.id}
                className="rounded-xl border border-white/10 bg-[#0D1B3E]/50 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-white">{inc.title}</p>
                    <p className="text-sm text-gray-500">{inc.region}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      inc.severity === "high"
                        ? "bg-red-500/20 text-red-400"
                        : inc.severity === "medium"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {inc.severity}
                  </span>
                </div>
                <p className="mt-2 text-xs capitalize text-gray-500">Status: {inc.status}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="reports" className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4" style={{ color: accent }} />
            <h3 className="font-semibold text-white">Policy & reports</h3>
          </div>
          <ul className="space-y-2">
            {policyReports.map((report) => (
              <li
                key={report.id}
                className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{report.name}</p>
                  <p className="text-xs text-gray-500">{report.date}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    report.status === "published"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {report.status}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
