import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import { businessProfile } from "@/lib/business";
import "./globals.css";

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
  metadataBase: new URL("https://shenachafiber.com"),
  title: {
    default: "Shenacha Fiber | Internet, CCTV & Biometric Access in Nairobi",
    template: "%s | Shenacha Fiber",
  },
  description:
    "Fibre and Wi-Fi connections, structured cabling, CCTV installation and biometric access for Nairobi homes, apartments and offices.",
  keywords: [
    "fibre internet Nairobi",
    "Wi-Fi installation Nairobi",
    "CCTV installation Nairobi",
    "biometric gate access Nairobi",
    "cable trunking Nairobi",
  ],
  openGraph: {
    title: "Shenacha Fiber",
    description: "Connected. Secured. Supported across Nairobi.",
    url: "https://shenachafiber.com",
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
    description: "Fibre internet, structured cabling, CCTV and biometric access services in Nairobi.",
    images: ["/images/family-laptop.jpg"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://shenachafiber.com/#business",
      name: "Shenacha Fiber",
      url: "https://shenachafiber.com",
      email: businessProfile.email,
      contactPoint: [
        { "@type": "ContactPoint", telephone: businessProfile.whatsapp, contactType: "WhatsApp enquiries", availableLanguage: ["English", "Swahili"] },
        { "@type": "ContactPoint", telephone: businessProfile.supportPhone, contactType: "customer support", availableLanguage: ["English", "Swahili"] },
      ],
      areaServed: { "@type": "City", name: "Nairobi" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Connectivity and security services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fibre internet, Wi-Fi and structured cabling", url: "https://shenachafiber.com/services/fiber-internet-nairobi" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "CCTV installation", url: "https://shenachafiber.com/services/cctv-installation-nairobi" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Biometric access control", url: "https://shenachafiber.com/services/biometric-access-control-nairobi" } },
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
