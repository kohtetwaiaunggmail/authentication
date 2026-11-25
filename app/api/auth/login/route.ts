import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { findEmployeeForLogin } from "@/lib/employees";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

type LoginBody = {
  employeeId?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ message: "Enter your employee ID and password." }, { status: 400 });
  }

  const employeeId = typeof body.employeeId === "string" ? body.employeeId.trim().toUpperCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (
    !/^FA\d{6}$/.test(employeeId) ||
    password.length === 0 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return NextResponse.json({ message: "Employee ID or password is incorrect." }, { status: 401 });
  }

  try {
    const employee = await findEmployeeForLogin(employeeId);
    const passwordMatches = employee ? await bcrypt.compare(password, employee.password_hash) : false;

    if (!employee || !passwordMatches) {
      return NextResponse.json({ message: "Employee ID or password is incorrect." }, { status: 401 });
    }

    const session = await createSession({
      employeeId: employee.employee_id,
      employeeName: employee.employee_name,
      role: employee.role,
    });
    const response = NextResponse.json({ ok: true, redirectTo: "/dashboard" });
    response.cookies.set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
    return response;
  } catch (error) {
    console.error("Employee login failed.", error);
    return NextResponse.json({ message: "Unable to sign in right now." }, { status: 500 });
  }
}
