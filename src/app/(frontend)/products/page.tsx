import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/common/prisma";
import { ProductCard } from "@/components/frontend/product/product-card";
import { ProductFilters } from "@/components/frontend/product/product-filters";
import { Pagination } from "@/components/common/pagination";
import { FlaskConical, Download, FileText } from "lucide-react";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Product Catalogue",
  description:
    "Browse our catalogue of 2,200+ unique laboratory reagents and fine chemicals — acids, solvents, buffers, indicators and specialty chemicals with CAS, HSN and pack size details.",
};

const PAGE_SIZE = 24;
const DEFAULT_CATALOGUE_URL = "/downloads/Quanta-Chem-Product-Catalogue.pdf";

async function getCatalogueUrl() {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "product_catalogue_url" } });
    return setting?.value || DEFAULT_CATALOGUE_URL;
  } catch {
    return DEFAULT_CATALOGUE_URL;
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);
  const q = searchParams.q?.trim();
  const category = searchParams.category;
  const sort = searchParams.sort || "name_asc";

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { sku: { contains: q } },
      { casNumber: { contains: q } },
    ];
  }
  if (category) where.category = { slug: category };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "name_desc" ? { name: "desc" } : sort === "newest" ? { createdAt: "desc" } : { name: "asc" };

  let items: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  let total = 0;
  try {
    [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, packSizes: true, images: { take: 1 } },
        orderBy,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
    ]);
  } catch {
    items = [];
    total = 0;
  }
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const catalogueUrl = await getCatalogueUrl();

  return (
    <div className="bg-navy-50/30">
      <div className="border-b border-navy-100 bg-white">
        <div className="container-px mx-auto max-w-7xl py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="eyebrow">Product Catalogue</span>
              <h1 className="section-heading mt-4">2,200+ unique laboratory reagents & fine chemicals</h1>
              <p className="mt-3 max-w-2xl text-navy-600">
                Search by product name, SKU or CAS number, or filter by category to find exactly what
                your lab or production line needs.
              </p>
            </div>

            <a
              href={catalogueUrl}
              download
              className="card-surface flex w-full shrink-0 items-center gap-4 p-5 transition-transform hover:-translate-y-0.5 lg:w-80"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <FileText className="h-6 w-6" />
              </span>
              <span className="flex-1">
                <span className="block font-display text-sm font-semibold text-navy-900">
                  Full Product Catalogue
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="container-px mx-auto max-w-7xl py-12">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Suspense>
              <ProductFilters />
            </Suspense>
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between text-sm text-navy-500">
              <span>
                Showing {items.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()} products
              </span>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-white py-24 text-center">
                <FlaskConical className="h-10 w-10 text-navy-300" />
                <p className="mt-4 font-display text-lg font-semibold text-navy-800">
                  No products found
                </p>
                <p className="mt-1 max-w-sm text-sm text-navy-500">
                  Try a different search term or clear your filters to see more results.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}

            <Suspense>
              <Pagination currentPage={page} totalPages={totalPages} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}