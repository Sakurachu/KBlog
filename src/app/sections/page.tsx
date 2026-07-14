import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getCategories, getPublishedPosts } from "@/lib/data";

export const metadata = { title: "全部分区" };

export default async function SectionsPage() {
  const [categories, posts] = await Promise.all([getCategories(), getPublishedPosts()]);

  return (
    <main className="inner-page">
      <header className="page-shell page-intro">
        <p className="eyebrow">Sections</p>
        <h1>从感兴趣的地方开始</h1>
        <p>每个分区代表一条持续观察的线索，而不是互不相干的抽屉。</p>
      </header>
      <section className="section-list page-shell">
        {categories.map((category) => {
          const categoryPosts = posts.filter((post) => post.category_id === category.id);
          return (
            <div className={`section-row accent-${category.accent}`} key={category.id}>
              <div className="section-row-heading">
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <Link href={`/sections/${category.slug}`}>
                  查看全部 {categoryPosts.length} 篇 <ArrowRight size={16} />
                </Link>
              </div>
              <div className="section-row-posts">
                {categoryPosts.slice(0, 2).map((post) => (
                  <Link href={`/posts/${post.slug}`} key={post.id}>
                    <span>{post.title}</span>
                    <ArrowRight size={16} />
                  </Link>
                ))}
                {!categoryPosts.length && <p className="muted">这个分区还没有文章。</p>}
              </div>
            </div>
          );
        })}
      </section>
      <section className="latest-section page-shell section-all-posts">
        <div className="section-heading">
          <div><p className="eyebrow">Archive</p><h2>全部文章</h2></div>
        </div>
        <div className="post-grid">
          {posts.map((post) => <PostCard post={post} key={post.id} />)}
        </div>
      </section>
    </main>
  );
}
