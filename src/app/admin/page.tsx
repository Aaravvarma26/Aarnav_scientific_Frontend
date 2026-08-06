import { headers, cookies } from "next/headers";
import { prisma } from "@/common/prisma";
import { getCurrentUser } from "@/common/session";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import {
  FlaskConical,
  FolderTree,
  Inbox,
  Users,
  Newspaper,
  FileDown,
  Clock,
} from "lucide-react";

export const metadata = { title: "Dashboard" };

async function getStats() {
  const [
    totalProducts,
    totalCategories,
    totalInquiries,
    pendingInquiries,
    totalUsers,
    totalBlogPosts,
    totalDownloads,
    recentInquiries,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.blogPost.count(),
    prisma.download.count(),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  const inquiries = await prisma.inquiry.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
  });
  const monthly: Record<string, number> = {};
  for (let i = 0; i < 6; i++) {
    const d = new Date(sixMonthsAgo);
    d.setMonth(d.getMonth() + i);
    monthly[d.toLocaleString("en-US", { month: "short", year: "2-digit" })] = 0;
  }
  for (const inq of inquiries) {
    const key = inq.createdAt.toLocaleString("en-US", { month: "short", year: "2-digit" });
    if (key in monthly) monthly[key]++;
  }

  return {
    stats: { totalProducts, totalCategories, totalInquiries, pendingInquiries, totalUsers, totalBlogPosts, totalDownloads },
    monthlyInquiries: Object.entries(monthly).map(([month, count]) => ({ month, count })),
    recentInquiries,
  };
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  let data;
  try {
    data = await getStats();
  } catch {
    data = {
      stats: { totalProducts: 0, totalCategories: 0, totalInquiries: 0, pendingInquiries: 0, totalUsers: 0, totalBlogPosts: 0, totalDownloads: 0 },
      monthlyInquiries: [],
      recentInquiries: [],
    };
  }
  const { stats, monthlyInquiries, recentInquiries } = data;

  const cards = [
    { label: "Total Products", value: stats.totalProducts, icon: FlaskConical, color: "bg-teal-50 text-teal-600" },
    { label: "Categories", value: stats.totalCategories, icon: FolderTree, color: "bg-navy-50 text-navy-600" },
    { label: "Inquiries", value: stats.totalInquiries, icon: Inbox, color: "bg-amber-50 text-amber-600" },
    { label: "Pending Inquiries", value: stats.pendingInquiries, icon: Clock, color: "bg-red-50 text-red-600" },
    { label: "Active Users", value: stats.totalUsers, icon: Users, color: "bg-navy-50 text-navy-600" },
    { label: "Blog Posts", value: stats.totalBlogPosts, icon: Newspaper, color: "bg-teal-50 text-teal-600" },
    { label: "Downloads Uploaded", value: stats.totalDownloads, icon: FileDown, color: "bg-navy-50 text-navy-600" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-900">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="mt-1 text-sm text-navy-500">Here's what's happening with Aarnav Scientific today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-navy-100 bg-white p-5 shadow-card">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 font-display text-2xl font-bold text-navy-900">{c.value.toLocaleString()}</p>
            <p className="mt-1 text-xs text-navy-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-base font-semibold text-navy-900">Inquiries (last 6 months)</h2>
          <div className="mt-4 h-64">
            <DashboardCharts data={monthlyInquiries} />
          </div>
        </div>

        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
          <h2 className="font-display text-base font-semibold text-navy-900">Recent Inquiries</h2>
          <div className="mt-4 space-y-3">
            {recentInquiries.length === 0 && <p className="text-sm text-navy-400">No inquiries yet.</p>}
            {recentInquiries.map((i) => (
              <div key={i.id} className="flex items-center justify-between border-b border-navy-100 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-navy-800">{i.companyName}</p>
                  <p className="text-xs text-navy-500">{i.email}</p>
                </div>
                <span className="rounded-full bg-navy-100 px-2.5 py-1 text-[10px] font-semibold uppercase text-navy-600">
                  {i.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
