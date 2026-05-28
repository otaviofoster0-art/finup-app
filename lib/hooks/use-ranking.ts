"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { PostWithAuthor } from "@/lib/supabase/types";

export type RankingItem = {
  user_id: string;
  nome: string;
  empresa: string | null;
  foto_url: string | null;
  xp_total: number;
  licoes_concluidas: number;
  posts: number;
  curtidas_recebidas: number;
  pontos: number;
};

const POSTS_PESO = 5;
const LIKE_PESO = 2;

/**
 * Ranking combina XP da trilha (peso 1) com engajamento no feed
 * (5 pontos por post + 2 por curtida recebida).
 */
export function useRanking(posts: PostWithAuthor[]) {
  const [ranking, setRanking] = useState<RankingItem[]>([]);

  const recompute = useCallback(async () => {
    const supabase = getSupabaseBrowser();

    // 1) Pega XP de TODOS os usuários da view de ranking (já é agregado)
    const { data: lessonData } = await supabase
      .from("lesson_ranking")
      .select("*")
      .order("xp_total", { ascending: false })
      .limit(50);

    const lessonMap = new Map<string, RankingItem>();

    (lessonData ?? []).forEach((row) => {
      lessonMap.set(row.user_id, {
        user_id: row.user_id,
        nome: row.nome,
        empresa: row.empresa,
        foto_url: row.foto_url,
        xp_total: Number(row.xp_total) || 0,
        licoes_concluidas: Number(row.licoes_concluidas) || 0,
        posts: 0,
        curtidas_recebidas: 0,
        pontos: 0,
      });
    });

    // 2) Agrega posts + curtidas a partir dos posts já carregados no feed
    for (const p of posts) {
      let item = lessonMap.get(p.user_id);
      if (!item) {
        item = {
          user_id: p.user_id,
          nome: p.autor_nome,
          empresa: p.autor_empresa,
          foto_url: p.autor_foto,
          xp_total: 0,
          licoes_concluidas: 0,
          posts: 0,
          curtidas_recebidas: 0,
          pontos: 0,
        };
        lessonMap.set(p.user_id, item);
      }
      item.posts += 1;
      item.curtidas_recebidas += p.curtidas;
    }

    // 3) Pontuação final
    const list: RankingItem[] = [...lessonMap.values()].map((u) => ({
      ...u,
      pontos: u.xp_total + u.posts * POSTS_PESO + u.curtidas_recebidas * LIKE_PESO,
    }));
    list.sort((a, b) => b.pontos - a.pontos);

    setRanking(list);
  }, [posts]);

  useEffect(() => {
    recompute();
  }, [recompute]);

  return { ranking };
}
