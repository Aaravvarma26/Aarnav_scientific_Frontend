import type { Metadata } from "next";
import Image from "next/image";
import { Download } from "lucide-react";
import { prisma } from "@/common/prisma";

export const metadata: Metadata = {
  title: "Certifications & Downloads",
  description: "View and download Aarnav Scientific's ISO 9001:2015 and MSME (Udyam) certifications, plus the full product catalogue.",
};

const DEFAULT_CATALOGUE_URL = "/downloads/Quanta-Chem-Product-Catalogue.pdf";

export default async function CertificationsPage() {
  const [certificates, catalogueSetting] = await Promise.all([
    prisma.certificate.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []),
    prisma.setting.findUnique({ where: { key: "product_catalogue_url" } }).catch(() => null),
  ]);
  const catalogueUrl = catalogueSetting?.value || DEFAULT_CATALOGUE_URL;

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
          {certificates.map((c) => (
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

          <div className="card-surface overflow-hidden p-0">
            <div className="relative aspect-[4/3] bg-navy-50">
              <Image
                src="/images/catalogue/product-catalogue-cover.jpg"
                alt="Full Product Catalogue"
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="p-6">
              <h2 className="font-display text-base font-semibold text-navy-900">Full Product Catalogue</h2>
              <p className="mt-1 text-xs text-navy-500">2,200+ laboratory reagents & fine chemicals</p>
              <a href={catalogueUrl} download className="btn-secondary mt-4 !py-2 text-xs">
                <Download className="h-3.5 w-3.5" /> Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}