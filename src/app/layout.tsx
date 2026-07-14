import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Kairos | 在恰好的时刻记录",
    template: "%s | Kairos",
  },
  description: "一个关于技术、生活与日常观察的个人博客。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Kairos",
    images: ["/images/writing-desk.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
