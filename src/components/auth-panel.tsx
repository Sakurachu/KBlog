"use client";

import { useActionState, useState } from "react";
import { signInAction, signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/types";

const initialState: ActionState = {};

export function AuthPanel({ nextPath = "/" }: { nextPath?: string }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, loginAction] = useActionState(signInAction, initialState);
  const [registerState, registerAction] = useActionState(signUpAction, initialState);

  return (
    <div className="auth-panel">
      <div className="segmented-control" role="tablist" aria-label="账号操作">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
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
          {loginState.error && <p className="form-message error">{loginState.error}</p>}
          <SubmitButton>登录</SubmitButton>
        </form>
      ) : (
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
      )}
    </div>
  );
}
