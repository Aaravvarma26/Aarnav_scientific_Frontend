import type { Metadata } from "next";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Management Team",
  description: "Meet the management team behind Aarnav Scientific.",
};

const team = [
  { name: "Sangeeta Varma", role: "Founder & Proprietor" },
  { name: "Operations Lead", role: "Manufacturing & Quality" },
  { name: "Export Manager", role: "International Sales & Logistics" },
];

export default function TeamPage() {
  return (
    <div className="bg-white">
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">About Us</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">Management Team</h1>
        </div>
      </div>

      <div className="container-px mx-auto max-w-5xl py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {team.map((m) => (
            <div key={m.name} className="card-surface p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy-100">
                <Users className="h-9 w-9 text-navy-500" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-navy-900">{m.name}</h3>
              <p className="mt-1 text-sm text-navy-500">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
