"use client";

import { useCountUp } from "@/lib/hooks";
import { formatBRL } from "@/lib/utils";

type Props = {
  value: number;
  format?: "brl" | "int" | "decimal";
  decimals?: number;
  durationMs?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
};

/**
 * Número animado: faz a contagem subir suavemente do 0 até `value`.
 * Em prefers-reduced-motion, mostra direto.
 */
export function AnimatedNumber({
  value,
  format = "int",
  decimals = 0,
  durationMs = 900,
  className,
  prefix,
  suffix,
}: Props) {
  const animated = useCountUp(value, { durationMs, decimals: format === "brl" ? 2 : decimals });

  let txt: string;
  if (format === "brl") txt = formatBRL(animated);
  else if (format === "decimal") txt = animated.toFixed(decimals);
  else txt = Math.round(animated).toString();

  return (
    <span className={className}>
      {prefix}
      {txt}
      {suffix}
    </span>
  );
}
