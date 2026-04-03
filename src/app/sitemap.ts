import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://supertest.vercel.app";

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/games`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    { url: `${baseUrl}/security`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
