import Link from "next/link";
import { ArrowUpRight, Crosshair } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link className="brand brand-light" href="/">
              <span className="brand-mark">
                <Crosshair size={23} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="brand-type">
                Kairos<span>·Semi</span>
                <small>精密制造观察笔记</small>
              </span>
            </Link>
            <p>
              在微小偏差里，看见整个系统。
              <br />
              记录每一个可测量、可补偿、可验证的细节。
            </p>
          </div>
          <nav className="footer-links" aria-label="页脚专题导航">
            <span>持续观察</span>
            <Link href="/sections/alignment-basics">对准基础</Link>
            <Link href="/sections/advanced-packaging">先进封装</Link>
            <Link href="/sections/display-manufacturing">显示制造</Link>
          </nav>
          <nav className="footer-links" aria-label="页脚站点导航">
            <span>继续探索</span>
            <Link href="/sections/process-atlas">
              精密工艺图解 <ArrowUpRight size={14} />
            </Link>
            <Link href="/sections">全部文章</Link>
            <Link href="/login">读者登录</Link>
          </nav>
          <div className="footer-note">
            <Crosshair size={28} strokeWidth={1} aria-hidden="true" />
            <p>
              保持好奇，
              <br />
              把问题再看近一点。
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Kairos Semi</p>
          <a
            className="image-credit"
            href="https://commons.wikimedia.org/wiki/File:Semiconductor_Wafer_of_Microelectronics.jpg"
            target="_blank"
            rel="noreferrer"
          >
            晶圆摄影：DrHughManning · CC BY-SA 4.0{" "}
            <ArrowUpRight size={12} aria-hidden="true" />
          </a>
          <a className="back-top" href="#main-content">
            回到顶部 ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
