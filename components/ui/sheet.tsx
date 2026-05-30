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
    /* Portal root — cobre a viewport inteira, z-index alto */
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "fixed inset-0 z-[100] flex",
        side === "bottom" ? "items-end justify-center" : "items-center justify-center",
      )}
      style={{ isolation: "isolate" }}
    >
      {/* Backdrop — div separado, pointer-events independente */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
      />

      {/* Painel — fica acima do backdrop via z-index relativo */}
      <div
        className={cn(
          "relative z-10 flex w-full flex-col overflow-hidden",
          "bg-surface border border-border shadow-2xl animate-scale-in",
          side === "bottom"
            ? "max-w-xl rounded-t-3xl max-h-[92dvh]"
            : "mx-3 max-w-lg rounded-3xl max-h-[90dvh]",
        )}
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
