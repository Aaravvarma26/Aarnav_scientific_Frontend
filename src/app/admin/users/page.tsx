"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { Input } from "@/components/common/input";
import { Select } from "@/components/common/select";
import { Label } from "@/components/common/label";
import { useToast } from "@/components/common/toast";
import { formatDate } from "@/common/utils";

type User = { id: string; name: string; email: string; role: string; isActive: boolean; lastLoginAt?: string | null; createdAt: string };

export default function AdminUsersPage() {
  const { push } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", roleName: "SALES" });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers((await res.json()).users);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    if (!form.name.trim() || !form.email.trim()) {
      push("Name and email are required", "error");
      return;
    }
    if (form.password.length < 8) {
      push("Password must be at least 8 characters", "error");
      return;
    }
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      push("User created");
      setForm({ name: "", email: "", password: "", roleName: "SALES" });
      setShowNew(false);
      load();
    } else {
      const d = await res.json().catch(() => ({}));
      push(d.error || "Failed to create user", "error");
    }
  }

  async function handleDeactivate(id: string) {
    if (!confirm("Deactivate this user?")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) { push("User deactivated"); load(); } else push("Failed to deactivate", "error");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy-900">Users & Roles</h1>
        <button onClick={() => setShowNew((v) => !v)} className="btn-primary"><Plus className="h-4 w-4" /> Add User</button>
      </div>

      {showNew && (
        <div className="mb-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div>
              <Label>Password</Label>
              <Input type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <p className="mt-1 text-xs text-navy-400">Minimum 8 characters</p>
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.roleName} onChange={(e) => setForm({ ...form, roleName: e.target.value })}>
                <option value="ADMIN">Admin</option>
                <option value="EDITOR">Editor</option>
                <option value="SALES">Sales</option>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleCreate} className="btn-primary !py-2 text-xs"><Save className="h-3.5 w-3.5" /> Save</button>
            <button onClick={() => setShowNew(false)} className="btn-secondary !py-2 text-xs"><X className="h-3.5 w-3.5" /> Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-500">
            <tr>
              <th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th><th className="px-5 py-3">Last Login</th><th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-navy-400">Loading…</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-t border-navy-100">
                <td className="px-5 py-3 font-medium text-navy-800">{u.name}</td>
                <td className="px-5 py-3 text-navy-500">{u.email}</td>
                <td className="px-5 py-3"><span className="rounded-full bg-navy-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-navy-600">{u.role}</span></td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${u.isActive ? "bg-teal-50 text-teal-700" : "bg-red-50 text-red-600"}`}>
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3 text-navy-400">{u.lastLoginAt ? formatDate(u.lastLoginAt) : "Never"}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => handleDeactivate(u.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-navy-200 text-navy-600 hover:border-red-400 hover:text-red-600 ml-auto">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}