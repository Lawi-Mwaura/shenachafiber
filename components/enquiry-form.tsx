"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/icons/ArrowRight";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { businessProfile } from "@/lib/business";
import type { LeadContactPreference, LeadField, LeadFieldErrors, LeadPropertyType, LeadResponse, LeadService } from "@/lib/lead";

type Topic = "internet" | "cctv" | "access" | "support";
type FormState = "idle" | "submitting" | "success" | "error";

const services: Array<{ key: Topic; label: string; help: string }> = [
  { key: "internet", label: "Fibre & Wi-Fi", help: "New connection or coverage request" },
  { key: "cctv", label: "CCTV installation", help: "Property survey and camera planning" },
  { key: "access", label: "Biometric access", help: "Gate or door compatibility assessment" },
  { key: "support", label: "Customer support", help: "Help with an existing connection" },
];

const serviceMap: Record<Topic, LeadService> = { internet: "internet", cctv: "cctv", access: "biometric_access", support: "support" };
const messageLabel: Record<Topic, { label: string; hint: string }> = {
  internet: { label: "How will you use the connection?", hint: "Tell us about users, devices, streaming, classes, remote work or business use." },
  cctv: { label: "Which areas are you concerned about?", hint: "Mention entrances, gates, parking, blind spots or any existing cameras." },
  access: { label: "Tell us about the entrance", hint: "Is it a gate or door? Mention existing automation, available power and estimated users if known." },
  support: { label: "What problem are you seeing and when did it begin?", hint: "Describe the router or fibre-box lights, when the problem began and the checks you have already tried." },
};
const properties: Array<{ key: LeadPropertyType; label: string }> = [
  { key: "home", label: "Home" },
  { key: "apartment", label: "Apartment building" },
  { key: "office", label: "Shop or office" },
  { key: "new_development", label: "New development" },
  { key: "other", label: "Other" },
];

