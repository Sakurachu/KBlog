import { redirect } from "next/navigation";
import { AuthPanel } from "@/components/auth-panel";
import { getCurrentUser } from "@/lib/data";

export const metadata = { title: "登录或注册" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [{ user }, query] = await Promise.all([getCurrentUser(), searchParams]);
  const nextPath = query.next?.startsWith("/") && !query.next.startsWith("//") ? query.next : "/";
  if (user) redirect(nextPath);

  return (
    <main className="auth-page">
      <div className="auth-layout page-shell">
        <section className="auth-intro">
          <p className="eyebrow">Reader account</p>
          <h1>加入一场<br />认真而友好的讨论</h1>
          <p>账号只用于评论与身份识别。我们不会发送营销邮件，也不会公开你的邮箱。</p>
          <div className="auth-note">
            <strong>为什么需要邮箱验证？</strong>
            <p>它能减少自动垃圾评论，同时让你保留稳定的读者身份。</p>
          </div>
        </section>
        <AuthPanel nextPath={nextPath} />
      </div>
    </main>
  );
}
