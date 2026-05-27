"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { UserCategoria } from "@/lib/supabase/types";

export function useCategorias() {
  const [categorias, setCategorias] = useState<UserCategoria[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from("user_categories")
      .select("*")
      .order("ordem", { ascending: true });
    setCategorias((data ?? []) as UserCategoria[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function create(c: Omit<UserCategoria, "id" | "user_id" | "criada_em" | "ordem"> & { ordem?: number }) {
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("user_categories").insert({
      user_id: user.id,
      ordem: c.ordem ?? 50,
      ...c,
    });
    if (!error) refresh();
    return error;
  }

  async function update(id: string, patch: Partial<UserCategoria>) {
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from("user_categories").update(patch).eq("id", id);
    if (!error) refresh();
    return error;
  }

  async function remove(id: string) {
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from("user_categories").delete().eq("id", id);
    if (!error) refresh();
    return error;
  }

  return { categorias, loading, refresh, create, update, remove };
}

export function getCategoriaById(cats: UserCategoria[], id: string | null) {
  if (!id) return null;
  return cats.find((c) => c.id === id) ?? null;
}
