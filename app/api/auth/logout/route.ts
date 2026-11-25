import { NextResponse } from "next/server";
import { expiredSessionCookieOptions, SESSION_COOKIE } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", expiredSessionCookieOptions());
  return response;
}
