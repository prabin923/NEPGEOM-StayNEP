import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  BedDouble,
  Calendar,
  Users,
  UtensilsCrossed,
  Package,
  Sparkles,
  UserCog,
  Clock,
  Wallet,
  FileText,
  BarChart3,
  Bell,
  Settings,
  Star,
} from "lucide-react";

export interface HotelNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface HotelNavGroup {
  title: string;
  items: HotelNavItem[];
}

export const HOTEL_NAV_GROUPS: HotelNavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard/hotel", icon: LayoutDashboard }],
  },
  {
    title: "Operations",
    items: [
      { label: "Rooms", href: "/dashboard/hotel/rooms", icon: BedDouble },
      { label: "Bookings", href: "/dashboard/hotel/bookings", icon: Calendar },
      { label: "Guests", href: "/dashboard/hotel/guests", icon: Users },
      { label: "Dining", href: "/dashboard/hotel/dining", icon: UtensilsCrossed },
      { label: "Inventory", href: "/dashboard/hotel/inventory", icon: Package },
      { label: "Housekeeping", href: "/dashboard/hotel/housekeeping", icon: Sparkles },
    ],
  },
  {
    title: "People & Finance",
    items: [
      { label: "Staff", href: "/dashboard/hotel/staff", icon: UserCog },
      { label: "Attendance", href: "/dashboard/hotel/attendance", icon: Clock },
      { label: "Payroll", href: "/dashboard/hotel/payroll", icon: Wallet },
      { label: "Invoices", href: "/dashboard/hotel/invoices", icon: FileText },
    ],
  },
  {
    title: "Analytics & Control",
    items: [
      { label: "Reports", href: "/dashboard/hotel/reports", icon: BarChart3 },
      { label: "Reviews", href: "/dashboard/hotel/reviews", icon: Star },
      { label: "Notifications", href: "/dashboard/hotel/notifications", icon: Bell },
      { label: "Settings", href: "/dashboard/hotel/settings", icon: Settings },
    ],
  },
];
