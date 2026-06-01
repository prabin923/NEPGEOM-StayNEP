"use client";

import {
  Globe,
  AlertTriangle,
  FileText,
  Shield,
  ChevronDown,
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
import {
  PortalCard,
  PortalSectionTitle,
  PortalChartTooltip,
  portalChartAxis,
  StatusBadge,
  portalTableHead,
  portalTableRow,
} from "@/components/portal/PortalUI";
import {
  provinceMetrics,
  nationalTrend,
  policyReports,
} from "@/data/saas-authorities";
import TouristLocationsMap from "@/components/map/TouristLocationsMap";
import AuthoritiesIncidentBoard from "@/components/authorities/AuthoritiesIncidentBoard";
import AuthoritiesMinistryHero from "@/components/authorities/AuthoritiesMinistryHero";
import AuthoritiesKpiStrip from "@/components/authorities/AuthoritiesKpiStrip";
import AuthoritiesAnalyticsCards from "@/components/authorities/AuthoritiesAnalyticsCards";
import AuthoritiesActivityFunnel from "@/components/authorities/AuthoritiesActivityFunnel";
import AuthoritiesMapLegend from "@/components/authorities/AuthoritiesMapLegend";
import type { TouristMapMarker } from "@/lib/traveler-locations";
import type { RegisteredHotelMarker } from "@/lib/registered-hotels";
import type { ReportMapMarker } from "@/lib/report-map-markers";
import type { TrafficCorridor } from "@/lib/map-traffic";
import type { CatalogMapHotel, MapHotelReview } from "@/lib/map-hotels";
import type {
  AuthorityLiveStats,
  TouristReportWithReporter,
  TransparencySnapshot,
} from "@/lib/tourist-reports";

interface AuthoritiesDashboardProps {
  tourists?: TouristMapMarker[];
  registeredHotels?: RegisteredHotelMarker[];
  reportMarkers?: ReportMapMarker[];
  trafficCorridors?: TrafficCorridor[];
  catalogHotels?: CatalogMapHotel[];
  recentReviews?: MapHotelReview[];
  reports?: TouristReportWithReporter[];
  transparency?: TransparencySnapshot;
  liveStats?: AuthorityLiveStats;
}

export default function AuthoritiesDashboard({
  tourists = [],
  registeredHotels = [],
  reportMarkers = [],
  trafficCorridors = [],
  catalogHotels,
  recentReviews = [],
  reports = [],
  transparency,
  liveStats,
}: AuthoritiesDashboardProps) {
  const stats = liveStats ?? {
    travelersOnMap: tourists.length,
    registeredHotels: registeredHotels.length,
    openReports: 0,
    criticalOpen: 0,
    resolvedThisMonth: 0,
    avgResolutionHours: null,
  };

  const openIncidents = reports.filter(
    (r) => r.status !== "RESOLVED" && r.status !== "DISMISSED"
  );

  return (
    <div className="space-y-6">
      {/* ── Shopify-style Header ── */}
      <AuthoritiesMinistryHero
        travelersOnMap={stats.travelersOnMap}
        openReports={stats.openReports}
        criticalOpen={stats.criticalOpen}
      />

      {/* ── Two-Column Layout: Stats + Map ── */}
      <div className="grid gap-6 lg:grid-cols-[minmax(320px,_1fr)_2fr]">
        {/* Left Column: Stats + Analytics */}
        <div className="space-y-4">
          {/* 2×2 Stat Cards */}
          <AuthoritiesKpiStrip stats={stats} />

          {/* Stacked Analytics Cards */}
          <AuthoritiesAnalyticsCards
            stats={stats}
            transparency={transparency}
          />

          {/* Tourist Activity Funnel */}
          <AuthoritiesActivityFunnel stats={stats} />
        </div>

        {/* Right Column: Map */}
        <div className="rounded-[20px] border border-fog bg-snow p-4">
          <AuthoritiesMapLegend />
          <div className="mt-3">
            <TouristLocationsMap
              initialTourists={tourists}
              initialHotels={registeredHotels}
              initialReports={reportMarkers}
              initialTraffic={trafficCorridors}
              initialCatalogHotels={catalogHotels}
              initialRecentReviews={recentReviews}
              defaultFilter="all"
              variant="ministry"
              showTouristCount
            />
          </div>
        </div>
      </div>

      {/* ── Incident Triage Desk ── */}
      <PortalCard id="incidents" variant="mist" className="!p-6 sm:!p-8">
        <PortalSectionTitle
          title="Incident triage desk"
          subtitle="Assign agencies, update status, and document resolutions for traveler reports"
          icon={AlertTriangle}
          action={
            openIncidents.length > 0 ? (
              <div className="flex items-center gap-2">
                {stats.criticalOpen > 0 && (
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                    {stats.criticalOpen} critical
                  </span>
                )}
                <span className="rounded-full border border-fog bg-snow px-3 py-1 text-xs font-medium text-graphite">
                  {openIncidents.length} in queue
                </span>
              </div>
            ) : (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                Queue clear
              </span>
            )
          }
        />
        <AuthoritiesIncidentBoard reports={reports} />
      </PortalCard>

      {/* ── Collapsible Reference Data ── */}
      <details
        id="reference"
        className="group rounded-[28px] border border-fog bg-fog/50"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
          <div>
            <p className="text-sm font-semibold text-ink">
              National reference &amp; policy data
            </p>
            <p className="mt-0.5 text-xs text-steel">
              Illustrative benchmarks — expand for arrivals, regions, and
              reports
            </p>
          </div>
          <ChevronDown className="h-5 w-5 shrink-0 text-steel transition group-open:rotate-180" />
        </summary>
        <div className="space-y-6 border-t border-fog px-4 pb-6 pt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <PortalCard variant="snow">
              <PortalSectionTitle title="Tourist arrivals (national)" />
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={nationalTrend}>
                  <defs>
                    <linearGradient
                      id="authGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#09090b"
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="100%"
                        stopColor="#09090b"
                        stopOpacity={0}
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
                    tick={portalChartAxis.tick}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={portalChartAxis.tick}
                    tickFormatter={(v) =>
                      `${(Number(v) / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip
                    content={<PortalChartTooltip unit="tourists" />}
                  />
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

            <PortalCard variant="mist">
              <PortalSectionTitle
                title="Regional distribution"
                icon={Globe}
              />
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={provinceMetrics}
                  layout="vertical"
                  margin={{ left: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ececee"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={portalChartAxis.tick}
                  />
                  <YAxis
                    type="category"
                    dataKey="province"
                    width={84}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#71717a" }}
                  />
                  <Tooltip
                    content={<PortalChartTooltip unit="tourists" />}
                  />
                  <Bar
                    dataKey="tourists"
                    fill="#52525b"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </PortalCard>
          </div>

          <PortalCard variant="snow" className="mt-6">
            <PortalSectionTitle
              title="Province intelligence"
              icon={Shield}
            />
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
                      <td className="py-3 pr-4 font-medium text-ink">
                        {row.province}
                      </td>
                      <td className="py-3 pr-4 text-graphite tabular-nums">
                        {row.tourists.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-steel tabular-nums">
                        {row.hotels}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 max-w-[88px] flex-1 rounded-full bg-fog">
                            <div
                              className="h-full rounded-full bg-obsidian"
                              style={{ width: `${row.occupancy}%` }}
                            />
                          </div>
                          <span className="text-xs text-steel tabular-nums">
                            {row.occupancy}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PortalCard>

          <PortalCard variant="mist" className="mt-6">
            <PortalSectionTitle
              title="Policy &amp; reports"
              icon={FileText}
            />
            <ul className="grid gap-2 sm:grid-cols-2">
              {policyReports.map((report) => (
                <li
                  key={report.id}
                  className="flex items-center justify-between rounded-[12px] border border-fog bg-snow px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {report.name}
                    </p>
                    <p className="text-xs text-steel">{report.date}</p>
                  </div>
                  <StatusBadge
                    tone={
                      report.status === "published"
                        ? "success"
                        : "neutral"
                    }
                  >
                    {report.status}
                  </StatusBadge>
                </li>
              ))}
            </ul>
          </PortalCard>
        </div>
      </details>
    </div>
  );
}
