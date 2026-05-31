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
import {
  PortalPageHeader,
  PortalCard,
  PortalSectionTitle,
  PortalInnerCard,
  PortalChartTooltip,
  portalChartAxis,
  StatusBadge,
  portalTableHead,
  portalTableRow,
} from "@/components/portal/PortalUI";
import {
  authorityStats,
  provinceMetrics,
  nationalTrend,
  incidents,
  policyReports,
} from "@/data/saas-authorities";
import TouristLocationsMap from "@/components/map/TouristLocationsMap";
import type { TouristMapMarker } from "@/lib/traveler-locations";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";

interface AuthoritiesDashboardProps {
  tourists?: TouristMapMarker[];
  registeredHotels?: RegisteredHotelMarker[];
}

export default function AuthoritiesDashboard({
  tourists = [],
  registeredHotels = [],
}: AuthoritiesDashboardProps) {
  return (
    <div className="space-y-8">
      <PortalPageHeader
        eyebrow="Ministry of Culture, Tourism & Civil Aviation"
        title="National tourism command center"
      />

      <PortalCard id="tourist-map" variant="snow">
        <PortalSectionTitle
          title="Live traveler map"
          subtitle="GPS locations shared by signed-in StayNEP travelers across Nepal"
          icon={Globe}
        />
        <TouristLocationsMap
          initialTourists={tourists}
          initialHotels={registeredHotels}
          defaultFilter="all"
        />
      </PortalCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <PortalStatCard
          icon={Users}
          value={String(tourists.length || authorityStats.activeTourists)}
          label="Travelers on map"
          change="Live"
        />
        <PortalStatCard
          icon={Building2}
          value={String(
            registeredHotels.length || authorityStats.registeredHotels
          )}
          label="Registered hotels"
        />
        <PortalStatCard
          icon={Globe}
          value={String(authorityStats.provincesMonitored)}
          label="Provinces monitored"
        />
        <PortalStatCard
          icon={TrendingUp}
          value={`${authorityStats.avgOccupancy}%`}
          label="National occupancy"
        />
        <PortalStatCard
          icon={AlertTriangle}
          value={String(authorityStats.openIncidents)}
          label="Open incidents"
          change="Review"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PortalCard variant="mist">
          <PortalSectionTitle title="Tourist arrivals (national)" />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={nationalTrend}>
              <defs>
                <linearGradient id="authGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#09090b" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#09090b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ececee" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={portalChartAxis.tick} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={portalChartAxis.tick}
                tickFormatter={(v) => `${(Number(v) / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<PortalChartTooltip unit="tourists" />} />
              <Area
                type="monotone"
                dataKey="arrivals"
                stroke="#09090b"
                fill="url(#authGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </PortalCard>

        <PortalCard id="regions" variant="snow">
          <PortalSectionTitle title="Regional distribution" icon={Globe} />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={provinceMetrics} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ececee" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={portalChartAxis.tick} />
              <YAxis
                type="category"
                dataKey="province"
                width={88}
                axisLine={false}
                tickLine={false}
                tick={portalChartAxis.tick}
              />
              <Tooltip content={<PortalChartTooltip unit="tourists" />} />
              <Bar dataKey="tourists" fill="#09090b" radius={[0, 4, 4, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </PortalCard>
      </div>

      <PortalCard id="safety" variant="snow">
        <PortalSectionTitle title="Province intelligence" icon={Shield} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={portalTableHead}>
                <th className="pb-3 pr-4">Province</th>
                <th className="pb-3 pr-4">Tourists</th>
                <th className="pb-3 pr-4">Hotels</th>
                <th className="pb-3">Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {provinceMetrics.map((row) => (
                <tr key={row.province} className={portalTableRow}>
                  <td className="py-3 pr-4 font-medium text-ink">{row.province}</td>
                  <td className="py-3 pr-4 text-graphite">
                    {row.tourists.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-steel">{row.hotels}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 max-w-[100px] flex-1 rounded-full bg-fog">
                        <div
                          className="h-full rounded-full bg-obsidian"
                          style={{ width: `${row.occupancy}%` }}
                        />
                      </div>
                      <span className="text-steel">{row.occupancy}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PortalCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <PortalCard id="incidents" variant="mist">
          <PortalSectionTitle title="Active incidents" icon={AlertTriangle} />
          <ul className="space-y-3">
            {incidents.map((inc) => (
              <PortalInnerCard key={inc.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-ink">{inc.title}</p>
                    <p className="text-sm text-steel">{inc.region}</p>
                  </div>
                  <StatusBadge
                    tone={
                      inc.severity === "high"
                        ? "warning"
                        : inc.severity === "medium"
                          ? "info"
                          : "neutral"
                    }
                  >
                    {inc.severity}
                  </StatusBadge>
                </div>
                <p className="mt-2 text-xs capitalize text-steel">Status: {inc.status}</p>
              </PortalInnerCard>
            ))}
          </ul>
        </PortalCard>

        <PortalCard id="reports" variant="snow">
          <PortalSectionTitle title="Policy & reports" icon={FileText} />
          <ul className="space-y-2">
            {policyReports.map((report) => (
              <li
                key={report.id}
                className="flex items-center justify-between rounded-[12px] border border-fog bg-mist px-3 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{report.name}</p>
                  <p className="text-xs text-steel">{report.date}</p>
                </div>
                <StatusBadge tone={report.status === "published" ? "success" : "neutral"}>
                  {report.status}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </PortalCard>
      </div>
    </div>
  );
}
