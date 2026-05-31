import type { BookingWithRoom } from "@/lib/hotel";
import { HOTEL_NAV_GROUPS } from "@/lib/hotel-nav";

export interface HotelSearchItem {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  category: string;
}

export function buildHotelSearchIndex(
  propertyName: string,
  bookings: BookingWithRoom[]
): HotelSearchItem[] {
  const nav: HotelSearchItem[] = HOTEL_NAV_GROUPS.flatMap((g) =>
    g.items.map((item) => ({
      id: `nav-${item.href}`,
      label: item.label,
      sublabel: g.title,
      href: item.href,
      category: "Pages",
    }))
  );

  const guestItems: HotelSearchItem[] = bookings
    .filter((b) => b.status !== "CANCELLED")
    .slice(0, 30)
    .map((b) => ({
      id: `booking-${b.id}`,
      label: b.guestName,
      sublabel: `${b.room.name} · ${b.status.replace("_", " ").toLowerCase()}`,
      href: "/dashboard/hotel/bookings",
      category: "Bookings",
    }));

  const roomNames = [...new Set(bookings.map((b) => b.room.name))];
  const roomItems: HotelSearchItem[] = roomNames.map((name) => ({
    id: `room-${name}`,
    label: name,
    sublabel: "Room type",
    href: "/dashboard/hotel/rooms",
    category: "Rooms",
  }));

  return [...nav, ...guestItems, ...roomItems];
}
