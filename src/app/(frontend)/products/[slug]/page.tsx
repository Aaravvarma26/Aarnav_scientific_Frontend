import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct as fetchProduct } from "@/common/api";
import { Badge } from "@/components/common/badge";
import { ProductCard } from "@/components/frontend/product/product-card";
import { InquiryButton } from "@/components/frontend/product/inquiry-button";
import { CoaRequestButton } from "@/components/frontend/product/coa-request-button";
import {
  FlaskConical,
  Package,
  FileText,
  ShieldAlert,
  Thermometer,
  ChevronRight,
  Download,
} from "lucide-react";

async function getProduct(slug: string) {
  const data = await fetchProduct(slug);
  return data.product;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug).catch(() => null);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.seoTitle || `${product.name} — CAS ${product.casNumber || "N/A"}`,
    description:
      product.seoDescription ||
      `${product.name} (SKU: ${product.sku})${
        product.casNumber ? `, CAS ${product.casNumber}` : ""
      } — available from Aarnav Scientific in multiple pack sizes. Request a quotation today.`,
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const data = await fetchProduct(params.slug).catch(() => null);
  const product = data?.product || null;
  if (!product || !product.isActive) notFound();

  const related = data?.related || [];

  const specRows = [
    { label: "CAS Number", value: product.casNumber },
    { label: "HSN Code", value: product.hsnCode },
    { label: "UN Number", value: product.unNumber },
    { label: "Chemical Formula", value: product.chemicalFormula },
    { label: "Molecular Weight", value: product.molecularWeight },
    { label: "Purity", value: product.purity },
    { label: "Appearance", value: product.appearance },
  ].filter((r) => r.value);

  return (
    <div className="bg-white">
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto flex max-w-7xl items-center gap-1.5 py-4 text-xs text-navy-500">
          <Link href="/" className="hover:text-teal-700">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-teal-700">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-teal-700">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 text-navy-800">{product.name}</span>
        </div>
      </div>

      <div className="container-px mx-auto max-w-7xl py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="sticky top-24 flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br from-navy-50 to-teal-50">
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0].url} alt={product.name} className="h-full w-full rounded-2xl object-contain p-6" />
              ) : (
                <FlaskConical className="h-24 w-24 text-teal-400/50" />
              )}
            </div>
          </div>

          <div>
            {product.category && <Badge variant="teal">{product.category.name}</Badge>}
            <h1 className="mt-4 font-display text-3xl font-bold text-navy-900 md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-navy-500">SKU: {product.sku}</p>

            {specRows.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-2xl border border-navy-100 bg-navy-50/40 p-5 text-sm sm:grid-cols-3">
                {specRows.map((r) => (
                  <div key={r.label}>
                    <p className="text-xs uppercase tracking-wide text-navy-400">{r.label}</p>
                    <p className="mt-0.5 font-medium text-navy-800">{r.value}</p>
                  </div>
                ))}
              </div>
            )}

            {product.packSizes.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-navy-800">
                  <Package className="h-4 w-4 text-teal-600" /> Available Pack Sizes
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.packSizes.map((p) => (
                    <span key={p.id} className="rounded-full border border-navy-200 px-3 py-1.5 text-xs font-medium text-navy-700">
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <InquiryButton productId={product.id} productName={product.name} />
              <CoaRequestButton productId={product.id} productName={product.name} sku={product.sku} />
              {product.downloads.map((d) => (
                <a
                  key={d.id}
                  href={d.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <Download className="h-4 w-4" /> {d.type === "MSDS" ? "MSDS" : "Datasheet"}
                </a>
              ))}
            </div>

            {product.description && (
              <div className="mt-8 border-t border-navy-100 pt-6">
                <h2 className="font-display text-lg font-semibold text-navy-900">Description</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-navy-600">
                  {product.description}
                </p>
              </div>
            )}

            {product.applications && (
              <div className="mt-6 border-t border-navy-100 pt-6">
                <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold text-navy-900">
                  <FileText className="h-4 w-4 text-teal-600" /> Applications
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-navy-600">
                  {product.applications}
                </p>
              </div>
            )}

            {product.safetyInfo && (
              <div className="mt-6 border-t border-navy-100 pt-6">
                <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold text-navy-900">
                  <ShieldAlert className="h-4 w-4 text-amber-600" /> Safety Information
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-navy-600">
                  {product.safetyInfo}
                </p>
              </div>
            )}

            {product.storageConditions && (
              <div className="mt-6 border-t border-navy-100 pt-6">
                <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold text-navy-900">
                  <Thermometer className="h-4 w-4 text-teal-600" /> Storage Conditions
                </h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-navy-600">
                  {product.storageConditions}
                </p>
              </div>
            )}

            {product.specifications.length > 0 && (
              <div className="mt-6 border-t border-navy-100 pt-6">
                <h2 className="font-display text-lg font-semibold text-navy-900">Specifications</h2>
                <table className="mt-3 w-full text-sm">
                  <tbody>
                    {product.specifications.map((s) => (
                      <tr key={s.id} className="border-b border-navy-100 last:border-0">
                        <td className="py-2 pr-4 font-medium text-navy-700">{s.label}</td>
                        <td className="py-2 text-navy-600">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20 border-t border-navy-100 pt-12">
            <h2 className="section-heading">Related Products</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}