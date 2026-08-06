"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { UploadCloud, Copy, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/common/toast";

type Media = { id: string; fileName: string; url: string; mimeType?: string | null; createdAt: string };

export default function AdminMediaPage() {
  const { push } = useToast();
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media?limit=60");
    if (res.ok) setItems((await res.json()).items);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      await fetch("/api/admin/upload", { method: "POST", body: form });
    }
    setUploading(false);
    push("Files uploaded");
    load();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
    push("URL copied to clipboard");
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-navy-900">Media Library</h1>
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary">
          <UploadCloud className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload Files"}
        </button>
        <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
      </div>

      {loading ? (
        <p className="text-navy-400">Loading…</p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-navy-200 py-20 text-center">
          <ImageIcon className="h-8 w-8 text-navy-200" />
          <p className="mt-2 text-navy-400">No media uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {items.map((m) => (
            <div key={m.id} className="group relative overflow-hidden rounded-xl border border-navy-100 bg-white">
              <div className="relative aspect-square bg-navy-50">
                {m.mimeType?.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.fileName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-navy-300">PDF</div>
                )}
              </div>
              <button
                onClick={() => copyUrl(m.url)}
                className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-navy-900/80 py-1.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" /> Copy URL
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
