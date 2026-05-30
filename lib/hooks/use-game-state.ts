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

  /** XP ganho → atualiza xp_total, recalcula nível, atualiza streak. */
  const ganharXp = useCallback(
    async (xp: number) => {
      const supabase = getSupabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !profile) return;

      const novoXp = (profile.xp_total ?? 0) + xp;
      const novoNivel = nivelDoXp(novoXp);
      const novoStreak = calcularStreak(profile.streak ?? 0, profile.streak_last_day ?? null);

      const update = {
        xp_total: novoXp,
        nivel: novoNivel,
        streak: novoStreak,
        streak_last_day: hojeIso(),
      };
      await supabase.from("profiles").update(update).eq("id", user.id);
      setProfile((p) => (p ? { ...p, ...update } : p));
    },
    [profile],
  );

  /** Erro em pergunta → perde 1 vida. */
  const perderVida = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !profile) return;
    const atuais = profile.vidas ?? MAX_VIDAS;
    if (atuais <= 0) return;
    const novasVidas = atuais - 1;
    // Se acabou de descer de 5, agenda recarga; senão mantém a recarga atual
    const proxRecarga =
      atuais === MAX_VIDAS || !profile.vidas_proxima_recarga
        ? new Date(Date.now() + RECARGA_MS).toISOString()
        : profile.vidas_proxima_recarga;

    const update = {
      vidas: novasVidas,
      vidas_proxima_recarga: proxRecarga,
    };
    await supabase.from("profiles").update(update).eq("id", user.id);
    setProfile((p) => (p ? { ...p, ...update } : p));
  }, [profile]);

  const state: GameState = useMemo(() => {
    const xpTotal = profile?.xp_total ?? 0;
    const nivel = profile?.nivel ?? nivelDoXp(xpTotal);
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

function hojeIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function diasEntre(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
}

function calcularStreak(atual: number, ultimoDia: string | null): number {
  const hoje = hojeIso();
  if (!ultimoDia) return 1;
  const diff = diasEntre(ultimoDia, hoje);
  if (diff === 0) return Math.max(1, atual);
  if (diff === 1) return atual + 1;
  return 1;
}

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
