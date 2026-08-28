export type ProductCategoryData = {
  name: string;
  slug: string;
};

export type ProductCardData = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  casNumber?: string | null;
  category?: ProductCategoryData | null;
  packSizes?: { id?: string; label: string }[];
  images?: { id?: string; url: string }[];
  isPopular?: boolean;
};

export type ProductDetailData = ProductCardData & {
  hsnCode?: string | null;
  unNumber?: string | null;
  chemicalFormula?: string | null;
  molecularWeight?: string | null;
  purity?: string | null;
  appearance?: string | null;
  applications?: string | null;
  safetyInfo?: string | null;
  storageConditions?: string | null;
  description?: string | null;
  isActive: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  images: { id: string; url: string }[];
  packSizes: { id: string; label: string }[];
  specifications: { id: string; label: string; value: string }[];
  downloads: { id: string; fileUrl: string; type: string }[];
};

export type ProductListResponse = {
  items: ProductCardData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ProductDetailResponse = {
  product: ProductDetailData;
  related: ProductCardData[];
};

export type BlogTagData = {
  id: string;
  name: string;
  slug: string;
};

export type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  publishedAt?: string | null;
  createdAt: string;
};

export type BlogPostDetail = BlogPostSummary & {
  content: string;
  status: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  updatedAt: string;
  author?: { name?: string | null } | null;
  tags: BlogTagData[];
};

export type BlogListResponse = {
  items: BlogPostSummary[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type BlogDetailResponse = {
  post: BlogPostDetail;
};

export type CertificateData = {
  id: string;
  title: string;
  issuer?: string | null;
  certNumber?: string | null;
  imageUrl: string;
  fileUrl?: string | null;
};

export type CatalogueItemData = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  fileUrl: string;
};

export type PartnerData = {
  id: string;
  name: string;
  logoUrl: string;
};

export type TestimonialData = {
  id: string;
  name: string;
  company?: string | null;
  country?: string | null;
  message: string;
  rating: number;
};

export type IndustryViewData = {
  name: string;
  slug: string;
  summary?: string | null;
  content?: string | null;
  imageUrl?: string | null;
};

export type IndustryProductData = {
  id: string;
  slug: string;
  name: string;
};

export type CountryData = {
  id: string;
  name: string;
};

export type SettingsResponse = {
  settings: Record<string, string>;
};

export type SitemapItemData = {
  slug: string;
  updatedAt: string;
};

export type SitemapDataResponse = {
  products: SitemapItemData[];
  posts: SitemapItemData[];
};