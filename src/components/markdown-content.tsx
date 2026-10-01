import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link2 } from "lucide-react";
import { ArticleImage } from "@/components/article-image";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="article-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, node }) => (
            <h1 id={`section-${node?.position?.start.line}`}>
              {children}
              <a
                className="heading-anchor"
                href={`#section-${node?.position?.start.line}`}
                aria-label="链接到此章节"
              >
                <Link2 size={16} />
              </a>
            </h1>
          ),
          h2: ({ children, node }) => (
            <h2 id={`section-${node?.position?.start.line}`}>
              {children}
              <a
                className="heading-anchor"
                href={`#section-${node?.position?.start.line}`}
                aria-label="链接到此章节"
              >
                <Link2 size={16} />
              </a>
            </h2>
          ),
          h3: ({ children, node }) => (
            <h3 id={`section-${node?.position?.start.line}`}>
              {children}
              <a
                className="heading-anchor"
                href={`#section-${node?.position?.start.line}`}
                aria-label="链接到此章节"
              >
                <Link2 size={16} />
              </a>
            </h3>
          ),
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              <ArticleImage src={src} alt={alt ?? ""} />
            ) : null,
          table: ({ children }) => (
            <div
              className="table-scroll"
              tabIndex={0}
              role="region"
              aria-label="文章表格，可横向滚动"
            >
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
