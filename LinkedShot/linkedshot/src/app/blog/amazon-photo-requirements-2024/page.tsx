import type { Metadata } from "next";
import Link from "next/link";
import Article1Content from "./content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linkedshot.com";
const slug = "amazon-photo-requirements-2024";
const canonicalUrl = `${siteUrl}/blog/${slug}`;

export const metadata: Metadata = {
  title: "Amazon Product Photo Requirements 2025: Complete Guide to Compliance",
  description:
    "Complete guide to Amazon image requirements 2025: size, pure white background (#FFFFFF), shadows, and formats. Avoid listing suppression with these rules.",
  openGraph: {
    title: "Amazon Product Photo Requirements 2025: Complete Guide to Compliance",
    description:
      "Complete guide to Amazon image requirements 2025: size, pure white background (#FFFFFF), shadows, and formats. Avoid listing suppression.",
    type: "article",
    url: canonicalUrl,
    publishedTime: "2025-01-10T00:00:00Z",
    modifiedTime: "2025-03-01T00:00:00Z",
    authors: ["LinkedShot"],
    tags: ["amazon photo requirements", "white background amazon", "FBA photos"],
  },
  alternates: { canonical: canonicalUrl },
};

const jsonLdArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Amazon Product Photo Requirements 2025: Complete Guide to Compliance",
  description:
    "Complete guide to Amazon image requirements 2025: size, pure white background (#FFFFFF), shadows, and formats.",
  url: canonicalUrl,
  datePublished: "2025-01-10T00:00:00Z",
  dateModified: "2025-03-01T00:00:00Z",
  author: { "@type": "Organization", name: "LinkedShot", url: siteUrl },
  publisher: {
    "@type": "Organization",
    name: "LinkedShot",
    url: siteUrl,
    logo: { "@type": "ImageObject", url: `${siteUrl}/og-image.png` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  image: `${siteUrl}/og-image.png`,
  keywords: "amazon photo requirements, white background amazon, FBA seller photos",
  articleSection: "Amazon Compliance",
  wordCount: 900,
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Amazon Product Photo Requirements 2025",
      item: canonicalUrl,
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-zinc-500">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-zinc-900">Home</Link></li>
          <li aria-hidden className="text-zinc-300">/</li>
          <li><Link href="/blog" className="hover:text-zinc-900">Blog</Link></li>
          <li aria-hidden className="text-zinc-300">/</li>
          <li className="text-zinc-700">Amazon Photo Requirements 2025</li>
        </ol>
      </nav>
      <Article1Content />
      <div className="mt-12 space-y-4 border-t border-zinc-200 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-400"
        >
          Try LinkedShot free — 3 images, no credit card →
        </Link>
        <p className="text-sm text-zinc-500">
          Also read:{" "}
          <Link href="/blog/fiverr-vs-software-vs-ai-amazon-photos" className="text-emerald-600 underline hover:text-emerald-700">
            Fiverr vs AI for Amazon photos (2025 comparison)
          </Link>
          {" · "}
          <Link href="/blog/amazon-product-photography-without-photographer" className="text-emerald-600 underline hover:text-emerald-700">
            Amazon photos without a photographer
          </Link>
        </p>
      </div>
    </>
  );
}
