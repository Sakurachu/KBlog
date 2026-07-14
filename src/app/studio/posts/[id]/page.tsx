import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { PostEditor } from "@/components/post-editor";
import { getCategories, getCurrentUser, getPostById } from "@/lib/data";

export const metadata = { title: "编辑文章" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, profile } = await getCurrentUser();
  if (!user || profile?.role !== "admin") redirect("/login?next=/studio");
  const { id } = await params;
  const [categories, post] = await Promise.all([getCategories(), getPostById(id)]);
  if (!post) notFound();

  return (
    <main className="editor-page page-shell">
      <header className="editor-header">
        <Link className="back-link" href="/studio"><ArrowLeft size={16} /> 返回写作台</Link>
        <p className="eyebrow">Edit post</p>
        <h1>编辑文章</h1>
      </header>
      <PostEditor categories={categories} post={post} />
    </main>
  );
}
