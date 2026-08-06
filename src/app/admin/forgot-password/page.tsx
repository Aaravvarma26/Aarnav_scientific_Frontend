"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { Label } from "@/components/common/label";
import { Input } from "@/components/common/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/95 p-8 shadow-premium">
        <h1 className="font-display text-xl font-bold text-navy-900">Reset your password</h1>
        <p className="mt-1 text-sm text-navy-500">We'll email you a link to reset your password.</p>

        {sent ? (
          <p className="mt-6 rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800">
            If that email is registered, a reset link has been sent.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Mail className="h-4 w-4" /> Send Reset Link
            </button>
          </form>
        )}

        <Link href="/admin/login" className="mt-5 flex items-center gap-1.5 text-sm text-teal-700 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to login
        </Link>
      </div>
    </div>
  );
}
