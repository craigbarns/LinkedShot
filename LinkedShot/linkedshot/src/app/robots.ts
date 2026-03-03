import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linkedshot.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/auth/", "/admin", "/dashboard"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/", "/auth/", "/admin", "/dashboard"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
