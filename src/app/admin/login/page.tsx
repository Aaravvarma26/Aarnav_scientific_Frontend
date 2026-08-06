"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Lock } from "lucide-react";
import { Label } from "@/components/common/label";
import { Input } from "@/components/common/input";
import { siteConfig } from "@/common/site-config";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Middleware sends anyone with an expired access token here — but their 30-day
  // refresh token/session may still be valid. Try a silent refresh first so an
  // admin who just left a tab idle isn't forced to type their password again.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/refresh", { method: "POST" })
      .then((res) => {
        if (cancelled) return;
        if (res.ok) {
          router.push(searchParams.get("redirect") || "/admin");
          router.refresh();
        } else {
          setCheckingSession(false);
        }
      })
      .catch(() => {
        if (!cancelled) setCheckingSession(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(values: FormValues) {
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Login failed");
      return;
    }
    router.push(searchParams.get("redirect") || "/admin");
    router.refresh();
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-gradient px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/95 p-8 shadow-premium">
        <div className="flex flex-col items-center text-center">
          <Image src="/images/logo/logo-mark.png" alt={siteConfig.name} width={44} height={44} />
          <h1 className="mt-4 font-display text-xl font-bold text-navy-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-navy-500">Sign in to manage {siteConfig.name}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} placeholder="admin@aarnavscientific.co.in" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} placeholder="••••••••" />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <Lock className="h-4 w-4" /> Sign In
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/admin/forgot-password" className="text-sm text-teal-700 hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}