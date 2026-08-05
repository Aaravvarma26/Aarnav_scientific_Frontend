import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/common/session";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";
import { SessionKeepAlive } from "@/components/admin/session-keepalive";
import { ToastProvider } from "@/components/common/toast";

export const metadata: Metadata = { title: { default: "Admin Panel", template: "%s | Admin — Aarnav Scientific" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // Login/forgot/reset pages render without the dashboard chrome.
  if (!user) return <ToastProvider>{children}</ToastProvider>;

  return (
    <ToastProvider>
      <SessionKeepAlive />
      <div className="flex min-h-screen bg-navy-50/40">
        <AdminSidebar role={user.role} />
        <div className="flex flex-1 flex-col lg:pl-64">
          <AdminTopbar user={user} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}