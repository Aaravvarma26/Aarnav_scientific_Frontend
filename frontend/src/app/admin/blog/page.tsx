"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Newspaper } from "lucide-react";
import { useToast } from "@/components/common/toast";
import { formatDate } from "@/common/utils";

type Post = { id: string; title: string; status: string; updatedAt: string };

export default function AdminBlogPage() {
  const { push } = useToast();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/blog?limit=50");
    if (res.ok) setItems((await res.json()).items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) { push("Post deleted"); load(); } else push("Failed to delete", "error");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy-900">Blog Posts</h1>
        <Link href="/admin/blog/new" className="btn-primary"><Plus className="h-4 w-4" /> New Post</Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-500">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Updated</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-navy-400">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-16 text-center text-navy-400">
                <Newspaper className="mx-auto h-8 w-8 text-navy-200" /><p className="mt-2">No posts yet</p>
              </td></tr>
            ) : items.map((p) => (
              <tr key={p.id} className="border-t border-navy-100">
                <td className="px-5 py-3 font-medium text-navy-800">{p.title}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${p.status === "PUBLISHED" ? "bg-teal-50 text-teal-700" : "bg-navy-100 text-navy-500"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-navy-400">{formatDate(p.updatedAt)}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/blog/${p.id}`} className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-600 hover:border-teal-500 hover:text-teal-700">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-600 hover:border-red-400 hover:text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
