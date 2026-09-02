import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.shenachafiber.com";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/fibre-internet`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/cctv`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/biometric-access`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/coverage`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/enquire`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/help`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
