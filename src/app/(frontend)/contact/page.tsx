import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { siteConfig } from "@/common/site-config";
import { ContactForm } from "@/components/frontend/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Aarnav Scientific for product inquiries, quotations and support.",
};

export default function ContactPage() {
  return (
    <div className="bg-navy-50/30">
      <div className="border-b border-navy-100 bg-white">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">Contact Us</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">We'd love to hear from you</h1>
        </div>
      </div>

      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <div className="space-y-5">
              <InfoRow icon={MapPin} title="Office Address">
                {siteConfig.address.line1}, {siteConfig.address.line2}, {siteConfig.address.city},{" "}
                {siteConfig.address.state} {siteConfig.address.pincode}, {siteConfig.address.country}
              </InfoRow>
              <InfoRow icon={Phone} title="Phone">
                <a href={`tel:${siteConfig.phone}`} className="hover:text-teal-700">{siteConfig.phone}</a>
              </InfoRow>
              <InfoRow icon={Mail} title="Email">
                <a href={`mailto:${siteConfig.email}`} className="hover:text-teal-700">{siteConfig.email}</a>
              </InfoRow>
              <InfoRow icon={Clock} title="Business Hours">
                Monday – Saturday, 9:30 AM – 6:30 PM IST
              </InfoRow>
            </div>

            <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-navy-100 shadow-card">
              <iframe
                title="Aarnav Scientific location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${siteConfig.address.line1}, ${siteConfig.address.line2}, ${siteConfig.address.city}, ${siteConfig.address.state} ${siteConfig.address.pincode}, ${siteConfig.address.country}`
                )}&z=16&output=embed`}
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-5">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-50">
        <Icon className="h-5 w-5 text-teal-600" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{title}</p>
        <p className="mt-1 text-sm text-navy-700">{children}</p>
      </div>
    </div>
  );
}