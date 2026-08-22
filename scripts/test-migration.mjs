import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { runMigration } from "./migrate.mjs";

const databaseUrl = process.env.NEON_TEST_DATABASE_URL;
if (!databaseUrl) throw new Error("NEON_TEST_DATABASE_URL is required. Use a disposable test database; no production database was changed.");

const suffix = randomBytes(5).toString("hex");
const emptyTable = `website_leads_empty_${suffix}`;
const legacyTable = `website_leads_legacy_${suffix}`;
const sql = neon(databaseUrl);
const migration = await readFile(new URL("../migrations/001_website_leads.sql", import.meta.url), "utf8");

function forTable(table) {
  return migration
    .replaceAll("website_leads_public_reference_idx", `${table}_reference_idx`)
    .replaceAll("website_leads", table);
}

try {
  await runMigration(databaseUrl, forTable(emptyTable));
  await runMigration(databaseUrl, forTable(emptyTable));

  await sql.query(`CREATE TABLE ${legacyTable} (
    id BIGSERIAL PRIMARY KEY, service TEXT NOT NULL, selected_plan TEXT, location TEXT NOT NULL,
    name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT, user_count INTEGER, property_type TEXT,
    contact_preference TEXT, notes TEXT, consent_at TIMESTAMPTZ NOT NULL, source TEXT NOT NULL DEFAULT 'website',
    utm JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  await sql.query(`INSERT INTO ${legacyTable} (service, location, name, phone, notes, consent_at) VALUES ('internet', 'Kilimani', 'Migration Test', '+254712345678', 'legacy message', NOW())`);
  await runMigration(databaseUrl, forTable(legacyTable));
  await runMigration(databaseUrl, forTable(legacyTable));

  const emptyColumns = await sql.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${emptyTable}'`);
  const legacyRows = await sql.query(`SELECT public_reference, message, consent_granted, submitted_at FROM ${legacyTable}`);
  const names = new Set(emptyColumns.map((row) => row.column_name));
  for (const required of ["public_reference", "building", "message", "consent_granted", "submitted_at"]) {
    if (!names.has(required)) throw new Error(`Empty-table migration is missing ${required}`);
  }
  if (!legacyRows[0]?.public_reference || legacyRows[0].message !== "legacy message" || legacyRows[0].consent_granted !== true || !legacyRows[0].submitted_at) {
    throw new Error("Legacy-table migration did not preserve and backfill the expected data");
  }
  console.log("migration passed for empty and legacy tables, including repeat execution");
} finally {
  await sql.query(`DROP TABLE IF EXISTS ${emptyTable}`);
  await sql.query(`DROP TABLE IF EXISTS ${legacyTable}`);
}
