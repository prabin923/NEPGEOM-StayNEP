"use client";

import {
  BedDouble,
  Calendar,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
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
  PortalChartTooltip,
  portalChartAxis,
} from "@/components/portal/PortalUI";
import HotelRoomsSection from "@/components/hotel/HotelRoomsSection";
import HotelBookingsSection from "@/components/hotel/HotelBookingsSection";
import type { BookingWithRoom, RoomWithAvailability } from "@/lib/hotel";
import { occupancyTrend } from "@/data/saas-hotel";

export interface HotelDashboardProps {
  propertyName: string;
  stats: {
    occupancyRate: number;
    availableRooms: number;
    totalRooms: number;
    todayBookings: number;
    monthlyRevenueLabel: string;
  };
  rooms: RoomWithAvailability[];
  bookings: BookingWithRoom[];
}

export default function HotelDashboard({
  propertyName,
  stats,
  rooms,
  bookings,
}: HotelDashboardProps) {
  return (
    <div className="space-y-8">
      <PortalPageHeader eyebrow="Property dashboard" title={propertyName} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PortalStatCard
          icon={TrendingUp}
          value={`${stats.occupancyRate}%`}
          label="Occupancy rate"
          change={stats.totalRooms > 0 ? "Live" : undefined}
        />
        <PortalStatCard
          icon={BedDouble}
          value={`${stats.availableRooms}/${stats.totalRooms}`}
          label="Rooms available today"
        />
        <PortalStatCard
          icon={Calendar}
          value={String(stats.todayBookings)}
          label="Check-ins today"
        />
        <PortalStatCard
          icon={DollarSign}
          value={stats.monthlyRevenueLabel}
          label="Revenue (MTD)"
        />
      </div>

      <PortalCard id="rooms" variant="snow">
        <HotelRoomsSection rooms={rooms} />
      </PortalCard>

      <PortalCard id="bookings" variant="mist">
        <HotelBookingsSection bookings={bookings} rooms={rooms} />
      </PortalCard>

      {stats.totalRooms > 0 && (
        <PortalCard id="analytics" variant="snow">
          <p className="mb-4 text-sm font-semibold text-ink font-cosmica">
            Occupancy trend (sample)
          </p>
          <ResponsiveContainer width="100%" height={200}>
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
      )}
    </div>
  );
}
