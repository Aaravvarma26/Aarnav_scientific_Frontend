import type { MetadataRoute } from "next";
import { prisma } from "@/common/prisma";
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
    const [products, posts] = await Promise.all([
      prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true }, take: 5000 }),
      prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    ]);
    productRoutes = products.map((p) => ({
      url: `${siteConfig.url}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
    blogRoutes = posts.map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    }));
  } catch {
    /* DB unavailable at build time — sitemap still returns static routes */
  }

  return [...staticRoutes, ...categoryRoutes, ...industryRoutes, ...productRoutes, ...blogRoutes];
}