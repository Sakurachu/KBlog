import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "./columns.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Kairos | 技术、随笔与生活记录",
    template: "%s | Kairos",
  },
  description:
    "认真探索，也自在记录。关于精密制造的技术笔记、个人随笔与日常生活。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Kairos",
    images: ["/images/writing-desk.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main-content">
          跳到主要内容
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
