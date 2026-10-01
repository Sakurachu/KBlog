import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PostBrowser } from "@/components/post-browser";
import { getCategories, getPublishedPosts } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  return {
    title: category?.name ?? "分区",
    description: category?.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const posts = await getPublishedPosts({ category: slug });
  const summaries = posts.map(
    ({
      id,
      title,
      slug,
      excerpt,
      cover_image,
      reading_time,
      published_at,
      category,
    }) => ({
      id,
      title,
      slug,
      excerpt,
      cover_image,
      reading_time,
      published_at,
      category,
    }),
  );

  return (
    <main className="inner-page" id="main-content" tabIndex={-1}>
      <header className={`category-page-header accent-${category.accent}`}>
        <div className="page-shell">
          <Link className="back-link" href="/sections">
            <ArrowLeft size={16} /> 所有分区
          </Link>
          <p className="eyebrow">Field notes / 专题笔记</p>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
          <div className="category-siblings" aria-label="切换专题">
            {categories.map((item) => (
              <Link
                key={item.id}
                href={`/sections/${item.slug}`}
                aria-current={item.slug === slug ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <section className="latest-section page-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">共 {posts.length} 篇</p>
            <h2>这个分区的文章</h2>
          </div>
        </div>
        {posts.length ? (
          <PostBrowser
            key={slug}
            posts={summaries}
            categories={categories}
            showCategories={false}
          />
        ) : (
          <div className="empty-state">
            <p>这个分区还没有文章。</p>
          </div>
        )}
      </section>
    </main>
  );
}
