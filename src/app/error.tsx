"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold text-navy-900">Something went wrong</h1>
      <p className="mt-3 max-w-sm text-navy-600">
        We hit an unexpected error. Please try again, or head back to the homepage.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button onClick={reset} className="btn-primary">
          <RefreshCcw className="h-4 w-4" /> Try Again
        </button>
        <Link href="/" className="btn-secondary">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
