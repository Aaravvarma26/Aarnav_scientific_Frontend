import Link from "next/link";
import Image from "next/image";
import { backendFetch } from "@/common/backend";
import { ArrowRight, Download } from "lucide-react";
import type { CertificateData, SettingsResponse } from "@/common/api-types";

const DEFAULT_CATALOGUE_URL = "/downloads/Quanta-Chem-Product-Catalogue.pdf";

export async function CertificatesSection() {
  let certificates: CertificateData[] = [];
  let catalogueUrl = DEFAULT_CATALOGUE_URL;
  try {
    const [certs, setting] = await Promise.all([getCerts(), getCatalogueSetting()]);
    certificates = certs;
    catalogueUrl = setting?.value || DEFAULT_CATALOGUE_URL;
  } catch {
    certificates = [];
  }

  return (
    <section className="section-y bg-navy-50/50">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="eyebrow">Certifications & Downloads</span>
            <h2 className="section-heading mt-4">Quality you can verify</h2>
          </div>
          <Link href="/certifications" className="flex items-center gap-2 text-sm font-semibold text-teal-700 hover:underline">
            View all certifications & downloads <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c: CertificateData) => (
            <div key={c.id} className="card-surface overflow-hidden p-0">
              <div className="relative aspect-[4/3] bg-navy-50">
                <Image src={c.imageUrl} alt={c.title} fill className="object-contain p-4" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-sm font-semibold text-navy-900">{c.title}</h3>
                {c.certNumber && <p className="mt-1 text-xs text-navy-500">Cert. No. {c.certNumber}</p>}
                {c.fileUrl && (
                  <a
                    href={c.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" /> Download PDF
                  </a>
                )}
              </div>
            </div>
          ))}

          <div className="card-surface overflow-hidden p-0">
            <div className="relative aspect-[4/3] bg-navy-50">
              <Image
                src="/images/catalogue/product-catalogue-cover.jpg"
                alt="Full Product Catalogue"
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display text-sm font-semibold text-navy-900">Full Product Catalogue</h3>
              <p className="mt-1 text-xs text-navy-500">2,200+ laboratory reagents & fine chemicals</p>
              <a
                href={catalogueUrl}
                download
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:underline"
              >
                <Download className="h-3.5 w-3.5" /> Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

async function getCerts(): Promise<CertificateData[]> {
  const data = await backendFetch<{ certificates: CertificateData[] }>("/api/certificates");
  return data.certificates || [];
}

async function getCatalogueSetting() {
  const data = await backendFetch<SettingsResponse>("/api/settings/public?key=product_catalogue_url");
  return data.settings?.product_catalogue_url
    ? { value: data.settings.product_catalogue_url }
    : null;
}