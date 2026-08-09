"use client";

import { useState } from "react";
import { FileCheck2, X, Loader2 } from "lucide-react";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { useToast } from "@/components/common/toast";

export function CoaRequestButton({
  productId,
  productName,
  sku,
}: {
  productId: string;
  productName: string;
  sku: string;
}) {
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ sku, batchNo: "", email: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.sku.trim() || !form.batchNo.trim() || !form.email.trim()) {
      push("Please fill in all fields", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/coa-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productName, ...form }),
      });
      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }
      push("COA request submitted — check your email shortly");
      setOpen(false);
      setForm({ sku, batchNo: "", email: "" });
    } catch (err) {
      push(err instanceof Error ? err.message : "Failed to submit request", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-secondary">
        <FileCheck2 className="h-4 w-4" /> Request COA
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-navy-900">Request COA</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-navy-400 hover:text-navy-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-xs text-navy-500">
              Request a Certificate of Analysis for {productName}. We&apos;ll email it to the address below.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>SKU No.</Label>
                <Input value={form.sku} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, sku: e.target.value })} required />
              </div>
              <div>
                <Label>Batch No.</Label>
                <Input
                  value={form.batchNo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, batchNo: e.target.value })}
                  placeholder="e.g. B24081501"
                  required
                />
              </div>
              <div>
                <Label>Email Id</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileCheck2 className="h-4 w-4" />}
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}