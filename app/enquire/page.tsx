import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "Request Internet, CCTV or Access Service in Nairobi",
  description: "Tell Shenacha Fiber your contact details, Nairobi location, property type and service needs for internet, CCTV, biometric access or support.",
  alternates: { canonical: "/enquire" },
  openGraph: { url: "/enquire", title: "Start an enquiry with Shenacha", description: "Request internet, CCTV, biometric access or connection support in Nairobi." },
};

export default function EnquirePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="enquire-page">
        <section className="enquire-hero">
          <div>
            <p className="eyebrow">START AN ENQUIRY</p>
            <h1>Tell us what you need.</h1>
            <p>Choose a service and share your Nairobi area and property type. We will review the details and contact you about coverage, a site assessment or support.</p>
            <p className="enquire-reassurance">No payment is taken here. Submitting the form does not confirm an installation or appointment.</p>
          </div>
          <div className="enquire-hero-image"><Image src="/images/family-laptop.jpg" alt="A family using a laptop together at home" fill priority sizes="(max-width: 900px) 100vw, 42vw" /></div>
        </section>
        <section className="enquiry-shell" aria-label="Service request form">
          <Suspense fallback={<p className="form-loading">Preparing the request form…</p>}><EnquiryForm /></Suspense>
        </section>
      </main>
      <SiteFooter showFloatingChat={false} />
    </>
  );
}
