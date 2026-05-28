/**
 * Devolve a base URL pública do app pra usar em redirects de auth.
 * Ordem de prioridade:
 *   1) NEXT_PUBLIC_SITE_URL (defina no Vercel pra ser canônica)
 *   2) VERCEL_URL (Vercel injeta automaticamente em prod, sem protocolo)
 *   3) window.location.origin (fallback no client)
 *   4) http://localhost:3000 (último recurso em SSR sem env)
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;

  if (typeof window !== "undefined") return window.location.origin;

  return "http://localhost:3000";
}
