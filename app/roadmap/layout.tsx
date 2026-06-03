import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AthenaX - Product Roadmap",
  description:
    "Follow the AthenaX roadmap as we expand discovery, research, community participation, and ecosystem infrastructure.",
  keywords: ["frontier products", "product discovery", "emerging technology", "AI", "crypto", "biotech", "robotics", "developer tools", "research"],
  openGraph: {
    title: "AthenaX - Product Roadmap",
    description:
      "Follow the AthenaX roadmap as we expand discovery, research, community participation, and ecosystem infrastructure.",
    images: ["/AthenaX_OG.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
