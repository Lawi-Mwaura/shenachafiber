import { notFound, redirect } from "next/navigation";

const redirects: Record<string, string> = {
  "fiber-internet-nairobi": "/fibre-internet",
  "fiber-internet-juja": "/fibre-internet",
  "cctv-installation-nairobi": "/cctv",
  "cctv-installation-juja": "/cctv",
  "biometric-access-control-nairobi": "/biometric-access",
  "biometric-access-control-juja": "/biometric-access",
};

export function generateStaticParams() { return Object.keys(redirects).map((slug) => ({ slug })); }
export default async function LegacyServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = redirects[slug];
  if (destination) redirect(destination);
  notFound();
}
