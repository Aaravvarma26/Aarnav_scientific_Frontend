import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Target, Eye, Heart, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/common/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Aarnav Scientific's story, mission, vision and values as an ISO 9001:2015 certified chemical manufacturer and exporter.",
};

const timeline = [
  { year: "2017", event: "Aarnav Scientific founded in Mumbai, India, trading laboratory reagents." },
  { year: "2019", event: "Expanded catalogue to cover industrial and specialty chemicals." },
  { year: "2021", event: "Launched the Quanta Chem brand for laboratory & fine chemicals." },
  { year: "2024", event: "Achieved ISO 9001:2015 certification and MSME (Udyam) registration." },
  { year: "Today", event: "Serving 500+ clients across 15+ countries with 3,400+ products." },
];

const values = [
  { icon: Target, title: "Mission", desc: "To deliver consistently pure, reliably sourced chemicals that our customers can build their business on." },
  { icon: Eye, title: "Vision", desc: "To become a globally trusted name in specialty chemical manufacturing and export from India." },
  { icon: Heart, title: "Values", desc: "Quality, integrity, and long-term partnership guide every decision we make." },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">About {siteConfig.name}</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">Our story, our commitment to quality</h1>
        </div>
      </div>

      <section className="section-y">
        <div className="container-px mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-premium">
            <Image src="/images/gallery/gallery-6.jpg" alt="Aarnav Scientific team" fill className="object-cover" />
          </div>
          <div>
            <h2 className="section-heading">Company Story</h2>
            <p className="mt-5 leading-relaxed text-navy-600">
              Founded in 2017 in Mumbai, Aarnav Scientific began as a supplier of laboratory
              reagents to research and QC laboratories across India. Over the years, we expanded
              into manufacturing and export, building the Quanta Chem brand to represent our
              growing catalogue of fine and specialty chemicals.
            </p>
            <p className="mt-4 leading-relaxed text-navy-600">
              Today, we are proud to be an ISO 9001:2015 certified, MSME-registered enterprise
              serving pharmaceutical, food, cosmetic, agricultural, laboratory, industrial and
              water-treatment industries — with a portfolio of over 3,400 products shipped to
              customers across 33+ countries.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y bg-navy-50/40">
        <div className="container-px mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="card-surface p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
                  <v.icon className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-navy-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-px mx-auto max-w-4xl">
          <h2 className="section-heading text-center">Our Journey</h2>
          <div className="mt-12 space-y-8 border-l-2 border-navy-100 pl-8">
            {timeline.map((t) => (
              <div key={t.year} className="relative">
                <div className="absolute -left-[38px] flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 ring-4 ring-white">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
                <p className="font-display text-lg font-bold text-navy-900">{t.year}</p>
                <p className="mt-1 text-sm text-navy-600">{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-navy-50/40">
        <div className="container-px mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          {[
            { href: "/about/infrastructure", title: "Infrastructure", desc: "Explore our manufacturing facility and equipment." },
            { href: "/about/quality-policy", title: "Quality Policy", desc: "How we ensure consistent quality on every batch." },
            { href: "/about/team", title: "Management Team", desc: "Meet the people behind Aarnav Scientific." },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="card-surface p-6">
              <h3 className="font-display text-base font-semibold text-navy-900">{l.title}</h3>
              <p className="mt-2 text-sm text-navy-600">{l.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
