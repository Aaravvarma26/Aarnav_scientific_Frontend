import type { MetadataRoute } from "next";
import { getSitemapData } from "@/common/api";
import { siteConfig } from "@/common/site-config";
import { industriesList, productCategoriesList } from "@/common/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/products",
    "/industries",
    "/about",
    "/about/infrastructure",
    "/about/quality-policy",
    "/about/team",
    "/manufacturing",
    "/export",
    "/certifications",
    "/blog",
    "/contact",
    "/inquiry",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const categoryRoutes = productCategoriesList.map((c) => ({
    url: `${siteConfig.url}/products?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const industryRoutes = industriesList.map((i) => ({
    url: `${siteConfig.url}/industries/${i.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { products, posts } = await getSitemapData();
    productRoutes = products.map((p) => ({
      url: `${siteConfig.url}/products/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
    blogRoutes = posts.map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }));
  } catch {
    /* DB unavailable at build time — sitemap still returns static routes */
  }

  return [...staticRoutes, ...categoryRoutes, ...industryRoutes, ...productRoutes, ...blogRoutes];
}