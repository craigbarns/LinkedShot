import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TrackVisit } from "@/components/TrackVisit";
import TrackPageView from "@/components/TrackPageView";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linkedshot.com";
const ogImageUrl = `${siteUrl}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Amazon Product Photos in Seconds | White Background AI – LinkedShot",
    template: "%s | LinkedShot",
  },
  description:
    "Create Amazon-compliant product photos in seconds: white background (#FFFFFF), remove background, HD PNG. 3 free images, no credit card. Used by FBA sellers. Try 1 free image without sign-up.",
  keywords: [
    "amazon product photography",
    "white background amazon",
    "remove background amazon",
    "amazon photo requirements",
    "product photo white background",
    "amazon listing images",
    "FBA product photos",
    "AI background removal",
  ],
  authors: [{ name: "LinkedShot", url: siteUrl }],
  creator: "LinkedShot",
  publisher: "LinkedShot",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "LinkedShot",
    title: "Amazon Product Photos in Seconds | White Background AI – LinkedShot",
    description:
      "Create Amazon-compliant product photos in seconds. White background, remove background, HD PNG. 3 free images. Try 1 free without sign-up.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "LinkedShot – Amazon product photos, white background, in seconds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazon Product Photos in Seconds | White Background AI – LinkedShot",
    description: "Amazon-compliant product photos in seconds. White background, 3 free images.",
    images: [ogImageUrl],
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
  verification: {},
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LinkedShot",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Create Amazon-compliant product photos in seconds. AI removes the background and outputs pure white (#FFFFFF) or transparent PNG. Used by Amazon and FBA sellers.",
  url: siteUrl,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
    lowPrice: "0",
    highPrice: "29",
    offerCount: "3",
  },
  featureList: [
    "Amazon white background (#FFFFFF)",
    "Transparent PNG",
    "HD 1024×1024 PNG",
    "~3 seconds per image",
    "No Photoshop required",
  ],
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LinkedShot",
  url: siteUrl,
  logo: `${siteUrl}/og-image.png`,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        {children}
        <TrackPageView />
        <TrackVisit />
        <Analytics />
      </body>
    </html>
  );
}
