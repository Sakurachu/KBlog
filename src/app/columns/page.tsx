import { ColumnGrid } from "@/components/column-grid";
import { getColumns, getPublishedPosts } from "@/lib/data";

export const metadata = {
  title: "专栏",
  description: "精密制造、随笔与生活记录。沿着不同的兴趣，找到想读的文字。",
};

export default async function ColumnsPage() {
  const [columns, posts] = await Promise.all([
    getColumns(),
    getPublishedPosts(),
  ]);
  return (
    <main className="columns-index inner-page" id="main-content" tabIndex={-1}>
      <header className="page-intro page-shell">
        <p className="eyebrow">The collections / 专栏</p>
        <h1>
          给不同的兴趣，
          <br />
          <em>留一个房间。</em>
        </h1>
        <p>
          这里的每个专栏有自己的节奏。你可以走进技术的细节，也可以坐下来，读一点随笔和日常。
        </p>
      </header>
      <section className="page-shell columns-index-grid" aria-label="专栏目录">
        <ColumnGrid columns={columns} posts={posts} />
      </section>
    </main>
  );
}
