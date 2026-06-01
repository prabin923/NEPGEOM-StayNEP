import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { portalRoleToPrisma } from "@/lib/auth-helpers";
import type { PortalRole } from "@/lib/roles";

export type GoogleProfile = {
  email: string;
  name?: string | null;
  image?: string | null;
};

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

/** Link or create a user from Google OAuth. */
export async function upsertUserFromGoogle(
  profile: GoogleProfile,
  options?: {
    role?: PortalRole;
    organization?: string;
  }
) {
  const email = profile.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        name: existing.name || profile.name || email.split("@")[0],
        image: profile.image ?? existing.image,
      },
    });
  }

  const role: Role = options?.role
    ? portalRoleToPrisma(options.role)
    : "TRAVELER";
  const organization = options?.organization?.trim() || null;
  const name = profile.name?.trim() || email.split("@")[0];

  return prisma.user.create({
    data: {
      email,
      name,
      image: profile.image ?? null,
      role,
      organization,
      passwordHash: null,
      ...(role === "HOTEL" && organization
        ? {
            property: {
              create: {
                name: organization,
                district: "Nepal",
              },
            },
          }
        : {}),
    },
  });
}

export function parseSignupRoleCookie(
  value: string | undefined
): PortalRole | undefined {
  if (value === "traveler" || value === "hotel" || value === "authorities") {
    return value;
  }
  return undefined;
}
