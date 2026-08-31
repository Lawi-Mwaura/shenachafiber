import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "Start a Shenacha Enquiry",
  description: "Check fibre availability in Juja, book a property meeting, request a CCTV or biometric quote, or contact support.",
  alternates: { canonical: "/enquire" },
  openGraph: { url: "/enquire", title: "Start an enquiry with Shenacha", description: "Choose the right fibre, property, security, access or support journey." },
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
            <p>Choose the enquiry that matches your need. Fibre requests are for Juja; CCTV and biometric access requests can be made for a property wherever it is located.</p>
            <p className="enquire-reassurance">No payment is taken here. Submitting the form does not confirm an installation or appointment.</p>
          </div>
          <div className="enquire-hero-image"><Image src="/images/family-laptop.jpg" alt="A family using a laptop together at home" fill priority sizes="(max-width: 900px) 100vw, 42vw" /></div>
        </section>
        <section className="enquiry-shell" aria-label="Service request form">
          <Suspense fallback={<p className="form-loading">Preparing the request form…</p>}><EnquiryForm idPrefix="general-enquiry" /></Suspense>
        </section>
      </main>
      <SiteFooter showFloatingChat={false} />
    </>
  );
}
