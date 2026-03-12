import type { Metadata } from "next";
import Link from "next/link";
import PhotoSizeArticleContent from "./content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linkedshot.com";
const slug = "best-amazon-product-photo-size";
const canonicalUrl = `${siteUrl}/blog/${slug}`;

export const metadata: Metadata = {
    title: "Best Amazon Product Photo Size in 2026: Dimensions, Format & Specs",
    description:
        "Amazon product image size guide 2026: minimum 1000×1000px, recommended 2000×2000px. PNG vs JPEG, aspect ratio, zoom requirements. Avoid listing suppression.",
    openGraph: {
        title: "Best Amazon Product Photo Size in 2026: Complete Specification Guide",
        description:
            "Exact Amazon product image dimensions, formats, and specs. Avoid listing suppression with the right size.",
        type: "article",
        url: canonicalUrl,
        publishedTime: "2026-02-20T00:00:00Z",
        modifiedTime: "2026-03-12T00:00:00Z",
        authors: ["LinkedShot"],
        tags: ["amazon product photo size", "amazon image dimensions", "amazon image requirements"],
    },
    alternates: { canonical: canonicalUrl },
};

const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Amazon Product Photo Size in 2026: Dimensions, Format & Specs",
    description:
        "Complete guide to Amazon product image sizes: minimum, recommended, and optimal dimensions for maximum conversions.",
    url: canonicalUrl,
    datePublished: "2026-02-20T00:00:00Z",
    dateModified: "2026-03-12T00:00:00Z",
    author: { "@type": "Organization", name: "LinkedShot", url: siteUrl },
    publisher: {
        "@type": "Organization",
        name: "LinkedShot",
        url: siteUrl,
        logo: { "@type": "ImageObject", url: `${siteUrl}/og-image.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    image: `${siteUrl}/og-image.png`,
    keywords: "amazon product photo size, amazon image dimensions, amazon image requirements 2026, amazon photo specifications",
    articleSection: "Amazon Compliance",
    wordCount: 1200,
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
            name: "Best Amazon Product Photo Size 2026",
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
                    <li className="text-zinc-700">Best Amazon Product Photo Size 2026</li>
                </ol>
            </nav>
            <PhotoSizeArticleContent />
            <div className="mt-12 space-y-4 border-t border-zinc-200 pt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-400"
                >
                    Try LinkedShot free — 3 images, no credit card →
                </Link>
                <p className="text-sm text-zinc-500">
                    Also read:{" "}
                    <Link href="/blog/amazon-photo-requirements-2024" className="text-emerald-600 underline hover:text-emerald-700">
                        Amazon Photo Requirements 2026 (Complete Guide)
                    </Link>
                    {" · "}
                    <Link href="/blog/remove-background-product-photo-amazon" className="text-emerald-600 underline hover:text-emerald-700">
                        How to Remove Background for Amazon
                    </Link>
                </p>
            </div>
        </>
    );
}
