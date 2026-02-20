import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TrackVisit } from "@/components/TrackVisit";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://linkedshot.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LinkedShot – Amazon Product Photos in Seconds | White Background AI",
    template: "%s | LinkedShot",
  },
  description:
    "Turn supplier photos into Amazon-compliant white background images in seconds. 3 free credits, no Photoshop. HD PNG, €0.18/image. Used by Amazon sellers.",
  authors: [{ name: "LinkedShot", url: siteUrl }],
  creator: "LinkedShot",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "LinkedShot",
    title: "LinkedShot – Amazon Product Photos in Seconds",
    description:
      "Turn supplier photos into Amazon-compliant white background images. 3 free credits. No Photoshop required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkedShot – Amazon product photos in seconds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedShot – Amazon Product Photos in Seconds",
    description: "White background images for Amazon in seconds. 3 free credits.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Optional: add when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LinkedShot",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Turn supplier photos into Amazon-compliant white background images in seconds. AI-powered background removal.",
  url: siteUrl,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: "0",
    highPrice: "29",
    offerCount: "3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) - Analytics + Ads */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SQ8931TST7"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              // Analytics (nouveau)
              gtag('config', 'G-SQ8931TST7');

              // Google Ads (conversions)
              gtag('config', 'AW-17687923294');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <TrackVisit />
        <Analytics />
      </body>
    </html>
  );
}
