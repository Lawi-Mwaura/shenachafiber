import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shenachafiber.com";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services/fiber-internet-nairobi`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/services/cctv-installation-nairobi`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/services/biometric-access-control-nairobi`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/enquire`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/help`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
