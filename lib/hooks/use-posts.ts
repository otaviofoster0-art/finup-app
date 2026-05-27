"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { PostWithAuthor } from "@/lib/supabase/types";

/**
 * Posts do feed (todos os usuários) com realtime via Supabase Channels.
 * Recarrega quando qualquer post ou like muda.
 */
export function usePosts(searchTerm: string = "") {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    let q = supabase
      .from("posts_with_author")
      .select("*")
      .order("criado_em", { ascending: false })
      .limit(100);

    if (searchTerm.trim().length > 1) {
      q = q.ilike("autor_nome", `%${searchTerm.trim()}%`);
    }
    const { data } = await q;
    setPosts((data ?? []) as PostWithAuthor[]);
    setLoading(false);
  }, [searchTerm]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Realtime: re-fetch quando posts ou likes mudam
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel("feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  async function publicar(texto: string, badge?: string) {
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      texto: texto.trim(),
      badge: badge ?? null,
    });
    if (!error) refresh();
    return error;
  }

  async function toggleCurtida(postId: string) {
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const p = posts.find((x) => x.id === postId);
    if (!p) return;
    if (p.curtido_por_mim) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    }
    refresh();
  }

  async function apagar(postId: string) {
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) refresh();
    return error;
  }

  return { posts, loading, refresh, publicar, toggleCurtida, apagar };
}
