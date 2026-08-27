import type { LeadContactPreference, LeadContactRole, LeadDraft, LeadEnquiryKind, LeadFieldErrors, LeadPropertyType, LeadService } from "./lead";

export const MAX_LEAD_BODY_BYTES = 16_384;

const enquiryKinds = new Set<LeadEnquiryKind>(["fibre_availability", "property_meeting", "cctv_quote", "biometric_quote", "support"]);
const propertyTypes = new Set<LeadPropertyType>(["home", "apartment", "office", "business", "commercial_property", "new_development", "other"]);
const contactPreferences = new Set<LeadContactPreference>(["whatsapp", "call", "email"]);
const contactRoles = new Set<LeadContactRole>(["resident", "landlord", "property_manager", "developer", "building_owner", "business_owner", "other"]);
const serviceForKind: Record<LeadEnquiryKind, LeadService> = {
  fibre_availability: "internet", property_meeting: "internet", cctv_quote: "cctv", biometric_quote: "biometric_access", support: "support",
};

function clean(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f-\u009f]/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function normaliseKenyanPhone(value: unknown) {
  const compact = clean(value, 40).replace(/[\s().-]/g, "");
  let national = compact;
  if (national.startsWith("+254")) national = national.slice(4);
  else if (national.startsWith("254")) national = national.slice(3);
  else if (national.startsWith("0")) national = national.slice(1);
  if (!/^[17]\d{8}$/.test(national)) return null;
  return `+254${national}`;
}

export type NormalisedLead = {
  enquiryKind: LeadEnquiryKind; service: LeadService; selectedPlan: string | null; location: string; building: string | null;
  propertyType: LeadPropertyType | null; contactRole: LeadContactRole | null; unitCount: number | null; unitNumber: string | null;
  name: string; phone: string; whatsapp: string | null; email: string | null; contactPreference: LeadContactPreference | null;
  preferredMeetingTime: string | null; preferredInstallationDate: string | null; message: string | null; consent: true; source: string;
  utm: { source?: string; medium?: string; campaign?: string };
};

export type LeadValidationResult =
  | { ok: true; lead: NormalisedLead }
  | { ok: false; reason: "validation" | "spam"; message: string; fieldErrors?: LeadFieldErrors };

