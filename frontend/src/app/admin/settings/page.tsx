"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { useToast } from "@/components/common/toast";

const FIELDS = [
  { key: "site_email", label: "Public Contact Email" },
  { key: "site_phone", label: "Public Contact Phone" },
  { key: "smtp_from_name", label: "Email 'From' Name" },
  { key: "ga_id", label: "Google Analytics ID" },
  { key: "whatsapp_number", label: "WhatsApp Number (with country code, no +)" },
];

export default function AdminSettingsPage() {
  const { push } = useToast();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setValues(d.settings || {}))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    if (res.ok) push("Settings saved");
    else push("Failed to save settings", "error");
  }

  if (loading) return <p className="text-navy-400">Loading…</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-900">Website Settings</h1>
      <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <div className="space-y-5">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <Label>{f.label}</Label>
              <Input
                value={values[f.key] || ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary mt-6">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          <Save className="h-4 w-4" /> Save Settings
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-navy-100 bg-navy-50/50 p-6 text-sm text-navy-600">
        <p className="font-semibold text-navy-800">Note on Email & Storage configuration</p>
        <p className="mt-1">
          SMTP credentials and file-storage (Cloudinary/S3) keys are configured via server
          environment variables for security, not through this UI. See <code>.env.example</code>{" "}
          in the project root and the deployment guide in <code>README.md</code>.
        </p>
      </div>
    </div>
  );
}
