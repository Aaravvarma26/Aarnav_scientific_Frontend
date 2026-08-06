"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, X, Award } from "lucide-react";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { useToast } from "@/components/common/toast";

type Certificate = { id: string; title: string; issuer?: string | null; certNumber?: string | null; imageUrl: string; fileUrl?: string | null };

export default function AdminCertificatesPage() {
  const { push } = useToast();
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", issuer: "", certNumber: "", imageUrl: "", fileUrl: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/certificates");
    if (res.ok) setItems((await res.json()).certificates);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    const res = await fetch("/api/admin/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { push("Certificate added"); setShowNew(false); setForm({ title: "", issuer: "", certNumber: "", imageUrl: "", fileUrl: "" }); load(); }
    else push("Failed to add certificate", "error");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this certificate?")) return;
    const res = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
    if (res.ok) { push("Certificate deleted"); load(); } else push("Failed to delete", "error");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy-900">Certificates</h1>
        <button onClick={() => setShowNew((v) => !v)} className="btn-primary"><Plus className="h-4 w-4" /> Add Certificate</button>
      </div>

      {showNew && (
        <div className="mb-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Issuer</Label><Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} /></div>
            <div><Label>Certificate No.</Label><Input value={form.certNumber} onChange={(e) => setForm({ ...form, certNumber: e.target.value })} /></div>
            <div><Label>Image URL (upload via Media Library first)</Label><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>PDF File URL</Label><Input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleCreate} className="btn-primary !py-2 text-xs"><Save className="h-3.5 w-3.5" /> Save</button>
            <button onClick={() => setShowNew(false)} className="btn-secondary !py-2 text-xs"><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-navy-400">Loading…</p> : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-navy-200 py-20 text-center">
          <Award className="h-8 w-8 text-navy-200" /><p className="mt-2 text-navy-400">No certificates yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <div key={c.id} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
              <h3 className="font-display text-sm font-semibold text-navy-900">{c.title}</h3>
              {c.issuer && <p className="mt-1 text-xs text-navy-500">{c.issuer}</p>}
              {c.certNumber && <p className="text-xs text-navy-400">No. {c.certNumber}</p>}
              <button onClick={() => handleDelete(c.id)} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
