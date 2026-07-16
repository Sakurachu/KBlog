import Link from "next/link";
import { Edit3, KeyRound, MessageCircle, Plus, ScrollText } from "lucide-react";
import { redirect } from "next/navigation";
import { deleteCommentAction, deletePostAction } from "@/app/actions";
import { ConfirmButton } from "@/components/confirm-button";
import { PasswordForm } from "@/components/password-form";
import { getCurrentUser, getStudioData } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata = { title: "写作台" };

export default async function StudioPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ user, profile }, query] = await Promise.all([getCurrentUser(), searchParams]);
  if (!user || profile?.role !== "admin") redirect("/login?next=/studio");
  const { posts, comments } = await getStudioData();
  const publishedCount = posts.filter((post) => post.status === "published").length;

  return (
    <main className="studio-page page-shell">
      <header className="studio-header">
        <div>
          <p className="eyebrow">Editorial studio</p>
          <h1>写作台</h1>
          <p>{profile.display_name}，这里是文章与讨论的管理入口。</p>
        </div>
        <Link className="primary-button" href="/studio/new"><Plus size={17} /> 新建文章</Link>
      </header>

      {query.saved && <p className="studio-notice">文章已经保存。</p>}

      <section className="studio-stats" aria-label="内容统计">
        <div><ScrollText size={20} /><strong>{posts.length}</strong><span>全部文章</span></div>
        <div><Edit3 size={20} /><strong>{publishedCount}</strong><span>已发布</span></div>
        <div><MessageCircle size={20} /><strong>{comments.length}</strong><span>近期评论</span></div>
      </section>

      <section className="studio-section">
        <div className="studio-section-heading"><h2>文章</h2><span>{posts.length} 篇</span></div>
        <div className="studio-table-wrap">
          <table className="studio-table">
            <thead><tr><th>文章</th><th>分区</th><th>状态</th><th>更新</th><th><span className="sr-only">操作</span></th></tr></thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td><strong>{post.title}</strong><small>/{post.slug}</small></td>
                  <td>{post.category?.name}</td>
                  <td><span className={`status status-${post.status}`}>{post.status === "published" ? "已发布" : "草稿"}</span></td>
                  <td>{formatDate(post.updated_at || post.created_at)}</td>
                  <td>
                    <div className="table-actions">
                      <Link className="icon-only" href={`/studio/posts/${post.id}`} title="编辑文章"><Edit3 size={16} /></Link>
                      <form action={deletePostAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <ConfirmButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!posts.length && <tr><td colSpan={5} className="table-empty">还没有文章，从第一篇开始。</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="studio-section">
        <div className="studio-section-heading"><h2>近期评论</h2><span>最多显示 30 条</span></div>
        <div className="moderation-list">
          {comments.map((comment) => {
            const post = posts.find((item) => item.id === comment.post_id);
            return (
              <article key={comment.id} className="moderation-item">
                <div className="avatar">{comment.profile?.display_name?.slice(0, 1) || "读"}</div>
                <div className="moderation-copy">
                  <div><strong>{comment.profile?.display_name || "读者"}</strong><span>{formatDate(comment.created_at)}</span></div>
                  <p>{comment.content}</p>
                  {post && <Link href={`/posts/${post.slug}`}>查看文章：{post.title}</Link>}
                </div>
                <form action={deleteCommentAction}>
                  <input type="hidden" name="id" value={comment.id} />
                  <ConfirmButton label="移除" />
                </form>
              </article>
            );
          })}
          {!comments.length && <p className="table-empty">暂无评论。</p>}
        </div>
      </section>

      <section className="studio-section studio-security-section">
        <div className="studio-section-heading">
          <h2><KeyRound size={20} aria-hidden="true" /> 账号安全</h2>
          <span>{user.email}</span>
        </div>
        <div className="studio-security-layout">
          <div>
            <strong>修改登录密码</strong>
            <p>保存后，新密码会立即用于此管理员账号。</p>
          </div>
          <PasswordForm compact />
        </div>
      </section>
    </main>
  );
}
