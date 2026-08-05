"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, X, Handshake } from "lucide-react";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { useToast } from "@/components/common/toast";

type Partner = { id: string; name: string; logoUrl: string; website?: string | null };

export default function AdminPartnersPage() {
  const { push } = useToast();
  const [items, setItems] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", logoUrl: "", website: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/partners");
    if (res.ok) setItems((await res.json()).partners);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    const res = await fetch("/api/admin/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { push("Partner added"); setShowNew(false); setForm({ name: "", logoUrl: "", website: "" }); load(); }
    else push("Failed to add", "error");
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this partner?")) return;
    const res = await fetch(`/api/admin/partners/${id}`, { method: "DELETE" });
    if (res.ok) { push("Removed"); load(); } else push("Failed to remove", "error");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy-900">Partners</h1>
        <button onClick={() => setShowNew((v) => !v)} className="btn-primary"><Plus className="h-4 w-4" /> Add Partner</button>
      </div>

      {showNew && (
        <div className="mb-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>Logo URL</Label><Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleCreate} className="btn-primary !py-2 text-xs"><Save className="h-3.5 w-3.5" /> Save</button>
            <button onClick={() => setShowNew(false)} className="btn-secondary !py-2 text-xs"><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p className="text-navy-400">Loading…</p> : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-navy-200 py-20 text-center">
          <Handshake className="h-8 w-8 text-navy-200" /><p className="mt-2 text-navy-400">No partners yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <div key={p.id} className="rounded-2xl border border-navy-100 bg-white p-5 text-center shadow-card">
              <p className="text-sm font-semibold text-navy-900">{p.name}</p>
              <button onClick={() => handleDelete(p.id)} className="mx-auto mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
