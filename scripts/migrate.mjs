import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

export function splitStatements(source) {
  return source.split(/;\s*(?:\r?\n|$)/).map((statement) => statement.trim()).filter(Boolean);
}

export async function runMigration(databaseUrl, source) {
  const sql = neon(databaseUrl);
  for (const statement of splitStatements(source)) await sql.query(statement);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.env.DATABASE_URL_UNPOOLED) throw new Error("DATABASE_URL_UNPOOLED is required. No migration was run.");
  for (const file of ["001_website_leads.sql", "002_structured_enquiries.sql"]) {
    const migrationUrl = new URL(`../migrations/${file}`, import.meta.url);
    await runMigration(process.env.DATABASE_URL_UNPOOLED, await readFile(migrationUrl, "utf8"));
  }
  console.log("website_leads migrations completed");
}
