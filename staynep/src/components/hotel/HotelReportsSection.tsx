import { BarChart3 } from "lucide-react";
import HotelMetricCard from "@/components/hotel/HotelMetricCard";
import type { BusinessDashboardStats } from "@/lib/load-hotel-property";
import { formatRs } from "@/lib/hotel";

interface HotelReportsSectionProps {
  business: BusinessDashboardStats;
  diningOrderCount: number;
  inventoryCount: number;
  openTasks: number;
  staffCount: number;
  unpaidInvoices: number;
}

export default function HotelReportsSection({
  business,
  diningOrderCount,
  inventoryCount,
  openTasks,
  staffCount,
  unpaidInvoices,
}: HotelReportsSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-obsidian font-cosmica">Reports</h1>
        <p className="mt-1 text-sm text-steel">
          Snapshot of property performance across operations and finance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <HotelMetricCard
          label="Room revenue"
          value={formatRs(business.roomRevenue)}
          subtitle="From active bookings"
        />
        <HotelMetricCard
          label="Dining revenue"
          value={formatRs(business.diningRevenue)}
          subtitle={`${diningOrderCount} orders recorded`}
        />
        <HotelMetricCard
          label="Occupancy"
          value={`${business.occupancyRate}%`}
          subtitle={`${business.occupiedUnits} / ${business.totalUnits} units`}
        />
        <HotelMetricCard
          label="Inventory items"
          value={String(inventoryCount)}
          subtitle="Tracked stock lines"
        />
        <HotelMetricCard
          label="Open housekeeping"
          value={String(openTasks)}
          subtitle="Tasks not completed"
        />
        <HotelMetricCard
          label="Team size"
          value={String(staffCount)}
          subtitle={`${unpaidInvoices} unpaid invoices`}
        />
      </div>

      <div className="rounded-[16px] border border-fog bg-snow p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-graphite" />
          <h2 className="text-base font-semibold text-obsidian font-cosmica">Booking summary</h2>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <dt className="text-steel">Total bookings</dt>
            <dd className="mt-1 text-xl font-bold text-obsidian">{business.bookingsCount}</dd>
          </div>
          <div>
            <dt className="text-steel">Paid / confirmed</dt>
            <dd className="mt-1 text-xl font-bold text-obsidian">{business.paidBookings}</dd>
          </div>
          <div>
            <dt className="text-steel">Pending payment</dt>
            <dd className="mt-1 text-xl font-bold text-obsidian">{business.pendingBookings}</dd>
          </div>
          <div>
            <dt className="text-steel">Unique guests</dt>
            <dd className="mt-1 text-xl font-bold text-obsidian">{business.guestsCount}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
