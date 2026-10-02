import Link from "next/link";
import { Feather, LogIn, PenLine } from "lucide-react";
import { HeaderNavigation } from "@/components/header-navigation";
import { signOutAction } from "@/app/actions";
import { getColumns, getCurrentUser } from "@/lib/data";

export async function SiteHeader() {
  const [{ user, profile }, columns] = await Promise.all([
    getCurrentUser(),
    getColumns(),
  ]);

  return (
    <header className="site-header">
      <div className="page-shell header-inner">
        <Link className="brand" href="/" aria-label="Kairos 首页">
          <span className="brand-mark">
            <Feather size={23} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="brand-type">
            Kairos<span>·Journal</span>
            <small>技术 · 随笔 · 生活</small>
          </span>
        </Link>
        <HeaderNavigation
          columns={columns}
          account={
            <>
              {profile?.role === "admin" && (
                <Link className="icon-command" href="/studio" title="写作台">
                  <PenLine size={18} aria-hidden="true" />
                  <span>写作台</span>
                </Link>
              )}
              {user ? (
                <div className="account-menu">
                  <span className="avatar" aria-hidden="true">
                    {profile?.display_name?.slice(0, 1) ||
                      user.email?.slice(0, 1)}
                  </span>
                  <form action={signOutAction}>
                    <button className="text-button" type="submit">
                      退出
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  className="icon-command account-command"
                  href="/login"
                  aria-label="读者登录"
                >
                  <LogIn size={18} aria-hidden="true" />
                  <span>登录</span>
                </Link>
              )}
            </>
          }
        />
      </div>
    </header>
  );
}
