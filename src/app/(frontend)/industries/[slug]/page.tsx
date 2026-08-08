import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getIndustries, getProducts } from "@/common/api";
import { industriesList } from "@/common/site-config";
import { ArrowRight } from "lucide-react";

// Products have no direct relation to an industry — the only structured signal
// available is product category, so relevance is derived from that. This is a
// curated approximation, not per-product tagging: some industries (e.g.
// Cosmetics, Agriculture) don't have a dedicated category yet, so they map to
// the closest available one. Adjust freely as categories evolve.
const INDUSTRY_CATEGORY_SLUGS: Record<string, string[]> = {
  pharmaceuticals: ["pharmaceutical-chemicals"],
  food: ["food-chemicals"],
  cosmetics: ["organic-chemicals"],
  agriculture: ["inorganic-chemicals", "organic-chemicals"],
  laboratory: ["laboratory-chemicals"],
  "industrial-chemicals": ["inorganic-chemicals", "acids", "solvents"],
  "water-treatment": ["water-treatment-chemicals"],
  "specialty-chemicals": ["organic-chemicals"],
};

export async function generateStaticParams() {
  return industriesList.map((i) => ({ slug: i.slug }));
}

async function getIndustry(slug: string) {
  try {
    const fromDb = await getIndustries().then((data) => data.industries.find((item) => item.slug === slug));
    if (fromDb) return fromDb;
  } catch {
    /* fall through to static config */
  }
  const fallback = industriesList.find((i) => i.slug === slug);
  return fallback ? { ...fallback, content: null, imageUrl: null } : null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const industry = await getIndustry(params.slug);
  if (!industry) return { title: "Industry Not Found" };
  return { title: industry.name, description: industry.summary || undefined };
}

export default async function IndustryDetailPage({ params }: { params: { slug: string } }) {
  const industry = await getIndustry(params.slug);
  if (!industry) notFound();

  const relevantCategorySlugs = INDUSTRY_CATEGORY_SLUGS[industry.slug];

  let products = relevantCategorySlugs
    ? await getProducts({ categories: relevantCategorySlugs.join(","), limit: 4, sort: "featured" })
        .then((data) => data.items)
        .catch(() => [])
    : [];

  // Graceful fallback so the section never ends up empty if a mapped category has no live products yet.
  if (products.length === 0) {
    products = await getProducts({ limit: 4, sort: "featured" })
      .then((data) => data.items)
      .catch(() => []);
  }

  return (
    <div className="bg-white">
      <div className="bg-hero-gradient py-20">
        <div className="container-px mx-auto max-w-4xl text-center">
          <span className="eyebrow bg-white/10 text-teal-300">Industries We Serve</span>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-4xl">{industry.name}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-navy-200">{industry.summary}</p>
        </div>
      </div>

      <div className="container-px mx-auto max-w-4xl py-16">
        <div className="prose prose-navy max-w-none text-navy-700">
          <p className="leading-relaxed">
            Aarnav Scientific supports the {industry.name.toLowerCase()} sector with consistently
            manufactured, quality-tested chemicals backed by full documentation — Certificates of
            Analysis, MSDS and technical datasheets — for every batch. Our team works closely with
            procurement and QA departments to ensure the right grade, packaging and delivery
            schedule for your operation.
          </p>
        </div>

        {products.length > 0 && (
          <div className="mt-14 rounded-2xl border border-navy-100 bg-navy-50/40 p-8">
            <h2 className="font-display text-lg font-semibold text-navy-900">
              Relevant products from our catalogue
            </h2>
            <ul className="mt-4 space-y-2">
              {products.map((p) => (
                <li key={p.id}>
                  <Link href={`/products/${p.slug}`} className="text-sm font-medium text-teal-700 hover:underline">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/products" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline">
              Browse full catalogue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/inquiry" className="btn-primary">
            Request a Quotation for {industry.name}
          </Link>
        </div>
      </div>
    </div>
  );
}