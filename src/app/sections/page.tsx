import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PostBrowser } from "@/components/post-browser";
import { getCategories, getPublishedPosts } from "@/lib/data";

export const metadata = {
  title: "专题索引与全部文章",
  description:
    "按专题浏览半导体、精密对准、先进封装与显示制造笔记，搜索工艺图谱和技术文章。",
};

export default async function SectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [categories, posts, query] = await Promise.all([
    getCategories(),
    getPublishedPosts(),
    searchParams,
  ]);
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
  const searchQuery = typeof query.q === "string" ? query.q : "";

  return (
    <main className="inner-page" id="main-content" tabIndex={-1}>
      <header className="page-shell page-intro">
        <p className="eyebrow">The index / 专题索引</p>
        <h1>每条线索，都值得深入。</h1>
        <p>
          从一个指标、一项工艺或一张图谱开始，逐步建立对精密制造的完整理解。
        </p>
        <a className="intro-anchor" href="#archive">
          {posts.length} 篇笔记 · {categories.length} 个专题{" "}
          <ArrowDown size={15} aria-hidden="true" />
        </a>
      </header>
      {!searchQuery && (
        <section className="section-directory page-shell" aria-label="专题目录">
          {categories.map((category, index) => (
            <Link
              className={`directory-card accent-${category.accent}`}
              href={`/sections/${category.slug}`}
              key={category.id}
            >
              <span className="directory-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <span className="category-bottom">
                {
                  posts.filter((post) => post.category.slug === category.slug)
                    .length
                }{" "}
                篇文章
                <ArrowUpRight size={18} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </section>
      )}
      <section
        className="latest-section page-shell section-all-posts"
        id="archive"
        aria-labelledby="archive-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">The archive / 笔记归档</p>
            <h2 id="archive-heading">全部文章</h2>
          </div>
          <span className="section-aside">让每一次阅读，都多一点收获。</span>
        </div>
        <PostBrowser
          key={searchQuery}
          posts={summaries}
          categories={categories}
          initialQuery={searchQuery}
        />
      </section>
    </main>
  );
}
