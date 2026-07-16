import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getCategories, getFeaturedPost, getPublishedPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";

export default async function Home() {
  const [categories, featured, posts] = await Promise.all([
    getCategories(),
    getFeaturedPost(),
    getPublishedPosts({ limit: 7 }),
  ]);
  const latest = posts.filter((post) => post.id !== featured?.id).slice(0, 6);

  return (
    <main>
      <section className="home-hero">
        <Image
          src="/images/semiconductor-wafer.webp"
          alt="布满微电子测试结构的十二英寸晶圆"
          fill
          loading="eager"
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="page-shell hero-content">
          <p className="eyebrow">Semiconductor Alignment Notes</p>
          <h1>精密对准</h1>
          <p className="hero-copy">
            从微米级装配到纳米级 Overlay，拆解视觉、运动、标定与工艺误差的完整链路。
          </p>
          <Link className="hero-link" href="#latest">
            开始阅读 <ArrowDown size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="category-band" aria-labelledby="category-heading">
        <div className="page-shell">
          <div className="section-heading compact-heading">
            <p className="eyebrow" id="category-heading">浏览分区</p>
            <Link href="/sections">全部分区 <ArrowRight size={15} /></Link>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => (
              <Link
                className={`category-item accent-${category.accent}`}
                href={`/sections/${category.slug}`}
                key={category.id}
              >
                <span className="category-index">0{index + 1}</span>
                <div>
                  <h2>{category.name}</h2>
                  <p>{category.description}</p>
                </div>
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured && (
        <section className="featured-section">
          <div className="page-shell featured-layout">
            <Link className="featured-image" href={`/posts/${featured.slug}`} tabIndex={-1}>
              <Image
                src={featured.cover_image}
                alt=""
                fill
                sizes="(max-width: 800px) 100vw, 58vw"
              />
            </Link>
            <div className="featured-copy">
              <p className="eyebrow"><Sparkles size={15} /> 本期精选</p>
              <h2><Link href={`/posts/${featured.slug}`}>{featured.title}</Link></h2>
              <p>{featured.excerpt}</p>
              <div className="post-meta">
                <span>{featured.category.name}</span>
                <span>{formatDate(featured.published_at)}</span>
                <span>{featured.reading_time} 分钟阅读</span>
              </div>
              <Link className="primary-button" href={`/posts/${featured.slug}`}>
                阅读全文 <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="latest-section page-shell" id="latest">
        <div className="section-heading">
          <div>
            <p className="eyebrow">专题文章</p>
            <h2>对准能力与工艺现场</h2>
          </div>
          <p>围绕对象、精度、误差源、补偿方法和验收边界展开。</p>
        </div>
        {latest.length ? (
          <div className="post-grid">
            {latest.map((post) => <PostCard post={post} key={post.id} />)}
          </div>
        ) : (
          <div className="empty-state"><p>更多文章正在路上。</p></div>
        )}
      </section>
    </main>
  );
}
