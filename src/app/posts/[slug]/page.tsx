import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comment-form";
import { MarkdownContent } from "@/components/markdown-content";
import { getComments, getCurrentUser, getPostBySlug } from "@/lib/data";
import { isEditorialPostId } from "@/lib/editorial-data";
import { isProcessAtlasPostId } from "@/lib/process-atlas-data";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return post
    ? { title: post.title, description: post.excerpt, openGraph: { images: [post.cover_image] } }
    : { title: "文章未找到" };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const isEditorial = isEditorialPostId(post.id) || isProcessAtlasPostId(post.id);
  const comments = isEditorial ? [] : await getComments(post.id);
  const { user } = isEditorial ? { user: null } : await getCurrentUser();

  return (
    <main className="article-page">
      <header className="article-header page-shell">
        <Link className="back-link" href={`/sections/${post.category.slug}`}>
          <ArrowLeft size={16} /> 返回{post.category.name}
        </Link>
        <div className="article-heading">
          <Link className="article-category" href={`/sections/${post.category.slug}`}>
            {post.category.name}
          </Link>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="post-meta article-meta">
            <span>{formatDate(post.published_at)}</span>
            <span><Clock3 size={15} /> {post.reading_time} 分钟阅读</span>
            {!isEditorial && <span><MessageCircle size={15} /> {comments.length} 条评论</span>}
          </div>
        </div>
      </header>
      <div className="article-cover page-shell">
        <Image
          src={post.cover_image}
          alt=""
          fill
          loading="eager"
          sizes="(max-width: 1100px) 100vw, 1100px"
        />
      </div>
      <article className="article-body page-shell">
        <MarkdownContent content={post.content} />
      </article>
      {!isEditorial && (
        <section className="comments-section">
          <div className="page-shell comments-inner">
            <div className="comments-heading">
              <p className="eyebrow">Discussion</p>
              <h2>评论 <span>{comments.length}</span></h2>
            </div>
            <CommentForm postId={post.id} postSlug={post.slug} signedIn={Boolean(user)} />
            <div className="comment-list">
              {comments.map((comment) => (
                <article className="comment" key={comment.id}>
                  <div className="avatar">{comment.profile?.display_name?.slice(0, 1) || "读"}</div>
                  <div>
                    <div className="comment-meta">
                      <strong>{comment.profile?.display_name || "读者"}</strong>
                      <time>{formatDate(comment.created_at)}</time>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </article>
              ))}
              {!comments.length && <p className="empty-comment">还没有评论，来留下第一个想法。</p>}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
