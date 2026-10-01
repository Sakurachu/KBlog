import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Crosshair,
  Layers3,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { PostCard } from "@/components/post-card";
import { getCategories, getPublishedPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";

const topicIcons = [Layers3, Crosshair, ScanLine, Sparkles];

export default async function Home() {
  const [categories, posts] = await Promise.all([
    getCategories(),
    getPublishedPosts(),
  ]);
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const latest = posts.filter((post) => post.id !== featured?.id).slice(0, 6);
  const topics = categories.slice(0, 4);

  return (
    <main id="main-content" tabIndex={-1}>
      <section className="home-hero page-shell" aria-labelledby="hero-heading">
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow">
            <span className="status-dot" /> Semiconductor field notes
          </p>
          <h1 id="hero-heading">
            把每一微米，
            <br />
            <em>讲清楚。</em>
          </h1>
          <p className="hero-copy">
            从微米级装配到纳米级 Overlay，
            <br className="desktop-break" />
            记录视觉、运动、标定与工艺之间的精密协作。
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="#latest">
              探索文章 <ArrowDown size={16} aria-hidden="true" />
            </Link>
            <Link className="hero-link" href="/sections/process-atlas">
              查看工艺图谱 <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>{String(posts.length).padStart(2, "0")}</strong>
              <span>篇观察笔记</span>
            </div>
            <div>
              <strong>{String(categories.length).padStart(2, "0")}</strong>
              <span>个研究专题</span>
            </div>
            <p>可测量 · 可补偿 · 可验证</p>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="/images/semiconductor-wafer.webp"
            alt="十二英寸半导体晶圆上的微电子测试结构"
            fill
            loading="eager"
            sizes="(max-width: 760px) 100vw, (max-width: 1300px) 50vw, 640px"
          />
          <div className="hero-image-shade" />
          <div className="visual-label">
            <span className="status-dot" /> FIELD OF PRECISION{" "}
            <span>μm / nm</span>
          </div>
          <div className="alignment-reticle" aria-hidden="true">
            <span />
            <span />
          </div>
          <span className="visual-coordinate" aria-hidden="true">
            X · Y · θ<br />
            ALIGNMENT
          </span>
          <div className="visual-caption">
            <p>在微小偏差里，看见整个系统。</p>
            <span>十二英寸晶圆 / 微电子测试结构</span>
            <Crosshair size={24} strokeWidth={1} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="category-band" aria-labelledby="category-heading">
        <div className="page-shell">
          <div className="section-heading compact-heading">
            <p className="eyebrow" id="category-heading">
              沿着一条线索，深入一点
            </p>
            <Link href="/sections">
              全部专题 <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="category-grid">
            {topics.map((category, index) => {
              const Icon = topicIcons[index];
              return (
                <Link
                  className={`category-item accent-${category.accent}`}
                  href={`/sections/${category.slug}`}
                  key={category.id}
                >
                  <div className="category-top">
                    <Icon size={23} strokeWidth={1.4} aria-hidden="true" />
                    <span className="category-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2>{category.name}</h2>
                  <p>{category.description}</p>
                  <span className="category-bottom">
                    {
                      posts.filter(
                        (post) => post.category.slug === category.slug,
                      ).length
                    }{" "}
                    篇笔记
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {featured && (
        <section
          className="featured-section page-shell"
          aria-labelledby="featured-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Editor’s pick / 编辑精选</p>
              <h2 id="featured-heading">建立你的精度坐标系</h2>
            </div>
            <span className="section-aside">
              读懂指标，是理解工艺的第一步。
            </span>
          </div>
          <div className="featured-layout">
            <Link
              className="featured-image"
              href={`/posts/${featured.slug}`}
              tabIndex={-1}
              aria-hidden="true"
            >
              <Image
                src={featured.cover_image}
                alt=""
                fill
                sizes="(max-width: 760px) 100vw, 600px"
              />
              <span className="featured-image-label">
                <BookOpen size={15} /> 深度阅读
              </span>
            </Link>
            <div className="featured-copy">
              <span className="topic-label">{featured.category.name}</span>
              <h3>
                <Link href={`/posts/${featured.slug}`}>{featured.title}</Link>
              </h3>
              <p>{featured.excerpt}</p>
              <div className="post-meta">
                <time dateTime={featured.published_at ?? undefined}>
                  {formatDate(featured.published_at)}
                </time>
                <span>{featured.reading_time} 分钟阅读</span>
              </div>
              <Link className="read-link" href={`/posts/${featured.slug}`}>
                进入这篇笔记 <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section
        className="latest-section page-shell"
        id="latest"
        aria-labelledby="latest-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Latest notes / 最近更新</p>
            <h2 id="latest-heading">从原理，走到工艺现场</h2>
          </div>
          <Link className="section-all-link" href="/sections#archive">
            浏览全部文章 <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        {latest.length ? (
          <div className="post-grid">
            {latest.map((post) => (
              <PostCard post={post} key={post.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>更多文章正在路上。</p>
          </div>
        )}
      </section>

      <section
        className="reading-path page-shell"
        aria-labelledby="reading-path-heading"
      >
        <div className="reading-path-intro">
          <p className="eyebrow">Start somewhere</p>
          <h2 id="reading-path-heading">
            第一次来？
            <br />
            从这里建立全局视角。
          </h2>
          <p>先把指标说清楚，再回到具体工艺。</p>
        </div>
        <div className="reading-path-links">
          {[
            {
              label: "01",
              title: "建立基础",
              copy: "精度、重复性与误差预算",
              href: "/sections/alignment-basics",
            },
            {
              label: "02",
              title: "理解系统",
              copy: "视觉对准与先进封装",
              href: "/sections/advanced-packaging",
            },
            {
              label: "03",
              title: "走进现场",
              copy: "逐步拆解完整工艺链路",
              href: "/sections/process-atlas",
            },
          ].map((item) => (
            <Link key={item.label} href={item.href}>
              <span>{item.label}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
