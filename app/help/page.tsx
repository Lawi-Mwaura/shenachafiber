import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { Envelope } from "@phosphor-icons/react/dist/ssr/Envelope";
import { Phone } from "@phosphor-icons/react/dist/ssr/Phone";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import type { Metadata } from "next";
import { troubleshootingGuides, troubleshootingSteps } from "@/lib/site-data";
import { businessProfile } from "@/lib/business";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Internet Troubleshooting & Payment Help",
  description: "Restart your router, check power and WAN lights, renew an expired connection and safely change your Shenacha Wi-Fi password.",
  alternates: { canonical: "/help" },
  openGraph: { title: "Internet Troubleshooting | Shenacha Fiber", description: "Simple connection, payment and router checks before contacting support.", url: "/help" },
};

export default function HelpPage() {
  const whatsappHref = `https://wa.me/${businessProfile.whatsapp.replace("+", "")}`;
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="help-page">
        <div className="help-shell">
        <Link className="back-link" href="/"><ArrowLeft size={18} aria-hidden="true" /> Back to home</Link>
        <p className="eyebrow">SHENACHA SUPPORT</p>
        <h1>Internet not working? Check these three things.</h1>
        <p className="help-intro">Follow these checks in order. If you are still offline, tell support whether the Power and WAN lights are on, off or blinking.</p>

        <ol className="help-steps">
          {troubleshootingSteps.map((step, index) => <li key={step.title}><span>0{index + 1}</span><div><h2>{step.title}</h2><p>{step.body}</p></div></li>)}
        </ol>

        <section className="support-contact-band" aria-labelledby="offline-contact-title">
          <div><p className="eyebrow light">STILL OFFLINE?</p><h2 id="offline-contact-title">Call or WhatsApp support.</h2><p>Share your name, location and the lights showing on the router.</p></div>
          <div className="support-contact-actions"><a className="button button-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer"><WhatsAppIcon size={19} /> {businessProfile.whatsappDisplay}</a><a className="button button-ghost-light" href={`tel:${businessProfile.supportPhone}`}><Phone size={19} aria-hidden="true" /> {businessProfile.supportPhoneDisplay}</a></div>
        </section>

        <section className="payment-help" aria-labelledby="payment-help-title">
          <div><p className="eyebrow">EXPIRED CONNECTION</p><h2 id="payment-help-title">Renew an expired connection.</h2></div>
          <div className="payment-details"><span>Paybill number</span><strong>{businessProfile.paymentNumber}</strong><span>Account number</span><strong>Your name</strong></div>
          <p>Confirm the payment details before sending and keep the confirmation message.</p>
        </section>

        <section className="help-guides" aria-labelledby="help-guides-title">
          <p className="eyebrow">ROUTER & ACCOUNT HELP</p>
          <h2 id="help-guides-title">Choose the issue that matches yours.</h2>
          <div>{troubleshootingGuides.map((guide) => <details key={guide.title}><summary>{guide.title}</summary><p>{guide.body}</p></details>)}</div>
        </section>

        <div className="pppoe-warning">
          <WarningCircle size={29} weight="fill" aria-hidden="true" />
          <div><h2>Never change the PPPoE username or password.</h2><p>Only change the Wi-Fi name or password in Wi-Fi Settings. Editing PPPoE details will take your connection offline.</p></div>
        </div>

        <div className="support-options">
          <div><h2>Need help with a complaint or service change?</h2><p>Send a WhatsApp message or email the team with your name, location and request.</p></div>
          <div className="support-options-actions"><a className="button button-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer"><WhatsAppIcon size={20} /> WhatsApp</a><a className="button button-outline" href={`mailto:${businessProfile.email}`}><Envelope size={20} aria-hidden="true" /> Email us</a></div>
        </div>
        </div>
      </main>
      <SiteFooter showFloatingChat={false} />
    </>
  );
}
