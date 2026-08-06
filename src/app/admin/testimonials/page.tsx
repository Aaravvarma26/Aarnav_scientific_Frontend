"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, X, Quote } from "lucide-react";
import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";
import { Label } from "@/components/common/label";
import { useToast } from "@/components/common/toast";

type Testimonial = { id: string; name: string; company?: string | null; country?: string | null; message: string; rating: number };

export default function AdminTestimonialsPage() {
  const { push } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", country: "", message: "", rating: 5 });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/testimonials");
    if (res.ok) setItems((await res.json()).testimonials);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { push("Testimonial added"); setShowNew(false); setForm({ name: "", company: "", country: "", message: "", rating: 5 }); load(); }
    else push("Failed to add", "error");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) { push("Deleted"); load(); } else push("Failed to delete", "error");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy-900">Testimonials</h1>
        <button onClick={() => setShowNew((v) => !v)} className="btn-primary"><Plus className="h-4 w-4" /> Add Testimonial</button>
      </div>

      {showNew && (
        <div className="mb-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
            <div><Label>Country</Label><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></div>
            <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} /></div>
            <div className="sm:col-span-2"><Label>Message</Label><Textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleCreate} className="btn-primary !py-2 text-xs"><Save className="h-3.5 w-3.5" /> Save</button>
            <button onClick={() => setShowNew(false)} className="btn-secondary !py-2 text-xs"><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-navy-400">Loading…</p> : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-navy-200 py-20 text-center">
          <Quote className="h-8 w-8 text-navy-200" /><p className="mt-2 text-navy-400">No testimonials yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div key={t.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <p className="line-clamp-3 text-sm text-navy-700">&ldquo;{t.message}&rdquo;</p>
              <p className="mt-3 text-sm font-semibold text-navy-900">{t.name}</p>
              <p className="text-xs text-navy-500">{t.company}{t.country ? `, ${t.country}` : ""}</p>
              <button onClick={() => handleDelete(t.id)} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
