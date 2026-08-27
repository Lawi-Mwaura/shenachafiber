import { afterEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({ calls: [] as unknown[][], fail: false }));
vi.mock("@/lib/db", () => ({ getDatabase: () => async (_strings: TemplateStringsArray, ...values: unknown[]) => { if (db.fail) throw new Error("database unavailable"); db.calls.push(values); return []; } }));
import { POST } from "./route";

const originalDatabaseUrl = process.env.DATABASE_URL;
const valid = { enquiryKind: "fibre_availability", selectedPlan: "10 Mbps - KSh 1,500/month", location: "Juja", building: "Acacia Court", unitNumber: "B4", name: "Jane Wanjiku", phone: "0712 345 678", whatsapp: "0112 345 678", preferredInstallationDate: "2026-09-10", consent: true };
afterEach(() => { if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL; else process.env.DATABASE_URL = originalDatabaseUrl; db.calls.length = 0; db.fail = false; });

describe("POST /api/leads", () => {
  it("returns an honest no-store 503 when storage is missing", async () => { delete process.env.DATABASE_URL; const response = await POST(new Request("http://localhost/api/leads", { method: "POST", body: JSON.stringify(valid) })); expect(response.status).toBe(503); expect(response.headers.get("cache-control")).toBe("no-store"); expect(await response.json()).toMatchObject({ saved: false, reason: "storage_unavailable", message: expect.stringContaining("not sent or stored") }); });
  it("inserts normalised structured values and returns only a public reference", async () => { process.env.DATABASE_URL = "postgresql://test.invalid/example"; const response = await POST(new Request("http://localhost/api/leads", { method: "POST", body: JSON.stringify(valid) })); expect(response.status).toBe(201); expect(response.headers.get("cache-control")).toBe("no-store"); const body = await response.json(); expect(body).toEqual({ saved: true, reference: expect.stringMatching(/^SF-[A-F0-9]{12}$/), message: expect.any(String) }); expect(body).not.toHaveProperty("id"); expect(db.calls).toHaveLength(1); expect(db.calls[0]).toEqual(expect.arrayContaining(["fibre_availability", "+254712345678", "+254112345678", true])); });
  it("returns an honest database error", async () => { process.env.DATABASE_URL = "postgresql://test.invalid/example"; db.fail = true; const response = await POST(new Request("http://localhost/api/leads", { method: "POST", body: JSON.stringify(valid) })); expect(response.status).toBe(503); expect(await response.json()).toMatchObject({ saved: false, reason: "storage_error", message: expect.stringContaining("not sent or stored") }); });
  it("rejects invalid and oversized payloads without storage", async () => { process.env.DATABASE_URL = "postgresql://test.invalid/example"; const invalid = await POST(new Request("http://localhost/api/leads", { method: "POST", body: "{" })); expect(invalid.status).toBe(400); const oversized = await POST(new Request("http://localhost/api/leads", { method: "POST", body: "x".repeat(17000) })); expect(oversized.status).toBe(413); expect(db.calls).toHaveLength(0); });
});
