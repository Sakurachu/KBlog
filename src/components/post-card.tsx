import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { categoryUrl, columnForCategory } from "@/lib/columns";
import type { Column, PostSummary } from "@/lib/types";

export function PostCard({
  post,
  priority = false,
  columns,
}: {
  post: PostSummary;
  priority?: boolean;
  columns?: Column[];
}) {
  const column = columnForCategory(post.category, columns);
  return (
    <article className={`post-card theme-${column.theme}`}>
      <Link
        className="post-card-image"
        href={`/posts/${post.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={post.cover_image}
          alt=""
          fill
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 400px"
        />
        <span className="image-read-time">
          <Clock3 size={13} aria-hidden="true" /> {post.reading_time} 分钟阅读
        </span>
      </Link>
      <div className="post-card-body">
        <div className="post-meta">
          <Link href={categoryUrl(post.category, columns)}>
            {post.category.name}
          </Link>
          <time dateTime={post.published_at ?? undefined}>
            {formatDate(post.published_at)}
          </time>
        </div>
        <span className="sr-only">{post.reading_time} 分钟阅读</span>
        <h3>
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        <Link
          className="read-link"
          href={`/posts/${post.slug}`}
          aria-label={`阅读：${post.title}`}
        >
          阅读文章 <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
