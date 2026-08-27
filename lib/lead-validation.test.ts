import { describe, expect, it } from "vitest";
import { MAX_LEAD_BODY_BYTES, normaliseKenyanPhone, readLeadJson, validateLead } from "./lead-validation";

const common = { location: " Juja ", name: " Jane   Wanjiku ", phone: "0712 345 678", consent: true, source: "test" };
const journeys = {
  fibre_availability: { ...common, enquiryKind: "fibre_availability", building: "Acacia Court", unitNumber: "B4", whatsapp: "+254 112 345 678", selectedPlan: "10 Mbps - KSh 1,500/month" },
  property_meeting: { ...common, enquiryKind: "property_meeting", building: "Acacia Court", unitCount: "24", contactRole: "property_manager", whatsapp: "0712345678", contactPreference: "email", email: "manager@example.com", preferredMeetingTime: "Weekday morning" },
  cctv_quote: { ...common, enquiryKind: "cctv_quote", location: "Nakuru", propertyType: "commercial_property", contactPreference: "call" },
  biometric_quote: { ...common, enquiryKind: "biometric_quote", location: "Mombasa", propertyType: "office", contactPreference: "whatsapp" },
  support: { ...common, enquiryKind: "support", message: "The router has had no WAN light since morning." },
} as const;

describe("validateLead", () => {
  it.each(Object.entries(journeys))("accepts and normalises %s", (_name, draft) => { const result = validateLead(draft); expect(result.ok).toBe(true); if (result.ok) expect(result.lead).toMatchObject({ name: "Jane Wanjiku", phone: "+254712345678" }); });
  it.each([["0712345678", "+254712345678"], ["+254 112 345 678", "+254112345678"], ["254712345678", "+254712345678"], ["712345678", "+254712345678"]])("normalises Kenyan phone %s", (input, expected) => expect(normaliseKenyanPhone(input)).toBe(expected));
  it("normalises a separate WhatsApp number", () => { const result = validateLead(journeys.fibre_availability); if (!result.ok) throw new Error("expected valid lead"); expect(result.lead.whatsapp).toBe("+254112345678"); });
  it("rejects honeypot data", () => expect(validateLead({ ...journeys.cctv_quote, website: "bot.example" })).toMatchObject({ ok: false, reason: "spam" }));
  it("requires fibre building, unit, WhatsApp and package", () => expect(validateLead({ ...journeys.fibre_availability, building: "", unitNumber: "", whatsapp: "", selectedPlan: "" })).toMatchObject({ ok: false, fieldErrors: { building: expect.any(String), unitNumber: expect.any(String), whatsapp: expect.any(String), selectedPlan: expect.any(String) } }));
  it("requires property meeting fields", () => expect(validateLead({ ...journeys.property_meeting, contactRole: "", unitCount: "", preferredMeetingTime: "", contactPreference: "" })).toMatchObject({ ok: false, fieldErrors: { contactRole: expect.any(String), unitCount: expect.any(String), preferredMeetingTime: expect.any(String), contactPreference: expect.any(String) } }));
  it("requires quote fields", () => expect(validateLead({ ...journeys.cctv_quote, propertyType: "", contactPreference: "" })).toMatchObject({ ok: false, fieldErrors: { propertyType: expect.any(String), contactPreference: expect.any(String) } }));
  it("requires email when preferred", () => expect(validateLead({ ...journeys.biometric_quote, contactPreference: "email", email: "" })).toMatchObject({ ok: false, fieldErrors: { email: expect.any(String) } }));
  it("requires a useful support message", () => expect(validateLead({ ...journeys.support, message: "offline" })).toMatchObject({ ok: false, fieldErrors: { message: expect.any(String) } }));
  it("requires explicit consent", () => expect(validateLead({ ...journeys.cctv_quote, consent: false })).toMatchObject({ ok: false, fieldErrors: { consent: expect.any(String) } }));
});

describe("readLeadJson", () => {
  it("rejects invalid JSON", async () => expect(await readLeadJson(new Request("http://test", { method: "POST", body: "{" }))).toEqual({ ok: false, reason: "invalid" }));
  it("rejects oversized bodies", async () => expect(await readLeadJson(new Request("http://test", { method: "POST", body: "x".repeat(MAX_LEAD_BODY_BYTES + 1) }))).toEqual({ ok: false, reason: "too_large" }));
  it("rejects oversized declared content length", async () => expect(await readLeadJson(new Request("http://test", { method: "POST", headers: { "content-length": String(MAX_LEAD_BODY_BYTES + 1) }, body: "{}" }))).toEqual({ ok: false, reason: "too_large" }));
});
