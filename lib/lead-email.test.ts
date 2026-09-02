import { describe, expect, it } from "vitest";
import { buildLeadNotification } from "./lead-email";
import type { NormalisedLead } from "./lead-validation";

const lead: NormalisedLead = {
  enquiryKind: "fibre_availability", service: "internet", selectedPlan: "10 Mbps", location: "Juja", building: "Acacia Court",
  propertyType: null, contactRole: null, unitCount: null, unitNumber: "B4", name: "Jane Wanjiku", phone: "+254712345678",
  whatsapp: "+254112345678", email: null, contactPreference: null, preferredMeetingTime: null,
  preferredInstallationDate: "2026-09-10", message: null, consent: true, source: "website", utm: {},
};

describe("buildLeadNotification", () => {
  it("formats a readable internal notification", () => {
    const result = buildLeadNotification("SF-ABC123", lead);
    expect(result.subject).toContain("SF-ABC123");
    expect(result.text).toContain("Name: Jane Wanjiku");
    expect(result.text).toContain("Email: Not provided");
    expect(result.text).toContain("Preferred installation date: 2026-09-10");
    expect(result.html).toContain("Shenacha Fiber");
    expect(result.html).toContain("WhatsApp customer");
    expect(result.html).not.toContain("Property type</td>");
  });

  it("escapes customer-provided content in HTML", () => {
    const result = buildLeadNotification("SF-ABC123", { ...lead, message: "<script>alert('no')</script>" });
    expect(result.html).toContain("&lt;script&gt;alert(&#039;no&#039;)&lt;/script&gt;");
    expect(result.html).not.toContain("<script>alert");
  });
});
