"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/icons/ArrowRight";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { businessProfile } from "@/lib/business";
import type { LeadContactPreference, LeadContactRole, LeadEnquiryKind, LeadField, LeadFieldErrors, LeadPropertyType, LeadResponse } from "@/lib/lead";

type FormState = "idle" | "submitting" | "success" | "error";
type Props = { fixedKind?: LeadEnquiryKind; heading?: string };

const journeys: Array<{ value: LeadEnquiryKind; label: string }> = [
  { value: "fibre_availability", label: "Check fibre availability" },
  { value: "property_meeting", label: "Book a property meeting" },
  { value: "cctv_quote", label: "Request a CCTV quote" },
  { value: "biometric_quote", label: "Request an access-control quote" },
  { value: "support", label: "Customer support" },
];
const propertyTypes: Array<{ value: LeadPropertyType; label: string }> = [
  { value: "home", label: "Home" }, { value: "apartment", label: "Apartment" }, { value: "office", label: "Office" },
  { value: "business", label: "Business" }, { value: "commercial_property", label: "Commercial property" }, { value: "new_development", label: "New development" }, { value: "other", label: "Other" },
];
const contactRoles: Array<{ value: LeadContactRole; label: string }> = [
  { value: "landlord", label: "Landlord" }, { value: "property_manager", label: "Property manager" }, { value: "developer", label: "Developer" },
  { value: "building_owner", label: "Building owner" }, { value: "business_owner", label: "Business owner" }, { value: "other", label: "Other" },
];
const titles: Record<LeadEnquiryKind, string> = {
  fibre_availability: "Check fibre availability", property_meeting: "Book a property meeting", cctv_quote: "Request a CCTV quote",
  biometric_quote: "Request an access-control quote", support: "Contact support",
};

