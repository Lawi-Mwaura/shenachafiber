import Link from "next/link";
import { businessProfile } from "@/lib/business";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

type SiteFooterProps = {
  showFloatingChat?: boolean;
};

export function SiteFooter({ showFloatingChat = true }: SiteFooterProps) {
  const whatsappHref = `https://wa.me/${businessProfile.whatsapp.replace("+", "")}`;

  return (
    <>
      <footer className="site-footer site-footer-expanded">
        <div className="footer-intro">
          <Link className="brand footer-brand" href="/" aria-label="Shenacha Fiber home"><span>SHENACHA FIBER</span></Link>
          <p>Fibre internet, structured cabling, CCTV and biometric access for Nairobi homes, apartments, offices and other premises.</p>
        </div>
        <div className="footer-column">
          <strong>Services</strong>
          <Link href="/services/fiber-internet-nairobi">Fibre & Wi-Fi</Link>
          <Link href="/services/cctv-installation-nairobi">CCTV installation</Link>
          <Link href="/services/biometric-access-control-nairobi">Biometric access</Link>
        </div>
        <div className="footer-column">
          <strong>Start here</strong>
          <Link href="/enquire">Start an enquiry</Link>
          <Link href="/contact">Contact & meetings</Link>
          <a href={whatsappHref} target="_blank" rel="noreferrer"><WhatsAppIcon size={17} /> WhatsApp {businessProfile.whatsappDisplay}</a>
          <a href={`tel:${businessProfile.supportPhone}`}>Support {businessProfile.supportPhoneDisplay}</a>
          <a href={`mailto:${businessProfile.email}`}>{businessProfile.email}</a>
          <Link href="/help">Troubleshooting</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <p className="footer-legal">© 2026 Shenacha Fiber</p>
      </footer>
      {showFloatingChat ? (
        <a className="floating-chat" href={whatsappHref} target="_blank" rel="noreferrer" aria-label={`WhatsApp Shenacha Fiber on ${businessProfile.whatsappDisplay}`}>
          <WhatsAppIcon size={21} /><span>WhatsApp</span>
        </a>
      ) : null}
    </>
  );
}
