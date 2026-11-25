import "server-only";

import { redirect } from "next/navigation";
import { findEmployee } from "@/lib/employees";
import type { Employee } from "@/lib/employees";
import { getSession } from "@/lib/session";

export async function requireCurrentEmployee(): Promise<Employee> {
  const session = await getSession();
  if (!session) redirect("/");

  // Check the current database role too, so a role change takes effect even
  // while a previously issued session cookie is still valid.
  const employee = await findEmployee(session.employeeId);
  if (!employee) redirect("/api/auth/refresh");
  if (employee.role !== session.role) redirect("/api/auth/refresh");

  return employee;
}
