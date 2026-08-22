import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { buyingQuestions, locations, packages } from "@/lib/site-data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FiberReadyBoard } from "@/components/fiber-ready-board";

export function HomePage() {
  return (
    <>
      <SiteHeader />

      <main id="main-content">
        <section className="story-hero" id="top">
          <div className="story-hero-copy">
            <p className="eyebrow">FIBER, CCTV & ACCESS CONTROL IN NAIROBI</p>
            <h1>Internet and security systems for Nairobi properties.</h1>
            <p className="story-hero-lede">Shenacha installs fibre and Wi-Fi, structured cabling, CCTV and biometric access for homes, apartment buildings and workplaces.</p>
            <div className="story-hero-cta">
              <Link className="button button-primary" href="/enquire">Start an enquiry <ArrowRight size={18} aria-hidden="true" /></Link>
              <a className="story-hero-text-link" href="#internet">Explore services <ArrowRight size={17} aria-hidden="true" /></a>
            </div>
            <div className="story-hero-facts" aria-label="Service highlights">
              <p><span>Internet plans</span><strong>From KSh 1,500/month</strong></p>
              <p><span>First step</span><strong>Share your area and property type</strong></p>
            </div>
          </div>
          <div className="story-triptych" aria-label="Shenacha services in real homes and properties">
            <figure>
              <Image src="/images/network-switch.avif" alt="Ethernet cables connected to an active network switch" fill priority sizes="(max-width: 760px) 100vw, (max-width: 1050px) 33vw, 17vw" />
              <figcaption><span>01</span><strong>Connect</strong><small>Fibre & Wi-Fi</small></figcaption>
            </figure>
            <figure>
              <Image src="/images/cctv-camera-detail.jpg" alt="A professionally installed dome security camera" fill sizes="(max-width: 760px) 100vw, (max-width: 1050px) 33vw, 17vw" />
              <figcaption><span>02</span><strong>See</strong><small>CCTV</small></figcaption>
            </figure>
            <figure>
              <Image src="/images/biometric-office.avif" alt="A modern fingerprint access control reader at an office entrance" fill sizes="(max-width: 760px) 100vw, (max-width: 1050px) 33vw, 17vw" />
              <figcaption><span>03</span><strong>Control</strong><small>Biometric access</small></figcaption>
            </figure>
          </div>
        </section>

        <section className="company-intro" aria-labelledby="company-intro-title">
          <div>
            <p className="eyebrow">WHAT SHENACHA DOES</p>
            <h2 id="company-intro-title">One team for internet, cabling and property security.</h2>
          </div>
          <div className="company-intro-copy">
            <p>We assess the property, recommend the appropriate setup and confirm equipment, cable routes, charges and timing before installation begins.</p>
            <div className="intro-links">
              <Link href="/services/fiber-internet-nairobi">Fibre, Wi-Fi & cabling <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/services/cctv-installation-nairobi">CCTV installations <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/services/biometric-access-control-nairobi">Biometric access <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className="local-strip" aria-label="Properties we serve">
          <p>Properties we serve</p>
          <div>{locations.map((area) => <span key={area}>{area}</span>)}</div>
          <Link href="/enquire">Tell us about yours <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>

        <section className="service-chapter chapter-internet" id="internet">
          <div className="chapter-shell">
            <div className="chapter-lead">
              <div className="chapter-copy">
                <p className="chapter-number">01 / Internet</p>
                <h2>Fibre and Wi-Fi for homes, apartments and offices.</h2>
                <p>Choose a starting plan, then let the team confirm coverage, user needs and the cleanest cable route. We also offer trunking, conduit cabling and landlord Wi-Fi consultation.</p>
                <a className="chapter-link" href="#plans">Compare plans <ArrowRight size={17} aria-hidden="true" /></a>
              </div>
              <div className="chapter-photo chapter-photo-internet">
                <Image src="/images/network-technician.avif" alt="A network technician organising ethernet connections in a communications cabinet" fill sizes="(max-width: 900px) 100vw, 48vw" />
              </div>
            </div>

            <div className="plan-board" id="plans" role="table" aria-label="Home internet packages">
              <div className="plan-board-head" role="row">
                <span role="columnheader">Plan</span><span role="columnheader">Speed</span><span role="columnheader">Best for</span><span role="columnheader">Monthly</span><span role="columnheader" aria-label="Action" />
              </div>
              {packages.map((item, index) => (
                <article className={item.featured ? "plan-row is-featured" : "plan-row"} role="row" key={item.name}>
                  <div className="plan-name" role="cell" aria-label={`Plan ${item.name}`}><span>0{index + 1}</span><div><strong>{item.name}</strong>{item.featured && <small>Most popular</small>}</div></div>
                  <p className="plan-speed" role="cell" aria-label={`Speed ${item.speed}`}>{item.speed}</p>
                  <div className="plan-fit" role="cell" aria-label={`Best for ${item.descriptor}; ${item.devices}`}><strong>{item.descriptor}</strong><span>{item.devices}</span></div>
                  <p className="plan-price" role="cell" aria-label={`${item.price} per month`}>{item.price}<span>per month</span></p>
                  <div className="plan-action-cell" role="cell" aria-label={`Choose the ${item.name} plan`}>
                    <Link className="plan-action" href={`/enquire?service=internet&plan=${encodeURIComponent(`${item.name} · ${item.speed} · ${item.price}/month`)}`}>
                      Choose plan <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <p className="chapter-note">Coverage varies by building. Any installation charge, equipment and service terms are confirmed before payment.</p>
          </div>
        </section>

        <FiberReadyBoard />

        <section className="service-chapter chapter-security" id="security">
          <div className="chapter-shell chapter-split">
            <div className="chapter-photo chapter-photo-security">
              <Image src="/images/cctv-modern-building.avif" alt="A dome security camera mounted on a modern commercial building" fill sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className="chapter-copy chapter-copy-wide">
              <p className="chapter-number">02 / CCTV</p>
              <h2>CCTV planned around entrances, compounds and blind spots.</h2>
              <p>Camera placement designed around gates, entrances, compounds and real blind spots—with recording and remote viewing explained at handover.</p>
              <ul className="chapter-facts">
                <li><span>Survey</span> Sightlines, lighting and blind spots</li>
                <li><span>Install</span> Neat cabling, cameras and recording</li>
                <li><span>Handover</span> Day, night and remote-view testing</li>
              </ul>
              <div className="chapter-actions">
                <Link className="button button-dark" href="/enquire?service=cctv">Plan my CCTV system <ArrowRight size={16} aria-hidden="true" /></Link>
                <Link className="chapter-detail-link" href="/services/cctv-installation-nairobi">See CCTV service <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="service-chapter chapter-access" id="access">
          <div className="chapter-shell chapter-split chapter-split-reverse">
            <div className="chapter-copy chapter-copy-wide">
              <p className="chapter-number">03 / Biometric access</p>
              <h2>Biometric access for compatible gates and doors.</h2>
              <p>Fingerprint and credential systems integrated with compatible gates and doors at homes, offices, apartments and other suitable premises.</p>
              <ul className="chapter-facts">
                <li><span>Plan</span> Gate type, power and manual override</li>
                <li><span>Control</span> Users, permissions and credentials</li>
                <li><span>Support</span> Clear owner and caretaker training</li>
              </ul>
              <div className="chapter-actions">
                <Link className="button button-dark" href="/enquire?service=access">Plan access control <ArrowRight size={16} aria-hidden="true" /></Link>
                <Link className="chapter-detail-link" href="/services/biometric-access-control-nairobi">See biometric service <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </div>
            <div className="chapter-photo chapter-photo-access">
              <Image src="/images/biometric-workplace.avif" alt="A professional using a fingerprint scanner at a workplace entrance" fill sizes="(max-width: 900px) 100vw, 44vw" />
            </div>
          </div>
        </section>

        <section className="assurance-strip story-process" id="process" aria-labelledby="process-title">
          <div className="process-heading">
            <p className="eyebrow light">How Shenacha works</p>
            <h2 id="process-title">A clear job, before anyone starts drilling.</h2>
            <p>Every recommendation starts with the property—not a one-size-fits-all package.</p>
          </div>
          <ol>
            <li><span>01</span><div><small>Understand</small><strong>Discuss the property</strong><p>Tell us the location, property type, users and the result you need.</p></div></li>
            <li><span>02</span><div><small>Agree</small><strong>Confirm the scope</strong><p>Equipment, charges, cable routes and timing are clear before work begins.</p></div></li>
            <li><span>03</span><div><small>Deliver</small><strong>Install, test, hand over</strong><p>We test the system with you and explain how to use it confidently.</p></div></li>
          </ol>
        </section>

        <section className="section faq-section" id="questions" aria-labelledby="questions-title">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">Before you commit</p><h2 id="questions-title">What to confirm before you pay.</h2></div>
            <p>Final equipment, charges and service terms depend on the property and package. Shenacha confirms them before payment.</p>
          </div>
          <div className="faq-list">
            {buyingQuestions.map((item) => (
              <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>
            ))}
          </div>
        </section>

        <section className="support-section" id="support">
          <div>
            <p className="eyebrow">Existing customer?</p>
            <h2>Try these checks before you call support.</h2>
            <p>Guided checks help diagnose power, cable and router issues before you contact support.</p>
          </div>
          <div className="support-actions">
            <Link className="button button-primary" href="/help">Open troubleshooting guide <ArrowRight size={17} aria-hidden="true" /></Link>
            <Link className="support-text-link" href="/enquire?service=support">Contact support <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </section>

        <section className="local-cta" id="enquire">
          <Image src="/images/apartment-exterior.jpg" alt="A modern residential apartment building" fill sizes="100vw" />
          <div className="local-cta-panel">
            <p className="eyebrow light">Local installations and support</p>
            <h2>Get a clear scope before installation.</h2>
            <p>Tell us your area, property type and what you need. We will confirm suitability and agree the next step.</p>
            <div>
              <Link className="button button-light" href="/enquire?service=internet">Discuss internet for my property</Link>
              <Link className="button button-ghost-light" href="/enquire">Start an enquiry</Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
