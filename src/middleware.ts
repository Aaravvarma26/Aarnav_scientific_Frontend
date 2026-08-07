import { verifyAccessToken } from "@/common/auth-edge";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"];
const ADMIN_SUBDOMAIN_HOSTS = ["admin.aarnavscientific.co.in"];

export async function middleware(req: NextRequest) {
  const hostname = (req.headers.get("host") || "").split(":")[0];
  const isAdminSubdomain = ADMIN_SUBDOMAIN_HOSTS.includes(hostname);
  const originalPathname = req.nextUrl.pathname;

  // Transparently map admin.aarnavscientific.co.in/* -> /admin/*
  // so visiting the bare subdomain serves the existing /admin routes
  // without moving or renaming any page/route files.
  const lastSegment = originalPathname.split("/").pop() || "";
  const looksLikeStaticFile = lastSegment.includes(".");

  let effectivePathname = originalPathname;
  if (
    isAdminSubdomain &&
    !originalPathname.startsWith("/admin") &&
    !originalPathname.startsWith("/api") &&
    !looksLikeStaticFile
  ) {
    effectivePathname = originalPathname === "/" ? "/admin" : `/admin${originalPathname}`;
  }

  if (
    effectivePathname.startsWith("/admin") &&
    !PUBLIC_ADMIN_PATHS.some((p) => effectivePathname.startsWith(p))
  ) {
    const token = req.cookies.get("as_access_token")?.value;
    const payload = token ? await verifyAccessToken(token) : null;

    if (!payload) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", effectivePathname);
      return NextResponse.redirect(loginUrl);
    }

    // Route-level RBAC: only ADMIN/EDITOR may access user & settings management
    if (
      (effectivePathname.startsWith("/admin/users") || effectivePathname.startsWith("/admin/settings")) &&
      payload.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  let res: NextResponse;
  if (effectivePathname !== originalPathname) {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = effectivePathname;
    res = NextResponse.rewrite(rewriteUrl);
  } else {
    res = NextResponse.next();
  }

  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};