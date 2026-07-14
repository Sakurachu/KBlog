"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  className = "primary-button",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button className={className} type="submit" disabled={pending}>
      {pending && <LoaderCircle className="spin" size={17} aria-hidden="true" />}
      {pending ? "正在处理" : children}
    </button>
  );
}
