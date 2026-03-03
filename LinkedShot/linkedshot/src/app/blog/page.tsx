import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linkedshot.com";

export const metadata: Metadata = {
  title: "Amazon Product Photo Guides – White Background, Compliance, AI Tips",
  description:
    "Guides for Amazon product photography: image requirements, white background (#FFFFFF), Fiverr vs AI, remove background. Get your listings approved.",
  openGraph: {
    title: "Amazon Product Photo Guides – White Background & Compliance | LinkedShot Blog",
    description: "Guides for Amazon image requirements, white background, and AI product photos.",
    type: "website",
    url: `${siteUrl}/blog`,
  },
  alternates: { canonical: `${siteUrl}/blog` },
};

const SLUG_TO_SUMMARY: Record<string, string> = {
  "amazon-photo-requirements-2024":
    "Size, pure white (#FFFFFF), shadows, formats. Avoid listing suppression.",
  "amazon-product-photography-without-photographer":
    "DIY setup vs Fiverr vs AI. Get studio-quality white backgrounds from supplier photos.",
  "fiverr-vs-software-vs-ai-amazon-photos":
    "Cost, speed, quality: Fiverr ($5), Photoshop (hours), or AI ($0.18/image)?",
};

export default function BlogPage() {
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-zinc-900">Blog</h1>
      <p className="mb-10 text-zinc-600">
        Guides for Amazon sellers: photo rules, tools, and workflows.
      </p>
      <ul className="space-y-8">
        {BLOG_POSTS.map((post) => (
          <li key={post.slug} className="border-b border-zinc-200 pb-8 last:border-0">
            <Link
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-blue-600">
                {post.title}
              </h2>
              <p className="mt-2 text-zinc-600">
                {SLUG_TO_SUMMARY[post.slug] ?? post.description}
              </p>
              <span className="mt-2 inline-block text-sm text-zinc-500">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
