import type { Transacao, UserCategoria } from "@/lib/supabase/types";

const CINZA_FALLBACK: Pick<UserCategoria, "id" | "nome" | "emoji" | "cor" | "hex" | "alerta" | "tipo"> = {
  id: "__sem__",
  nome: "Sem categoria",
  emoji: "❓",
  cor: "bg-text-muted",
  hex: "#94A3B8",
  alerta: false,
  tipo: "despesa",
};

export function getCategoria(cats: UserCategoria[], id: string | null) {
  if (!id) return CINZA_FALLBACK;
  return cats.find((c) => c.id === id) ?? CINZA_FALLBACK;
}

/**
 * Agrupa as despesas do mês corrente por categoria.
 * Retorna lista ordenada do maior pro menor com pct sobre total.
 */
export function porCategoriaDoMes(transacoes: Transacao[], cats: UserCategoria[]) {
  const ref = new Date();
  const m = ref.getMonth();
  const y = ref.getFullYear();
  const noMes = transacoes.filter((t) => {
    const d = new Date(t.data);
    return t.tipo === "despesa" && d.getMonth() === m && d.getFullYear() === y;
  });

  const map = new Map<string, number>();
  for (const t of noMes) {
    const k = t.categoria_id ?? "__sem__";
    map.set(k, (map.get(k) ?? 0) + Number(t.valor));
  }
  const itens = [...map.entries()]
    .map(([id, total]) => ({ categoria: getCategoria(cats, id), total }))
    .sort((a, b) => b.total - a.total);
  const totalDespesas = itens.reduce((a, b) => a + b.total, 0);
  return itens.map((i) => ({
    ...i,
    pct: totalDespesas ? (i.total / totalDespesas) * 100 : 0,
  }));
}

export function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}
