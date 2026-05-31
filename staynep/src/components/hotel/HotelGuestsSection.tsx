"use client";

import { Users } from "lucide-react";
import { PortalSectionTitle, portalTableHead, portalTableRow } from "@/components/portal/PortalUI";
import {
  formatGuestLastStay,
  formatGuestSpent,
  type GuestProfile,
} from "@/lib/hotel-guests";

interface HotelGuestsSectionProps {
  guests: GuestProfile[];
}

export default function HotelGuestsSection({ guests }: HotelGuestsSectionProps) {
  return (
    <div className="space-y-6">
      <PortalSectionTitle
        title="Guest directory"
        subtitle="Unique guests from your booking history"
        icon={Users}
      />
      {guests.length === 0 ? (
        <p className="text-sm text-steel">No guests yet. Create a booking to add guests.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className={portalTableHead}>
                <th className="pb-3 pr-4">Guest</th>
                <th className="pb-3 pr-4">Stays</th>
                <th className="pb-3 pr-4">Total spent</th>
                <th className="pb-3 pr-4">Last room</th>
                <th className="pb-3">Last stay</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => (
                <tr key={g.key} className={portalTableRow}>
                  <td className="py-3 pr-4">
                    <p className="font-medium text-ink">{g.name}</p>
                    {g.email && <p className="text-xs text-steel">{g.email}</p>}
                  </td>
                  <td className="py-3 pr-4 text-graphite">{g.stays}</td>
                  <td className="py-3 pr-4 font-medium text-obsidian">
                    {formatGuestSpent(g.totalSpent)}
                  </td>
                  <td className="py-3 pr-4 text-steel">{g.lastRoom}</td>
                  <td className="py-3 text-steel">{formatGuestLastStay(g.lastStay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
