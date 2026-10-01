import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found page-shell" id="main-content" tabIndex={-1}>
      <p className="eyebrow">404</p>
      <h1>这一页暂时没有被记录</h1>
      <p>它可能被移动了，也可能还没有写下。</p>
      <div className="not-found-actions">
        <Link className="primary-button" href="/">
          回到首页
        </Link>
        <Link className="secondary-button" href="/sections">
          浏览全部文章
        </Link>
      </div>
    </main>
  );
}
