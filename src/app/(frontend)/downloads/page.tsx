import type { Metadata } from "next";
import Image from "next/image";
import { Download } from "lucide-react";
import { backendFetch } from "@/common/backend";
import type { CertificateData, CatalogueItemData } from "@/common/api-types";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Download Aarnav Scientific's product catalogue, price lists, and quality certifications including ISO 9001:2015 and MSME (Udyam).",
};

export default async function DownloadsPage() {
  const [certificates, catalogueItems]: [CertificateData[], CatalogueItemData[]] = await Promise.all([
    backendFetch<{ certificates: CertificateData[] }>("/api/certificates")
      .then((data) => data.certificates || [])
      .catch((): CertificateData[] => []),
    backendFetch<{ items: CatalogueItemData[] }>("/api/catalogue")
      .then((data) => data.items || [])
      .catch((): CatalogueItemData[] => []),
  ]);

  return (
    <div className="bg-white">
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">Resources</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">Downloads</h1>
          <p className="mx-auto mt-3 max-w-xl text-navy-600">
            Our product catalogue, price lists, and certifications — all in one place, reflecting our
            ongoing commitment to quality, safety and regulatory compliance.
          </p>
        </div>
      </div>

      <div className="container-px mx-auto max-w-5xl py-16">
        <section>
          <h2 className="font-display text-xl font-bold text-navy-900">Catalogue & Price Lists</h2>
          {catalogueItems.length === 0 ? (
            <p className="mt-4 text-sm text-navy-400">No catalogue items available yet.</p>
          ) : (
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {catalogueItems.map((item) => (
                <div key={item.id} className="card-surface overflow-hidden p-0">
                  <div className="relative aspect-[4/3] bg-navy-50">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-contain p-4" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-base font-semibold text-navy-900">{item.title}</h3>
                    {item.description && <p className="mt-1 text-xs text-navy-500">{item.description}</p>}
                    <a href={item.fileUrl} download className="btn-secondary mt-4 !py-2 text-xs">
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16">
          <h2 className="font-display text-xl font-bold text-navy-900">Certificates</h2>
          {certificates.length === 0 ? (
            <p className="mt-4 text-sm text-navy-400">No certificates available yet.</p>
          ) : (
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {certificates.map((c) => (
                <div key={c.id} className="card-surface overflow-hidden p-0">
                  <div className="relative aspect-[4/3] bg-navy-50">
                    <Image src={c.imageUrl} alt={c.title} fill className="object-contain p-4" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-base font-semibold text-navy-900">{c.title}</h3>
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
            </div>
          )}
        </section>
      </div>
    </div>
  );
}