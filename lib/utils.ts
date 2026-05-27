import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatMonths(months: number) {
  if (months < 1) return "menos de 1 mês";
  if (months < 12) return `${Math.round(months)} ${Math.round(months) === 1 ? "mês" : "meses"}`;
  const years = months / 12;
  if (years < 2) return `1 ano e ${Math.round(months - 12)} meses`;
  return `${years.toFixed(1).replace(".", ",")} anos`;
}

/**
 * Calcula quantos meses são necessários pra atingir um objetivo
 * com aporte mensal e taxa anual.
 */
export function monthsToGoal({
  goal,
  current,
  monthly,
  annualRate = 0.1,
}: {
  goal: number;
  current: number;
  monthly: number;
  annualRate?: number;
}) {
  if (monthly <= 0) return Infinity;
  const i = Math.pow(1 + annualRate, 1 / 12) - 1;
  if (i === 0) return (goal - current) / monthly;
  // FV = PV*(1+i)^n + PMT*((1+i)^n - 1)/i
  // resolvendo pra n
  const numerator = Math.log((goal * i + monthly) / (current * i + monthly));
  const denominator = Math.log(1 + i);
  return numerator / denominator;
}
