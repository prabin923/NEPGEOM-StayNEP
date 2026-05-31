import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { dashboardPathForRole } from "@/lib/auth-helpers";

export async function requireRole(allowedRole: Role) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== allowedRole) {
    redirect(dashboardPathForRole(session.user.role));
  }

  return session;
}
