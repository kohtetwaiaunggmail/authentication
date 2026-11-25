import type { QueryResultRow } from "pg";
import { getPool } from "@/lib/db";

export type EmployeeRole = "employee" | "admin";

export type Employee = {
  employeeId: string;
  employeeName: string;
  role: EmployeeRole;
  createdAt: Date;
};

type EmployeeRow = QueryResultRow & {
  employee_id: string;
  employee_name: string;
  role: EmployeeRole;
  created_at: Date;
};

type LoginEmployeeRow = EmployeeRow & { password_hash: string };

export async function findEmployeeForLogin(employeeId: string) {
  const result = await getPool().query<LoginEmployeeRow>(
    `SELECT employee_id, employee_name, password_hash, role, created_at
     FROM employees WHERE employee_id = $1`,
    [employeeId],
  );

  return result.rows[0] ?? null;
}

export async function findEmployee(employeeId: string): Promise<Employee | null> {
  const result = await getPool().query<EmployeeRow>(
    `SELECT employee_id, employee_name, role, created_at
     FROM employees WHERE employee_id = $1`,
    [employeeId],
  );

  const row = result.rows[0];
  if (!row) return null;

  return {
    employeeId: row.employee_id,
    employeeName: row.employee_name,
    role: row.role,
    createdAt: row.created_at,
  };
}

export async function listEmployees(): Promise<Employee[]> {
  const result = await getPool().query<EmployeeRow>(
    `SELECT employee_id, employee_name, role, created_at
     FROM employees ORDER BY created_at DESC, employee_id ASC`,
  );

  return result.rows.map((row) => ({
    employeeId: row.employee_id,
    employeeName: row.employee_name,
    role: row.role,
    createdAt: row.created_at,
  }));
}
