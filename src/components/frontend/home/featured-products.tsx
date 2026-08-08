import Link from "next/link";
import { ArrowRight, Beaker } from "lucide-react";
import { getProducts } from "@/common/api";
import { ProductCard } from "@/components/frontend/product/product-card";

export async function FeaturedProducts() {
  let products: Awaited<ReturnType<typeof fetchFeatured>> = [];
  try {
    products = await fetchFeatured();
  } catch {
    products = [];
  }

  if (products.length === 0) return null;

  return (
    <section className="section-y bg-navy-50/50">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Featured Products</span>
            <h2 className="section-heading mt-4">Popular from our catalogue</h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-semibold text-teal-700 hover:underline"
          >
            View full catalogue <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function fetchFeatured() {
  return getProducts({ featured: true, limit: 8 }).then((data) => data.items);
}

export function FeaturedProductsFallbackIcon() {
  return <Beaker className="h-5 w-5" />;
}