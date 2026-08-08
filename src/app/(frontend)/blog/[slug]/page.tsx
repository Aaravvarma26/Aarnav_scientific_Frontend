import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CalendarDays, User } from "lucide-react";
import { getBlogPost } from "@/common/api";
import { formatDate } from "@/common/utils";
import { siteConfig } from "@/common/site-config";
import { extractFaqsFromMarkdown, jsonLdScript } from "@/common/seo";

// This page is driven entirely by admin-authored content in the database.
// Without this, Next.js can cache a rendered result (including a 404 for a
// slug that didn't exist yet) for this path indefinitely in production,
// so a freshly published post can keep 404ing until the next deploy.
export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  try {
    return await getBlogPost(slug).then((data) => data.post);
  } catch (err) {
    console.error(`[blog/${slug}] Failed to load post:`, err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt || undefined };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) {
    console.warn(`[blog/${params.slug}] No post found with this slug.`);
    notFound();
  }
  if (post.status !== "PUBLISHED") {
    console.warn(`[blog/${params.slug}] Post exists but status is "${post.status}", not PUBLISHED.`);
    notFound();
  }

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;
  const faqs = extractFaqsFromMarkdown(post.content);

  const absoluteImageUrl = post.featuredImage
    ? post.featuredImage.startsWith("http")
      ? post.featuredImage
      : `${siteConfig.url}${post.featuredImage}`
    : undefined;

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: absoluteImageUrl,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/images/logo/logo-full.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    datePublished: new Date(post.publishedAt || post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
  };

  const faqPageJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <article className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(blogPostingJsonLd) }}
      />
      {faqPageJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(faqPageJsonLd) }}
        />
      )}
      <div className="border-b border-navy-100 bg-navy-50/40">
        <div className="container-px mx-auto max-w-3xl py-14">
          <h1 className="font-display text-3xl font-bold text-navy-900 md:text-4xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-navy-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> {formatDate(post.publishedAt || post.createdAt)}
            </span>
            {post.author?.name && (
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {post.featuredImage && (
        <div className="container-px mx-auto max-w-4xl -mt-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-premium">
            <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
          </div>
        </div>
      )}

      <div className="container-px mx-auto max-w-3xl py-12">
        <div className="prose prose-navy max-w-none leading-relaxed text-navy-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-navy-100 pt-6">
            {post.tags.map((t) => (
              <span key={t.id} className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600">
                #{t.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}