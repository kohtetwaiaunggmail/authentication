import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { findEmployee } from "@/lib/employees";
import {
  createSession,
  expiredSessionCookieOptions,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifySessionToken,
} from "@/lib/session-token";

export async function GET(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const employee = await findEmployee(session.employeeId);
    if (!employee) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.set(SESSION_COOKIE, "", expiredSessionCookieOptions());
      return response;
    }

    const refreshedSession = await createSession({
      employeeId: employee.employeeId,
      employeeName: employee.employeeName,
      role: employee.role,
    });
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.cookies.set(
      SESSION_COOKIE,
      refreshedSession.token,
      sessionCookieOptions(refreshedSession.expiresAt),
    );
    return response;
  } catch (error) {
    console.error("Session refresh failed.", error);
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set(SESSION_COOKIE, "", expiredSessionCookieOptions());
    return response;
  }
}
