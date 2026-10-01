"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Maximize2, X, ZoomIn, ZoomOut } from "lucide-react";

export function ArticleImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const isPoster = src.startsWith("/images/process-atlas/");

  useEffect(() => {
    if (open) dialog.current?.showModal();
  }, [open]);

  const close = () => {
    dialog.current?.close();
    setOpen(false);
    setZoomed(false);
    trigger.current?.focus();
  };

  return (
    <>
      <span className="article-image-wrap">
        <button
          ref={trigger}
          className="article-image-trigger"
          type="button"
          aria-label={`放大查看：${alt || "文章配图"}`}
          onClick={() => setOpen(true)}
        >
          <Image
            src={src}
            alt={alt}
            width={isPoster ? 1080 : 1536}
            height={isPoster ? 1440 : 1024}
            sizes="(max-width: 760px) 100vw, 780px"
            unoptimized={!src.startsWith("/images/")}
          />
          <span className="image-expand">
            <Maximize2 size={15} /> 放大查看
          </span>
        </button>
        {alt && (
          <span className="article-image-caption">
            {alt}
            <span>点击图片查看细节</span>
          </span>
        )}
      </span>
      {open &&
        createPortal(
          <dialog
            ref={dialog}
            className="image-dialog"
            aria-label={alt || "查看文章配图"}
            onCancel={close}
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <div className="image-dialog-toolbar">
              <span>{alt || "文章配图"}</span>
              <div>
                <button
                  type="button"
                  className="icon-only"
                  aria-label={zoomed ? "适应窗口" : "放大图片"}
                  aria-pressed={zoomed}
                  onClick={() => setZoomed(!zoomed)}
                >
                  {zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                </button>
                <a
                  className="icon-only"
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="在新窗口查看原图"
                >
                  <ArrowUpRight size={20} />
                </a>
                <button
                  type="button"
                  className="icon-only"
                  aria-label="关闭图片"
                  onClick={close}
                >
                  <X size={22} />
                </button>
              </div>
            </div>
            <div
              className={`image-dialog-content ${zoomed ? "is-zoomed" : ""}`}
            >
              <Image
                src={src}
                alt={alt}
                width={isPoster ? 1080 : 1536}
                height={isPoster ? 1440 : 1024}
                unoptimized
              />
            </div>
            <p className="image-dialog-hint">
              {zoomed ? "滚动查看图片细节" : "放大以查看细节 · Esc 关闭"}
            </p>
          </dialog>,
          document.body,
        )}
    </>
  );
}
