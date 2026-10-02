import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Column, PostSummary } from "@/lib/types";

export function ColumnGrid({
  columns,
  posts,
}: {
  columns: Column[];
  posts: PostSummary[];
}) {
  return (
    <div className="column-grid">
      {columns.map((column, index) => {
        const count = posts.filter((post) =>
          column.categorySlugs.includes(post.category.slug),
        ).length;
        return (
          <Link
            href={`/columns/${column.slug}`}
            className={`column-card theme-${column.theme}`}
            key={column.slug}
          >
            <div className="column-card-image">
              <Image
                src={column.cover}
                alt=""
                fill
                sizes="(max-width: 760px) 100vw, 420px"
              />
              <span>{column.eyebrow}</span>
            </div>
            <div className="column-card-copy">
              <div className="column-card-number">
                <span>{String(index + 1).padStart(2, "0")} / COLUMN</span>
                <span>{count ? `${count} 篇文章` : "等待第一篇"}</span>
              </div>
              <h2>
                {column.name}
                <ArrowUpRight size={24} strokeWidth={1.4} aria-hidden="true" />
              </h2>
              <p>{column.description}</p>
              <span className="column-card-link">
                进入专栏 <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
