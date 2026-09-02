import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  allowedDevOrigins: ["192.168.0.103"],
  experimental: {
    preloadEntriesOnStart: false,
    webpackMemoryOptimizations: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/services/fiber-internet-nairobi", destination: "/fibre-internet", permanent: true },
      { source: "/services/fiber-internet-juja", destination: "/fibre-internet", permanent: true },
      { source: "/services/cctv-installation-nairobi", destination: "/cctv", permanent: true },
      { source: "/services/cctv-installation-juja", destination: "/cctv", permanent: true },
      { source: "/services/biometric-access-control-nairobi", destination: "/biometric-access", permanent: true },
      { source: "/services/biometric-access-control-juja", destination: "/biometric-access", permanent: true },
    ];
  },
};

export default nextConfig;
