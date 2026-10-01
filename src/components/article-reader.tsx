"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Check, Copy, List, Minus, Plus } from "lucide-react";
import type { ArticleHeading } from "@/lib/article-headings";

export function ArticleReader({
  headings,
  children,
}: {
  headings: ArticleHeading[];
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(headings[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState(18);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  const mobileToc = useRef<HTMLDetailsElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (!body.current) return;
      const rect = body.current.getBoundingClientRect();
      const distance =
        rect.height - Math.min(window.innerHeight - 100, rect.height);
      setProgress(
        Math.round(
          Math.min(1, Math.max(0, (100 - rect.top) / Math.max(1, distance))) *
            100,
        ),
      );
      let current = headings[0]?.id ?? "";
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= 180)
          current = heading.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(onScroll);
    if (body.current) observer.observe(body.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyError(false);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopyError(true);
    }
  };
  const tocLinks = headings.map((heading) => (
    <a
      key={heading.id}
      href={`#${heading.id}`}
      className={heading.depth === 3 ? "toc-subheading" : undefined}
      aria-current={active === heading.id ? "location" : undefined}
      onClick={() => {
        if (mobileToc.current) mobileToc.current.open = false;
      }}
    >
      {heading.text}
    </a>
  ));

  return (
    <div className="reader-layout page-shell">
      <div
        className="reading-progress"
        role="progressbar"
        aria-label="文章阅读进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span style={{ width: `${progress}%` }} />
      </div>
      <aside className="reader-sidebar">
        <div className="reader-sidebar-inner">
          <p className="eyebrow">
            <List size={15} aria-hidden="true" /> 本文目录
          </p>
          <nav className="article-toc" aria-label="文章目录">
            {tocLinks}
          </nav>
          <div className="reader-progress-label">
            <span>阅读进度</span>
            <span>{progress}%</span>
          </div>
          <div className="reader-progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
          <a className="reader-top" href="#main-content">
            <ArrowUp size={14} /> 回到文章顶部
          </a>
        </div>
      </aside>
      <article className="reader-article">
        <div className="reader-toolbar">
          <span>留一点时间，认真读一篇。</span>
          <div className="reading-controls">
            <button
              type="button"
              className="icon-only"
              aria-label="缩小正文字号"
              disabled={size <= 16}
              onClick={() => setSize((value) => value - 1)}
            >
              <Minus size={15} />
            </button>
            <span aria-live="polite">{size}px</span>
            <button
              type="button"
              className="icon-only"
              aria-label="增大正文字号"
              disabled={size >= 22}
              onClick={() => setSize((value) => value + 1)}
            >
              <Plus size={15} />
            </button>
            <button type="button" className="copy-article" onClick={copyLink}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "已复制" : "复制链接"}
            </button>
          </div>
        </div>
        {copyError && (
          <p className="form-message error" role="alert">
            复制失败，请从浏览器地址栏复制文章链接。
          </p>
        )}
        {headings.length > 0 && (
          <details ref={mobileToc} className="mobile-toc">
            <summary>
              <List size={16} /> 本文目录 <span>{headings.length} 个章节</span>
            </summary>
            <nav className="article-toc" aria-label="移动端文章目录">
              {tocLinks}
            </nav>
          </details>
        )}
        <div
          ref={body}
          className="reader-content"
          style={{ fontSize: `${size}px` }}
        >
          {children}
        </div>
        <div className="article-end">
          <span />
          <p>这篇笔记到这里，观察还在继续。</p>
          <span />
        </div>
      </article>
    </div>
  );
}
