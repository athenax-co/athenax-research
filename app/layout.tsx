import type { Metadata } from "next";
import { Inter, Londrina_Solid, Space_Grotesk, VT323, Geist } from "next/font/google";
import "./globals.css";
import "./styles.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const londrinaSolid = Londrina_Solid({
  weight: ["300", "400", "900"],
  subsets: ["latin"],
  variable: "--font-londrina",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const vt323 = VT323({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://athenax.co"),
  title: "AthenaX — Discovery Platform for Frontier Products",
  description:
    "AthenaX is a discovery platform for frontier technology products and research across AI, crypto, biotech, infrastructure, robotics, and developer tools.",
  icons: {
    icon: "https://athenax.mypinx.store/favicon.png",
  },
  openGraph: {
    type: "website",
    siteName: "AthenaX",
    title: "AthenaX — Discovery Platform for Frontier Products",
    description:
      "AthenaX is a discovery platform for frontier technology products and research across AI, crypto, biotech, infrastructure, robotics, and developer tools.",
    images: [{ url: "/AthenaX_OG.jpg", width: 1200, height: 630, alt: "AthenaX" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AthenaX — Discovery Platform for Frontier Products",
    description:
      "AthenaX is a discovery platform for frontier technology products and research across AI, crypto, biotech, infrastructure, robotics, and developer tools.",
    images: ["/AthenaX_OG.jpg"],
  },
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import Providers from "./providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${spaceGrotesk.variable} ${londrinaSolid.variable} ${vt323.variable} ${inter.variable} antialiased`}
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
