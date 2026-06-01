import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Keep middleware bundle small for Vercel Edge:
 * - Avoid importing `next-auth` or Prisma (they bloat the Edge bundle)
 * - Decode the NextAuth JWT cookie payload to read `role`
 */

const DASHBOARD_BASE_BY_ROLE: Record<string, string> = {
  TRAVELER: "/dashboard/traveler",
  HOTEL: "/dashboard/hotel",
  AUTHORITIES: "/dashboard/authorities",
};

const ALLOWED_DASHBOARD_PREFIXES = Object.values(DASHBOARD_BASE_BY_ROLE);

function base64UrlDecodeToString(input: string): string | null {
  try {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
    const decoded = atob(normalized + padding);
    // JWT payload is UTF-8 JSON; this handles multibyte chars.
    return decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string): { role?: string } | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const payloadJson = base64UrlDecodeToString(parts[1]);
  if (!payloadJson) return null;
  try {
    return JSON.parse(payloadJson) as { role?: string };
  } catch {
    return null;
  }
}

function getRoleFromRequest(req: NextRequest): string | null {
  // NextAuth cookie names vary by browser/security settings.
  const candidates = [
    "__Secure-next-auth.session-token",
    "__Host-next-auth.session-token",
    "next-auth.session-token",
  ];
  const token =
    candidates.map((name) => req.cookies.get(name)?.value).find(Boolean) ??
    null;
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  const role = payload?.role;
  return typeof role === "string" && DASHBOARD_BASE_BY_ROLE[role]
    ? role
    : null;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const userRole = getRoleFromRequest(req);
  const isLoggedIn = !!userRole;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isDashboard = pathname.startsWith("/dashboard");

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL(DASHBOARD_BASE_BY_ROLE[userRole as string] ?? "/dashboard", req.url)
    );
  }

  if (!isDashboard) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/dashboard") {
    return NextResponse.next();
  }

  const matched = ALLOWED_DASHBOARD_PREFIXES.find((base) =>
    pathname.startsWith(base)
  );

  if (matched) {
    const requiredRole =
      Object.entries(DASHBOARD_BASE_BY_ROLE).find(([, base]) => base === matched)
        ?.at(0) ?? null;

    if (requiredRole && requiredRole !== userRole) {
      return NextResponse.redirect(
        new URL(DASHBOARD_BASE_BY_ROLE[userRole as string] ?? "/dashboard", req.url)
      );
    } 
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
