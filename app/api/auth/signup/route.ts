import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

type SignupBody = {
  employeeId?: unknown;
  employeeName?: unknown;
  password?: unknown;
};

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

export async function POST(request: Request) {
  let body: SignupBody;
  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return NextResponse.json({ message: "Enter valid form details." }, { status: 400 });
  }

  const employeeId = typeof body.employeeId === "string" ? body.employeeId.trim().toUpperCase() : "";
  const employeeName = typeof body.employeeName === "string" ? body.employeeName.trim() : "";
  const password = body.password;

  if (!/^FA\d{6}$/.test(employeeId)) {
    return NextResponse.json(
      { message: "Employee ID must be FA followed by exactly 6 digits, such as FA123456." },
      { status: 400 },
    );
  }
  if (employeeName.length < 2 || employeeName.length > 80) {
    return NextResponse.json({ message: "Employee name must be 2 to 80 characters." }, { status: 400 });
  }
  if (
    typeof password !== "string" ||
    password.length < 10 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return NextResponse.json(
      { message: "Password must be at least 10 characters and no more than 72 UTF-8 bytes." },
      { status: 400 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    await getPool().query(
      `INSERT INTO employees (employee_id, employee_name, password_hash, role)
       VALUES ($1, $2, $3, 'employee')`,
      [employeeId, employeeName, passwordHash],
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ message: "That employee ID is already registered." }, { status: 409 });
    }
    console.error("Employee signup failed.", error);
    return NextResponse.json({ message: "Unable to create the account right now." }, { status: 500 });
  }

  const session = await createSession({ employeeId, employeeName, role: "employee" });
  const response = NextResponse.json({ ok: true, redirectTo: "/dashboard" }, { status: 201 });
  response.cookies.set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
  return response;
}
