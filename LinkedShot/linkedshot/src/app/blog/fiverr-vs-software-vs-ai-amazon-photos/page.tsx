import type { Metadata } from "next";
import Link from "next/link";
import Article3Content from "./content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linkedshot.com";
const slug = "fiverr-vs-software-vs-ai-amazon-photos";
const canonicalUrl = `${siteUrl}/blog/${slug}`;

export const metadata: Metadata = {
  title: "Amazon Photos: Fiverr vs Photoshop vs AI Tools (2025 Comparison)",
  description:
    "Fiverr ($5/image), Photoshop (hours), or AI ($0.18/image)? Honest comparison for Amazon product photography. Which is best for bulk editing in 2025?",
  openGraph: {
    title: "Amazon Photos: Fiverr vs Photoshop vs AI Tools (2025 Comparison)",
    description:
      "Fiverr ($5/image), Photoshop (hours), or AI ($0.18/image)? Honest comparison for Amazon product photography. Best for bulk editing?",
    type: "article",
    url: canonicalUrl,
    publishedTime: "2025-01-20T00:00:00Z",
    modifiedTime: "2025-03-01T00:00:00Z",
    authors: ["LinkedShot"],
    tags: ["fiverr amazon photos", "AI background removal", "remove background amazon"],
  },
  alternates: { canonical: canonicalUrl },
};

const jsonLdArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Amazon Photos: Fiverr vs Photoshop vs AI Tools (2025 Comparison)",
  description:
    "Fiverr ($5/image), Photoshop (hours), or AI ($0.18/image)? Honest comparison for Amazon product photography.",
  url: canonicalUrl,
  datePublished: "2025-01-20T00:00:00Z",
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
  keywords: "fiverr amazon photos, AI background removal, remove background amazon",
  articleSection: "Tools & Comparison",
  wordCount: 1100,
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
      name: "Fiverr vs Software vs AI for Amazon Photos",
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
          <li className="text-zinc-700">Fiverr vs AI for Amazon Photos</li>
        </ol>
      </nav>
      <Article3Content />
      <div className="mt-12 space-y-4 border-t border-zinc-200 pt-8">
        <Link
          href="/#pricing"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-400"
        >
          Process 50 images for €9 vs €250 on Fiverr →
        </Link>
        <p className="text-sm text-zinc-500">
          Also read:{" "}
          <Link href="/blog/amazon-photo-requirements-2024" className="text-emerald-600 underline hover:text-emerald-700">
            Amazon product photo guidelines (2025)
          </Link>
          {" · "}
          <Link href="/blog/amazon-product-photography-without-photographer" className="text-emerald-600 underline hover:text-emerald-700">
            DIY Amazon Photography Guide
          </Link>
        </p>
      </div>
    </>
  );
}
