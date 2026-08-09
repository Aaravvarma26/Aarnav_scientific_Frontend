import Link from "next/link";
import { FlaskConical, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
        <FlaskConical className="h-10 w-10 text-teal-600" />
      </div>
      <h1 className="mt-6 font-display text-6xl font-extrabold text-navy-900">404</h1>
      <p className="mt-3 max-w-sm text-navy-600">
        This page seems to have evaporated. Let's get you back to something useful.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
        <Link href="/products" className="btn-secondary">
          <Search className="h-4 w-4" /> Browse Products
        </Link>
      </div>
    </div>
  );
}
