import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <div>
          <Link className="brand brand-light" href="/">
            Kairos<span>·Semi</span>
          </Link>
          <p>记录精密制造里每一个可测量、可补偿、可验证的偏差。</p>
        </div>
        <div className="footer-links">
          <Link href="/sections">浏览分区</Link>
          <Link href="/login">读者登录</Link>
          <a href="https://commons.wikimedia.org/wiki/File:Semiconductor_Wafer_of_Microelectronics.jpg">
            DrHughManning / CC BY-SA 4.0
          </a>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Kairos Semi</p>
      </div>
    </footer>
  );
}
