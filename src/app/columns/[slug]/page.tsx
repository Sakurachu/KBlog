import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Feather } from "lucide-react";
import { notFound } from "next/navigation";
import { PostBrowser } from "@/components/post-browser";
import { getCategories, getColumns, getPublishedPosts } from "@/lib/data";
import { toPostSummary } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const column = (await getColumns()).find((item) => item.slug === slug);
  return {
    title: column?.name ?? "专栏未找到",
    description: column?.description,
    openGraph: { images: [column?.cover ?? "/images/writing-desk.jpg"] },
  };
}

export default async function ColumnPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ slug }, query, columns, categories, allPosts] = await Promise.all([
    params,
    searchParams,
    getColumns(),
    getCategories(),
    getPublishedPosts(),
  ]);
  const column = columns.find((item) => item.slug === slug);
  if (!column) notFound();
  const posts = allPosts.filter((post) =>
    column.categorySlugs.includes(post.category.slug),
  );
  const topics = categories.filter(
    (category) =>
      column.categorySlugs.includes(category.slug) &&
      category.slug !== column.slug,
  );
  return (
    <main
      className={`column-page theme-${column.theme}`}
      id="main-content"
      tabIndex={-1}
    >
      <header className="column-hero page-shell">
        <div className="column-hero-copy">
          <Link className="back-link" href="/columns">
            <ArrowLeft size={15} /> 全部专栏
          </Link>
          <p className="eyebrow">{column.eyebrow}</p>
          <h1>{column.name}</h1>
          <p className="column-description">{column.description}</p>
          <div className="column-hero-bottom">
            <span>{posts.length} 篇文章</span>
            <a href="#column-articles">
              从这里开始阅读 <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="column-hero-image">
          <Image
            src={column.cover}
            alt=""
            fill
            loading="eager"
            sizes="(max-width: 760px) 100vw, 600px"
          />
          <span>
            {column.theme === "precision"
              ? "FIELD OF PRECISION · μm / nm"
              : column.theme === "notebook"
                ? "A LITTLE SPACE FOR WORDS"
                : "COLLECT THE SMALL MOMENTS"}
          </span>
        </div>
      </header>
      <nav className="column-switcher page-shell" aria-label="切换专栏">
        {columns.map((item) => (
          <Link
            href={`/columns/${item.slug}`}
            key={item.slug}
            aria-current={item.slug === slug ? "page" : undefined}
          >
            {item.name}
            <ArrowUpRight size={14} />
          </Link>
        ))}
      </nav>
      {topics.length > 0 && (
        <section className="column-topics page-shell" aria-label="专栏内的专题">
          <p className="eyebrow">沿着一条线索深入</p>
          <div>
            {topics.map((topic) => (
              <Link href={`/sections/${topic.slug}`} key={topic.slug}>
                <span>{topic.name}</span>
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </section>
      )}
      <section
        className="latest-section page-shell"
        id="column-articles"
        aria-labelledby="column-articles-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Entries / 专栏文章</p>
            <h2 id="column-articles-heading">
              {column.theme === "notebook"
                ? "慢慢写，慢慢读。"
                : column.theme === "gallery"
                  ? "日常，也值得被记住。"
                  : "从原理，走到现场。"}
            </h2>
          </div>
        </div>
        {posts.length ? (
          <PostBrowser
            key={slug}
            posts={posts.map(toPostSummary)}
            columns={columns}
            categories={topics}
            showCategories={topics.length > 1}
            initialQuery={typeof query.q === "string" ? query.q : ""}
            initialView={column.theme === "notebook" ? "list" : "grid"}
          />
        ) : (
          <div className="column-empty">
            <Feather size={34} strokeWidth={1.2} />
            <p className="eyebrow">The first page is still blank</p>
            <h3>第一页，留给下一次落笔。</h3>
            <p>这个专栏已经准备好了。第一篇文章发布后，会出现在这里。</p>
            <Link href="/sections" className="read-link">
              先读读其他文字 <ArrowUpRight size={16} />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
