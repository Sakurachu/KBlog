import Link from "next/link";
import { LogIn, PenLine } from "lucide-react";
import { signOutAction } from "@/app/actions";
import { getCategories, getCurrentUser } from "@/lib/data";

export async function SiteHeader() {
  const [{ user, profile }, categories] = await Promise.all([
    getCurrentUser(),
    getCategories(),
  ]);

  return (
    <header className="site-header">
      <div className="page-shell header-inner">
        <Link className="brand" href="/" aria-label="Kairos 首页">
          Kairos<span>.</span>
        </Link>
        <nav className="main-nav" aria-label="主导航">
          <Link href="/">首页</Link>
          <Link href="/sections">分区</Link>
          {categories.slice(0, 3).map((category) => (
            <Link key={category.id} href={`/sections/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {profile?.role === "admin" && (
            <Link className="icon-command" href="/studio" title="写作台">
              <PenLine size={18} aria-hidden="true" />
              <span>写作台</span>
            </Link>
          )}
          {user ? (
            <div className="account-menu">
              <span className="avatar" aria-hidden="true">
                {profile?.display_name?.slice(0, 1) || user.email?.slice(0, 1)}
              </span>
              <form action={signOutAction}>
                <button className="text-button" type="submit">
                  退出
                </button>
              </form>
            </div>
          ) : (
            <Link className="icon-command" href="/login">
              <LogIn size={18} aria-hidden="true" />
              <span>登录</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
