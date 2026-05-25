import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AthenaX Launch — Research-Backed Products Across Frontier Technology",
  description:
    "Discover research-backed products across AI, robotics, biotech, crypto, and infrastructure. Every founder is ARS-scored. Every product is grounded in indexed research.",
  openGraph: {
    title: "AthenaX Launch — Research-Backed Products Across Frontier Technology",
    description:
      "Discover research-backed products across AI, robotics, biotech, crypto, and infrastructure. Every founder is ARS-scored. Every product is grounded in indexed research.",
    images: ["/AthenaX_OG.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
