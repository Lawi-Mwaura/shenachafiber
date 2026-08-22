import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { legacyServiceRoutes, servicePages, type ServicePageSlug } from "@/lib/service-pages";
import { packages } from "@/lib/site-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FiberReadyBoard } from "@/components/fiber-ready-board";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...Object.keys(servicePages), ...Object.keys(legacyServiceRoutes)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const legacyTarget = legacyServiceRoutes[slug as keyof typeof legacyServiceRoutes];
  if (legacyTarget) {
    const legacyPage = servicePages[legacyTarget];
    return { title: legacyPage.seoTitle, description: legacyPage.metaDescription, alternates: { canonical: `/services/${legacyTarget}` } };
  }
  const page = servicePages[slug as ServicePageSlug];
  if (!page) return {};
  return {
    title: page.seoTitle,
    description: page.metaDescription,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `/services/${slug}`,
      type: "website",
      images: [{ url: page.image, alt: page.imageAlt }],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const legacyTarget = legacyServiceRoutes[slug as keyof typeof legacyServiceRoutes];
  if (legacyTarget) redirect(`/services/${legacyTarget}`);
  const page = servicePages[slug as ServicePageSlug];
  if (!page) notFound();

  const enquiryHref = `/enquire?service=${page.service}`;
  const finalHeading = page.service === "internet"
    ? "Check internet coverage at your property."
    : page.service === "cctv"
      ? "Arrange a CCTV site survey."
      : "Check whether your entrance is compatible.";
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.seoTitle,
    description: page.metaDescription,
    areaServed: { "@type": "City", name: "Nairobi" },
    provider: { "@id": "https://shenachafiber.com/#business" },
    url: `https://shenachafiber.com/services/${slug}`,
  };

  return (
    <>
      <SiteHeader />
      <main id="main-content" className={`offer-page offer-${page.service}`}>
        <section className="offer-hero">
          <div className="offer-hero-copy">
            <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">{page.eyebrow.replace(" IN NAIROBI", "")}</span></nav>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <div className="offer-hero-actions">
              <Link className="button button-primary" href={enquiryHref}>{page.primaryCta} <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link className="offer-text-link" href={page.service === "internet" ? "#plans" : "/contact"}>{page.secondaryCta} <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <p className="offer-reassurance">A request is not a payment or confirmed appointment. Suitability, charges and timing are confirmed first.</p>
          </div>
          <div className="offer-hero-image">
            <Image src={page.image} alt={page.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 48vw" />
          </div>
        </section>

        <section className="offer-intro section-narrow">
          <div>
            <p className="eyebrow">PLANNED AROUND THE PROPERTY</p>
            <h2>{page.summaryTitle}</h2>
          </div>
          <p>{page.summary}</p>
        </section>

        <section className="offer-suitable" aria-labelledby="suitable-title">
          <div className="offer-section-heading"><p className="eyebrow">SUITABLE FOR</p><h2 id="suitable-title">Where we install.</h2></div>
          <div className="suitable-list">
            {page.suitableFor.map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3></article>)}
          </div>
        </section>

        {page.service === "internet" ? (
          <section className="offer-plans" id="plans" aria-labelledby="offer-plans-title">
            <div className="offer-section-heading split-heading">
              <div><p className="eyebrow">HOME INTERNET PLANS</p><h2 id="offer-plans-title">Compare home internet plans.</h2></div>
              <p>Final suitability depends on coverage, property layout and how several devices are used at the same time.</p>
            </div>
            <div className="plan-board" role="table" aria-label="Home internet packages">
              <div className="plan-board-head" role="row"><span role="columnheader">Plan</span><span role="columnheader">Speed</span><span role="columnheader">Best for</span><span role="columnheader">Monthly</span><span role="columnheader" aria-label="Action" /></div>
              {packages.map((item, index) => (
                <article className={item.featured ? "plan-row is-featured" : "plan-row"} role="row" key={item.name}>
                  <div className="plan-name" role="cell" aria-label={`Plan ${item.name}`}><span>0{index + 1}</span><div><strong>{item.name}</strong>{item.featured && <small>Most popular</small>}</div></div>
                  <p className="plan-speed" role="cell" aria-label={`Speed ${item.speed}`}>{item.speed}</p>
                  <div className="plan-fit" role="cell" aria-label={`Best for ${item.descriptor}; ${item.devices}`}><strong>{item.descriptor}</strong><span>{item.devices}</span></div>
                  <p className="plan-price" role="cell" aria-label={`${item.price} per month`}>{item.price}<span>per month</span></p>
                  <div className="plan-action-cell" role="cell" aria-label={`Choose the ${item.name} plan`}><Link className="plan-action" href={`/enquire?service=internet&plan=${encodeURIComponent(`${item.name} · ${item.speed} · ${item.price}/month`)}`}>Choose plan <ArrowRight size={16} aria-hidden="true" /></Link></div>
                </article>
              ))}
            </div>
            <p className="chapter-note">Device guidance is illustrative. Confirm package speeds, prices, installation charges, router terms and any Fair Usage Policy before payment.</p>
          </section>
        ) : null}

        {page.service === "internet" ? <FiberReadyBoard compact /> : null}

        <section className="offer-scope-grid">
          <article>
            <p className="eyebrow">WHAT TO EXPECT</p>
            <h2>What we complete before handover.</h2>
            <ul>{page.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
          </article>
          <article>
            <p className="eyebrow">CONFIRM IN WRITING</p>
            <h2>Confirm these details before work begins.</h2>
            <ul>{page.scope.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </section>

        <section className="offer-process" aria-labelledby="offer-process-title">
          <div className="offer-section-heading"><p className="eyebrow">THE PROCESS</p><h2 id="offer-process-title">From enquiry to handover.</h2></div>
          <ol>{page.process.map(([title, body], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
        </section>

        <section className="offer-faq section-narrow" aria-labelledby="offer-faq-title">
          <div><p className="eyebrow">COMMON QUESTIONS</p><h2 id="offer-faq-title">What to know before you request.</h2></div>
          <div className="faq-list">{page.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="offer-final-cta">
          <div><p className="eyebrow light">NEXT STEP</p><h2>{finalHeading}</h2><p>Share the location and service you need. Shenacha will confirm the practical next step before you commit.</p></div>
          <Link className="button button-light" href={enquiryHref}>{page.primaryCta} <ArrowRight size={18} aria-hidden="true" /></Link>
        </section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }} />
    </>
  );
}