export function EnquiryForm() {
  const search = useSearchParams();
  const queryTopic = search.get("service");
  const initialTopic: Topic = queryTopic === "cctv" || queryTopic === "access" || queryTopic === "support" ? queryTopic : "internet";
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [plan, setPlan] = useState(search.get("plan") ?? "");
  const [location, setLocation] = useState(search.get("location") ?? "");
  const [building, setBuilding] = useState("");
  const [propertyType, setPropertyType] = useState<LeadPropertyType | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userCount, setUserCount] = useState("");
  const [contactPreference, setContactPreference] = useState<LeadContactPreference | "">("");
  const [details, setDetails] = useState("");
  const [consent, setConsent] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [reference, setReference] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LeadFieldErrors>({});
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const whatsappHref = `https://wa.me/${businessProfile.whatsapp.replace("+", "")}`;

  function clearError(field: LeadField) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function fieldError(field: LeadField) {
    const error = fieldErrors[field];
    return error ? <small className="field-error" id={`${field}-error`}>{error}</small> : null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("submitting");
    setStatusMessage("");
    setFieldErrors({});
    const payload = {
      service: serviceMap[topic],
      selectedPlan: topic === "internet" && plan ? plan : undefined,
      location,
      building,
      propertyType,
      name,
      phone,
      email,
      userCount,
      contactPreference,
      message: details,
      consent,
      source: "dedicated_enquiry_page",
      website: new FormData(event.currentTarget).get("website")?.toString() ?? "",
      utm: { source: search.get("utm_source") ?? undefined, medium: search.get("utm_medium") ?? undefined, campaign: search.get("utm_campaign") ?? undefined },
    };

    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = (await response.json()) as LeadResponse;
      setStatusMessage(result.message);
      if (response.ok && result.saved) {
        setReference(result.reference);
        setFormState("success");
        return;
      }
      setFieldErrors(result.saved ? {} : (result.fieldErrors ?? {}));
      setFormState("error");
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
    } catch {
      setFormState("error");
      setStatusMessage("The request could not be sent. Your details were not stored. Check your connection and try again, or use the official WhatsApp contact.");
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
    }
  }

  if (formState === "success") {
    return (
      <section className="enquiry-success" aria-live="polite">
        <span>Request received</span>
        <h2>Thank you, {name}.</h2>
        <p>Your request has been sent. Keep reference <strong>{reference}</strong> for follow-up. We will contact you using the number provided.</p>
        <div><Link className="button button-primary" href="/">Return home</Link><Link className="button button-outline" href="/contact">Contact & meetings</Link></div>
      </section>
    );
  }

  return (
    <form className="dedicated-enquiry-form" onSubmit={submit} noValidate aria-busy={formState === "submitting"}>
      {formState === "error" ? (
        <div className="lead-feedback error error-summary" role="alert" tabIndex={-1} ref={errorSummaryRef}>
          <strong>Request not sent</strong>
          <p>{statusMessage}</p>
          {Object.entries(fieldErrors).length ? <ul>{Object.entries(fieldErrors).map(([field, error]) => <li key={field}><a href={`#${field}`}>{error}</a></li>)}</ul> : null}
          <a className="whatsapp-fallback" href={whatsappHref} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> WhatsApp {businessProfile.whatsappDisplay}</a>
        </div>
      ) : null}

      <fieldset className="enquiry-step">
        <legend><span>01</span><strong>Choose the service</strong><small>Pick the closest option. Add the practical details below.</small></legend>
        <div className="service-choice-grid">
          {services.map((item, index) => <label className={topic === item.key ? "is-selected" : ""} key={item.key}><input type="radio" name="service" value={item.key} checked={topic === item.key} onChange={() => { setTopic(item.key); clearError("service"); }} /><span className="choice-index">0{index + 1}</span><strong>{item.label}</strong><small>{item.help}</small></label>)}
        </div>
        {fieldError("service")}
      </fieldset>

      <fieldset className="enquiry-step">
        <legend><span>02</span><strong>Tell us about the property</strong><small>These details help us prepare before we contact you.</small></legend>
        <div className="field-grid">
          <label className="field">Nairobi area or neighbourhood <span>Required</span><input id="location" value={location} onChange={(event) => { setLocation(event.target.value); clearError("location"); }} placeholder="For example: Kilimani" autoComplete="address-level2" aria-invalid={Boolean(fieldErrors.location)} aria-describedby={fieldErrors.location ? "location-error" : undefined} />{fieldError("location")}</label>
          <label className="field">Building, estate or unit <span>Optional</span><input id="building" value={building} onChange={(event) => { setBuilding(event.target.value); clearError("building"); }} placeholder="For example: Acacia Court, Block B" autoComplete="address-line1" aria-invalid={Boolean(fieldErrors.building)} aria-describedby={fieldErrors.building ? "building-error" : undefined} />{fieldError("building")}</label>
          <fieldset className="property-choice field-wide" id="propertyType" aria-invalid={Boolean(fieldErrors.propertyType)} aria-describedby={fieldErrors.propertyType ? "propertyType-error" : undefined}><legend>Property type <span className="required-label">Required</span></legend><div>{properties.map((item) => <label className={propertyType === item.key ? "is-selected" : ""} key={item.key}><input type="radio" name="propertyType" value={item.key} checked={propertyType === item.key} onChange={() => { setPropertyType(item.key); clearError("propertyType"); }} />{item.label}</label>)}</div>{fieldError("propertyType")}</fieldset>
          {topic === "internet" || topic === "access" ? <label className="field">{topic === "internet" ? "How many people normally use the connection?" : "About how many authorised users?"} <span>Required</span><input id="userCount" value={userCount} onChange={(event) => { setUserCount(event.target.value); clearError("userCount"); }} type="number" inputMode="numeric" min="1" placeholder={topic === "internet" ? "People using the Wi-Fi" : "People using the access system"} aria-invalid={Boolean(fieldErrors.userCount)} aria-describedby={fieldErrors.userCount ? "userCount-error" : undefined} />{fieldError("userCount")}</label> : null}
          {topic === "internet" ? <label className="field field-wide">Selected plan <span>Optional</span><input value={plan} onChange={(event) => setPlan(event.target.value)} placeholder="Leave blank if you want a recommendation" /></label> : null}
          <label className="field field-wide">{messageLabel[topic].label} <span>Optional</span><textarea id="message" value={details} onChange={(event) => { setDetails(event.target.value); clearError("message"); }} placeholder={messageLabel[topic].hint} rows={5} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? "message-error message-help" : "message-help"} />{fieldError("message")}<small id="message-help">Do not include passwords, PINs or biometric information.</small></label>
        </div>
      </fieldset>

      <fieldset className="enquiry-step">
        <legend><span>03</span><strong>How should we reach you?</strong><small>Use a number the team can reach by call or WhatsApp.</small></legend>
        <div className="field-grid">
          <label className="field">Full name <span>Required</span><input id="name" value={name} onChange={(event) => { setName(event.target.value); clearError("name"); }} autoComplete="name" aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "name-error" : undefined} />{fieldError("name")}</label>
          <label className="field">Phone number <span>Required</span><input id="phone" value={phone} onChange={(event) => { setPhone(event.target.value); clearError("phone"); }} type="tel" inputMode="tel" autoComplete="tel" placeholder="0712 345 678 or +254 712 345 678" aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "phone-error" : undefined} />{fieldError("phone")}</label>
          <label className="field field-wide">Email address <span>Optional</span><input id="email" value={email} onChange={(event) => { setEmail(event.target.value); clearError("email"); }} type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined} />{fieldError("email")}</label>
          <fieldset className="contact-choice field-wide" id="contactPreference" aria-invalid={Boolean(fieldErrors.contactPreference)} aria-describedby={fieldErrors.contactPreference ? "contactPreference-error" : undefined}><legend>Preferred contact method <span className="required-label">Required</span></legend><div><label className={contactPreference === "whatsapp" ? "is-selected" : ""}><input type="radio" name="contactPreference" checked={contactPreference === "whatsapp"} onChange={() => { setContactPreference("whatsapp"); clearError("contactPreference"); }} /><WhatsAppIcon size={18} /> WhatsApp</label><label className={contactPreference === "call" ? "is-selected" : ""}><input type="radio" name="contactPreference" checked={contactPreference === "call"} onChange={() => { setContactPreference("call"); clearError("contactPreference"); }} />Phone call</label></div>{fieldError("contactPreference")}</fieldset>
          <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <div className="field-wide"><label className="consent-field"><input id="consent" type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); clearError("consent"); }} aria-invalid={Boolean(fieldErrors.consent)} aria-describedby={fieldErrors.consent ? "consent-error" : undefined} /><span>I agree that Shenacha may use these details to respond to this request. I understand this is not a confirmed installation or appointment. Read the <Link href="/privacy">privacy notice</Link>.</span></label>{fieldError("consent")}</div>
        </div>
      </fieldset>

      <div className="enquiry-submit-row">
        <div><strong>No payment is taken here.</strong><p>Submitting starts an enquiry; suitability, charges and meeting details are confirmed first.</p></div>
        <button className="button button-primary" type="submit" disabled={formState === "submitting"}>{formState === "submitting" ? "Sending your request…" : <>Send my request <ArrowRight size={18} aria-hidden="true" /></>}</button>
      </div>
      <p className="sr-status" role="status" aria-live="polite">{formState === "submitting" ? "Sending your request. Please wait." : ""}</p>
    </form>
  );
}
