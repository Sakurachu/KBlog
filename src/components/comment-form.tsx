"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createCommentAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";

export function CommentForm({
  postId,
  postSlug,
  signedIn,
}: {
  postId: string;
  postSlug: string;
  signedIn: boolean;
}) {
  const action = createCommentAction.bind(null, postId, postSlug);
  const [state, formAction] = useActionState(action, {});
  const [content, setContent] = useState("");

  if (!signedIn) {
    return (
      <div className="comment-gate">
        <p>登录后参与讨论。注册时需要验证邮箱，以保持评论区干净友好。</p>
        <Link
          className="secondary-button"
          href={`/login?next=/posts/${postSlug}`}
        >
          登录或注册
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="comment-form">
      <label htmlFor="comment">写下你的想法</label>
      <textarea
        id="comment"
        name="content"
        rows={5}
        maxLength={1000}
        required
        placeholder="分享你的工艺经验，或提出一个值得继续讨论的问题…"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        aria-describedby="comment-length"
      />
      <div className="form-row">
        <span className="field-hint" id="comment-length">
          {content.length} / 1000 字
        </span>
        <SubmitButton>发布评论</SubmitButton>
      </div>
      {state.error && (
        <p className="form-message error" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="form-message success" role="status">
          {state.success}
        </p>
      )}
    </form>
  );
}
