import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Shenacha Fiber",
    short_name: "Shenacha",
    description: "Fibre internet, structured cabling, CCTV and biometric access services in Nairobi.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#0b1830",
  };
}
