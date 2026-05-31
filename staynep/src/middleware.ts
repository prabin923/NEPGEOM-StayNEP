import { auth } from "@/lib/auth";
import { dashboardPathForRole, prismaRoleToPortal } from "@/lib/auth-helpers";
import { PORTALS } from "@/lib/roles";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const isLoggedIn = !!session?.user;

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isDashboard = pathname.startsWith("/dashboard");

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL(dashboardPathForRole(session.user.role), req.url)
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

  const userRole = session.user.role;
  const userPortal = prismaRoleToPortal(userRole);

  if (pathname === "/dashboard") {
    return NextResponse.next();
  }

  const allowedPrefixes = Object.values(PORTALS).map((p) => p.basePath);
  const matched = allowedPrefixes.find((base) => pathname.startsWith(base));

  if (matched) {
    const requiredPortal = Object.entries(PORTALS).find(
      ([, config]) => config.basePath === matched
    )?.[0];

    if (requiredPortal && requiredPortal !== userPortal) {
      return NextResponse.redirect(
        new URL(dashboardPathForRole(userRole), req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
