import { describe, expect, it } from "vitest";
import { MAX_LEAD_BODY_BYTES, normaliseKenyanPhone, readLeadJson, validateLead } from "./lead-validation";

const validLead = {
  service: "internet",
  selectedPlan: "  20 Mbps  ",
  location: "  Kilimani\n Nairobi ",
  building: " Acacia\u0000 Court ",
  propertyType: "apartment",
  userCount: "4",
  message: " Remote\twork ",
  name: " Jane   Wanjiku ",
  phone: "0712 345 678",
  email: " JANE@EXAMPLE.COM ",
  contactPreference: "whatsapp",
  consent: true,
  source: "test",
};

describe("validateLead", () => {
  it("normalises a valid submission", () => {
    const result = validateLead(validLead);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.lead).toMatchObject({ location: "Kilimani Nairobi", building: "Acacia Court", name: "Jane Wanjiku", phone: "+254712345678", email: "jane@example.com", userCount: 4 });
  });

  it.each([
    ["0712345678", "+254712345678"],
    ["+254 112 345 678", "+254112345678"],
    ["254712345678", "+254712345678"],
    ["712345678", "+254712345678"],
  ])("normalises Kenyan phone %s", (input, expected) => expect(normaliseKenyanPhone(input)).toBe(expected));

  it("rejects honeypot data", () => expect(validateLead({ ...validLead, website: "bot.example" })).toMatchObject({ ok: false, reason: "spam" }));
  it("rejects bad enums", () => expect(validateLead({ ...validLead, service: "other", propertyType: "castle", contactPreference: "email" })).toMatchObject({ ok: false, fieldErrors: { service: expect.any(String), propertyType: expect.any(String), contactPreference: expect.any(String) } }));
  it("rejects a bad phone and email", () => expect(validateLead({ ...validLead, phone: "123", email: "bad@" })).toMatchObject({ ok: false, fieldErrors: { phone: expect.any(String), email: expect.any(String) } }));
  it("requires user count conditionally", () => {
    expect(validateLead({ ...validLead, userCount: "" })).toMatchObject({ ok: false, fieldErrors: { userCount: expect.any(String) } });
    expect(validateLead({ ...validLead, service: "cctv", userCount: "" }).ok).toBe(true);
  });
  it("requires location and property type", () => expect(validateLead({ ...validLead, location: "", propertyType: "" })).toMatchObject({ ok: false, fieldErrors: { location: expect.any(String), propertyType: expect.any(String) } }));
  it("requires an explicit contact preference", () => expect(validateLead({ ...validLead, contactPreference: "" })).toMatchObject({ ok: false, fieldErrors: { contactPreference: expect.any(String) } }));
  it("requires explicit consent", () => expect(validateLead({ ...validLead, consent: false })).toMatchObject({ ok: false, fieldErrors: { consent: expect.any(String) } }));
});

describe("readLeadJson", () => {
  it("rejects invalid JSON", async () => expect(await readLeadJson(new Request("http://test", { method: "POST", body: "{" }))).toEqual({ ok: false, reason: "invalid" }));
  it("rejects oversized bodies", async () => expect(await readLeadJson(new Request("http://test", { method: "POST", body: "x".repeat(MAX_LEAD_BODY_BYTES + 1) }))).toEqual({ ok: false, reason: "too_large" }));
});
