import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { PostEditor } from "@/components/post-editor";
import { getCategories, getCurrentUser } from "@/lib/data";

export const metadata = { title: "新建文章" };

export default async function NewPostPage() {
  const { user, profile } = await getCurrentUser();
  if (!user || profile?.role !== "admin") redirect("/login?next=/studio/new");
  const categories = await getCategories();

  return (
    <main className="editor-page page-shell">
      <header className="editor-header">
        <Link className="back-link" href="/studio"><ArrowLeft size={16} /> 返回写作台</Link>
        <p className="eyebrow">New post</p>
        <h1>新建文章</h1>
      </header>
      <PostEditor categories={categories} />
    </main>
  );
}
