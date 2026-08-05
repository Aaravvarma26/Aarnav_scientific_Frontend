import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/frontend/product/inquiry-form";

export const metadata: Metadata = {
  title: "Request a Quotation",
  description: "Submit your product inquiry and our team will respond within one business day with pricing and availability.",
};

export default function InquiryPage() {
  return (
    <div className="bg-navy-50/30">
      <div className="border-b border-navy-100 bg-white">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">Get in Touch</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">Request a Quotation</h1>
          <p className="mx-auto mt-3 max-w-xl text-navy-600">
            Tell us what you need and our sales team will respond with pricing, availability and
            documentation within one business day.
          </p>
        </div>
      </div>
      <div className="container-px mx-auto max-w-2xl py-16">
        <Suspense>
          <InquiryForm />
        </Suspense>
      </div>
    </div>
  );
}
