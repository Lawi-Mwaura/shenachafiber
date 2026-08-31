import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FiberReadyBoard } from "@/components/fiber-ready-board";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = { title: "Fibre Coverage in Juja", description: "Ask Shenacha to manually confirm fibre availability for your building or area in Juja.", alternates: { canonical: "/coverage" }, openGraph: { url: "/coverage", title: "Check Fibre Availability in Juja", description: "Share your building and unit details for a manual availability check." } };
export default function CoveragePage() { return <><SiteHeader /><main id="main-content" className="canonical-page coverage-page"><section className="coverage-hero"><p className="eyebrow">FIBRE COVERAGE</p><h1>Check fibre availability in Juja.</h1><p>Share your area, building and unit details. The Shenacha team will review the address and give you a clear, personal availability confirmation.</p><a className="button button-primary" href="#availability-form">Check fibre availability</a></section><div className="coverage-journey"><FiberReadyBoard /><section className="embedded-form-section" id="availability-form"><Suspense fallback={<p>Preparing the availability form...</p>}><EnquiryForm fixedKind="fibre_availability" heading="Check your building or area" idPrefix="coverage" /></Suspense></section></div></main><SiteFooter /></>; }
