"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { LessonProgress } from "@/lib/supabase/types";

export function useLessonProgress() {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setProgress([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("lesson_progress")
      .select("*")
      .eq("user_id", user.id);
    setProgress((data ?? []) as LessonProgress[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function concluirLicao(moduloId: number, licaoId: number, acertos: number, xpGanho: number) {
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("lesson_progress").upsert(
      {
        user_id: user.id,
        modulo_id: moduloId,
        licao_id: licaoId,
        concluida: true,
        acertos,
        xp_ganho: xpGanho,
        concluida_em: new Date().toISOString(),
      },
      { onConflict: "user_id,licao_id" },
    );
    refresh();
  }

  const totalXp = useMemo(
    () => progress.reduce((a, b) => a + (b.xp_ganho ?? 0), 0),
    [progress],
  );
  const totalConcluidas = useMemo(
    () => progress.filter((p) => p.concluida).length,
    [progress],
  );

  return { progress, totalXp, totalConcluidas, loading, refresh, concluirLicao };
}
