import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linkedshot.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Homepage — highest priority, changes often
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Blog index
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Blog articles — high-value SEO pages
    {
      url: `${baseUrl}/blog/photoroom-vs-linkedshot`,
      lastModified: new Date("2026-03-12"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog/remove-background-product-photo-amazon`,
      lastModified: new Date("2026-03-12"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog/best-amazon-product-photo-size`,
      lastModified: new Date("2026-03-12"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog/amazon-photo-requirements-2024`,
      lastModified: new Date("2026-03-10"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog/amazon-product-photography-without-photographer`,
      lastModified: new Date("2026-03-10"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog/fiverr-vs-software-vs-ai-amazon-photos`,
      lastModified: new Date("2026-03-10"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    // Contact — moderate priority
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    // Legal — low crawl priority
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2026-01-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // NOTE: /login and /dashboard excluded — no SEO value, causes canonical issues
  ];
}
