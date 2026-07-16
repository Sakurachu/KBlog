import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Kairos Semi | 精密制造对准笔记",
    template: "%s | Kairos Semi",
  },
  description: "聚焦半导体、先进封装与显示制造的精密视觉对准专题。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Kairos Semi",
    images: ["/images/semiconductor-wafer.webp"],
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