export function validateLead(input: unknown): LeadValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, reason: "validation", message: "Check the highlighted fields and try again." };
  const draft = input as Partial<LeadDraft>;
  if (clean(draft.website, 120)) return { ok: false, reason: "spam", message: "Unable to submit this request." };

  const enquiryKind = clean(draft.enquiryKind, 40) as LeadEnquiryKind;
  const selectedPlan = clean(draft.selectedPlan, 80);
  const location = clean(draft.location, 120);
  const building = clean(draft.building, 120);
  const propertyType = clean(draft.propertyType, 40) as LeadPropertyType;
  const contactRole = clean(draft.contactRole, 40) as LeadContactRole;
  const unitCountText = clean(draft.unitCount, 10);
  const unitNumber = clean(draft.unitNumber, 40);
  const name = clean(draft.name, 100);
  const phone = normaliseKenyanPhone(draft.phone);
  const whatsappInput = clean(draft.whatsapp, 40);
  const whatsapp = whatsappInput ? normaliseKenyanPhone(whatsappInput) : null;
  const email = clean(draft.email, 160).toLowerCase();
  const contactPreference = clean(draft.contactPreference, 40) as LeadContactPreference;
  const preferredMeetingTime = clean(draft.preferredMeetingTime, 100);
  const preferredInstallationDate = clean(draft.preferredInstallationDate, 40);
  const message = clean(draft.message, 1_200);
  const source = clean(draft.source, 80) || "website";
  const unitCount = /^\d{1,5}$/.test(unitCountText) ? Number(unitCountText) : null;
  const fieldErrors: LeadFieldErrors = {};

  if (!enquiryKinds.has(enquiryKind)) fieldErrors.enquiryKind = "Choose the type of enquiry.";
  if (location.length < 2) fieldErrors.location = enquiryKind === "fibre_availability" || enquiryKind === "property_meeting" ? "Enter the property location in Juja." : "Enter the property location.";
  if (name.length < 2) fieldErrors.name = "Enter the contact person's full name.";
  if (!phone) fieldErrors.phone = "Enter a valid Kenyan phone number, such as 0712 345 678.";
  if (whatsappInput && !whatsapp) fieldErrors.whatsapp = "Enter a valid Kenyan WhatsApp number.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email address or leave it blank.";
  if (draft.consent !== true) fieldErrors.consent = "Consent is required before the request can be sent.";

  if (enquiryKind === "fibre_availability") {
    if (building.length < 2) fieldErrors.building = "Enter the apartment or building name.";
    if (!unitNumber) fieldErrors.unitNumber = "Enter the house or unit number.";
    if (!whatsapp) fieldErrors.whatsapp = "Enter a valid WhatsApp number.";
    if (!selectedPlan) fieldErrors.selectedPlan = "Confirm the package you are asking about.";
  }
  if (enquiryKind === "property_meeting") {
    if (building.length < 2) fieldErrors.building = "Enter the apartment or building name.";
    if (!unitCount || unitCount < 1) fieldErrors.unitCount = "Enter the number of units.";
    if (!contactRoles.has(contactRole)) fieldErrors.contactRole = "Choose your role at the property.";
    if (!whatsapp) fieldErrors.whatsapp = "Enter a valid WhatsApp number.";
    if (!contactPreferences.has(contactPreference)) fieldErrors.contactPreference = "Choose WhatsApp, phone call or email.";
    if (contactPreference === "email" && !email) fieldErrors.email = "Enter an email address for email contact.";
    if (!preferredMeetingTime) fieldErrors.preferredMeetingTime = "Enter a preferred meeting time.";
  }
  if (enquiryKind === "cctv_quote" || enquiryKind === "biometric_quote") {
    if (!propertyTypes.has(propertyType)) fieldErrors.propertyType = "Choose the property type.";
    if (!contactPreferences.has(contactPreference)) fieldErrors.contactPreference = "Choose WhatsApp, phone call or email.";
    if (contactPreference === "email" && !email) fieldErrors.email = "Enter an email address for email contact.";
  }
  if (enquiryKind === "support" && message.length < 10) fieldErrors.message = "Describe the problem and when it began.";

  if (Object.keys(fieldErrors).length) return { ok: false, reason: "validation", message: "Check the highlighted fields and try again.", fieldErrors };
  const utmInput = draft.utm && typeof draft.utm === "object" ? draft.utm : {};
  return { ok: true, lead: {
    enquiryKind, service: serviceForKind[enquiryKind], selectedPlan: selectedPlan || null, location, building: building || null,
    propertyType: propertyTypes.has(propertyType) ? propertyType : null, contactRole: contactRoles.has(contactRole) ? contactRole : null,
    unitCount, unitNumber: unitNumber || null, name, phone: phone!, whatsapp, email: email || null,
    contactPreference: contactPreferences.has(contactPreference) ? contactPreference : null,
    preferredMeetingTime: preferredMeetingTime || null, preferredInstallationDate: preferredInstallationDate || null,
    message: message || null, consent: true, source,
    utm: { source: clean(utmInput.source, 100) || undefined, medium: clean(utmInput.medium, 100) || undefined, campaign: clean(utmInput.campaign, 100) || undefined },
  } };
}

export async function readLeadJson(request: Request): Promise<{ ok: true; value: unknown } | { ok: false; reason: "invalid" | "too_large" }> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_LEAD_BODY_BYTES) return { ok: false, reason: "too_large" };
  if (!request.body) return { ok: false, reason: "invalid" };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_LEAD_BODY_BYTES) { await reader.cancel(); return { ok: false, reason: "too_large" }; }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) }; }
  catch { return { ok: false, reason: "invalid" }; }
}
