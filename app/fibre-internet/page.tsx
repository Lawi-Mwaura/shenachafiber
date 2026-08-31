import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FiberReadyBoard } from "@/components/fiber-ready-board";
import { FibreEnquiryJourneys } from "@/components/fibre-enquiry-journeys";

export const metadata: Metadata = { title: "Reliable Fibre Internet in Juja", description: "Fibre internet for homes, apartments, offices and businesses within Juja, including property-owner and resident enquiry routes.", alternates: { canonical: "/fibre-internet" }, openGraph: { url: "/fibre-internet", title: "Reliable Fibre Internet in Juja", description: "Check fibre availability or book a property meeting with Shenacha." } };

export default function FibreInternetPage() { return <><SiteHeader /><main id="main-content" className="canonical-page fibre-page">
  <section className="canonical-hero"><div><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Fibre internet</span></nav><p className="eyebrow">SHENACHA FIBRE</p><h1>Reliable Fibre Internet in Juja</h1><p>Fibre internet for homes, apartments, offices and businesses within Juja.</p><div className="hero-action-grid"><a className="button button-primary" href="#resident-inquiry">Check fibre availability</a><a className="button button-outline" href="#property-meeting">Book a property meeting</a></div></div><div className="canonical-hero-image"><Image src="/images/home-office.jpg" alt="A resident using fibre internet from a home office" fill priority sizes="(max-width: 900px) 100vw, 48vw" /></div></section>

  <section className="package-section" aria-labelledby="package-title"><div><p className="eyebrow">CURRENT PACKAGE</p><h2 id="package-title">Simple, confirmed pricing.</h2></div><div className="single-package"><span>10 Mbps</span><strong>KSh 1,500<small>/month</small></strong><p>Router <b>KSh 2,000</b></p><p>Installation <b>FREE</b></p></div></section>

  <section className="fibre-board-section"><FiberReadyBoard compact /></section>
  <Suspense fallback={<p className="form-loading">Preparing the fibre enquiry options…</p>}><FibreEnquiryJourneys /></Suspense>
</main><SiteFooter /></>; }
