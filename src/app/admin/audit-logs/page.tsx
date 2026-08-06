"use client";

import { useEffect, useState } from "react";
import { ScrollText } from "lucide-react";
import { formatDate } from "@/common/utils";

type Log = {
  id: string;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  ipAddress?: string | null;
  createdAt: string;
  user?: { name: string; email: string } | null;
};

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/audit-logs?limit=100")
      .then((r) => r.json())
      .then((d) => setLogs(d.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-900">Audit Logs</h1>
      <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-navy-50/60 text-left text-xs uppercase tracking-wide text-navy-500">
            <tr>
              <th className="px-5 py-3">Action</th>
              <th className="px-5 py-3">User</th>
              <th className="px-5 py-3">Entity</th>
              <th className="px-5 py-3">IP</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-navy-400">Loading…</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-16 text-center text-navy-400">
                <ScrollText className="mx-auto h-8 w-8 text-navy-200" /><p className="mt-2">No audit logs yet</p>
              </td></tr>
            ) : logs.map((l) => (
              <tr key={l.id} className="border-t border-navy-100">
                <td className="px-5 py-3 font-medium text-navy-800">{l.action}</td>
                <td className="px-5 py-3 text-navy-500">{l.user?.email || "System"}</td>
                <td className="px-5 py-3 text-navy-500">{l.entityType ? `${l.entityType} (${l.entityId?.slice(0, 8)}…)` : "—"}</td>
                <td className="px-5 py-3 text-navy-400">{l.ipAddress || "—"}</td>
                <td className="px-5 py-3 text-navy-400">{formatDate(l.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
