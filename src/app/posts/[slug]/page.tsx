import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/comment-form";
import { MarkdownContent } from "@/components/markdown-content";
import { ArticleReader } from "@/components/article-reader";
import { PostCard } from "@/components/post-card";
import { getArticleHeadings } from "@/lib/article-headings";
import {
  getComments,
  getCurrentUser,
  getPostBySlug,
  getPublishedPosts,
  getColumns,
} from "@/lib/data";
import { isEditorialPostId } from "@/lib/editorial-data";
import { isProcessAtlasPostId } from "@/lib/process-atlas-data";
import { formatDate } from "@/lib/format";
import { categoryUrl, columnForCategory } from "@/lib/columns";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return post
    ? {
        title: post.title,
        description: post.excerpt,
        openGraph: { images: [post.cover_image] },
      }
    : { title: "文章未找到" };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();
  const columns = await getColumns();
  const column = columnForCategory(post.category, columns);

  const isEditorial =
    isEditorialPostId(post.id) || isProcessAtlasPostId(post.id);
  const comments = isEditorial ? [] : await getComments(post.id);
  const { user } = isEditorial ? { user: null } : await getCurrentUser();
  const otherPosts = (await getPublishedPosts()).filter(
    (item) =>
      item.id !== post.id && column.categorySlugs.includes(item.category.slug),
  );
  const related = [
    ...otherPosts.filter((item) => item.category.slug === post.category.slug),
    ...otherPosts.filter((item) => item.category.slug !== post.category.slug),
  ].slice(0, 3);

  return (
    <main
      className={`article-page theme-${column.theme}`}
      id="main-content"
      tabIndex={-1}
    >
      <header className="article-header page-shell">
        <nav className="article-breadcrumb" aria-label="面包屑导航">
          <Link href="/">首页</Link>
          <span>/</span>
          <Link href={`/columns/${column.slug}`}>{column.name}</Link>
          {post.category.slug !== column.slug && (
            <>
              <span>/</span>
              <Link href={categoryUrl(post.category, columns)}>
                {post.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span>正文</span>
        </nav>
        <div className="article-heading">
          <Link
            className="article-category"
            href={categoryUrl(post.category, columns)}
          >
            {post.category.name}
          </Link>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="post-meta article-meta">
            <time dateTime={post.published_at ?? undefined}>
              {formatDate(post.published_at)}
            </time>
            <span>
              <Clock3 size={15} /> {post.reading_time} 分钟阅读
            </span>
            {!isEditorial && (
              <span>
                <MessageCircle size={15} /> {comments.length} 条评论
              </span>
            )}
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
      <ArticleReader headings={getArticleHeadings(post.content)}>
        <MarkdownContent content={post.content} />
      </ArticleReader>
      {related.length > 0 && (
        <section
          className="related-posts page-shell"
          aria-labelledby="related-heading"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">Keep exploring / 延伸阅读</p>
              <h2 id="related-heading">沿着这条线索，继续读</h2>
            </div>
            <Link className="section-all-link" href={`/columns/${column.slug}`}>
              浏览本专栏 <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="post-grid">
            {related.map((item) => (
              <PostCard key={item.id} post={item} columns={columns} />
            ))}
          </div>
          <Link className="back-link" href={`/columns/${column.slug}`}>
            <ArrowLeft size={16} /> 返回{column.name}
          </Link>
        </section>
      )}
      {!isEditorial && (
        <section className="comments-section">
          <div className="page-shell comments-inner">
            <div className="comments-heading">
              <p className="eyebrow">Discussion</p>
              <h2>
                评论 <span>{comments.length}</span>
              </h2>
            </div>
            <CommentForm
              postId={post.id}
              postSlug={post.slug}
              signedIn={Boolean(user)}
            />
            <div className="comment-list">
              {comments.map((comment) => (
                <article className="comment" key={comment.id}>
                  <div className="avatar">
                    {comment.profile?.display_name?.slice(0, 1) || "读"}
                  </div>
                  <div>
                    <div className="comment-meta">
                      <strong>{comment.profile?.display_name || "读者"}</strong>
                      <time>{formatDate(comment.created_at)}</time>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </article>
              ))}
              {!comments.length && (
                <p className="empty-comment">还没有评论，来留下第一个想法。</p>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
