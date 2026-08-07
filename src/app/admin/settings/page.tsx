"use client";

import { useEffect, useRef, useState } from "react";
import { Save, Loader2, Upload, FileText } from "lucide-react";
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
  const [uploadingCatalogue, setUploadingCatalogue] = useState(false);
  const catalogueInputRef = useRef<HTMLInputElement>(null);

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

  async function handleCatalogueUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      push("Please upload a PDF file", "error");
      return;
    }
    setUploadingCatalogue(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { media } = await uploadRes.json();

      const nextValues = { ...values, product_catalogue_url: media.url };
      const saveRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextValues),
      });
      if (!saveRes.ok) throw new Error("Save failed");

      setValues(nextValues);
      push("Product catalogue updated");
    } catch {
      push("Failed to update catalogue PDF", "error");
    } finally {
      setUploadingCatalogue(false);
      if (catalogueInputRef.current) catalogueInputRef.current.value = "";
    }
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

      <div className="mt-6 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
        <Label>Product Catalogue PDF</Label>
        <p className="mt-1 text-xs text-navy-500">
          This is the file customers download from the "Download PDF" button on the Products page.
        </p>
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-navy-100 bg-navy-50/50 p-3">
          <FileText className="h-5 w-5 shrink-0 text-teal-700" />
          <a
            href={values.product_catalogue_url || "/downloads/Quanta-Chem-Product-Catalogue.pdf"}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-sm font-medium text-navy-700 hover:underline"
          >
            {values.product_catalogue_url || "/downloads/Quanta-Chem-Product-Catalogue.pdf"}
          </a>
        </div>
        <input
          ref={catalogueInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleCatalogueUpload}
        />
        <button
          type="button"
          onClick={() => catalogueInputRef.current?.click()}
          disabled={uploadingCatalogue}
          className="btn-secondary mt-4"
        >
          {uploadingCatalogue ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploadingCatalogue ? "Uploading…" : "Replace with new PDF"}
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