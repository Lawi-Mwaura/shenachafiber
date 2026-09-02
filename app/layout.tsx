import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { businessProfile } from "@/lib/business";
import "./globals.css";
import "./canonical.css";

const display = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shenachafiber.com"),
  title: {
    default: "Shenacha | Connectivity, Security & Access",
    template: "%s | Shenacha Fiber",
  },
  description:
    "Fibre internet in Juja, plus professional CCTV and biometric access solutions wherever your property is located.",
  keywords: [
    "fibre internet Juja",
    "CCTV installation Kenya",
    "biometric access control Kenya",
    "property technology solutions",
  ],
  openGraph: {
    title: "Shenacha Fiber",
    description: "Connectivity. Security. Access. Fibre in Juja; CCTV and biometric access wherever your property is located.",
    url: "https://www.shenachafiber.com",
    siteName: "Shenacha Fiber",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "/images/family-laptop.jpg",
        width: 1200,
        height: 630,
        alt: "A family using a laptop together at home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shenacha Fiber",
    description: "Fibre internet in Juja, plus CCTV and biometric access solutions for properties wherever located.",
    images: ["/images/family-laptop.jpg"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://www.shenachafiber.com/#business",
      name: "Shenacha Fiber",
      url: "https://www.shenachafiber.com",
      email: businessProfile.email,
      contactPoint: [
        { "@type": "ContactPoint", telephone: businessProfile.whatsapp, contactType: "WhatsApp enquiries", availableLanguage: ["English", "Swahili"] },
        { "@type": "ContactPoint", telephone: businessProfile.supportPhone, contactType: "customer support", availableLanguage: ["English", "Swahili"] },
      ],
      areaServed: [
        { "@type": "Place", name: "Juja", description: "Fibre internet service area" },
        { "@type": "Country", name: "Kenya", description: "CCTV and biometric access enquiries are accepted based on property location" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Connectivity and security services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fibre internet in Juja", url: "https://www.shenachafiber.com/fibre-internet" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "CCTV solutions", url: "https://www.shenachafiber.com/cctv" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Biometric access control", url: "https://www.shenachafiber.com/biometric-access" } },
        ],
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </body>
    </html>
  );
}
