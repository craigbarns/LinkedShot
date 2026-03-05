import type { Metadata } from "next";
import Link from "next/link";
import Article2Content from "./content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linkedshot.com";
const slug = "amazon-product-photography-without-photographer";
const canonicalUrl = `${siteUrl}/blog/${slug}`;

export const metadata: Metadata = {
  title: "How to Shoot Amazon Product Photos Without a Photographer (Under $10)",
  description:
    "Professional Amazon photos without hiring a photographer. DIY setup vs AI tools. Get studio-quality white backgrounds from your supplier mess.",
  openGraph: {
    title: "How to Shoot Amazon Product Photos Without a Photographer (Under $10)",
    description:
      "Professional Amazon photos without hiring a photographer. DIY setup vs AI tools. Get studio-quality white backgrounds from your supplier mess.",
    type: "article",
    url: canonicalUrl,
    publishedTime: "2025-01-15T00:00:00Z",
    modifiedTime: "2025-03-01T00:00:00Z",
    authors: ["LinkedShot"],
    tags: ["amazon product photography", "DIY product photos", "white background"],
  },
  alternates: { canonical: canonicalUrl },
};

const jsonLdArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Shoot Amazon Product Photos Without a Photographer (Under $10)",
  description:
    "Professional Amazon photos without hiring a photographer. DIY setup vs AI tools.",
  url: canonicalUrl,
  datePublished: "2025-01-15T00:00:00Z",
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
  keywords: "amazon product photography, DIY product photos, white background",
  articleSection: "Product Photography",
  wordCount: 1050,
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
      name: "Amazon Product Photos Without a Photographer",
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
          <li className="text-zinc-700">Amazon Photos Without a Photographer</li>
        </ol>
      </nav>
      <Article2Content />
      <div className="mt-12 space-y-4 border-t border-zinc-200 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-400"
        >
          Upload your worst supplier photo →
        </Link>
        <p className="text-sm text-zinc-500">
          Also read:{" "}
          <Link href="/blog/amazon-photo-requirements-2024" className="text-emerald-600 underline hover:text-emerald-700">
            Amazon product photo requirements (2025 rules)
          </Link>
          {" · "}
          <Link href="/blog/fiverr-vs-software-vs-ai-amazon-photos" className="text-emerald-600 underline hover:text-emerald-700">
            Fiverr vs AI for Amazon photos
          </Link>
        </p>
      </div>
    </>
  );
}
