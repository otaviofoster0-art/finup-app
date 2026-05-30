"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  side?: "bottom" | "center";
};

export function Sheet({ open, onClose, title, children, side = "bottom" }: SheetProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    /* Usa style inline pra garantir dimensões corretas independente de
       transforms/stacking contexts dos ancestrais — inset-0 sozinho
       falha quando algum pai tem transform ou will-change */
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        alignItems: side === "bottom" ? "flex-end" : "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }}
        className="backdrop-blur-sm animate-fade-in"
      />

      {/* Painel */}
      <div
        className={cn(
          "relative flex flex-col overflow-hidden",
          "bg-surface border border-border shadow-2xl animate-scale-in",
          "w-full",
          side === "bottom"
            ? "max-w-xl rounded-t-3xl max-h-[92vh]"
            : "mx-3 max-w-lg rounded-3xl max-h-[90vh]",
        )}
        style={{ zIndex: 1 }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <div className="text-lg font-bold text-text">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo rolável */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-8 pt-5">
          {children}
        </div>
      </div>
    </div>
  );
}
