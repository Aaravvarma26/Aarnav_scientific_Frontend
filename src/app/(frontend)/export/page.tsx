import type { Metadata } from "next";
import { cache } from "react";
import { backendFetch } from "@/common/backend";
import { siteConfig } from "@/common/site-config";
import { Ship, FileCheck2, PackageCheck, Globe2 } from "lucide-react";
import { WorldExportMap } from "@/components/frontend/export/world-map";
import type { CountryData } from "@/common/api-types";

// Fallback list used only if the database is unavailable at build/request time
// (keeps the page — and the map — working even before the DB is seeded).
const FALLBACK_COUNTRIES = [
  "India", "United Arab Emirates", "United States", "United Kingdom", "Germany",
  "Bangladesh", "Sri Lanka", "Nepal", "Kenya", "South Africa", "Vietnam",
  "Indonesia", "Saudi Arabia", "Nigeria", "Brazil", "Malaysia", "Ethiopia",
  "Jordan", "Egypt", "Thailand", "Singapore", "Uganda", "Sudan", "Mauritius",
  "Iran", "Oman", "Bahrain", "Myanmar", "Cambodia", "Burundi", "Malawi",
  "Rwanda", "Zambia",
];

// cache() dedupes this across generateMetadata and the page component within
// the same request, so the SEO description and the on-page copy can never
// drift apart the way a hardcoded "30+ countries" string did before.
const getCountryNames = cache(async (): Promise<string[]> => {
  const dbCountries: CountryData[] = await backendFetch<{ countries: CountryData[] }>("/api/countries?served=true")
    .then((data) => data.countries || [])
    .catch((): CountryData[] => []);
  return dbCountries.length > 0 ? dbCountries.map((c: CountryData) => c.name) : FALLBACK_COUNTRIES;
});

export async function generateMetadata(): Promise<Metadata> {
  const countryNames = await getCountryNames();
  return {
    title: "Export",
    description: `Aarnav Scientific exports laboratory reagents and fine chemicals to ${countryNames.length}+ countries with compliant packaging, documentation and logistics.`,
  };
}

const highlights = [
  { icon: FileCheck2, title: "Export Documentation", desc: "Complete documentation including COA, MSDS, packing list and certificate of origin." },
  { icon: PackageCheck, title: "Compliant Packaging", desc: "Packaging that meets international shipping and hazard-classification standards." },
  { icon: Ship, title: "Reliable Logistics", desc: "Coordinated freight-forwarding for sea and air shipments worldwide." },
  { icon: Globe2, title: "Global Reach", desc: "Active export relationships across Asia, the Middle East, Africa and beyond." },
];

export default async function ExportPage() {
  const countryNames = await getCountryNames();

  return (
    <div className="bg-white">
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">Export</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">Exporting Indian chemical quality worldwide</h1>
        </div>
      </div>

      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="card-surface p-6">
              <h.icon className="h-8 w-8 text-teal-600" />
              <h3 className="mt-4 font-display text-base font-semibold text-navy-900">{h.title}</h3>
              <p className="mt-2 text-sm text-navy-600">{h.desc}</p>
            </div>
          ))}
        </div>

        {countryNames.length > 0 && (
          <div className="mt-16">
            <h2 className="section-heading text-center">Countries We Serve</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-navy-600">
              From our {siteConfig.address.city} headquarters, we currently export to {countryNames.length}+ countries
              across Asia, the Middle East, Africa, Europe and the Americas.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {countryNames.map((name: string) => (
                <span key={name} className="rounded-full border border-navy-200 px-4 py-2 text-sm font-medium text-navy-700">
                  {name}
                </span>
              ))}
            </div>

            <div className="mt-10">
              <WorldExportMap countries={countryNames} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}