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
const gtmId = "GTM-567NXBG7";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Amazon Product Photos in Seconds | White Background AI – LinkedShot",
    template: "%s | LinkedShot",
  },
  description:
    "Create Amazon-compliant product photos in seconds: white background (#FFFFFF), remove background, HD PNG. 3 free images, no credit card. Used by 2,800+ FBA sellers.",
  keywords: [
    "amazon product photography",
    "white background amazon",
    "remove background amazon",
    "amazon photo requirements",
    "product photo white background",
    "amazon listing images",
    "FBA product photos",
    "AI background removal",
    "amazon background removal",
    "amazon compliant photos",
    "product photo editing",
    "remove background product photo",
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
      "Remove background, get pure white #FFFFFF HD PNG in ~3 seconds. Amazon-compliant. 3 free images — no credit card.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "LinkedShot – Amazon product photos with white background, in seconds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazon Product Photos in Seconds | White Background AI – LinkedShot",
    description:
      "Remove background from product photos. Get Amazon-compliant white background in ~3 seconds. 3 free images.",
    images: [ogImageUrl],
    creator: "@LinkedShot",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  // Google Search Console verification — add your code here when ready
  verification: {
    // google: "YOUR_GSC_VERIFICATION_CODE",
  },
};

// ── Structured Data ──────────────────────────────────────────────────────────

/** WebSite schema enables Google Sitelinks Searchbox */
const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "LinkedShot",
  url: siteUrl,
  description:
    "AI-powered Amazon product photo background removal. Pure white (#FFFFFF) or transparent PNG in seconds.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?s={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

/** SoftwareApplication with real AggregateRating → can show stars in Google SERPs */
const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LinkedShot",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description:
    "Create Amazon-compliant product photos in seconds. AI removes the background and outputs pure white (#FFFFFF) or transparent PNG in ~3 seconds. Used by 2,800+ Amazon FBA sellers.",
  screenshot: ogImageUrl,
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      name: "Free",
      description: "3 free images, no credit card required",
    },
    {
      "@type": "Offer",
      price: "9",
      priceCurrency: "EUR",
      name: "Starter",
      description: "50 images, ~€0.18/image, HD PNG",
    },
    {
      "@type": "Offer",
      price: "29",
      priceCurrency: "EUR",
      name: "Pro",
      description: "200 images, ~€0.15/image, HD PNG, priority support",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "214",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "Amazon white background (#FFFFFF)",
    "Transparent PNG export",
    "HD 1024×1024 PNG",
    "Background removal in ~3 seconds",
    "Bulk processing up to 10 images",
    "ZIP download",
    "No Photoshop required",
  ],
};

/** Organization with logo for Google Knowledge Panel */
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LinkedShot",
  url: siteUrl,
  logo: {
    "@type": "ImageObject",
    url: ogImageUrl,
    width: 1200,
    height: 630,
  },
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: `${siteUrl}/contact`,
    availableLanguage: ["English", "French"],
  },
};

/** BreadcrumbList for the homepage */
const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteUrl,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* GEO: LLMs.txt for AI discoverability */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Information" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM Full Information" />

        {/* Google Analytics + Ads */}
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
              gtag('config', 'G-SQ8931TST7', { send_page_view: false });
              gtag('config', 'AW-17687923294');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Structured Data — all schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
        />
        {children}
        <TrackPageView />
        <TrackVisit />
        <Analytics />
      </body>
    </html>
  );
}
