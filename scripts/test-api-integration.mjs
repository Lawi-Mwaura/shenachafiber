import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL_UNPOOLED) {
  throw new Error("DATABASE_URL and DATABASE_URL_UNPOOLED are required. Use a disposable branch.");
}

const port = 3101;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  cwd: new URL("..", import.meta.url),
  env: process.env,
  stdio: ["ignore", "pipe", "pipe"],
});
let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/coverage`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Next.js did not start for the integration test.\n${serverOutput.slice(-2_000)}`);
}

let reference;
const sql = neon(process.env.DATABASE_URL_UNPOOLED);
try {
  await waitForServer();
  const response = await fetch(`${baseUrl}/api/leads`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      enquiryKind: "property_meeting",
      location: "Juja town",
      building: "Integration Test Apartments",
      contactRole: "property_manager",
      unitCount: "24",
      name: "Integration Test",
      phone: "0712 345 678",
      whatsapp: "254 733 456 789",
      email: "integration@example.test",
      contactPreference: "whatsapp",
      preferredMeetingTime: "Weekday morning",
      message: "Disposable branch verification; remove after test.",
      consent: true,
      source: "integration_test",
    }),
  });
  const body = await response.json();
  assert.equal(response.status, 201);
  assert.equal(body.saved, true);
  assert.match(body.reference, /^SF-[A-F0-9]{12}$/);
  assert.equal("id" in body, false);
  assert.deepEqual(Object.keys(body).sort(), ["message", "reference", "saved"]);
  reference = body.reference;

  const rows = await sql.query(
    "SELECT enquiry_kind, contact_role, unit_count, phone, whatsapp, consent_granted, consent_at, submitted_at FROM website_leads WHERE public_reference = $1",
    [reference],
  );
  assert.equal(rows.length, 1);
  assert.equal(rows[0].enquiry_kind, "property_meeting");
  assert.equal(rows[0].contact_role, "property_manager");
  assert.equal(rows[0].unit_count, 24);
  assert.equal(rows[0].phone, "+254712345678");
  assert.equal(rows[0].whatsapp, "+254733456789");
  assert.equal(rows[0].consent_granted, true);
  assert.ok(rows[0].consent_at);
  assert.ok(rows[0].submitted_at);
  console.log("API/database integration passed with normalized values, consent timestamps, and public-only response data");
} finally {
  if (reference) await sql.query("DELETE FROM website_leads WHERE public_reference = $1", [reference]);
  server.kill();
}
