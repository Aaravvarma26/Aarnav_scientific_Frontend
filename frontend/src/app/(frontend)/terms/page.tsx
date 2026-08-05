import type { Metadata } from "next";
import { siteConfig } from "@/common/site-config";

export const metadata: Metadata = { title: "Terms of Use" };

export default function TermsPage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-16">
      <h1 className="section-heading">Terms of Use</h1>
      <div className="prose prose-navy mt-8 max-w-none space-y-4 text-navy-600">
        <p>By accessing this website, you agree to the following terms.</p>
        <h2 className="font-display text-lg font-semibold text-navy-900">Use of Content</h2>
        <p>All content on this website, including product information, images and branding, is the
        property of {siteConfig.name} unless otherwise noted, and may not be reproduced without
        permission.</p>
        <h2 className="font-display text-lg font-semibold text-navy-900">Product Information</h2>
        <p>Specifications listed on this website are indicative. Please refer to the official
        Certificate of Analysis and Technical Datasheet for each batch before use.</p>
        <h2 className="font-display text-lg font-semibold text-navy-900">Quotations & Orders</h2>
        <p>Submitting an inquiry does not constitute a binding order. All orders are subject to a
        formal quotation and purchase agreement.</p>
        <h2 className="font-display text-lg font-semibold text-navy-900">Limitation of Liability</h2>
        <p>{siteConfig.name} is not liable for indirect or consequential damages arising from use
        of this website or reliance on information published here.</p>
        <h2 className="font-display text-lg font-semibold text-navy-900">Governing Law</h2>
        <p>These terms are governed by the laws of India.</p>
      </div>
    </div>
  );
}