export function EnquiryForm({ fixedKind, heading }: Props) {
  const search = useSearchParams();
  const queryKind = search.get("kind") as LeadEnquiryKind | null;
  const initialKind = journeys.some((item) => item.value === queryKind) ? queryKind! : "fibre_availability";
  const [enquiryKind, setEnquiryKind] = useState<LeadEnquiryKind>(fixedKind ?? initialKind);
  const [values, setValues] = useState({ selectedPlan: "10 Mbps - KSh 1,500/month", location: "", building: "", propertyType: "" as LeadPropertyType | "", contactRole: "" as LeadContactRole | "", unitCount: "", unitNumber: "", name: "", phone: "", whatsapp: "", email: "", contactPreference: "" as LeadContactPreference | "", preferredMeetingTime: "", preferredInstallationDate: "", message: "", consent: false });
  const [formState, setFormState] = useState<FormState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [reference, setReference] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LeadFieldErrors>({});
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const whatsappHref = `https://wa.me/${businessProfile.whatsapp.replace("+", "")}`;
  const isFibre = enquiryKind === "fibre_availability";
  const isMeeting = enquiryKind === "property_meeting";
  const isQuote = enquiryKind === "cctv_quote" || enquiryKind === "biometric_quote";

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => { const next = { ...current }; delete next[key as LeadField]; return next; });
  }
  function error(field: LeadField) {
    return fieldErrors[field] ? <small className="field-error" id={`${field}-error`}>{fieldErrors[field]}</small> : null;
  }
  function described(field: LeadField) { return fieldErrors[field] ? `${field}-error` : undefined; }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormState("submitting"); setStatusMessage(""); setFieldErrors({});
    const payload = { enquiryKind, ...values, source: fixedKind ? `embedded_${fixedKind}` : "dedicated_enquiry_page", website: new FormData(event.currentTarget).get("website")?.toString() ?? "", utm: { source: search.get("utm_source") ?? undefined, medium: search.get("utm_medium") ?? undefined, campaign: search.get("utm_campaign") ?? undefined } };
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = (await response.json()) as LeadResponse;
      setStatusMessage(result.message);
      if (response.ok && result.saved) { setReference(result.reference); setFormState("success"); return; }
      setFieldErrors(result.saved ? {} : (result.fieldErrors ?? {})); setFormState("error"); requestAnimationFrame(() => errorSummaryRef.current?.focus());
    } catch {
      setFormState("error"); setStatusMessage("The request could not be sent. Your details were not stored. Check your connection and try again, or use the official WhatsApp contact."); requestAnimationFrame(() => errorSummaryRef.current?.focus());
    }
  }

  if (formState === "success") return <section className="enquiry-success" aria-live="polite"><span>Request received</span><h2>Thank you, {values.name}.</h2><p>Keep reference <strong>{reference}</strong> for follow-up. Shenacha will contact you using the details provided.</p><div><Link className="button button-primary" href="/">Return home</Link><Link className="button button-outline" href="/contact">Contact Shenacha</Link></div></section>;

  return (
    <form className="dedicated-enquiry-form journey-form" onSubmit={submit} noValidate aria-busy={formState === "submitting"}>
      <div className="journey-form-heading"><p className="eyebrow">ENQUIRY FORM</p><h2>{heading ?? titles[enquiryKind]}</h2><p>Fields marked required help us review your request. Submitting does not confirm an installation, quote or appointment.</p></div>
      {formState === "error" ? <div className="lead-feedback error error-summary" role="alert" tabIndex={-1} ref={errorSummaryRef}><strong>Request not sent</strong><p>{statusMessage}</p>{Object.keys(fieldErrors).length ? <ul>{Object.entries(fieldErrors).map(([field, message]) => <li key={field}><a href={`#${field}`}>{message}</a></li>)}</ul> : null}<a className="whatsapp-fallback" href={whatsappHref} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> WhatsApp {businessProfile.whatsappDisplay}</a></div> : null}

      {!fixedKind ? <label className="field field-wide">What do you need? <span>Required</span><select id="enquiryKind" value={enquiryKind} onChange={(e) => { setEnquiryKind(e.target.value as LeadEnquiryKind); setFieldErrors({}); }}>{journeys.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select>{error("enquiryKind")}</label> : null}

      <div className="field-grid">
        <label className="field">{isFibre || isMeeting ? "Property location in Juja" : "Property location"} <span>Required</span><input id="location" value={values.location} onChange={(e) => update("location", e.target.value)} autoComplete="address-level2" placeholder={isFibre || isMeeting ? "Area or nearest landmark in Juja" : "Town, area or nearest landmark"} aria-invalid={Boolean(fieldErrors.location)} aria-describedby={described("location")} />{error("location")}</label>
        {(isFibre || isMeeting) ? <label className="field">Apartment / building name <span>Required</span><input id="building" value={values.building} onChange={(e) => update("building", e.target.value)} autoComplete="address-line1" aria-invalid={Boolean(fieldErrors.building)} aria-describedby={described("building")} />{error("building")}</label> : null}
        {isQuote ? <label className="field">Property type <span>Required</span><select id="propertyType" value={values.propertyType} onChange={(e) => update("propertyType", e.target.value as LeadPropertyType)} aria-invalid={Boolean(fieldErrors.propertyType)} aria-describedby={described("propertyType")}><option value="">Select property type</option>{propertyTypes.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select>{error("propertyType")}</label> : null}
        {isMeeting ? <><label className="field">Number of units <span>Required</span><input id="unitCount" type="number" min="1" inputMode="numeric" value={values.unitCount} onChange={(e) => update("unitCount", e.target.value)} aria-invalid={Boolean(fieldErrors.unitCount)} aria-describedby={described("unitCount")} />{error("unitCount")}</label><label className="field">Your role <span>Required</span><select id="contactRole" value={values.contactRole} onChange={(e) => update("contactRole", e.target.value as LeadContactRole)} aria-invalid={Boolean(fieldErrors.contactRole)} aria-describedby={described("contactRole")}><option value="">Select your role</option>{contactRoles.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}</select>{error("contactRole")}</label></> : null}
        {isFibre ? <><label className="field">House / unit number <span>Required</span><input id="unitNumber" value={values.unitNumber} onChange={(e) => update("unitNumber", e.target.value)} aria-invalid={Boolean(fieldErrors.unitNumber)} aria-describedby={described("unitNumber")} />{error("unitNumber")}</label><label className="field">Package <span>Required</span><input id="selectedPlan" value={values.selectedPlan} readOnly aria-readonly="true" aria-describedby={described("selectedPlan")} />{error("selectedPlan")}</label><label className="field">Preferred installation date <span>Optional</span><input id="preferredInstallationDate" type="date" value={values.preferredInstallationDate} onChange={(e) => update("preferredInstallationDate", e.target.value)} /></label></> : null}
        <label className="field">Full name <span>Required</span><input id="name" value={values.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={described("name")} />{error("name")}</label>
        <label className="field">Phone number <span>Required</span><input id="phone" type="tel" inputMode="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} autoComplete="tel" placeholder="0712 345 678" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={described("phone")} />{error("phone")}</label>
        {(isFibre || isMeeting) ? <label className="field">WhatsApp number <span>Required</span><input id="whatsapp" type="tel" inputMode="tel" value={values.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} autoComplete="tel" placeholder="0712 345 678" aria-invalid={Boolean(fieldErrors.whatsapp)} aria-describedby={described("whatsapp")} />{error("whatsapp")}</label> : null}
        {(isMeeting || isQuote) ? <><label className="field">Email address <span>Optional</span><input id="email" type="email" value={values.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={described("email")} />{error("email")}</label><label className="field">Preferred contact method <span>Required</span><select id="contactPreference" value={values.contactPreference} onChange={(e) => update("contactPreference", e.target.value as LeadContactPreference)} aria-invalid={Boolean(fieldErrors.contactPreference)} aria-describedby={described("contactPreference")}><option value="">Choose a method</option><option value="whatsapp">WhatsApp</option><option value="call">Phone call</option><option value="email">Email</option></select>{error("contactPreference")}</label></> : null}
        {isMeeting ? <label className="field field-wide">Preferred meeting time <span>Required</span><input id="preferredMeetingTime" value={values.preferredMeetingTime} onChange={(e) => update("preferredMeetingTime", e.target.value)} placeholder="For example: weekday morning" aria-invalid={Boolean(fieldErrors.preferredMeetingTime)} aria-describedby={described("preferredMeetingTime")} />{error("preferredMeetingTime")}</label> : null}
        <label className="field field-wide">{enquiryKind === "support" ? "Describe the problem" : "Additional information"} <span>{enquiryKind === "support" ? "Required" : "Optional"}</span><textarea id="message" rows={5} value={values.message} onChange={(e) => update("message", e.target.value)} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={described("message")} />{error("message")}<small>Do not include passwords, PINs or biometric information.</small></label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <div className="field-wide"><label className="consent-field"><input id="consent" type="checkbox" checked={values.consent} onChange={(e) => update("consent", e.target.checked)} aria-invalid={Boolean(fieldErrors.consent)} aria-describedby={described("consent")} /><span>I agree that Shenacha may use these details to respond to this request. Read the <Link href="/privacy">privacy notice</Link>.</span></label>{error("consent")}</div>
      </div>
      <div className="enquiry-submit-row"><div><strong>No payment is taken here.</strong><p>Availability, assessment, pricing and timing are confirmed before you commit.</p></div><button className="button button-primary" type="submit" disabled={formState === "submitting"}>{formState === "submitting" ? "Sending your request..." : <>Submit request <ArrowRight size={18} aria-hidden="true" /></>}</button></div>
      <p className="sr-status" role="status" aria-live="polite">{formState === "submitting" ? "Sending your request. Please wait." : ""}</p>
    </form>
  );
}
