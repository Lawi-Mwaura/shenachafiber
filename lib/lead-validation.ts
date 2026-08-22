import type { LeadContactPreference, LeadDraft, LeadFieldErrors, LeadPropertyType, LeadService } from "./lead";

export const MAX_LEAD_BODY_BYTES = 16_384;

const services = new Set<LeadService>(["internet", "cctv", "biometric_access", "support"]);
const propertyTypes = new Set<LeadPropertyType>(["home", "apartment", "office", "new_development", "other"]);
const contactPreferences = new Set<LeadContactPreference>(["whatsapp", "call"]);

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
  service: LeadService;
  selectedPlan: string | null;
  location: string;
  building: string | null;
  propertyType: LeadPropertyType;
  userCount: number | null;
  message: string | null;
  name: string;
  phone: string;
  email: string | null;
  contactPreference: LeadContactPreference;
  consent: true;
  source: string;
  utm: { source?: string; medium?: string; campaign?: string };
};

export type LeadValidationResult =
  | { ok: true; lead: NormalisedLead }
  | { ok: false; reason: "validation" | "spam"; message: string; fieldErrors?: LeadFieldErrors };

export function validateLead(input: unknown): LeadValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, reason: "validation", message: "Check the highlighted fields and try again." };
  }

  const draft = input as Partial<LeadDraft>;
  if (clean(draft.website, 120)) return { ok: false, reason: "spam", message: "Unable to submit this request." };

  const service = clean(draft.service, 40) as LeadService;
  const selectedPlan = clean(draft.selectedPlan, 80);
  const location = clean(draft.location, 120);
  const building = clean(draft.building, 120);
  const propertyType = clean(draft.propertyType, 40) as LeadPropertyType;
  const userCountText = clean(draft.userCount, 10);
  const message = clean(draft.message, 1_200);
  const name = clean(draft.name, 100);
  const phone = normaliseKenyanPhone(draft.phone);
  const email = clean(draft.email, 160).toLowerCase();
  const contactPreference = clean(draft.contactPreference, 40) as LeadContactPreference;
  const source = clean(draft.source, 80) || "website";
  const userCount = /^\d{1,5}$/.test(userCountText) ? Number(userCountText) : null;
  const fieldErrors: LeadFieldErrors = {};

  if (!services.has(service)) fieldErrors.service = "Choose the service you need.";
  if (location.length < 2) fieldErrors.location = "Enter your Nairobi area or neighbourhood.";
  if (!propertyTypes.has(propertyType)) fieldErrors.propertyType = "Choose the property type.";
  if ((service === "internet" || service === "biometric_access") && (!userCount || userCount < 1)) fieldErrors.userCount = "Enter the number of users or people.";
  else if (userCountText && (!userCount || userCount < 1)) fieldErrors.userCount = "Enter a valid number of users or people.";
  if (name.length < 2) fieldErrors.name = "Enter your full name.";
  if (!phone) fieldErrors.phone = "Enter a valid Kenyan mobile number, such as 0712 345 678.";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email address or leave it blank.";
  if (!contactPreferences.has(contactPreference)) fieldErrors.contactPreference = "Choose WhatsApp or phone call.";
  if (draft.consent !== true) fieldErrors.consent = "Consent is required before the request can be sent.";

  if (Object.keys(fieldErrors).length) return { ok: false, reason: "validation", message: "Check the highlighted fields and try again.", fieldErrors };

  const utmInput = draft.utm && typeof draft.utm === "object" ? draft.utm : {};
  return {
    ok: true,
    lead: {
      service,
      selectedPlan: selectedPlan || null,
      location,
      building: building || null,
      propertyType,
      userCount,
      message: message || null,
      name,
      phone: phone!,
      email: email || null,
      contactPreference,
      consent: true,
      source,
      utm: {
        source: clean(utmInput.source, 100) || undefined,
        medium: clean(utmInput.medium, 100) || undefined,
        campaign: clean(utmInput.campaign, 100) || undefined,
      },
    },
  };
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
    if (size > MAX_LEAD_BODY_BYTES) {
      await reader.cancel();
      return { ok: false, reason: "too_large" };
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}
