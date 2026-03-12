import type { Metadata } from "next";
import Link from "next/link";
import RemoveBgArticleContent from "./content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linkedshot.com";
const slug = "remove-background-product-photo-amazon";
const canonicalUrl = `${siteUrl}/blog/${slug}`;

export const metadata: Metadata = {
    title: "How to Remove Background from Product Photos for Amazon (2026)",
    description:
        "5 methods to remove background from product photos for Amazon: Photoshop, Remove.bg, Canva, Fiverr, and AI tools. Compare cost, speed, and quality. Get pure white #FFFFFF background.",
    openGraph: {
        title: "How to Remove Background from Product Photos for Amazon (2026)",
        description:
            "Compare 5 methods to get Amazon-compliant white background product photos. From free to pro solutions.",
        type: "article",
        url: canonicalUrl,
        publishedTime: "2026-03-01T00:00:00Z",
        modifiedTime: "2026-03-12T00:00:00Z",
        authors: ["LinkedShot"],
        tags: ["remove background", "product photo", "amazon white background", "background removal"],
    },
    alternates: { canonical: canonicalUrl },
};

const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Remove Background from Product Photos for Amazon (2026 Guide)",
    description:
        "5 methods to remove background from product photos for Amazon. Compare Photoshop, Remove.bg, Canva, Fiverr, and LinkedShot.",
    url: canonicalUrl,
    datePublished: "2026-03-01T00:00:00Z",
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
    keywords: "remove background product photo, amazon white background, background removal amazon, product photo editing",
    articleSection: "Product Photography",
    wordCount: 1500,
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
            name: "Remove Background from Product Photos for Amazon",
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
                    <li className="text-zinc-700">Remove Background for Amazon</li>
                </ol>
            </nav>
            <RemoveBgArticleContent />
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
                    <Link href="/blog/best-amazon-product-photo-size" className="text-emerald-600 underline hover:text-emerald-700">
                        Best Amazon Product Photo Size in 2026
                    </Link>
                </p>
            </div>
        </>
    );
}
