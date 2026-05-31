"use client";

import dynamic from "next/dynamic";
import {
  Compass,
  Heart,
  Shield,
  MapPin,
  Calendar,
  Bell,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PortalStatCard from "@/components/portal/PortalStatCard";
import { PORTALS } from "@/lib/roles";
import {
  travelerStats,
  upcomingTrips,
  savedPlaces,
  travelerAlerts,
  exploreActivity,
} from "@/data/saas-traveler";
import { hotels } from "@/data/hotels";
import { attractions } from "@/data/attractions";
import { emergencyServices } from "@/data/emergency";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-xl bg-white/5 text-gray-400">
      Loading map…
    </div>
  ),
});

const accent = PORTALS.traveler.accent;

export default function TravelerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-400">Welcome back</p>
        <h2 className="text-2xl font-bold text-white">Your Nepal journey</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PortalStatCard icon={Compass} value={String(travelerStats.upcomingTrips)} label="Upcoming trips" accent={accent} change="+1 new" />
        <PortalStatCard icon={Heart} value={String(travelerStats.savedPlaces)} label="Saved places" accent={accent} />
        <PortalStatCard icon={MapPin} value={String(travelerStats.completedTrips)} label="Trips completed" accent={accent} />
        <PortalStatCard icon={Shield} value={`${travelerStats.safetyScore}%`} label="Safety score" accent={accent} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="trips" className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-white">Upcoming trips</h3>
            <Calendar className="h-4 w-4 text-gray-500" />
          </div>
          <ul className="space-y-3">
            {upcomingTrips.map((trip) => (
              <li
                key={trip.id}
                className="rounded-xl border border-white/10 bg-[#0D1B3E]/50 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-white">{trip.destination}</p>
                    <p className="text-sm text-gray-400">{trip.hotel}</p>
                    <p className="mt-1 text-xs text-gray-500">{trip.dates}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      trip.status === "confirmed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 font-semibold text-white">Exploration activity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={exploreActivity}>
              <defs>
                <linearGradient id="travelerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#0D1B3E",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                }}
              />
              <Area type="monotone" dataKey="visits" stroke={accent} fill="url(#travelerGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </section>
      </div>

      <section id="map" className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Explore nearby</h3>
            <p className="text-sm text-gray-400">Hotels, attractions & emergency services</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: accent }}
          >
            Full map <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <LeafletMap
          hotels={hotels}
          attractions={attractions}
          emergencyServices={emergencyServices}
          filter="all"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section id="saved" className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 font-semibold text-white">Saved places</h3>
          <ul className="space-y-2">
            {savedPlaces.map((place) => (
              <li
                key={place.id}
                className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-white">{place.name}</p>
                  <p className="text-xs text-gray-500">{place.district}</p>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-400">
                  {place.type}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section id="alerts" className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4" style={{ color: accent }} />
            <h3 className="font-semibold text-white">Travel alerts</h3>
          </div>
          <ul className="space-y-3">
            {travelerAlerts.map((alert) => (
              <li
                key={alert.id}
                className="rounded-xl border border-white/10 bg-[#0D1B3E]/50 p-3"
              >
                <p className="text-sm text-gray-200">{alert.message}</p>
                <p className="mt-1 text-xs text-gray-500">{alert.time}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
