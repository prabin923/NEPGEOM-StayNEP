import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const DASHBOARD_BASE_BY_ROLE: Record<string, string> = {
  TRAVELER: "/dashboard/traveler",
  HOTEL: "/dashboard/hotel",
  AUTHORITIES: "/dashboard/authorities",
};

const ALLOWED_DASHBOARD_PREFIXES = Object.values(DASHBOARD_BASE_BY_ROLE);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const userRole = req.auth?.user?.role;
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
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
