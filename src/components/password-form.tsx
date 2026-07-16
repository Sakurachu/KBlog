"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updatePasswordAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

export function PasswordForm({
  compact = false,
  successHref,
}: {
  compact?: boolean;
  successHref?: string;
}) {
  const [state, action] = useActionState(updatePasswordAction, initialState);

  return (
    <form action={action} className={`stack-form password-form${compact ? " compact" : ""}`}>
      <label>
        新密码
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>
      <label>
        确认新密码
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>
      <p className="field-hint">至少 8 个字符，请勿使用其他网站的相同密码。</p>
      {state.error && <p className="form-message error">{state.error}</p>}
      {state.success && <p className="form-message success">{state.success}</p>}
      <SubmitButton>保存新密码</SubmitButton>
      {state.success && successHref && (
        <Link className="text-link password-success-link" href={successHref}>
          进入写作台
        </Link>
      )}
    </form>
  );
}
