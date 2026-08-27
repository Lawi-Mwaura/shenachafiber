import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EnquiryForm } from "@/components/enquiry-form";
import type { LeadEnquiryKind } from "@/lib/lead";

type Props = { eyebrow: string; title: string; description: string; image: string; imageAlt: string; kind: Extract<LeadEnquiryKind, "cctv_quote" | "biometric_quote">; formHeading: string; serviceAreas: string[]; points: string[] };

export function SolutionPage({ eyebrow, title, description, image, imageAlt, kind, formHeading, serviceAreas, points }: Props) {
  return <><SiteHeader /><main id="main-content" className="canonical-page">
    <section className="canonical-hero"><div><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{eyebrow}</span></nav><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p><a className="button button-primary" href="#quote-form">{formHeading} <ArrowRight size={18} aria-hidden="true" /></a></div><div className="canonical-hero-image"><Image src={image} alt={imageAlt} fill priority sizes="(max-width: 900px) 100vw, 48vw" /></div></section>
    <section className="scope-section"><div><p className="eyebrow">PROPERTY-LED PLANNING</p><h2>Recommendations shaped around the site.</h2><p>Our team can assess the property and recommend the right setup based on practical needs, coverage and budget. Final equipment, work and timing are confirmed in the quotation.</p></div><ul>{points.map((point) => <li key={point}>{point}</li>)}</ul></section>
    <section className="location-list" aria-labelledby="locations-heading"><p className="eyebrow">SUITABLE FOR</p><h2 id="locations-heading">Properties wherever you need us.</h2><div>{serviceAreas.map((area, index) => <span key={area}>0{index + 1} / {area}</span>)}</div></section>
    <section className="embedded-form-section" id="quote-form"><Suspense fallback={<p>Preparing the quote form...</p>}><EnquiryForm fixedKind={kind} heading={formHeading} /></Suspense></section>
  </main><SiteFooter /></>;
}
