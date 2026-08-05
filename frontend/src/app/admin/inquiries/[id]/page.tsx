"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Paperclip, Save } from "lucide-react";
import { useToast } from "@/components/common/toast";
import { formatDate } from "@/common/utils";
import Link from "next/link";

type Inquiry = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country?: string | null;
  quantity?: string | null;
  message: string;
  status: string;
  attachmentUrl?: string | null;
  createdAt: string;
  product?: { name: string; sku: string } | null;
};

export default function AdminInquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { push } = useToast();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/inquiries/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setInquiry(d.inquiry);
        setStatus(d.inquiry?.status || "PENDING");
      });
  }, [params.id]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/inquiries/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    if (res.ok) push("Status updated");
    else push("Failed to update", "error");
  }

  if (!inquiry) return <p className="text-navy-400">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/inquiries" className="mb-4 flex items-center gap-1.5 text-sm text-navy-500 hover:text-teal-700">
        <ArrowLeft className="h-4 w-4" /> Back to Inquiries
      </Link>

      <div className="rounded-2xl border border-navy-100 bg-white p-8 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-navy-900">{inquiry.companyName}</h1>
            <p className="mt-1 text-sm text-navy-500">Submitted {formatDate(inquiry.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-navy-200 px-3 py-2 text-sm"
            >
              <option value="PENDING">Pending</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUOTATION_SENT">Quotation Sent</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button onClick={handleSave} disabled={saving} className="btn-primary !py-2 text-xs">
              <Save className="h-3.5 w-3.5" /> Save
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-navy-100 pt-6 sm:grid-cols-2">
          <Field label="Contact Person" value={inquiry.contactPerson} />
          <Field label="Email" value={inquiry.email} />
          <Field label="Phone" value={inquiry.phone} />
          <Field label="Country" value={inquiry.country || "—"} />
          <Field label="Product" value={inquiry.product ? `${inquiry.product.name} (${inquiry.product.sku})` : "—"} />
          <Field label="Quantity" value={inquiry.quantity || "—"} />
        </div>

        <div className="mt-6 border-t border-navy-100 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Message</p>
          <p className="mt-2 whitespace-pre-line text-sm text-navy-700">{inquiry.message}</p>
        </div>

        {inquiry.attachmentUrl && (
          <div className="mt-6 border-t border-navy-100 pt-6">
            <a
              href={inquiry.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-teal-700 hover:underline"
            >
              <Paperclip className="h-4 w-4" /> View Attachment
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">{label}</p>
      <p className="mt-1 text-sm text-navy-800">{value}</p>
    </div>
  );
}
