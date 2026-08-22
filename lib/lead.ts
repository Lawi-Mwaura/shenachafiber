export type LeadService = "internet" | "cctv" | "biometric_access" | "support";
export type LeadPropertyType = "home" | "apartment" | "office" | "new_development" | "other";
export type LeadContactPreference = "whatsapp" | "call";

export type LeadDraft = {
  service: LeadService;
  selectedPlan?: string;
  location: string;
  building?: string;
  name: string;
  phone: string;
  email?: string;
  userCount?: string;
  propertyType: LeadPropertyType;
  contactPreference: LeadContactPreference;
  message?: string;
  consent: boolean;
  source?: string;
  website?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
};

export type LeadField = keyof Pick<LeadDraft, "service" | "location" | "building" | "name" | "phone" | "email" | "userCount" | "propertyType" | "contactPreference" | "message" | "consent">;
export type LeadFieldErrors = Partial<Record<LeadField, string>>;

export type LeadResponse =
  | { saved: true; reference: string; message: string }
  | { saved: false; message: string; fieldErrors?: LeadFieldErrors; reason: "invalid_request" | "validation" | "spam" | "storage_unavailable" | "storage_error" };
