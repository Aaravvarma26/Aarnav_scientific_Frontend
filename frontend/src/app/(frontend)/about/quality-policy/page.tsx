import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { siteConfig } from "@/common/site-config";

export const metadata: Metadata = {
  title: "Quality Policy",
  description: "Aarnav Scientific's ISO 9001:2015 certified quality management policy.",
};

const points = [
  "Manufacture and supply chemicals that consistently meet or exceed customer specifications.",
  "Maintain a certified Quality Management System (ISO 9001:2015) across all operations.",
  "Conduct batch-wise quality control testing prior to dispatch.",
  "Continually improve processes through employee training and customer feedback.",
  "Ensure full regulatory compliance in manufacturing, packaging, storage and export.",
];

export default function QualityPolicyPage() {
  return (
    <div className="bg-white">
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">About Us</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">Quality Policy</h1>
        </div>
      </div>

      <div className="container-px mx-auto max-w-3xl py-16">
        <div className="flex items-center gap-3 rounded-2xl bg-teal-50 p-5">
          <ShieldCheck className="h-8 w-8 flex-shrink-0 text-teal-600" />
          <p className="text-sm text-teal-900">{siteConfig.legal.iso}</p>
        </div>
        <p className="mt-8 leading-relaxed text-navy-600">
          At {siteConfig.name}, quality is not a department — it is a company-wide commitment.
          Our Quality Management System is certified to ISO 9001:2015 and governs every stage of
          our operations, from raw material sourcing to final dispatch.
        </p>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm text-navy-700">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
