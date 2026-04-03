import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/settings", "/onboarding", "/pending", "/rejected"],
    },
    sitemap: "https://supertest.vercel.app/sitemap.xml",
  };
}
