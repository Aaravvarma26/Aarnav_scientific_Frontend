import type { Metadata } from "next";
import Image from "next/image";
import { Factory, Beaker, PackageCheck, Warehouse } from "lucide-react";

export const metadata: Metadata = {
  title: "Infrastructure",
  description: "Explore Aarnav Scientific's manufacturing facility, equipment and quality infrastructure.",
};

const features = [
  { icon: Factory, title: "Manufacturing Facility", desc: "A dedicated production unit in Mumbai equipped for consistent, scalable chemical manufacturing." },
  { icon: Beaker, title: "QC Laboratory", desc: "In-house testing equipment for batch-wise quality control and Certificate of Analysis generation." },
  { icon: PackageCheck, title: "Packaging Line", desc: "Flexible packaging capability from small lab packs to bulk industrial drums." },
  { icon: Warehouse, title: "Warehousing", desc: "Organized, safety-compliant storage for raw materials and finished goods." },
];

export default function InfrastructurePage() {
  return (
    <div className="bg-white">
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">About Us</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">Infrastructure</h1>
        </div>
      </div>

      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card-surface p-6">
              <f.icon className="h-8 w-8 text-teal-600" />
              <h3 className="mt-4 font-display text-base font-semibold text-navy-900">{f.title}</h3>
              <p className="mt-2 text-sm text-navy-600">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["gallery-5", "gallery-12", "gallery-18", "gallery-22", "gallery-27", "gallery-9"].map((img) => (
            <div key={img} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
              <Image src={`/images/gallery/${img}.jpg`} alt="Aarnav Scientific facility" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
