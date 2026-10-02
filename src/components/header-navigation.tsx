"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import type { Column } from "@/lib/types";

export function HeaderNavigation({
  columns,
  account,
}: {
  columns: Column[];
  account: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const links = [
    { href: "/", label: "首页" },
    { href: "/columns", label: "专栏" },
    { href: "/sections", label: "归档" },
    { href: "/about", label: "关于我" },
  ];

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuPath(null);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  return (
    <>
      <nav className="main-nav" aria-label="主导航">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={
              (
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)
              )
                ? "page"
                : undefined
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="search-command"
          type="button"
          aria-label="搜索文章"
          onClick={() => {
            setMenuPath(null);
            dialog.current?.showModal();
          }}
        >
          <Search size={18} aria-hidden="true" />
          <span>搜索</span>
        </button>
        {account}
        <button
          ref={menuButton}
          className="menu-command icon-only"
          type="button"
          aria-label={menuOpen ? "关闭导航" : "打开导航"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuPath(menuOpen ? null : pathname)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="移动端导航"
        >
          <p className="eyebrow">探索 Kairos</p>
          {[
            { href: "/", label: "首页" },
            { href: "/columns", label: "全部专栏" },
            ...columns.map((column) => ({
              href: `/columns/${column.slug}`,
              label: column.name,
            })),
            { href: "/sections", label: "文章归档" },
            { href: "/about", label: "关于我" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setMenuPath(null)}
            >
              {link.label}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      )}
      <dialog
        ref={dialog}
        className="search-dialog"
        aria-labelledby="search-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="search-dialog-heading">
          <div>
            <p className="eyebrow">Find your next read</p>
            <h2 id="search-title">找一篇想读的文字</h2>
          </div>
          <button
            className="icon-only"
            type="button"
            aria-label="关闭搜索"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <form
          className="quick-search"
          action="/sections"
          role="search"
          onSubmit={() => dialog.current?.close()}
        >
          <Search size={20} aria-hidden="true" />
          <input
            name="q"
            type="search"
            placeholder="搜索技术、随笔或生活片段…"
            aria-label="搜索关键词"
            autoFocus
            required
          />
          <button type="submit" className="primary-button">
            搜索
          </button>
        </form>
        <p className="search-hint">在所有专栏中搜索标题、摘要和关键词</p>
        <div className="search-topics">
          {columns.map((column) => (
            <Link
              key={column.id}
              href={`/columns/${column.slug}`}
              onClick={() => dialog.current?.close()}
            >
              {column.name}
              <ArrowUpRight size={14} />
            </Link>
          ))}
        </div>
        <p className="search-keyboard">
          <kbd>Esc</kbd> 关闭搜索
        </p>
      </dialog>
    </>
  );
}
