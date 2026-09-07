import type { Metadata } from "next";
import Image from "next/image";
import { Download } from "lucide-react";
import { backendFetch } from "@/common/backend";
import type { CertificateData, CatalogueItemData } from "@/common/api-types";

export const metadata: Metadata = {
  title: "Certifications & Downloads",
  description: "View and download Aarnav Scientific's ISO 9001:2015 and MSME (Udyam) certifications, plus the full product catalogue.",
};

export default async function CertificationsPage() {
  const [certificates, catalogueItems]: [CertificateData[], CatalogueItemData[]] = await Promise.all([
    backendFetch<{ certificates: CertificateData[] }>("/api/certificates")
      .then((data) => data.certificates || [])
      .catch((): CertificateData[] => []),
    backendFetch<{ items: CatalogueItemData[] }>("/api/catalogue")
      .then((data) => data.items || [])
      .catch((): CatalogueItemData[] => []),
  ]);
  // Featured catalogue download is the first item (by sort order) from the
  // same Catalogue & Price Lists list managed in Admin → Downloads.
  const catalogueItem = catalogueItems[0] || null;

  return (
    <div className="bg-white">
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">Compliance</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">Certifications & Downloads</h1>
          <p className="mx-auto mt-3 max-w-xl text-navy-600">
            Our certifications reflect our ongoing commitment to quality, safety and regulatory
            compliance across every product we manufacture and export.
          </p>
        </div>
      </div>

      <div className="container-px mx-auto max-w-5xl py-16">
        <div className="grid gap-8 sm:grid-cols-2">
          {certificates.map((c: CertificateData) => (
            <div key={c.id} className="card-surface overflow-hidden p-0">
              <div className="relative aspect-[4/3] bg-navy-50">
                <Image src={c.imageUrl} alt={c.title} fill className="object-contain p-4" />
              </div>
              <div className="p-6">
                <h2 className="font-display text-base font-semibold text-navy-900">{c.title}</h2>
                {c.issuer && <p className="mt-1 text-xs text-navy-500">Issued by {c.issuer}</p>}
                {c.certNumber && <p className="mt-1 text-xs text-navy-500">Certificate No. {c.certNumber}</p>}
                {c.fileUrl && (
                  <a href={c.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-4 !py-2 text-xs">
                    <Download className="h-3.5 w-3.5" /> Download PDF
                  </a>
                )}
              </div>
            </div>
          ))}

          {catalogueItem && (
            <div className="card-surface overflow-hidden p-0">
              <div className="relative aspect-[4/3] bg-navy-50">
                <Image
                  src={catalogueItem.imageUrl}
                  alt={catalogueItem.title}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-6">
                <h2 className="font-display text-base font-semibold text-navy-900">{catalogueItem.title}</h2>
                {catalogueItem.description && (
                  <p className="mt-1 text-xs text-navy-500">{catalogueItem.description}</p>
                )}
                <a href={catalogueItem.fileUrl} download className="btn-secondary mt-4 !py-2 text-xs">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}