"use client";

import { useActionState, useState } from "react";
import { Eye, FileText } from "lucide-react";
import { savePostAction } from "@/app/actions";
import { MarkdownContent } from "@/components/markdown-content";
import { SubmitButton } from "@/components/submit-button";
import type { Category, Post } from "@/lib/types";

export function PostEditor({
  categories,
  post,
}: {
  categories: Category[];
  post?: Post | null;
}) {
  const [state, formAction] = useActionState(savePostAction, {});
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [content, setContent] = useState(post?.content ?? "");

  return (
    <form action={formAction} className="editor-form">
      {post && <input type="hidden" name="id" value={post.id} />}
      {post?.published_at && (
        <input type="hidden" name="publishedAt" value={post.published_at} />
      )}
      <div className="editor-topline">
        <input
          className="title-input"
          name="title"
          defaultValue={post?.title}
          placeholder="文章标题"
          maxLength={120}
          required
        />
        <div className="editor-actions">
          <select name="status" defaultValue={post?.status ?? "draft"} aria-label="发布状态">
            <option value="draft">保存为草稿</option>
            <option value="published">立即发布</option>
          </select>
          <SubmitButton>保存文章</SubmitButton>
        </div>
      </div>

      <div className="editor-settings">
        <label>
          所属分区
          <select name="categoryId" defaultValue={post?.category_id ?? ""} required>
            <option value="" disabled>选择分区</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label>
          链接别名
          <input name="slug" defaultValue={post?.slug} placeholder="留空则根据标题生成" />
        </label>
        <label>
          封面
          <select name="coverImage" defaultValue={post?.cover_image ?? "/images/writing-desk.jpg"}>
            <option value="/images/writing-desk.jpg">书桌与记录</option>
            <option value="/images/architecture.jpg">建筑与光影</option>
            <option value="/images/coast.jpg">海岸与散步</option>
          </select>
        </label>
        <label className="checkbox-label">
          <input name="featured" type="checkbox" defaultChecked={post?.featured} />
          首页精选
        </label>
      </div>

      <label className="excerpt-field">
        摘要
        <textarea
          name="excerpt"
          rows={2}
          maxLength={240}
          defaultValue={post?.excerpt}
          placeholder="留空时会自动从正文截取"
        />
      </label>

      <div className="editor-tabs" role="tablist" aria-label="正文模式">
        <button type="button" role="tab" aria-selected={mode === "write"} onClick={() => setMode("write")}>
          <FileText size={16} aria-hidden="true" /> 编辑
        </button>
        <button type="button" role="tab" aria-selected={mode === "preview"} onClick={() => setMode("preview")}>
          <Eye size={16} aria-hidden="true" /> 预览
        </button>
      </div>
      {mode === "write" ? (
        <textarea
          className="content-editor"
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="使用 Markdown 开始写作……"
          required
        />
      ) : (
        <div className="editor-preview">
          {content ? <MarkdownContent content={content} /> : <p className="muted">暂无预览内容</p>}
          <input type="hidden" name="content" value={content} />
        </div>
      )}
      {state.error && <p className="form-message error">{state.error}</p>}
    </form>
  );
}
