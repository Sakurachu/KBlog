import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, BookOpen, Feather } from "lucide-react";
import { ColumnGrid } from "@/components/column-grid";
import { PostCard } from "@/components/post-card";
import { getColumns, getPublishedPosts } from "@/lib/data";
import { columnForCategory } from "@/lib/columns";
import { formatDate } from "@/lib/format";

export default async function Home() {
  const [columns, posts] = await Promise.all([
    getColumns(),
    getPublishedPosts(),
  ]);
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const latest = posts.slice(0, 6);
  return (
    <main className="journal-home" id="main-content" tabIndex={-1}>
      <section
        className="journal-hero page-shell"
        aria-labelledby="hero-heading"
      >
        <div className="journal-hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> A personal journal / Kairos
          </p>
          <h1 id="hero-heading">
            认真探索，
            <br />
            <em>也自在记录。</em>
          </h1>
          <p className="journal-description">
            这里有把问题看近一点的技术笔记，
            <br className="desktop-break" />
            也有不急着找到答案的随笔与日常。
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="#columns">
              找到感兴趣的专栏 <ArrowDown size={16} />
            </Link>
            <Link className="hero-link" href="/about">
              关于这里 <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="journal-signature">
            <Feather size={19} strokeWidth={1.3} />
            <p>
              把值得留住的事，<span>写进时间里。</span>
            </p>
          </div>
        </div>
        <div
          className="journal-collage"
          aria-label="技术、文字与生活，都是记录的一部分"
        >
          <div className="collage-main">
            <Image
              src="/images/writing-desk.jpg"
              alt="书页与安静的书桌"
              fill
              loading="eager"
              sizes="(max-width: 760px) 90vw, 560px"
            />
            <span>ROOM FOR THOUGHT</span>
          </div>
          <div className="collage-small">
            <Image
              src="/images/coast.jpg"
              alt="开阔的海岸与天空"
              fill
              sizes="(max-width: 760px) 40vw, 230px"
            />
          </div>
          <div className="collage-note">
            <span>NOTES TO SELF</span>
            <p>
              好奇心有很多方向。
              <br />
              文字也是。
            </p>
            <span className="collage-note-line" />
          </div>
          <span className="collage-index">01 — KEEP A LITTLE OF TODAY</span>
        </div>
      </section>
      <section
        className="journal-columns page-shell"
        id="columns"
        aria-labelledby="columns-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Different rooms, same mind / 我的专栏</p>
            <h2 id="columns-heading">不同的心情，不同的入口。</h2>
          </div>
          <Link className="section-all-link" href="/columns">
            全部专栏 <ArrowUpRight size={17} />
          </Link>
        </div>
        <ColumnGrid columns={columns} posts={posts} />
      </section>
      {featured && (
        <section
          className="journal-feature page-shell"
          aria-labelledby="featured-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">On the reading table / 精选阅读</p>
              <h2 id="featured-heading">值得停留的一篇</h2>
            </div>
            <BookOpen size={25} strokeWidth={1.3} aria-hidden="true" />
          </div>
          <div
            className={`journal-feature-inner theme-${columnForCategory(featured.category, columns).theme}`}
          >
            <Link
              className="journal-feature-image"
              href={`/posts/${featured.slug}`}
              tabIndex={-1}
              aria-hidden="true"
            >
              <Image
                src={featured.cover_image}
                alt=""
                fill
                sizes="(max-width: 760px) 100vw, 580px"
              />
            </Link>
            <div className="journal-feature-copy">
              <Link
                className="topic-label"
                href={`/columns/${columnForCategory(featured.category, columns).slug}`}
              >
                {columnForCategory(featured.category, columns).name}
              </Link>
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
                展开阅读 <ArrowUpRight size={17} />
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
            <p className="eyebrow">Latest entries / 最近写下的</p>
            <h2 id="latest-heading">最近的文字</h2>
          </div>
          <Link className="section-all-link" href="/sections">
            浏览归档 <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="post-grid">
          {latest.map((post) => (
            <PostCard key={post.id} post={post} columns={columns} />
          ))}
        </div>
      </section>
      <section className="journal-closing page-shell">
        <span className="eyebrow">A place to return to</span>
        <p>
          有些文字用来理解世界，
          <br />
          <em>有些文字用来记得自己。</em>
        </p>
        <Link href="/columns">
          选一个专栏，慢慢读 <ArrowUpRight size={18} />
        </Link>
      </section>
    </main>
  );
}
