"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

/**
 * Game state estilo Duolingo. Lê da tabela `profiles` os campos:
 *   xp_total, nivel, streak, streak_last_day, vidas, vidas_proxima_recarga.
 *
 * Regras:
 *  - Nível: curva quadrática. nivel = floor(sqrt(xp/50)) + 1
 *  - Streak: incrementa se último dia ativo == ontem; mantém se hoje; reseta caso contrário
 *  - Vidas: 5 no máximo. Cada vida perdida agenda uma recarga em +4h.
 *    Ao carregar, calcula vidas extras pelo tempo decorrido.
 */

const MAX_VIDAS = 5;
const RECARGA_MS = 4 * 60 * 60 * 1000; // 4h por vida

export function nivelDoXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

export function xpDoProximoNivel(nivel: number): number {
  return Math.pow(nivel, 2) * 50;
}

export type GameState = {
  xpTotal: number;
  nivel: number;
  xpDoNivel: number;
  xpDoProximo: number;
  pctNivel: number;
  streak: number;
  vidas: number;
  vidasProximaRecargaIso: string | null;
  loading: boolean;
};

export function useGameState() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      setProfile((data ?? null) as Profile | null);
      setLoading(false);

      // Reconcilia vidas regeneradas ao carregar (silencioso se migration ainda não rodou)
      if (data) {
        const reconciliado = reconciliarVidas(data as Profile);
        if (reconciliado) {
          try {
            await supabase.from("profiles").update(reconciliado).eq("id", user.id);
            setProfile((p) => (p ? { ...p, ...reconciliado } : p));
          } catch {
            /* migration provavelmente não rodou; ignora */
          }
        }
      }
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /**
   * XP ganho → incremento ATÔMICO no servidor (RPC ganhar_xp).
   * Imune a stale state: o cálculo soma no valor real do banco, não no
   * profile.xp_total do closure React (que podia estar desatualizado e
   * causar sobrescrita em vez de soma).
   */
  const ganharXp = useCallback(async (xp: number) => {
    if (!xp) return;
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.rpc("ganhar_xp", { p_xp: xp });
    if (error) return;
    const novo = (Array.isArray(data) ? data[0] : data) as Profile | null;
    if (novo) setProfile((p) => (p ? { ...p, ...novo } : novo));
  }, []);

  /**
   * Erro em pergunta → perde 1 vida ATOMICAMENTE (RPC perder_vida).
   * Cada chamada decrementa do valor real do banco, então erros em
   * sequência somam corretamente (antes, com closure, só descontava 1).
   */
  const perderVida = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.rpc("perder_vida");
    if (error) return;
    const novo = (Array.isArray(data) ? data[0] : data) as Profile | null;
    if (novo) setProfile((p) => (p ? { ...p, ...novo } : novo));
  }, []);

  const state: GameState = useMemo(() => {
    const xpTotal = profile?.xp_total ?? 0;
    // Nível derivado do XP (fonte da verdade) — evita barra "150/50 XP"
    // quando a coluna nivel fica dessincronizada do xp_total.
    const nivel = nivelDoXp(xpTotal);
    const xpNivelAtual = xpDoProximoNivel(nivel - 1);
    const xpProximo = xpDoProximoNivel(nivel);
    const xpDoNivel = xpTotal - xpNivelAtual;
    const span = Math.max(1, xpProximo - xpNivelAtual);
    return {
      xpTotal,
      nivel,
      xpDoNivel,
      xpDoProximo: xpProximo - xpNivelAtual,
      pctNivel: Math.min(100, (xpDoNivel / span) * 100),
      streak: profile?.streak ?? 0,
      vidas: profile?.vidas ?? MAX_VIDAS,
      vidasProximaRecargaIso: profile?.vidas_proxima_recarga ?? null,
      loading,
    };
  }, [profile, loading]);

  return { ...state, ganharXp, perderVida, refresh };
}

/* ============== helpers ============== */

function reconciliarVidas(p: Profile): Partial<Profile> | null {
  const vidas = p.vidas ?? MAX_VIDAS;
  if (vidas >= MAX_VIDAS || !p.vidas_proxima_recarga) return null;
  const prox = new Date(p.vidas_proxima_recarga).getTime();
  const agora = Date.now();
  if (agora < prox) return null;
  const extras = 1 + Math.floor((agora - prox) / RECARGA_MS);
  const novasVidas = Math.min(MAX_VIDAS, vidas + extras);
  const novaRecarga =
    novasVidas >= MAX_VIDAS
      ? null
      : new Date(prox + extras * RECARGA_MS).toISOString();
  return {
    vidas: novasVidas,
    vidas_proxima_recarga: novaRecarga,
  };
}
