import type { MetadataRoute } from "next";
import { getCategories, getColumns, getPublishedPosts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [categories, columns, posts] = await Promise.all([
    getCategories(),
    getColumns(),
    getPublishedPosts(),
  ]);
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/sections`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/columns`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    ...columns.map((column) => ({
      url: `${baseUrl}/columns/${column.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...categories
      .filter(
        (category) => !columns.some((column) => column.slug === category.slug),
      )
      .map((category) => ({
        url: `${baseUrl}/sections/${category.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...posts.map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: post.updated_at || post.published_at || post.created_at,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];
}
