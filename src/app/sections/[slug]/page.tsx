import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/post-card";
import { getCategories, getPublishedPosts } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  return { title: category?.name ?? "分区", description: category?.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const posts = await getPublishedPosts({ category: slug });

  return (
    <main className="inner-page">
      <header className={`category-page-header accent-${category.accent}`}>
        <div className="page-shell">
          <Link className="back-link" href="/sections"><ArrowLeft size={16} /> 所有分区</Link>
          <p className="eyebrow">Section</p>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
      </header>
      <section className="latest-section page-shell">
        <div className="section-heading">
          <div><p className="eyebrow">共 {posts.length} 篇</p><h2>这个分区的文章</h2></div>
        </div>
        {posts.length ? (
          <div className="post-grid">
            {posts.map((post) => <PostCard post={post} key={post.id} />)}
          </div>
        ) : (
          <div className="empty-state"><p>这个分区还没有文章。</p></div>
        )}
      </section>
    </main>
  );
}
