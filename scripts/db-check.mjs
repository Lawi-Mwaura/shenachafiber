import { neon } from "@neondatabase/serverless";

const pooledUrl = process.env.DATABASE_URL;
const directUrl = process.env.DATABASE_URL_UNPOOLED;

if (!pooledUrl || !directUrl) {
  throw new Error("DATABASE_URL and DATABASE_URL_UNPOOLED are required");
}

const pooledHost = new URL(pooledUrl).hostname;
const directHost = new URL(directUrl).hostname;

if (!pooledHost.includes("-pooler")) {
  throw new Error("DATABASE_URL must use the pooled Neon endpoint");
}

if (directHost.includes("-pooler")) {
  throw new Error("DATABASE_URL_UNPOOLED must use the direct Neon endpoint");
}

const pooled = neon(pooledUrl);
const direct = neon(directUrl);

const [ping, table, columns] = await Promise.all([
  pooled.query("SELECT 1 AS ok"),
  direct.query("SELECT to_regclass('public.website_leads')::text AS table_name"),
  direct.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'website_leads'"),
]);

const requiredColumns = [
  "public_reference",
  "service",
  "enquiry_kind",
  "location",
  "name",
  "phone",
  "consent_granted",
  "consent_at",
  "submitted_at",
];
const availableColumns = new Set(columns.map(({ column_name: columnName }) => columnName));
const missingColumns = requiredColumns.filter((column) => !availableColumns.has(column));

if (ping[0]?.ok !== 1 || table[0]?.table_name !== "website_leads" || missingColumns.length) {
  throw new Error(`Neon schema check failed${missingColumns.length ? `; missing columns: ${missingColumns.join(", ")}` : ""}`);
}

console.log(JSON.stringify({
  pooledConnection: true,
  directConnection: true,
  websiteLeadsTable: true,
  columnCount: columns.length,
}));
