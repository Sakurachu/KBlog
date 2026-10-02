"use client";

import { useDeferredValue, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  LayoutGrid,
  List,
  Search,
  SearchX,
  X,
} from "lucide-react";
import { PostCard } from "@/components/post-card";
import type { Category, Column, PostSummary } from "@/lib/types";
import { columnForCategory } from "@/lib/columns";

export function PostBrowser({
  posts,
  categories,
  initialQuery = "",
  showCategories = true,
  columns,
  filterColumns = false,
  initialView = "grid",
}: {
  posts: PostSummary[];
  categories: Category[];
  initialQuery?: string;
  showCategories?: boolean;
  columns?: Column[];
  filterColumns?: boolean;
  initialView?: "grid" | "list";
}) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");
  const [view, setView] = useState(initialView);
  const [visibleCount, setVisibleCount] = useState(9);
  const terms = deferredQuery
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const filtered = posts
    .filter((post) => {
      const text =
        `${post.title} ${post.excerpt} ${post.category.name} ${columnForCategory(post.category, columns).name}`.toLocaleLowerCase();
      return (
        (category === "all" ||
          (filterColumns
            ? columnForCategory(post.category, columns).slug === category
            : post.category.slug === category)) &&
        terms.every((term) => text.includes(term))
      );
    })
    .sort((a, b) =>
      sort === "shortest"
        ? a.reading_time - b.reading_time
        : sort === "oldest"
          ? (Date.parse(a.published_at ?? "") || 0) -
            (Date.parse(b.published_at ?? "") || 0)
          : (Date.parse(b.published_at ?? "") || 0) -
            (Date.parse(a.published_at ?? "") || 0),
    );
  const updateQuery = (value: string) => {
    setQuery(value);
    setVisibleCount(9);
    const url = new URL(window.location.href);
    if (value.trim()) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  };

  return (
    <div className="post-browser">
      {showCategories && (
        <div
          className="filter-tabs"
          role="group"
          aria-label={filterColumns ? "按专栏筛选" : "按专题筛选"}
        >
          <button
            type="button"
            aria-pressed={category === "all"}
            onClick={() => {
              setCategory("all");
              setVisibleCount(9);
            }}
          >
            全部文章 <span>{posts.length}</span>
          </button>
          {(filterColumns ? (columns ?? []) : categories).map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={category === item.slug}
              onClick={() => {
                setCategory(item.slug);
                setVisibleCount(9);
              }}
            >
              {item.name}
              <span>
                {
                  posts.filter(
                    (post) =>
                      (filterColumns
                        ? columnForCategory(post.category, columns).slug
                        : post.category.slug) === item.slug,
                  ).length
                }
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="browser-toolbar">
        <div className="archive-search" role="search">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="搜索标题、关键词或专栏…"
            aria-label="搜索文章"
          />
          {query && (
            <button
              type="button"
              className="clear-search"
              aria-label="清空搜索"
              onClick={() => updateQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <div className="browser-controls">
          <label className="sort-control">
            <span className="sr-only">文章排序</span>
            <select
              aria-label="文章排序"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="latest">最新发布</option>
              <option value="oldest">最早发布</option>
              <option value="shortest">阅读时间最短</option>
            </select>
          </label>
          <div className="view-switch" role="group" aria-label="文章展示方式">
            <button
              type="button"
              aria-label="网格视图"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              aria-label="列表视图"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
            >
              <List size={19} />
            </button>
          </div>
        </div>
      </div>
      <p className="results-count" role="status">
        {query.trim()
          ? `“${query.trim()}” · 找到 ${filtered.length} 篇文章`
          : `${filtered.length} 篇文章 · 找一篇想读的文字`}
      </p>
      {filtered.length ? (
        <div className={`post-grid ${view === "list" ? "post-list" : ""}`}>
          {filtered.slice(0, visibleCount).map((post) => (
            <PostCard key={post.id} post={post} columns={columns} />
          ))}
        </div>
      ) : (
        <div className="search-empty">
          <SearchX size={32} strokeWidth={1.3} aria-hidden="true" />
          <h3>暂时没有找到相关文章</h3>
          <p>试试更短的关键词，或选择其他专栏。</p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              updateQuery("");
              setCategory("all");
            }}
          >
            重置筛选 <ArrowUpRight size={16} />
          </button>
        </div>
      )}
      {filtered.length > visibleCount && (
        <div className="load-more">
          <button
            className="secondary-button"
            type="button"
            onClick={() => setVisibleCount((count) => count + 9)}
          >
            查看更多文章 <ArrowDown size={16} />
          </button>
          <span>
            已显示 {visibleCount} / {filtered.length} 篇
          </span>
        </div>
      )}
    </div>
  );
}
