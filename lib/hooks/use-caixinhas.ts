"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Caixinha } from "@/lib/supabase/types";

export function useCaixinhas() {
  const [caixinhas, setCaixinhas] = useState<Caixinha[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from("caixinhas")
      .select("*")
      .order("criada_em", { ascending: false });
    setCaixinhas((data ?? []) as Caixinha[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function add(c: Omit<Caixinha, "id" | "user_id" | "criada_em">) {
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("caixinhas").insert({ ...c, user_id: user.id });
    if (!error) refresh();
    return error;
  }

  async function remove(id: string) {
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from("caixinhas").delete().eq("id", id);
    if (!error) refresh();
    return error;
  }

  async function depositar(id: string, valor: number) {
    const current = caixinhas.find((c) => c.id === id);
    if (!current) return;
    const supabase = getSupabaseBrowser();
    const novoAtual = Math.max(0, Number(current.atual) + valor);
    const { error } = await supabase.from("caixinhas").update({ atual: novoAtual }).eq("id", id);
    if (!error) refresh();
    return error;
  }

  return { caixinhas, loading, refresh, add, remove, depositar };
}
