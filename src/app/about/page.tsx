import Link from "next/link";
import { ArrowUpRight, Feather } from "lucide-react";

export const metadata = {
  title: "关于这里",
  description: "Kairos：技术、随笔与生活记录，一个留给好奇心和个人表达的地方。",
};
export default function AboutPage() {
  return (
    <main className="about-page page-shell" id="main-content" tabIndex={-1}>
      <header>
        <p className="eyebrow">Behind the words / 关于这里</p>
        <h1>
          你好，
          <br />
          欢迎来到 <em>Kairos。</em>
        </h1>
      </header>
      <div className="about-body">
        <Feather size={32} strokeWidth={1.2} />
        <p className="about-lead">
          这是我的个人博客。
          <br />
          技术是其中一部分，生活和想法也是。
        </p>
        <p>
          有时，我想把一项工艺、一套系统或一个技术问题说清楚；有时，只想留下读过的文字、当下的念头和日常的片段。这些内容放在不同的专栏里，各自保留适合自己的节奏。
        </p>
        <p>
          精密制造专栏沿着问题往深处走，随笔给思考留一点空间，生活记录则把目光放回身边。你可以按兴趣阅读，也可以在归档里遇见意料之外的一篇。
        </p>
        <div className="about-links">
          <Link className="primary-button" href="/columns">
            探索专栏 <ArrowUpRight size={16} />
          </Link>
          <Link className="hero-link" href="/sections">
            看看最近的文章 <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
