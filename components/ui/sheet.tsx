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
    <div className="fixed inset-0 z-50 flex">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in"
      />
      <div
        className={cn(
          "relative mx-auto flex w-full max-w-xl px-3",
          side === "bottom" ? "items-end pt-10" : "items-center py-6",
        )}
      >
        <div
          className={cn(
            "relative flex w-full flex-col overflow-hidden border border-border bg-surface shadow-soft animate-scale-in",
            side === "bottom" ? "rounded-t-3xl safe-bottom max-h-[92dvh]" : "rounded-3xl max-h-[92dvh]",
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-6 py-4">
            <div className="text-lg font-bold text-text">{title}</div>
            <button
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-text"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-2 pt-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
