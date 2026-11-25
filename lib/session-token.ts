import { jwtVerify, SignJWT } from "jose";
import { addSeconds, getUnixTime, subSeconds } from "date-fns";
import type { EmployeeRole } from "@/lib/employees";

export const SESSION_COOKIE = "employee_portal_session";
const DEFAULT_SESSION_TIMEOUT_SECONDS = 60;
const MAX_SESSION_TIMEOUT_SECONDS = 30 * 24 * 60 * 60;
const SESSION_ISSUER = "employee-auth-portal";

export type SessionUser = {
  employeeId: string;
  employeeName: string;
  role: EmployeeRole;
};

function getSigningKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

export function getSessionTimeoutSeconds() {
  const configuredTimeout = process.env.SESSION_TIMEOUT_SECONDS;
  if (!configuredTimeout) return DEFAULT_SESSION_TIMEOUT_SECONDS;

  const timeoutSeconds = Number(configuredTimeout);
  if (
    !Number.isSafeInteger(timeoutSeconds) ||
    timeoutSeconds < 1 ||
    timeoutSeconds > MAX_SESSION_TIMEOUT_SECONDS
  ) {
    throw new Error("SESSION_TIMEOUT_SECONDS must be an integer between 1 and 2592000.");
  }

  return timeoutSeconds;
}

export async function createSession(user: SessionUser) {
  const issuedAt = new Date();
  const expiresAt = addSeconds(issuedAt, getSessionTimeoutSeconds());
  const token = await new SignJWT({
    employeeId: user.employeeId,
    employeeName: user.employeeName,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_ISSUER)
    .setSubject(user.employeeId)
    .setIssuedAt(getUnixTime(issuedAt))
    .setExpirationTime(getUnixTime(expiresAt))
    .sign(getSigningKey());

  return { token, expiresAt };
}

export async function verifySessionToken(token?: string | null): Promise<SessionUser | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSigningKey(), {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_ISSUER,
    });

    const employeeId = payload.employeeId;
    const employeeName = payload.employeeName;
    const role = payload.role;

    if (
      typeof employeeId !== "string" ||
      !/^FA\d{6}$/.test(employeeId) ||
      typeof employeeName !== "string" ||
      (role !== "employee" && role !== "admin")
    ) {
      return null;
    }

    return { employeeId, employeeName, role };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(expiresAt: Date) {
  const maxAge = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / 1000));

  return {
    expires: expiresAt,
    maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export function expiredSessionCookieOptions() {
  return {
    expires: subSeconds(new Date(), 1),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
