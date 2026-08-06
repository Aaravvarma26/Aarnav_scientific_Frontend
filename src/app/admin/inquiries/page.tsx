"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Download, Inbox, Search } from "lucide-react";
import { formatDate } from "@/common/utils";

type Inquiry = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  status: string;
  createdAt: string;
  product?: { name: string } | null;
  assignedTo?: { name: string } | null;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONTACTED: "bg-navy-100 text-navy-700",
  QUOTATION_SENT: "bg-teal-50 text-teal-700",
  CLOSED: "bg-navy-200 text-navy-600",
};

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/inquiries?${params}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
      setTotal(data.pagination.total);
    }
    setLoading(false);
  }, [status, q]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Inquiries</h1>
          <p className="mt-1 text-sm text-navy-500">{total} total inquiries</p>
        </div>
        <a href="/api/admin/inquiries/export" className="btn-secondary">
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search company, email…"
            className="w-full rounded-xl border border-navy-200 py-2.5 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-navy-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUOTATION_SENT">Quotation Sent</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-500">
            <tr>
              <th className="px-5 py-3">Company</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Assigned</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-navy-400">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-navy-400">
                  <Inbox className="mx-auto h-8 w-8 text-navy-200" />
                  <p className="mt-2">No inquiries found</p>
                </td>
              </tr>
            ) : (
              items.map((i) => (
                <tr key={i.id} className="cursor-pointer border-t border-navy-100 hover:bg-navy-50/40">
                  <td className="px-5 py-3">
                    <Link href={`/admin/inquiries/${i.id}`} className="font-medium text-navy-800 hover:text-teal-700">
                      {i.companyName}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-navy-500">
                    {i.contactPerson}
                    <br />
                    <span className="text-xs">{i.email}</span>
                  </td>
                  <td className="px-5 py-3 text-navy-500">{i.product?.name || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${STATUS_COLORS[i.status]}`}>
                      {i.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-navy-500">{i.assignedTo?.name || "Unassigned"}</td>
                  <td className="px-5 py-3 text-navy-400">{formatDate(i.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
