import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Race The Rails - DC Metro Running Challenge",
  description:
    "An unsanctioned, self-supported urban road race against DC's metro lines. Run DC, one line at a time.",
  metadataBase: new URL("https://racetherails.com"),
  openGraph: {
    title: "Race The Rails - DC Metro Running Challenge",
    description:
      "An unsanctioned, self-supported urban road race against DC's metro lines. Run DC, one line at a time.",
    images: [
      {
        url: "/images/hero/WMATA_metro_center_crossvault.jpg",
        width: 1200,
        height: 630,
        alt: "DC Metro Station with iconic waffle ceiling",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Race The Rails - DC Metro Running Challenge",
    description:
      "An unsanctioned, self-supported urban road race against DC's metro lines. Run DC, one line at a time.",
    images: ["/images/hero/WMATA_metro_center_crossvault.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
