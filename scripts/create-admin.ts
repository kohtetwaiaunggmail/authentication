import bcrypt from "bcryptjs";
import { loadEnvConfig } from "@next/env";
import { getPool } from "../lib/db";

async function main() {
  loadEnvConfig(process.cwd());
  const employeeId = process.env.ADMIN_EMPLOYEE_ID?.trim().toUpperCase();
  const employeeName = process.env.ADMIN_EMPLOYEE_NAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!employeeId || !/^FA\d{6}$/.test(employeeId)) {
    throw new Error("ADMIN_EMPLOYEE_ID must use the format FA followed by 6 digits.");
  }
  if (!employeeName || employeeName.length < 2 || employeeName.length > 80) {
    throw new Error("ADMIN_EMPLOYEE_NAME must contain 2 to 80 characters.");
  }
  if (!password || password.length < 10 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters and at most 72 UTF-8 bytes.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await getPool().query(
    `INSERT INTO employees (employee_id, employee_name, password_hash, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (employee_id) DO UPDATE SET
       employee_name = EXCLUDED.employee_name,
       password_hash = EXCLUDED.password_hash,
       role = 'admin'`,
    [employeeId, employeeName, passwordHash],
  );

  console.log(`Admin account ${employeeId} is ready.`);
  await getPool().end();
}

main().catch((error: unknown) => {
  console.error("Could not create admin account:", error);
  process.exitCode = 1;
});
