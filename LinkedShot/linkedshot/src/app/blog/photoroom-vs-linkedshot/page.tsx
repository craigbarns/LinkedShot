import type { Metadata } from "next";
import Link from "next/link";
import PhotoRoomVsLinkedShotContent from "./content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linkedshot.com";
const slug = "photoroom-vs-linkedshot";
const canonicalUrl = `${siteUrl}/blog/${slug}`;

export const metadata: Metadata = {
    title: "PhotoRoom vs LinkedShot: Which is Best for Amazon FBA? (2026)",
    description:
        "PhotoRoom vs LinkedShot comparison for Amazon sellers. Compare background removal quality, Amazon compliance, pricing (subscription vs credits), and speed.",
    openGraph: {
        title: "PhotoRoom vs LinkedShot: Best Tool for Amazon Product Photos?",
        description:
            "Honest comparison between PhotoRoom and LinkedShot. Which tool handles Amazon's #FFFFFF white background better?",
        type: "article",
        url: canonicalUrl,
        publishedTime: "2026-03-12T00:00:00Z",
        modifiedTime: "2026-03-12T00:00:00Z",
        authors: ["LinkedShot"],
        tags: ["photoroom alternative", "photoroom vs linkedshot", "amazon product photos", "white background tool"],
    },
    alternates: { canonical: canonicalUrl },
};

const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "PhotoRoom vs LinkedShot: Which is Best for Your Amazon Business?",
    description:
        "Comparison of PhotoRoom and LinkedShot for e-commerce background removal and Amazon compliance.",
    url: canonicalUrl,
    datePublished: "2026-03-12T00:00:00Z",
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
    keywords: "photoroom, linkedshot, photoroom alternative, amazon product photo editor, background removal comparison",
    articleSection: "Market Comparison",
    wordCount: 1000,
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
            name: "PhotoRoom vs LinkedShot",
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
                    <li className="text-zinc-700">PhotoRoom vs LinkedShot</li>
                </ol>
            </nav>
            <PhotoRoomVsLinkedShotContent />
            <div className="mt-12 space-y-4 border-t border-zinc-200 pt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-400"
                >
                    Try LinkedShot free — 3 images, no credit card →
                </Link>
                <p className="text-sm text-zinc-500">
                    Also read:{" "}
                    <Link href="/blog/remove-background-product-photo-amazon" className="text-emerald-600 underline hover:text-emerald-700">
                        5 methods to remove background for Amazon
                    </Link>
                    {" · "}
                    <Link href="/blog/amazon-photo-requirements-2024" className="text-emerald-600 underline hover:text-emerald-700">
                        Amazon Photo Requirements 2026
                    </Link>
                </p>
            </div>
        </>
    );
}
