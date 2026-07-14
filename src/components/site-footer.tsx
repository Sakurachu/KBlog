import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <div>
          <Link className="brand brand-light" href="/">
            Kairos<span>.</span>
          </Link>
          <p>在恰好的时刻，记录值得留下的事。</p>
        </div>
        <div className="footer-links">
          <Link href="/sections">浏览分区</Link>
          <Link href="/login">读者登录</Link>
          <a href="mailto:hello@example.com">联系</a>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Kairos</p>
      </div>
    </footer>
  );
}
