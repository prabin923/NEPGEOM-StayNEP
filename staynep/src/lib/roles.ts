import type { LucideIcon } from "lucide-react";
import {
  MapPin,
  Compass,
  Building2,
  Shield,
  LayoutDashboard,
  Calendar,
  Heart,
  Bell,
  BedDouble,
  Users,
  BarChart3,
  FileText,
  AlertTriangle,
  Globe,
} from "lucide-react";

export type PortalRole = "traveler" | "hotel" | "authorities";

export interface PortalNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface PortalConfig {
  role: PortalRole;
  title: string;
  subtitle: string;
  basePath: string;
  accent: string;
  accentMuted: string;
  nav: PortalNavItem[];
}

export const PORTALS: Record<PortalRole, PortalConfig> = {
  traveler: {
    role: "traveler",
    title: "Traveler Portal",
    subtitle: "Discover Nepal, book stays, stay safe",
    basePath: "/dashboard/traveler",
    accent: "#09090b",
    accentMuted: "rgba(9,9,11,0.06)",
    nav: [
      { label: "Overview", href: "/dashboard/traveler", icon: LayoutDashboard },
      { label: "Explore Map", href: "/dashboard/traveler#map", icon: MapPin },
      { label: "My Trips", href: "/dashboard/traveler#trips", icon: Compass },
      { label: "Saved Places", href: "/dashboard/traveler#saved", icon: Heart },
      { label: "Alerts", href: "/dashboard/traveler#alerts", icon: Bell },
    ],
  },
  hotel: {
    role: "hotel",
    title: "Hotel Partner",
    subtitle: "Manage inventory, bookings & occupancy",
    basePath: "/dashboard/hotel",
    accent: "#3f3f46",
    accentMuted: "rgba(63,63,70,0.08)",
    nav: [
      { label: "Overview", href: "/dashboard/hotel", icon: LayoutDashboard },
      { label: "Rooms", href: "/dashboard/hotel#rooms", icon: BedDouble },
      { label: "Bookings", href: "/dashboard/hotel#bookings", icon: Calendar },
      { label: "Guests", href: "/dashboard/hotel#guests", icon: Users },
      { label: "Analytics", href: "/dashboard/hotel#analytics", icon: BarChart3 },
    ],
  },
  authorities: {
    role: "authorities",
    title: "Tourism Authority",
    subtitle: "National tourism intelligence & policy",
    basePath: "/dashboard/authorities",
    accent: "#52525b",
    accentMuted: "rgba(82,82,91,0.08)",
    nav: [
      { label: "Overview", href: "/dashboard/authorities", icon: LayoutDashboard },
      { label: "Regional Intel", href: "/dashboard/authorities#regions", icon: Globe },
      { label: "Safety Network", href: "/dashboard/authorities#safety", icon: Shield },
      { label: "Reports", href: "/dashboard/authorities#reports", icon: FileText },
      { label: "Incidents", href: "/dashboard/authorities#incidents", icon: AlertTriangle },
    ],
  },
};

export const PORTAL_LIST: PortalConfig[] = [
  PORTALS.traveler,
  PORTALS.hotel,
  PORTALS.authorities,
];
