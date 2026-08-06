"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Pencil, X, Save } from "lucide-react";
import { Input } from "@/components/common/input";
import { Textarea } from "@/components/common/textarea";
import { Label } from "@/components/common/label";
import { useToast } from "@/components/common/toast";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isFeatured: boolean;
  _count?: { products: number };
};

export default function AdminCategoriesPage() {
  const { push } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories((await res.json()).categories);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate() {
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      push("Category created");
      setForm({ name: "", description: "" });
      setShowNew(false);
      load();
    } else {
      push("Failed to create category", "error");
    }
  }

  async function handleUpdate(id: string, data: Partial<Category>) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      push("Category updated");
      setEditing(null);
      load();
    } else {
      push("Failed to update category", "error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category? Products in it will become uncategorized.")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      push("Category deleted");
      load();
    } else {
      push("Failed to delete category", "error");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy-900">Categories</h1>
        <button onClick={() => setShowNew((v) => !v)} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {showNew && (
        <div className="mb-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={1} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <button onClick={handleCreate} className="btn-primary mt-4 !py-2 text-xs">
            <Save className="h-3.5 w-3.5" /> Save Category
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Products</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-navy-400">Loading…</td></tr>
            ) : (
              categories.map((c) => (
                <CategoryRow
                  key={c.id}
                  category={c}
                  editing={editing === c.id}
                  onEdit={() => setEditing(c.id)}
                  onCancel={() => setEditing(null)}
                  onSave={(data) => handleUpdate(c.id, data)}
                  onDelete={() => handleDelete(c.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryRow({
  category,
  editing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: {
  category: Category;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (data: Partial<Category>) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(category.name);

  if (editing) {
    return (
      <tr className="border-t border-navy-100">
        <td className="px-5 py-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} className="!py-1.5" />
        </td>
        <td className="px-5 py-3 text-navy-400">{category.slug}</td>
        <td className="px-5 py-3 text-navy-500">{category._count?.products ?? 0}</td>
        <td className="px-5 py-3">
          <div className="flex justify-end gap-2">
            <button onClick={() => onSave({ name })} className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
              <Save className="h-3.5 w-3.5" />
            </button>
            <button onClick={onCancel} className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-600">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-t border-navy-100">
      <td className="px-5 py-3 font-medium text-navy-800">{category.name}</td>
      <td className="px-5 py-3 text-navy-500">{category.slug}</td>
      <td className="px-5 py-3 text-navy-500">{category._count?.products ?? 0}</td>
      <td className="px-5 py-3">
        <div className="flex justify-end gap-2">
          <button onClick={onEdit} className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-600 hover:border-teal-500 hover:text-teal-700">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button onClick={onDelete} className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-600 hover:border-red-400 hover:text-red-600">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
