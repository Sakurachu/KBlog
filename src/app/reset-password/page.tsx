import { redirect } from "next/navigation";
import { connection } from "next/server";
import { PasswordForm } from "@/components/password-form";
import { getCurrentUser } from "@/lib/data";

export const metadata = { title: "重置密码" };

export default async function ResetPasswordPage() {
  await connection();
  const { user } = await getCurrentUser();
  if (!user) redirect("/login?error=recovery");

  return (
    <main className="auth-page">
      <div className="auth-layout page-shell">
        <section className="auth-intro">
          <p className="eyebrow">Account recovery</p>
          <h1>为账号设置<br />一个新密码</h1>
          <p>重置链接已经通过验证。保存后，新密码会立即生效。</p>
          <div className="auth-note">
            <strong>链接具有时效性</strong>
            <p>如果页面提示链接失效，请返回登录页重新发送重置邮件。</p>
          </div>
        </section>
        <div className="auth-panel">
          <PasswordForm successHref="/studio" />
        </div>
      </div>
    </main>
  );
}
