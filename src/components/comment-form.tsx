"use client";

import Link from "next/link";
import { useActionState } from "react";
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

  if (!signedIn) {
    return (
      <div className="comment-gate">
        <p>登录后参与讨论。注册时需要验证邮箱，以保持评论区干净友好。</p>
        <Link className="secondary-button" href={`/login?next=/posts/${postSlug}`}>
          登录或注册
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="comment-form">
      <label htmlFor="comment">写下你的想法</label>
      <textarea id="comment" name="content" rows={5} maxLength={1000} required />
      <div className="form-row">
        <span className="field-hint">最多 1000 字</span>
        <SubmitButton>发布评论</SubmitButton>
      </div>
      {state.error && <p className="form-message error">{state.error}</p>}
      {state.success && <p className="form-message success">{state.success}</p>}
    </form>
  );
}
