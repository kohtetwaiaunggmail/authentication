import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/") {
    return session
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.next();
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return session
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/", request.url));
  }

  const legacyDashboard =
    pathname === "/admin" || pathname.startsWith("/admin/") ||
    pathname === "/employee" || pathname.startsWith("/employee/");

  if (legacyDashboard) {
    return session
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/employee/:path*", "/admin/:path*"],
};
