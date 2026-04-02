import type { Metadata } from "next";
import { Inter, Londrina_Solid, Space_Grotesk, VT323 } from "next/font/google";
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
  title: "AthenaX Research",
};

import GlobalProvider from "@/components/GlobalProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${londrinaSolid.variable} ${vt323.variable} ${inter.variable} antialiased`}
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        <GlobalProvider>
          <Navbar />
          {children}
          <Footer />
        </GlobalProvider>
      </body>
    </html>
  );
}
