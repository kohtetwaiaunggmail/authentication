import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadEnvConfig } from "@next/env";
import { getPool } from "../lib/db";

async function main() {
  loadEnvConfig(process.cwd());
  const schema = await readFile(resolve(process.cwd(), "database/schema.sql"), "utf8");
  await getPool().query(schema);
  console.log("PostgreSQL table is ready.");
  await getPool().end();
}

main().catch((error: unknown) => {
  console.error("Could not initialize the database:", error);
  process.exitCode = 1;
});
