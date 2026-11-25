import { Pool } from "pg";

declare global {
  // Reuse one pool during local hot reloads.
  var employeePortalPool: Pool | undefined;
}

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.employeePortalPool) {
    globalThis.employeePortalPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    });
  }

  return globalThis.employeePortalPool;
}
