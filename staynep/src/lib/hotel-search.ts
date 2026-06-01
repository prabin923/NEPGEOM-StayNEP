import type { BookingWithRoom } from "@/lib/hotel";

/** Hotel admin command palette (⌘K) — not traveler map search */
export type HotelSearchItem = {
  id: string;
  label: string;
  sublabel?: string;
  category: string;
  href: string;
};

const HOTEL_PAGES: HotelSearchItem[] = [
  { id: "page-dashboard", label: "Dashboard", category: "Page", href: "/dashboard/hotel" },
  { id: "page-bookings", label: "Bookings", category: "Page", href: "/dashboard/hotel/bookings" },
  { id: "page-rooms", label: "Rooms", category: "Page", href: "/dashboard/hotel/rooms" },
  { id: "page-dining", label: "Dining", category: "Page", href: "/dashboard/hotel/dining" },
  { id: "page-inventory", label: "Inventory", category: "Page", href: "/dashboard/hotel/inventory" },
  { id: "page-housekeeping", label: "Housekeeping", category: "Page", href: "/dashboard/hotel/housekeeping" },
  { id: "page-staff", label: "Staff", category: "Page", href: "/dashboard/hotel/staff" },
  { id: "page-invoices", label: "Invoices", category: "Page", href: "/dashboard/hotel/invoices" },
  { id: "page-notifications", label: "Notifications", category: "Page", href: "/dashboard/hotel/notifications" },
];

export function buildHotelSearchIndex(
  propertyName: string,
  bookings: BookingWithRoom[]
): HotelSearchItem[] {
  const items: HotelSearchItem[] = [
    {
      id: "property",
      label: propertyName,
      sublabel: "Your property",
      category: "Property",
      href: "/dashboard/hotel",
    },
    ...HOTEL_PAGES,
  ];

  for (const b of bookings.slice(0, 40)) {
    items.push({
      id: `booking-${b.id}`,
      label: b.guestName,
      sublabel: `${b.room.name} · ${b.status}`,
      category: "Booking",
      href: "/dashboard/hotel/bookings",
    });
  }

  return items;
}
