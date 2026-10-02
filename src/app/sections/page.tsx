import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PostBrowser } from "@/components/post-browser";
import { getCategories, getColumns, getPublishedPosts } from "@/lib/data";
import { toPostSummary } from "@/lib/format";

export const metadata = {
  title: "文章归档",
  description: "在 Kairos 的所有专栏中浏览和搜索技术笔记、随笔与生活记录。",
};
export default async function SectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [categories, columns, posts, query] = await Promise.all([
    getCategories(),
    getColumns(),
    getPublishedPosts(),
    searchParams,
  ]);
  const searchQuery = typeof query.q === "string" ? query.q : "";
  return (
    <main className="inner-page archive-page" id="main-content" tabIndex={-1}>
      <header className="page-shell page-intro">
        <p className="eyebrow">The archive / 文章归档</p>
        <h1>
          把散落的文字，
          <br />
          <em>慢慢翻回来。</em>
        </h1>
        <p>技术、想法和日常，都在这里。按专栏寻找，或从一个关键词开始。</p>
        <div className="archive-column-links">
          {columns.map((column) => (
            <Link key={column.slug} href={`/columns/${column.slug}`}>
              {column.name}
              <ArrowUpRight size={14} />
            </Link>
          ))}
        </div>
      </header>
      <section
        className="latest-section page-shell section-all-posts"
        id="archive"
        aria-labelledby="archive-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">{posts.length} entries / 所有记录</p>
            <h2 id="archive-heading">全部文章</h2>
          </div>
        </div>
        <PostBrowser
          key={searchQuery}
          posts={posts.map(toPostSummary)}
          categories={categories}
          columns={columns}
          filterColumns
          initialQuery={searchQuery}
        />
      </section>
    </main>
  );
}
