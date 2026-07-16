"use client";

import { useActionState, useState } from "react";
import {
  requestPasswordResetAction,
  signInAction,
  signUpAction,
} from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

export function AuthPanel({
  nextPath = "/",
  pageError,
}: {
  nextPath?: string;
  pageError?: string;
}) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [loginState, loginAction] = useActionState(signInAction, initialState);
  const [registerState, registerAction] = useActionState(signUpAction, initialState);
  const [resetState, resetAction] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <div className="auth-panel">
      <div className="segmented-control" role="tablist" aria-label="账号操作">
        <button
          type="button"
          role="tab"
          aria-selected={mode !== "register"}
          onClick={() => setMode("login")}
        >
          登录
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "register"}
          onClick={() => setMode("register")}
        >
          注册
        </button>
      </div>

      {pageError && <p className="form-message error auth-page-message">{pageError}</p>}

      {mode === "login" ? (
        <form action={loginAction} className="stack-form">
          <input type="hidden" name="next" value={nextPath} />
          <label>
            邮箱
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            密码
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              required
            />
          </label>
          <div className="form-link-row">
            <button
              className="inline-link-button"
              type="button"
              onClick={() => setMode("forgot")}
            >
              忘记密码？
            </button>
          </div>
          {loginState.error && <p className="form-message error">{loginState.error}</p>}
          <SubmitButton>登录</SubmitButton>
        </form>
      ) : mode === "register" ? (
        <form action={registerAction} className="stack-form">
          <label>
            昵称
            <input name="displayName" maxLength={32} autoComplete="nickname" required />
          </label>
          <label>
            邮箱
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            密码
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          {registerState.error && (
            <p className="form-message error">{registerState.error}</p>
          )}
          {registerState.success && (
            <p className="form-message success">{registerState.success}</p>
          )}
          <SubmitButton>创建账号</SubmitButton>
        </form>
      ) : (
        <form action={resetAction} className="stack-form">
          <div className="auth-form-heading">
            <strong>找回密码</strong>
            <span>输入注册邮箱，我们会发送一次性重置链接。</span>
          </div>
          <label>
            邮箱
            <input name="email" type="email" autoComplete="email" required />
          </label>
          {resetState.error && (
            <p className="form-message error">{resetState.error}</p>
          )}
          {resetState.success && (
            <p className="form-message success">{resetState.success}</p>
          )}
          <SubmitButton>发送重置邮件</SubmitButton>
          <button
            className="inline-link-button form-back-button"
            type="button"
            onClick={() => setMode("login")}
          >
            返回登录
          </button>
        </form>
      )}
    </div>
  );
}
