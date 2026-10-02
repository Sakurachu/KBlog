import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { PostBrowser } from "@/components/post-browser";
import { getCategories, getColumns, getPublishedPosts } from "@/lib/data";
import { columnForCategory } from "@/lib/columns";

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
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const columns = await getColumns();
  const column = columnForCategory(category, columns);
  if (column.slug === slug) {
    const query = await searchParams;
    redirect(
      `/columns/${slug}${typeof query.q === "string" && query.q ? `?q=${encodeURIComponent(query.q)}` : ""}`,
    );
  }
  const siblings = categories.filter(
    (item) =>
      column.categorySlugs.includes(item.slug) && item.slug !== column.slug,
  );
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
    <main
      className={`inner-page theme-${column.theme}`}
      id="main-content"
      tabIndex={-1}
    >
      <header className={`category-page-header accent-${category.accent}`}>
        <div className="page-shell">
          <Link className="back-link" href={`/columns/${column.slug}`}>
            <ArrowLeft size={16} /> {column.name}专栏
          </Link>
          <p className="eyebrow">Field notes / 专题笔记</p>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
          <div className="category-siblings" aria-label="切换专题">
            {siblings.map((item) => (
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
            <h2>这个专题的文章</h2>
          </div>
        </div>
        {posts.length ? (
          <PostBrowser
            key={slug}
            posts={summaries}
            categories={categories}
            columns={columns}
            showCategories={false}
          />
        ) : (
          <div className="empty-state">
            <p>这个专题还没有文章。</p>
          </div>
        )}
      </section>
    </main>
  );
}
