import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FiberReadyBoard } from "@/components/fiber-ready-board";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = { title: "Reliable Fibre Internet in Juja", description: "Fibre internet for homes, apartments, offices and businesses within Juja, including property-owner and resident enquiry routes.", alternates: { canonical: "/fibre-internet" }, openGraph: { url: "/fibre-internet", title: "Reliable Fibre Internet in Juja", description: "Check fibre availability or book a property meeting with Shenacha." } };

export default function FibreInternetPage() { return <><SiteHeader /><main id="main-content" className="canonical-page fibre-page">
  <section className="canonical-hero"><div><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Fibre internet</span></nav><p className="eyebrow">SHENACHA FIBRE</p><h1>Reliable Fibre Internet in Juja</h1><p>Fibre internet for homes, apartments, offices and businesses within Juja.</p><div className="hero-action-grid"><a className="button button-primary" href="#resident-inquiry">Check Fibre Availability</a><a className="button button-outline" href="#property-meeting">Book a Property Meeting</a></div></div><div className="canonical-hero-image"><Image src="/images/home-office.jpg" alt="A resident using fibre internet from a home office" fill priority sizes="(max-width: 900px) 100vw, 48vw" /></div></section>

  <section className="package-section" aria-labelledby="package-title"><div><p className="eyebrow">CURRENT PACKAGE</p><h2 id="package-title">Simple, confirmed pricing.</h2></div><div className="single-package"><span>10 Mbps</span><strong>KSh 1,500<small>/month</small></strong><p>Router <b>KSh 2,000</b></p><p>Installation <b>FREE</b></p></div></section>

  <section className="owner-section" id="property-meeting"><div className="owner-copy"><p className="eyebrow">LANDLORDS & PROPERTY OWNERS</p><h2>Bring Reliable Fibre Internet to Your Building</h2><p>Shenacha Fibre partners with landlords, property owners, property managers, developers and building owners to provide professional fibre connectivity within Juja.</p><ul><li>We visit and assess the property.</li><li>Fibre cabling can be structured through conduits.</li><li>Neat surface trunking can be used where required.</li><li>The partnership is based on a signed contract, with terms agreed by both parties.</li></ul><p className="meeting-note">Meetings and assessments are arranged in advance. There is no walk-in office.</p></div><div className="embedded-form-section compact-form"><Suspense fallback={<p>Preparing the meeting form...</p>}><EnquiryForm fixedKind="property_meeting" heading="Book a meeting with us" /></Suspense></div></section>

  <section className="resident-section" id="resident-inquiry"><div><p className="eyebrow">RESIDENTS & CLIENTS</p><h2>Looking for Fibre Internet in Juja?</h2><p>Check whether Shenacha Fibre is already available in your building or area.</p></div><FiberReadyBoard compact /><div className="embedded-form-section"><Suspense fallback={<p>Preparing the availability form...</p>}><EnquiryForm fixedKind="fibre_availability" heading="Submit a fibre inquiry" /></Suspense></div></section>
</main><SiteFooter /></>; }
