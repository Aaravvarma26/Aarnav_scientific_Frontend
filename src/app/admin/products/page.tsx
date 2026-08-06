"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, FlaskConical } from "lucide-react";
import { useToast } from "@/components/common/toast";

type Product = {
  id: string;
  sku: string;
  name: string;
  isActive: boolean;
  isFeatured: boolean;
  category?: { name: string } | null;
  packSizes: { label: string }[];
};

export default function AdminProductsPage() {
  const { push } = useToast();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/products?${params}`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    }
    setLoading(false);
  }, [page, q]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      push("Product deleted");
      load();
    } else {
      push("Failed to delete product", "error");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Products</h1>
          <p className="mt-1 text-sm text-navy-500">{total.toLocaleString()} products in catalogue</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
        <input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Search by name or SKU…"
          className="w-full rounded-xl border border-navy-200 py-2.5 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-500">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Pack Sizes</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-navy-400">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-navy-400">
                  <FlaskConical className="mx-auto h-8 w-8 text-navy-200" />
                  <p className="mt-2">No products found</p>
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id} className="border-t border-navy-100">
                  <td className="max-w-xs truncate px-5 py-3 font-medium text-navy-800">{p.name}</td>
                  <td className="px-5 py-3 text-navy-500">{p.sku}</td>
                  <td className="px-5 py-3 text-navy-500">{p.category?.name || "—"}</td>
                  <td className="px-5 py-3 text-navy-500">{p.packSizes.map((x) => x.label).join(", ") || "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                        p.isActive ? "bg-teal-50 text-teal-700" : "bg-navy-100 text-navy-500"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-600 hover:border-teal-500 hover:text-teal-700"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-600 hover:border-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 10)
            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  p === page ? "bg-teal-600 text-white" : "text-navy-600 hover:bg-navy-100"
                }`}
              >
                {p}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
