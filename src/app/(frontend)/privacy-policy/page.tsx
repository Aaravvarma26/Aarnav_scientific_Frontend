import type { Metadata } from "next";
import { siteConfig } from "@/common/site-config";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-16">
      <h1 className="section-heading">Privacy Policy</h1>
      <div className="prose prose-navy mt-8 max-w-none space-y-4 text-navy-600">
        <p>{siteConfig.name} ("we", "us") respects your privacy. This policy explains what
        information we collect through this website, how we use it, and the choices you have.</p>
        <h2 className="font-display text-lg font-semibold text-navy-900">Information We Collect</h2>
        <p>We collect information you voluntarily provide via inquiry, contact and newsletter
        forms — including name, company, email, phone number and any attachments you
        upload. We also collect standard analytics data (pages visited, browser type) via cookies.</p>
        <h2 className="font-display text-lg font-semibold text-navy-900">How We Use Information</h2>
        <p>We use the information you provide to respond to inquiries, process quotations,
        send newsletters (only if you subscribe) and improve our website.</p>
        <h2 className="font-display text-lg font-semibold text-navy-900">Data Sharing</h2>
        <p>We do not sell your personal data. We may share information with logistics or service
        providers strictly to fulfil your request (e.g. shipping a sample).</p>
        <h2 className="font-display text-lg font-semibold text-navy-900">Cookies</h2>
        <p>We use cookies to operate core site functionality and, where you consent, for analytics.
        You can control cookies through your browser settings.</p>
        <h2 className="font-display text-lg font-semibold text-navy-900">Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data by
        contacting us at {siteConfig.email}.</p>
        <h2 className="font-display text-lg font-semibold text-navy-900">Contact</h2>
        <p>Questions about this policy can be directed to {siteConfig.email}.</p>
      </div>
    </div>
  );
}