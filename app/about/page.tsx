import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "About Shenacha", description: "One company delivering fibre internet in Juja and property-led CCTV and biometric access solutions.", alternates: { canonical: "/about" }, openGraph: { url: "/about", title: "One Company. Three Solutions.", description: "Meet Shenacha: connectivity, security and access." } };

const steps = [
  ["01", "Understand the property", "We begin with the location, building, priorities and people who will use the service."],
  ["02", "Assess and recommend", "Where needed, the team arranges a property assessment and prepares a practical scope."],
  ["03", "Confirm before work", "Availability, equipment, pricing, timing and responsibilities are agreed before installation."],
];

export default function AboutPage() {
  return <><SiteHeader /><main id="main-content" className="canonical-page">
    <section className="canonical-hero about-hero"><div><p className="eyebrow">ABOUT SHENACHA</p><h1>One Company.<br />Three Solutions.</h1><p>Shenacha brings connectivity, security and access together for homes, apartments, offices, businesses and other properties.</p><Link className="button button-primary" href="/enquire">Start an enquiry</Link></div><div className="canonical-hero-image"><Image src="/images/network-technician.avif" alt="A network technician working with communications equipment" fill priority sizes="(max-width: 900px) 100vw, 48vw" /></div></section>
    <section className="values-grid"><article><span>01</span><h2>Connectivity</h2><p>Reliable fibre internet currently focused on Juja, with availability confirmed for each building or area.</p></article><article><span>02</span><h2>Security</h2><p>Professional CCTV solutions planned around the property, its priority views and budget.</p></article><article><span>03</span><h2>Access</h2><p>Modern biometric access systems selected around compatible entrances and daily use.</p></article></section>
    <section className="about-process" aria-labelledby="about-process-title"><div><p className="eyebrow">HOW WE WORK</p><h2 id="about-process-title">Practical decisions before installation.</h2><p>Each project is grounded in the actual property. That keeps recommendations clear and avoids promising work before the details are understood.</p></div><ol>{steps.map(([number, title, body]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol></section>
    <section className="positioning-band"><p className="eyebrow light">OUR POSITION</p><h2>Internet for Juja.<br />Security and access across Kenya.</h2><p>Every project begins with the practical details. Meetings and property assessments are arranged in advance because Shenacha does not operate a walk-in office.</p><Link className="button button-light" href="/contact">Contact Shenacha <ArrowRight size={18} aria-hidden="true" /></Link></section>
  </main><SiteFooter /></>;
}
