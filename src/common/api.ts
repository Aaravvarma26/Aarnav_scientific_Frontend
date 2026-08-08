const BACKEND_URL = (process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");

async function apiGet<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: { Accept: "application/json", ...(options?.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${path}${body ? `: ${body.slice(0, 200)}` : ""}`);
  }
  return res.json() as Promise<T>;
}

export type ProductCardData = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  casNumber?: string | null;
  categoryId?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  category?: { id?: string; name: string; slug: string } | null;
  packSizes?: { id?: string; label: string }[];
  images?: { id?: string; url: string; altText?: string | null; sortOrder?: number }[];
  [key: string]: unknown;
};

export type ProductsResponse = {
  items: ProductCardData[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type ProductDetailResponse = {
  product: ProductCardData & Record<string, any>;
  related: ProductCardData[];
};

export type BlogPostData = Record<string, any> & {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  tags: Array<{ id: string; name: string; slug: string }>;
  author?: { name: string } | null;
};

export type SiteContent = {
  certificates: Array<Record<string, any>>;
  testimonials: Array<Record<string, any>>;
  partners: Array<Record<string, any>>;
  countries: Array<{ id: string; name: string; code?: string | null }>;
  catalogueUrl: string;
};

export function getProducts(params: Record<string, string | number | boolean | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  return apiGet<ProductsResponse>(`/api/products?${query.toString()}`, { cache: "no-store" });
}

export function getProduct(slug: string) {
  return apiGet<ProductDetailResponse>(`/api/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
}

export function getBlogPosts(params: { q?: string; page?: number; limit?: number } = {}) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  query.set("page", String(params.page || 1));
  query.set("limit", String(params.limit || 100));
  return apiGet<{ items: BlogPostData[]; pagination: ProductsResponse["pagination"] }>(
    `/api/blog?${query.toString()}`,
    { cache: "no-store" }
  );
}

export function getBlogPost(slug: string) {
  return apiGet<{ post: BlogPostData }>(`/api/blog/${encodeURIComponent(slug)}`, { cache: "no-store" });
}

export function getIndustries() {
  return apiGet<{ industries: Array<Record<string, any>> }>("/api/industries", { cache: "no-store" });
}

export function getSiteContent() {
  return apiGet<SiteContent>("/api/site-content", { cache: "no-store" });
}

export function getSitemapData() {
  return apiGet<{
    products: Array<{ slug: string; updatedAt: string }>;
    posts: Array<{ slug: string; updatedAt: string }>;
  }>("/api/sitemap", { cache: "no-store" });
}