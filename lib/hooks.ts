"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anima um número de `from` até `to` em `durationMs`.
 * Respeita prefers-reduced-motion (volta o valor final na hora).
 */
export function useCountUp(
  to: number,
  {
    durationMs = 900,
    from = 0,
    decimals = 0,
    enabled = true,
  }: { durationMs?: number; from?: number; decimals?: number; enabled?: boolean } = {},
) {
  const [value, setValue] = useState(enabled ? from : to);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(from);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setValue(to);
      return;
    }

    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    startRef.current = null;
    fromRef.current = value;

    function tick(now: number) {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - t, 4);
      const next = fromRef.current + (to - fromRef.current) * eased;
      setValue(decimals === 0 ? Math.round(next) : Number(next.toFixed(decimals)));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, durationMs, enabled, decimals]);

  return value;
}

/**
 * Retorna true depois do primeiro render no client.
 * Útil pra trigger de animações que só rodam pós-hidratação.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
