import type { Role } from "@prisma/client";
import { PORTALS, type PortalRole } from "@/lib/roles";

export function portalRoleToPrisma(role: PortalRole): Role {
  const map: Record<PortalRole, Role> = {
    traveler: "TRAVELER",
    hotel: "HOTEL",
    authorities: "AUTHORITIES",
  };
  return map[role];
}

export function prismaRoleToPortal(role: Role): PortalRole {
  const map: Record<Role, PortalRole> = {
    TRAVELER: "traveler",
    HOTEL: "hotel",
    AUTHORITIES: "authorities",
  };
  return map[role];
}

export function dashboardPathForRole(role: Role): string {
  return PORTALS[prismaRoleToPortal(role)].basePath;
}

export function roleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    TRAVELER: "Traveler",
    HOTEL: "Hotel Partner",
    AUTHORITIES: "Tourism Authority",
  };
  return labels[role];
}

export function roleMeta(role: Role): string {
  const meta: Record<Role, string> = {
    TRAVELER: "Traveler · Free plan",
    HOTEL: "Hotel Partner · Pro",
    AUTHORITIES: "Government · Enterprise",
  };
  return meta[role];
}
