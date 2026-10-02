import Link from "next/link";
import { ArrowUpRight, Feather } from "lucide-react";
import { getColumns } from "@/lib/data";

export async function SiteFooter() {
  const columns = await getColumns();
  return (
    <footer className="site-footer">
      <div className="page-shell">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link className="brand brand-light" href="/">
              <span className="brand-mark">
                <Feather size={23} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="brand-type">
                Kairos<span>·Journal</span>
                <small>技术 · 随笔 · 生活</small>
              </span>
            </Link>
            <p>
              认真探索，也自在记录。
              <br />
              给好奇心和个人表达，留一个地方。
            </p>
          </div>
          <nav className="footer-links" aria-label="页脚专栏导航">
            <span>沿着兴趣阅读</span>
            {columns.map((column) => (
              <Link key={column.slug} href={`/columns/${column.slug}`}>
                {column.name}
              </Link>
            ))}
          </nav>
          <nav className="footer-links" aria-label="页脚站点导航">
            <span>继续探索</span>
            <Link href="/columns">
              全部专栏 <ArrowUpRight size={14} />
            </Link>
            <Link href="/sections">文章归档</Link>
            <Link href="/about">关于我</Link>
          </nav>
          <div className="footer-note">
            <Feather size={28} strokeWidth={1} aria-hidden="true" />
            <p>
              把值得留住的事，
              <br />
              写进时间里。
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Kairos</p>
          <a
            className="image-credit"
            href="https://commons.wikimedia.org/wiki/File:Semiconductor_Wafer_of_Microelectronics.jpg"
            target="_blank"
            rel="noreferrer"
          >
            晶圆摄影：DrHughManning · CC BY-SA 4.0 <ArrowUpRight size={12} />
          </a>
          <a className="back-top" href="#main-content">
            回到顶部 ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
