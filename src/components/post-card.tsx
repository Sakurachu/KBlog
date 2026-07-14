import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <article className="post-card">
      <Link className="post-card-image" href={`/posts/${post.slug}`} tabIndex={-1}>
        <Image
          src={post.cover_image}
          alt=""
          fill
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 720px) 100vw, 33vw"
        />
      </Link>
      <div className="post-card-body">
        <div className="post-meta">
          <Link href={`/sections/${post.category.slug}`}>{post.category.name}</Link>
          <span>{formatDate(post.published_at)}</span>
          <span className="reading-time">
            <Clock3 size={14} aria-hidden="true" /> {post.reading_time} 分钟
          </span>
        </div>
        <h3>
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p>{post.excerpt}</p>
        <Link className="read-link" href={`/posts/${post.slug}`}>
          阅读文章 <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
