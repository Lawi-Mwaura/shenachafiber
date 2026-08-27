import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const services = [
  { number: "01", label: "SHENACHA FIBRE", title: "Reliable Fibre Internet in Juja", body: "Fibre internet for homes, apartments, offices and businesses within Juja.", href: "/fibre-internet", cta: "Explore fibre internet", image: "/images/family-laptop.jpg", alt: "A family using a laptop together at home" },
  { number: "02", label: "CCTV SOLUTIONS", title: "Security You Can See.", body: "Professional CCTV installation for homes, offices, apartments, businesses and commercial properties.", href: "/cctv", cta: "Explore CCTV solutions", image: "/images/cctv-installation.jpg", alt: "A technician installing a CCTV camera at a property" },
  { number: "03", label: "BIOMETRIC ACCESS", title: "Smarter, Safer Access.", body: "Modern biometric access solutions for homes, apartments, offices, businesses and other properties.", href: "/biometric-access", cta: "Explore biometric access", image: "/images/biometric-access.jpg", alt: "A person using a fingerprint access-control reader" },
];

export function HomePage() {
  return <><SiteHeader /><main id="main-content">
    <section className="new-hero">
      <div className="new-hero-copy"><p className="eyebrow">ONE COMPANY. THREE SOLUTIONS.</p><h1>Connectivity.<br />Security.<br />Access.</h1><p>Smart technology solutions for homes, businesses, apartments and properties.</p><div className="hero-action-grid"><Link className="button button-primary" href="/coverage#availability-form">Check Fibre Availability</Link><Link className="button button-outline" href="/fibre-internet#property-meeting">Book a Property Meeting</Link><Link className="text-action" href="/contact#request-quote">Request a Quote <ArrowRight size={17} aria-hidden="true" /></Link></div><div className="availability-note"><strong>Fibre: Juja only</strong><span>CCTV and biometric access: wherever your property is located</span></div></div>
      <div className="new-hero-image"><Image src="/images/apartment-exterior.jpg" alt="A residential apartment property served by Shenacha solutions" fill priority sizes="(max-width: 900px) 100vw, 52vw" /></div>
    </section>

    <section className="service-index" aria-labelledby="services-title"><div className="section-heading"><p className="eyebrow">WHAT WE DO</p><h2 id="services-title">Three focused services.<br />One practical partner.</h2></div>{services.map((service, index) => <article className={index % 2 ? "service-feature reverse" : "service-feature"} key={service.href}><div className="service-feature-copy"><span>{service.number} / {service.label}</span><h3>{service.title}</h3><p>{service.body}</p><Link href={service.href}>{service.cta} <ArrowRight size={17} aria-hidden="true" /></Link></div><div className="service-feature-image"><Image src={service.image} alt={service.alt} fill sizes="(max-width: 800px) 100vw, 50vw" /></div></article>)}</section>

    <section className="positioning-band"><p className="eyebrow light">CLEAR SERVICE AREAS</p><h2>Internet for Juja.<br />Security and access solutions wherever you need them.</h2><p>Fibre availability is confirmed manually for each building or area. CCTV and biometric projects start with a discussion about your property, wherever it is located.</p><Link className="button button-light" href="/contact">Talk to Shenacha <ArrowRight size={18} aria-hidden="true" /></Link></section>
  </main><SiteFooter /></>;
}
