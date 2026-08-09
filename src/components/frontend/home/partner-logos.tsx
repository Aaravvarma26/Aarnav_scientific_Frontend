import { backendFetch } from "@/common/backend";
import Image from "next/image";
import type { PartnerData } from "@/common/api-types";

export async function PartnerLogos() {
  let partners: PartnerData[] = [];
  try {
    partners = await getPartners();
  } catch {
    partners = [];
  }
  if (partners.length === 0) return null;

  return (
    <section className="border-y border-navy-100 bg-white py-12">
      <div className="container-px mx-auto max-w-7xl">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-navy-400">
          Trusted by laboratories and manufacturers worldwide
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70 grayscale">
          {partners.map((p: PartnerData) => (
            <div key={p.id} className="relative h-8 w-28">
              <Image src={p.logoUrl} alt={p.name} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function getPartners(): Promise<PartnerData[]> {
  const data = await backendFetch<{ partners: PartnerData[] }>("/api/partners");
  return data.partners || [];
}