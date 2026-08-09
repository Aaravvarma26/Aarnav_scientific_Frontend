import type { Metadata } from "next";
import Image from "next/image";
import { Factory, FlaskConical, PackageCheck, ClipboardCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Manufacturing",
  description: "Explore Aarnav Scientific's manufacturing infrastructure, production process, quality assurance and packaging capabilities.",
};

const steps = [
  { icon: FlaskConical, title: "Raw Material Sourcing", desc: "Carefully vetted suppliers and incoming material QC checks." },
  { icon: Factory, title: "Production", desc: "Controlled manufacturing processes following standard operating procedures." },
  { icon: ClipboardCheck, title: "Quality Assurance", desc: "Batch-wise testing against specification before release." },
  { icon: PackageCheck, title: "Packaging & Export", desc: "Compliant packaging and documentation ready for domestic or export shipment." },
];

export default function ManufacturingPage() {
  return (
    <div className="bg-white">
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">Packaging</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">From raw material to finished, tested product</h1>
        </div>
      </div>

      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="card-surface relative p-6">
              <span className="font-display text-4xl font-extrabold text-navy-100">0{i + 1}</span>
              <s.icon className="mt-2 h-7 w-7 text-teal-600" />
              <h3 className="mt-3 font-display text-base font-semibold text-navy-900">{s.title}</h3>
              <p className="mt-2 text-sm text-navy-600">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["gallery-14", "gallery-18", "gallery-3", "gallery-8", "gallery-7", "gallery-2"].map((img) => (
            <div key={img} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              <Image src={`/images/gallery/${img}.jpg`} alt="Manufacturing process" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
