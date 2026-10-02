"use client";

import { useActionState, useState } from "react";
import { saveColumnAction } from "@/app/actions";
import { columnThemes } from "@/lib/columns";
import { SubmitButton } from "@/components/submit-button";
import type { Column, ColumnTheme } from "@/lib/types";

export function ColumnForm({ column }: { column?: Column }) {
  const [state, action] = useActionState(saveColumnAction, {});
  const [theme, setTheme] = useState<ColumnTheme>(column?.theme ?? "notebook");
  return (
    <form action={action} className="column-form editor-form">
      {column && <input type="hidden" name="editing" value="yes" />}
      <div className="column-form-fields">
        <label>
          专栏名称
          <input
            name="name"
            defaultValue={column?.name}
            maxLength={40}
            required
            placeholder="例如：读书札记"
          />
        </label>
        <label>
          链接标识
          <input
            name="slug"
            defaultValue={column?.slug}
            readOnly={Boolean(column)}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={60}
            required
            placeholder="例如：reading"
          />
          <span className="field-hint">
            {column
              ? "标识保持固定，已有链接不会改变。"
              : "使用小写英文、数字和连字符。"}
          </span>
        </label>
        <label>
          显示顺序
          <input
            name="sortOrder"
            type="number"
            min={0}
            max={1000}
            defaultValue={column?.sort_order ?? 100}
            required
          />
          <span className="field-hint">数字越小，位置越靠前。</span>
        </label>
      </div>
      <label className="excerpt-field">
        专栏介绍
        <textarea
          name="description"
          defaultValue={column?.description}
          maxLength={240}
          rows={2}
          placeholder="这个专栏里，你想记录什么？"
        />
      </label>
      <fieldset className="column-theme-options">
        <legend>专栏风格</legend>
        {(Object.keys(columnThemes) as ColumnTheme[]).map((value) => (
          <label className={`theme-option theme-${value}`} key={value}>
            <input
              type="radio"
              name="theme"
              value={value}
              checked={theme === value}
              onChange={() => setTheme(value)}
            />
            <span className="theme-swatch" />
            <strong>{columnThemes[value].name}</strong>
            <span>{columnThemes[value].description}</span>
          </label>
        ))}
      </fieldset>
      <div className={`column-theme-preview theme-${theme}`}>
        <p className="eyebrow">阅读风格预览</p>
        <h3>
          {theme === "precision"
            ? "把细节看清楚。"
            : theme === "notebook"
              ? "留一点空间，给文字。"
              : "让日常，有自己的光。"}
        </h3>
        <p>专栏首页、文章卡片与正文阅读页会使用这套风格。</p>
      </div>
      <div className="form-row">
        <SubmitButton>{column ? "保存专栏" : "创建专栏"}</SubmitButton>
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
      </div>
    </form>
  );
}
