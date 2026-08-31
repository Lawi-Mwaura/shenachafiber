import Link from "next/link";
import { businessProfile } from "@/lib/business";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

type SiteFooterProps = { showFloatingChat?: boolean };

export function SiteFooter({ showFloatingChat = false }: SiteFooterProps) {
  const whatsappHref = `https://wa.me/${businessProfile.whatsapp.replace("+", "")}`;

  return (
    <>
      <footer className="site-footer site-footer-expanded">
        <div className="footer-intro">
          <Link className="brand footer-brand" href="/" aria-label="Shenacha Fiber home"><span>SHENACHA FIBER</span></Link>
          <p>Fibre internet in Juja, plus CCTV and biometric access solutions for properties across Kenya.</p>
        </div>
        <div className="footer-column">
          <strong>Services</strong>
          <Link href="/fibre-internet">Fibre internet</Link>
          <Link href="/cctv">CCTV solutions</Link>
          <Link href="/biometric-access">Biometric access</Link>
        </div>
        <div className="footer-column">
          <strong>Enquiries</strong>
          <Link href="/enquire">Start an enquiry</Link>
          <Link href="/coverage">Check fibre availability</Link>
          <Link href="/fibre-internet#property-meeting">Book a property meeting</Link>
          <Link href="/contact">Contact Shenacha</Link>
        </div>
        <div className="footer-column">
          <strong>Support</strong>
          <a href={whatsappHref} target="_blank" rel="noreferrer"><WhatsAppIcon size={17} /> WhatsApp {businessProfile.whatsappDisplay}</a>
          <a href={`tel:${businessProfile.supportPhone}`}>Call {businessProfile.supportPhoneDisplay}</a>
          <a href={`mailto:${businessProfile.email}`}>{businessProfile.email}</a>
          <Link href="/help">Troubleshooting</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <p className="footer-legal">© 2026 Shenacha Fiber · Meetings and assessments are arranged in advance; there is no walk-in office.</p>
      </footer>
      {showFloatingChat ? <a className="floating-chat" href={whatsappHref} target="_blank" rel="noreferrer" aria-label={`WhatsApp Shenacha Fiber on ${businessProfile.whatsappDisplay}`}><WhatsAppIcon size={21} /><span>WhatsApp</span></a> : null}
    </>
  );
}
