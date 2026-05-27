"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Pencil } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { SessionGate } from "@/components/session-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { useCategorias } from "@/lib/hooks/use-categorias";
import type { Tipo, UserCategoria } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const COR_PALETTE: { label: string; cor: string; hex: string }[] = [
  { label: "Azul",        cor: "bg-brand",        hex: "#1948C9" },
  { label: "Azul claro",  cor: "bg-accent",       hex: "#5BA0FF" },
  { label: "Verde",       cor: "bg-success",      hex: "#3FB87A" },
  { label: "Amarelo",     cor: "bg-warning",      hex: "#F59E0B" },
  { label: "Vermelho",    cor: "bg-danger",       hex: "#E04646" },
  { label: "Roxo",        cor: "bg-brand-bright", hex: "#0A2A6E" },
  { label: "Cinza",       cor: "bg-text-muted",   hex: "#94A3B8" },
];

const EMOJIS_SUGERIDOS = ["💼", "🎯", "💸", "🛒", "🏠", "🚌", "📺", "🎰", "🍻", "❤️", "📚", "📦", "✈️", "🚗", "🎁", "🐾", "💊", "🎮", "💄", "👕", "🏋️"];

export default function CategoriasPage() {
  return <SessionGate>{() => <CategoriasInner />}</SessionGate>;
}

function CategoriasInner() {
  const { categorias, create, update, remove } = useCategorias();
  const [editing, setEditing] = useState<UserCategoria | null>(null);
  const [creating, setCreating] = useState<Tipo | null>(null);

  const receitas = categorias.filter((c) => c.tipo === "receita");
  const despesas = categorias.filter((c) => c.tipo === "despesa");

  return (
    <>
      <AppHeader title="Categorias" />
      <main className="mx-auto w-full max-w-xl px-5 pb-10 pt-4">
        <div className="mb-4 flex items-center gap-3">
          <Link
            href="/perfil"
            className="press inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-text"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <p className="text-sm text-text-muted">
            Suas categorias. Use pra etiquetar receitas e despesas como preferir.
          </p>
        </div>

        <Section
          titulo="Receitas"
          cats={receitas}
          onAdd={() => setCreating("receita")}
          onEdit={(c) => setEditing(c)}
          onDelete={(id) => remove(id)}
        />

        <Section
          titulo="Despesas"
          cats={despesas}
          onAdd={() => setCreating("despesa")}
          onEdit={(c) => setEditing(c)}
          onDelete={(id) => remove(id)}
        />
      </main>

      <CategoriaSheet
        open={!!creating || !!editing}
        modo={editing ? "editar" : "criar"}
        tipoFixo={creating ?? editing?.tipo ?? "despesa"}
        categoria={editing}
        onClose={() => {
          setCreating(null);
          setEditing(null);
        }}
        onSalvar={async (data) => {
          if (editing) await update(editing.id, data);
          else await create(data);
        }}
      />
    </>
  );
}

function Section({
  titulo,
  cats,
  onAdd,
  onEdit,
  onDelete,
}: {
  titulo: string;
  cats: UserCategoria[];
  onAdd: () => void;
  onEdit: (c: UserCategoria) => void;
  onDelete: (id: string) => void;
}) {
  const toast = useToast();
  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">{titulo}</h2>
        <Button size="sm" variant="secondary" onClick={onAdd}>
          <Plus className="h-4 w-4" /> Nova
        </Button>
      </div>
      <Card className="p-2">
        {cats.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-text-muted">Sem categorias ainda.</div>
        ) : (
          <ul className="divide-y divide-border">
            {cats.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-3 py-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg"
                  style={{ background: c.hex + "22" }}
                >
                  {c.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-text">{c.nome}</div>
                  {c.alerta && (
                    <div className="text-[10px] font-bold uppercase tracking-wider text-danger">
                      Categoria de alerta
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onEdit(c)}
                  className="press inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-text"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Apagar a categoria "${c.nome}"?`)) {
                      onDelete(c.id);
                      toast("Categoria apagada");
                    }
                  }}
                  className="press inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-danger/10 hover:text-danger"
                  aria-label="Apagar"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}

function CategoriaSheet({
  open,
  modo,
  tipoFixo,
  categoria,
  onClose,
  onSalvar,
}: {
  open: boolean;
  modo: "criar" | "editar";
  tipoFixo: Tipo;
  categoria: UserCategoria | null;
  onClose: () => void;
  onSalvar: (data: {
    nome: string;
    tipo: Tipo;
    emoji: string;
    cor: string;
    hex: string;
    alerta: boolean;
  }) => Promise<void>;
}) {
  const toast = useToast();
  const [nome, setNome] = useState(categoria?.nome ?? "");
  const [emoji, setEmoji] = useState(categoria?.emoji ?? EMOJIS_SUGERIDOS[0]);
  const [paletteIdx, setPaletteIdx] = useState(() => {
    if (!categoria) return 0;
    return Math.max(0, COR_PALETTE.findIndex((c) => c.cor === categoria.cor));
  });
  const [alerta, setAlerta] = useState(categoria?.alerta ?? false);

  // reset quando abre uma nova
  if (!open && nome !== (categoria?.nome ?? "")) {
    // não setamos durante render — só na próxima abertura
  }

  async function salvar() {
    if (!nome.trim()) {
      toast("Coloca um nome");
      return;
    }
    const c = COR_PALETTE[paletteIdx];
    await onSalvar({
      nome: nome.trim(),
      tipo: tipoFixo,
      emoji,
      cor: c.cor,
      hex: c.hex,
      alerta,
    });
    toast(modo === "criar" ? "Categoria criada" : "Categoria atualizada");
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title={modo === "criar" ? `Nova categoria de ${tipoFixo}` : "Editar categoria"}>
      <div className="space-y-4">
        <Input
          label="Nome"
          placeholder="Ex: Pet, Padaria, Streaming"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoFocus
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-text">Emoji</label>
          <div className="flex flex-wrap gap-1.5">
            {EMOJIS_SUGERIDOS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={cn(
                  "press flex h-10 w-10 items-center justify-center rounded-2xl border text-lg transition",
                  emoji === e
                    ? "border-brand bg-brand-soft shadow-soft"
                    : "border-border bg-surface hover:border-brand/40",
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text">Cor</label>
          <div className="flex flex-wrap gap-2">
            {COR_PALETTE.map((c, i) => (
              <button
                key={c.label}
                type="button"
                onClick={() => setPaletteIdx(i)}
                className={cn(
                  "press flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition",
                  paletteIdx === i ? "border-text shadow-soft" : "border-border hover:border-text-muted",
                )}
              >
                <span className="h-3 w-3 rounded-full" style={{ background: c.hex }} />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {tipoFixo === "despesa" && (
          <label className="flex items-start gap-3 rounded-2xl bg-surface-2 p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={alerta}
              onChange={(e) => setAlerta(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-danger"
            />
            <div>
              <div className="text-sm font-semibold text-text">Marcar como categoria de alerta</div>
              <div className="text-xs text-text-muted">
                O app vai destacar essa categoria no relatório como gasto que merece atenção (ex: apostas, vícios, supérfluos).
              </div>
            </div>
          </label>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button fullWidth onClick={salvar}>
            {modo === "criar" ? "Criar" : "Salvar"}
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
