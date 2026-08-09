import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, FileText } from "lucide-react";
import { backendFetch } from "@/common/backend";
import { formatDate } from "@/common/utils";
import type { BlogListResponse, BlogPostSummary } from "@/common/api-types";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, insights and updates from Aarnav Scientific on chemical manufacturing, quality and industry trends.",
};

// Keep this in sync with the database on every request — see [slug]/page.tsx for why.
export const dynamic = "force-dynamic";

export default async function BlogPage({ searchParams }: { searchParams: { q?: string } }) {
  const posts: BlogPostSummary[] = await backendFetch<BlogListResponse>(
    `/api/blog?limit=100${searchParams.q ? `&q=${encodeURIComponent(searchParams.q)}` : ""}`
  )
    .then((data: BlogListResponse): BlogPostSummary[] => data.items ?? [])
    .catch((err: unknown): BlogPostSummary[] => {
      console.error("[blog] Failed to load posts:", err);
      return [];
    });

  return (
    <div className="bg-white">
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto max-w-7xl py-14 text-center">
          <span className="eyebrow">Blog</span>
          <h1 className="section-heading mx-auto mt-4 max-w-2xl">News & Insights</h1>
        </div>
      </div>

      <div className="container-px mx-auto max-w-7xl py-16">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-navy-200 py-24 text-center">
            <FileText className="h-10 w-10 text-navy-300" />
            <p className="mt-4 font-display text-lg font-semibold text-navy-800">No posts yet</p>
            <p className="mt-1 text-sm text-navy-500">Check back soon for updates from our team.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post: BlogPostSummary) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="card-surface overflow-hidden p-0">
                <div className="relative aspect-[16/10] bg-navy-50">
                  {post.featuredImage && <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-navy-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                  <h2 className="mt-2 line-clamp-2 font-display text-base font-semibold text-navy-900">{post.title}</h2>
                  {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-navy-600">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}