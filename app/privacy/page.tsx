import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { businessProfile } from "@/lib/business";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Shenacha Fiber's website handles details submitted through the enquiry form.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="legal-page">
        <article>
          <Link className="back-link" href="/"><ArrowLeft size={18} aria-hidden="true" /> Back to home</Link>
          <p className="eyebrow">PRIVACY NOTICE</p>
          <h1>How we use your enquiry details.</h1>
          <p>When you submit an enquiry, we collect the contact and property details needed to respond to your request. This may include your name, phone number, email address, location, selected service and any notes you provide.</p>
          <h2>Who is responsible for the information</h2>
          <p>Shenacha Fiber is responsible for deciding how enquiry information submitted through this website is used. Questions about that information can be sent to <a href={`mailto:${businessProfile.email}`}>{businessProfile.email}</a>.</p>
          <h2>How the information is used</h2>
          <p>We use the information to confirm coverage or property requirements and to contact you about your request. We do not use enquiry details for unrelated marketing unless you give separate consent.</p>
          <h2>Storage</h2>
          <p>We store successfully submitted requests so the team can respond and follow up. If submission fails, the form tells you that the request was not sent.</p>
          <p>Enquiry details are kept only for as long as they are reasonably needed to handle the request, provide follow-up, meet applicable legal obligations or resolve a dispute. Stored details should be reviewed periodically and deleted or anonymised when they are no longer needed.</p>
          <h2>Access and service providers</h2>
          <p>Access is limited to people who need the information to respond to the enquiry or maintain the website and its secure data storage. Service providers that support the website or database may process the information only as needed to provide those services.</p>
          <h2>Your choices and rights</h2>
          <p>You may ask what personal information Shenacha holds about you, request a correction, object to or ask us to restrict its use, or request deletion when the information is no longer needed. Some requests may be limited where the information must be kept to meet a legal obligation or resolve a claim.</p>
          <h2>Questions and deletion requests</h2>
          <p>Email <a href={`mailto:${businessProfile.email}`}>{businessProfile.email}</a> if you have a privacy question, want to exercise one of these rights or want to request deletion of enquiry details.</p>
        </article>
      </main>
      <SiteFooter showFloatingChat={false} />
    </>
  );
}
