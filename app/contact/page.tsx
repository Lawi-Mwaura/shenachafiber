import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { Envelope } from "@phosphor-icons/react/dist/ssr/Envelope";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { businessProfile } from "@/lib/business";

export const metadata: Metadata = {
  title: "Contact Shenacha Fiber in Nairobi",
  description: "Call, WhatsApp or send an enquiry about Shenacha Fiber internet, CCTV, biometric access or an existing connection in Nairobi.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: "Contact Shenacha Fiber in Nairobi", description: "Start a service enquiry or contact Shenacha support." },
};

export default function ContactPage() {
  const whatsappHref = `https://wa.me/${businessProfile.whatsapp.replace("+", "")}`;
  const supportHref = `tel:${businessProfile.supportPhone}`;
  const emailHref = `mailto:${businessProfile.email}`;
  const contactSchema = { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact Shenacha Fiber", url: "https://shenachafiber.com/contact", about: { "@id": "https://shenachafiber.com/#business" } };

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="contact-page">
        <section className="contact-hero">
          <div>
            <p className="eyebrow">CONTACT SHENACHA</p>
            <h1>Contact Shenacha Fiber.</h1>
            <p>Call, WhatsApp or send an enquiry about internet, CCTV, biometric access or an existing connection.</p>
            <div className="contact-hero-actions">
              <Link className="button button-primary" href="/enquire">Start an enquiry <ArrowRight size={18} aria-hidden="true" /></Link>
              <a className="button button-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer"><WhatsAppIcon size={19} /> WhatsApp Shenacha</a>
            </div>
          </div>
          <aside className="visit-notice meeting-notice">
            <div><strong>Meetings are arranged in advance.</strong><p>Leave your name, phone number, Nairobi area, property type and a short description of the job. We will confirm the best next step with you.</p></div>
          </aside>
        </section>

        <section className="contact-details" aria-labelledby="contact-details-title">
          <div className="contact-section-heading"><p className="eyebrow">DIRECT CONTACT</p><h2 id="contact-details-title">Choose the channel that suits you.</h2></div>
          <div className="contact-card-grid">
            <article><span>WhatsApp & enquiries</span><strong>{businessProfile.whatsappDisplay}</strong><p>Best for new enquiries, changes to an existing service and quick follow-up.</p><a className="contact-card-action whatsapp-action" href={whatsappHref} target="_blank" rel="noreferrer"><WhatsAppIcon size={18} /> Start a WhatsApp chat</a></article>
            <article><span>Support line</span><strong>{businessProfile.supportPhoneDisplay}</strong><p>Call when you are offline after completing the first troubleshooting checks.</p><a className="contact-card-action" href={supportHref}><Phone size={18} aria-hidden="true" /> Call support</a></article>
            <article><span>Email</span><strong>{businessProfile.email}</strong><p>Use email for complaints, service changes or details that are easier to write out.</p><a className="contact-card-action" href={emailHref}><Envelope size={18} aria-hidden="true" /> Email Shenacha</a></article>
          </div>
        </section>

        <section className="meeting-grid" aria-labelledby="meeting-title">
          <div className="meeting-image"><Image src="/images/apartment-exterior.jpg" alt="A residential apartment property in Nairobi" fill sizes="(max-width: 900px) 100vw, 50vw" /></div>
          <div className="meeting-panel">
            <p className="eyebrow light">BEFORE WE SPEAK</p>
            <h2 id="meeting-title">Share these details so we can help faster.</h2>
            <ol>
              <li><span>01</span><strong>Your name and best contact number</strong></li>
              <li><span>02</span><strong>The service you need</strong></li>
              <li><span>03</span><strong>Your Nairobi area or nearest landmark</strong></li>
              <li><span>04</span><strong>Property type and a short description of the job</strong></li>
            </ol>
            <Link className="button button-light" href="/enquire">Share the property details <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="contact-faq section-narrow" aria-labelledby="meeting-questions-title">
          <div><p className="eyebrow">MEETING QUESTIONS</p><h2 id="meeting-questions-title">What happens next?</h2></div>
          <div className="faq-list">
            <details><summary>Is there a Shenacha office I can visit?</summary><p>No walk-in office is listed. Submit your details or contact the team first so a conversation or meeting can be arranged.</p></details>
            <details><summary>Can CCTV or biometric access be installed at my property?</summary><p>Shenacha works with personal homes, offices, apartments and other suitable premises. The team confirms compatibility, access and project requirements before quoting.</p></details>
            <details><summary>What should landlords share?</summary><p>Include the building location, approximate number of units or users, whether cabling already exists and whether the premise is new or occupied.</p></details>
            <details><summary>Which parts of Nairobi do you serve?</summary><p>Share your area or nearest landmark. Shenacha will confirm availability and any travel requirements before arranging the next step.</p></details>
          </div>
        </section>
      </main>
      <SiteFooter showFloatingChat={false} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
