import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AthenaX - Frontier Research & Insights",
  description:
    "Explore research, analysis, and commentary covering frontier technologies, emerging products, and internet-native innovation.",
  keywords: ["frontier products", "product discovery", "emerging technology", "AI", "crypto", "biotech", "robotics", "developer tools", "research"],
  openGraph: {
    title: "AthenaX - Frontier Research & Insights",
    description:
      "Explore research, analysis, and commentary covering frontier technologies, emerging products, and internet-native innovation.",
    images: ["/AthenaX_OG.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
