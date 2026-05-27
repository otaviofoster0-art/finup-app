"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  /** valor de 0 a 100 */
  value: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
  delayMs?: number;
  durationMs?: number;
};

/**
 * Barra de progresso animada: monta em 0% e cresce até o valor.
 * Bom feel visual sem custar performance.
 */
export function ProgressBar({
  value,
  className,
  trackClassName,
  fillClassName = "bg-brand",
  delayMs = 80,
  durationMs = 900,
}: Props) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setW(value);
      return;
    }
    const id = setTimeout(() => setW(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-surface-2",
        trackClassName,
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] ease-out-quart",
          fillClassName,
        )}
        style={{
          width: `${Math.min(100, Math.max(0, w))}%`,
          transitionDuration: `${durationMs}ms`,
        }}
      />
    </div>
  );
}
