import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Pill, UtensilsCrossed, Sparkles, Wheat, FlaskConical, Factory, Droplets, TestTubes } from "lucide-react";
import { industriesList } from "@/common/site-config";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description: "Aarnav Scientific supplies chemicals to pharmaceutical, food, cosmetics, agriculture, laboratory, industrial and water-treatment industries worldwide.",
};

const iconMap: Record<string, React.ElementType> = {
  Pill, UtensilsCrossed, Sparkles, Wheat, FlaskConical, Factory, Droplets, TestTubes,
};

export default function IndustriesPage() {
  return (
    <div className="bg-white">
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">Industries We Serve</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">
            Purpose-built chemical solutions across sectors
          </h1>
        </div>
      </div>

      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industriesList.map((ind) => {
            const Icon = iconMap[ind.icon] || FlaskConical;
            return (
              <Link key={ind.slug} href={`/industries/${ind.slug}`} className="card-surface group p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                  <Icon className="h-6 w-6 text-teal-600" />
                </div>
                <h2 className="mt-5 font-display text-lg font-semibold text-navy-900">{ind.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{ind.summary}</p>
                <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-teal-700 opacity-0 transition-opacity group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
