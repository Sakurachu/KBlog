"use client";

import { Trash2 } from "lucide-react";
import type { MouseEvent } from "react";

export function ConfirmButton({ label = "删除" }: { label?: string }) {
  function confirmDelete(event: MouseEvent<HTMLButtonElement>) {
    if (!window.confirm("确定要删除吗？此操作无法撤销。")) event.preventDefault();
  }

  return (
    <button className="danger-button" type="submit" onClick={confirmDelete}>
      <Trash2 size={15} aria-hidden="true" /> {label}
    </button>
  );
}
