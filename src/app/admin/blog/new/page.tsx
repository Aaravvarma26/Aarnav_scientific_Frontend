import { BlogPostForm } from "@/components/admin/blog-post-form";

export const metadata = { title: "New Post" };

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-900">New Blog Post</h1>
      <BlogPostForm />
    </div>
  );
}
