import { afterEach, describe, expect, it } from "vitest";
import { POST } from "./route";

const originalDatabaseUrl = process.env.DATABASE_URL;
afterEach(() => {
  if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = originalDatabaseUrl;
});

describe("POST /api/leads without storage", () => {
  it("returns an honest no-store 503", async () => {
    delete process.env.DATABASE_URL;
    const response = await POST(new Request("http://localhost/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
      service: "cctv", location: "Kilimani", propertyType: "home", name: "Jane Wanjiku", phone: "0712345678", contactPreference: "whatsapp", consent: true,
    }) }));
    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toMatchObject({ saved: false, reason: "storage_unavailable", message: expect.stringContaining("not sent or stored") });
  });
});
