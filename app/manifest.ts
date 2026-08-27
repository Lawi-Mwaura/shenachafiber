import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shenacha Fiber",
    short_name: "Shenacha",
    description: "Fibre internet in Juja, plus CCTV and biometric access solutions for properties.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b1f3a",
  };
}
