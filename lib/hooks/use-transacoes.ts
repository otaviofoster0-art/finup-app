"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Transacao } from "@/lib/supabase/types";

export function useTransacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("data", { ascending: false })
      .order("criado_em", { ascending: false });
    setTransacoes((data ?? []) as Transacao[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function add(t: Omit<Transacao, "id" | "user_id" | "criado_em">) {
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("transactions").insert({ ...t, user_id: user.id });
    if (!error) refresh();
    return error;
  }

  async function remove(id: string) {
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (!error) refresh();
    return error;
  }

  // Helpers de agregação
  const totaisMes = useMemo(() => {
    const ref = new Date();
    const m = ref.getMonth();
    const y = ref.getFullYear();
    const noMes = transacoes.filter((t) => {
      const d = new Date(t.data);
      return d.getMonth() === m && d.getFullYear() === y;
    });
    const receitas = noMes.filter((t) => t.tipo === "receita").reduce((a, b) => a + Number(b.valor), 0);
    const despesas = noMes.filter((t) => t.tipo === "despesa").reduce((a, b) => a + Number(b.valor), 0);
    return { receitas, despesas, sobra: receitas - despesas, transacoes: noMes };
  }, [transacoes]);

  return { transacoes, totaisMes, loading, refresh, add, remove };
}
