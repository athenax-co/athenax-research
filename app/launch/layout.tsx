import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AthenaX - Launch Frontier Products",
  description:
    "Launch your product on AthenaX and connect with builders, researchers, investors, and early adopters across frontier technology.",
  keywords: ["frontier products", "product discovery", "emerging technology", "AI", "crypto", "biotech", "robotics", "developer tools", "research"],
  openGraph: {
    title: "AthenaX - Launch Frontier Products",
    description:
      "Launch your product on AthenaX and connect with builders, researchers, investors, and early adopters across frontier technology.",
    images: ["/AthenaX_OG.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
