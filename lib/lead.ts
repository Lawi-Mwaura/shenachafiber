export type LeadEnquiryKind = "fibre_availability" | "property_meeting" | "cctv_quote" | "biometric_quote" | "support";
export type LeadService = "internet" | "cctv" | "biometric_access" | "support";
export type LeadPropertyType = "home" | "apartment" | "office" | "business" | "commercial_property" | "new_development" | "other";
export type LeadContactPreference = "whatsapp" | "call" | "email";
export type LeadContactRole = "resident" | "landlord" | "property_manager" | "developer" | "building_owner" | "business_owner" | "other";

export type LeadDraft = {
  enquiryKind: LeadEnquiryKind;
  service?: LeadService;
  selectedPlan?: string;
  location: string;
  building?: string;
  propertyType?: LeadPropertyType;
  contactRole?: LeadContactRole;
  unitCount?: string;
  unitNumber?: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  contactPreference?: LeadContactPreference;
  preferredMeetingTime?: string;
  preferredInstallationDate?: string;
  message?: string;
  consent: boolean;
  source?: string;
  website?: string;
  utm?: { source?: string; medium?: string; campaign?: string };
};

export type LeadField = keyof Pick<LeadDraft, "enquiryKind" | "selectedPlan" | "location" | "building" | "propertyType" | "contactRole" | "unitCount" | "unitNumber" | "name" | "phone" | "whatsapp" | "email" | "contactPreference" | "preferredMeetingTime" | "preferredInstallationDate" | "message" | "consent">;
export type LeadFieldErrors = Partial<Record<LeadField, string>>;

export type LeadResponse =
  | { saved: true; reference: string; message: string }
  | { saved: false; message: string; fieldErrors?: LeadFieldErrors; reason: "invalid_request" | "validation" | "spam" | "storage_unavailable" | "storage_error" };
