import type { Metadata } from "next";
import Link from "next/link";
import { Envelope } from "@phosphor-icons/react/dist/ssr/Envelope";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { businessProfile } from "@/lib/business";

export const metadata: Metadata = { title: "Contact Shenacha", description: "Contact Shenacha about fibre internet in Juja, or CCTV and biometric access for your property.", alternates: { canonical: "/contact" }, openGraph: { url: "/contact", title: "Contact Shenacha", description: "Arrange an enquiry, property meeting or quote." } };
export default function ContactPage() {
  const whatsappHref = `https://wa.me/${businessProfile.whatsapp.replace("+", "")}`;
  return <><SiteHeader /><main id="main-content" className="canonical-page contact-page-new"><section className="coverage-hero"><p className="eyebrow">CONTACT SHENACHA</p><h1>Let’s talk about your property.</h1><p>Use the right enquiry route below, or contact the team directly. Fibre is currently available in Juja; CCTV and biometric access can be provided wherever the property is located.</p></section>
    <section className="contact-card-grid contact-direct" aria-label="Direct contact options"><article><span>WhatsApp & enquiries</span><strong>{businessProfile.whatsappDisplay}</strong><p>Start a new enquiry or follow up on an existing request.</p><a className="contact-card-action whatsapp-action" href={whatsappHref} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> Start a WhatsApp chat</a></article><article><span>Support line</span><strong>{businessProfile.supportPhoneDisplay}</strong><p>Call for help with an existing connection.</p><a className="contact-card-action" href={`tel:${businessProfile.supportPhone}`}><Phone size={18} aria-hidden="true" /> Call support</a></article><article><span>Email</span><strong>{businessProfile.email}</strong><p>Send details that are easier to explain in writing.</p><a className="contact-card-action" href={`mailto:${businessProfile.email}`}><Envelope size={18} aria-hidden="true" /> Email Shenacha</a></article></section>
    <section className="quote-journeys" id="request-quote"><div><p className="eyebrow">CHOOSE YOUR NEXT STEP</p><h2>One request. A clear follow-up.</h2><p>Submitting a form is not a confirmed appointment, installation or quote.</p></div><div><Link href="/coverage#availability-form"><span>01</span><strong>Check Fibre Availability</strong><small>For residents and clients in Juja</small></Link><Link href="/fibre-internet#property-meeting"><span>02</span><strong>Book a Property Meeting</strong><small>For Juja landlords and property teams</small></Link><Link href="/cctv#quote-form"><span>03</span><strong>Request a CCTV Quote</strong><small>For properties wherever located</small></Link><Link href="/biometric-access#quote-form"><span>04</span><strong>Request an Access Quote</strong><small>For properties wherever located</small></Link></div></section>
    <aside className="meeting-notice-wide"><strong>Meetings and assessments are arranged in advance.</strong><p>Shenacha does not operate a walk-in office. Share your details first and the team will confirm the next step.</p></aside>
  </main><SiteFooter showFloatingChat={false} /></>;
}
