"use client";

import { useActionState, useState } from "react";
import {
  requestPasswordResetAction,
  signInAction,
  signUpAction,
} from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { PasswordInput } from "@/components/password-input";
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
  const [registerState, registerAction] = useActionState(
    signUpAction,
    initialState,
  );
  const [resetState, resetAction] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <div className="auth-panel">
      <div className="auth-panel-heading">
        <h2>
          {mode === "register"
            ? "认识一个新的你"
            : mode === "forgot"
              ? "找回你的账号"
              : "欢迎回来"}
        </h2>
        <p>
          {mode === "register"
            ? "创建读者身份，继续交流与思考。"
            : mode === "forgot"
              ? "通过注册邮箱重新设置密码。"
              : "登录后，留下你的观察与想法。"}
        </p>
      </div>
      <div className="segmented-control" role="group" aria-label="账号操作">
        <button
          type="button"
          aria-pressed={mode !== "register"}
          onClick={() => setMode("login")}
        >
          登录
        </button>
        <button
          type="button"
          aria-pressed={mode === "register"}
          onClick={() => setMode("register")}
        >
          注册
        </button>
      </div>

      {pageError && (
        <p className="form-message error auth-page-message" role="alert">
          {pageError}
        </p>
      )}

      {mode === "login" ? (
        <form action={loginAction} className="stack-form">
          <input type="hidden" name="next" value={nextPath} />
          <label>
            邮箱
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            密码
            <PasswordInput
              name="password"
              aria-label="密码"
              autoComplete="current-password"
              placeholder="输入登录密码"
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
          {loginState.error && (
            <p className="form-message error" role="alert">
              {loginState.error}
            </p>
          )}
          <SubmitButton>登录</SubmitButton>
        </form>
      ) : mode === "register" ? (
        <form action={registerAction} className="stack-form">
          <label>
            昵称
            <input
              name="displayName"
              maxLength={32}
              autoComplete="nickname"
              placeholder="希望大家怎么称呼你"
              required
            />
          </label>
          <label>
            邮箱
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            密码
            <PasswordInput
              name="password"
              aria-label="密码"
              autoComplete="new-password"
              placeholder="至少 8 个字符"
              minLength={8}
              required
            />
          </label>
          {registerState.error && (
            <p className="form-message error" role="alert">
              {registerState.error}
            </p>
          )}
          {registerState.success && (
            <p className="form-message success" role="status">
              {registerState.success}
            </p>
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
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>
          {resetState.error && (
            <p className="form-message error" role="alert">
              {resetState.error}
            </p>
          )}
          {resetState.success && (
            <p className="form-message success" role="status">
              {resetState.success}
            </p>
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
