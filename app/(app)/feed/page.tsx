"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, MoreHorizontal, Search, Send, Sparkles, Trophy, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { SessionGate } from "@/components/session-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { usePosts } from "@/lib/hooks/use-posts";
import { useLessonProgress } from "@/lib/hooks/use-lesson-progress";
import { useRanking } from "@/lib/hooks/use-ranking";
import type { PostWithAuthor } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

export default function FeedPage() {
  return (
    <SessionGate>
      {(s) => (
        <FeedInner
          userId={s.userId}
          nome={s.nome}
          foto={s.fotoUrl}
        />
      )}
    </SessionGate>
  );
}

function FeedInner({
  userId,
  nome,
  foto,
}: {
  userId: string;
  nome: string;
  foto: string | null;
}) {
  const [busca, setBusca] = useState("");
  const [buscaDebounced, setBuscaDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setBuscaDebounced(busca), 300);
    return () => clearTimeout(t);
  }, [busca]);

  const { posts, loading, publicar, toggleCurtida, apagar } = usePosts(buscaDebounced);
  const { totalConcluidas, totalXp } = useLessonProgress();
  const [composerOpen, setComposerOpen] = useState(false);

  const iniciais = nome
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0] ?? "")
    .join("")
    .toUpperCase() || "U";

  const { ranking: rankingFull } = useRanking(posts);
  const ranking = rankingFull.slice(0, 3);

  return (
    <>
      <AppHeader title="Feed" />
      <main className="mx-auto w-full max-w-xl px-5 pb-10 pt-4">
        {/* Composer */}
        <Card className="mb-4">
          <div className="flex items-center gap-3">
            <Avatar iniciais={iniciais} cor="from-brand to-brand-bright" foto={foto} />
            <button
              onClick={() => setComposerOpen(true)}
              className="press flex-1 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-left text-sm text-text-muted transition hover:border-brand/30"
            >
              Compartilha uma conquista{nome.split(" ")[0] ? `, ${nome.split(" ")[0]}` : ""}...
            </button>
          </div>
        </Card>

        {/* Busca */}
        <div className="mb-4">
          <Input
            placeholder="Buscar pessoas pelo nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            leadingIcon={<Search className="h-5 w-5" />}
          />
        </div>

        {/* Ranking */}
        {!buscaDebounced && ranking.length > 0 && (
          <Card className="mb-6 overflow-hidden border-gold/30 bg-gold-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold text-[#3a2700]">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-text">Ranking global</div>
                <p className="text-xs text-text-muted">Top 3 entre todos os usuários</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {ranking.map((r, i) => {
                const iniciaisR = r.nome
                  .split(" ")
                  .slice(0, 2)
                  .map((x) => x[0] ?? "")
                  .join("")
                  .toUpperCase() || "U";
                return (
                  <div
                    key={r.user_id}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl bg-surface p-2.5",
                      i === 0 && "ring-2 ring-gold/50",
                    )}
                  >
                    <div className="w-5 text-center text-sm font-bold text-text-muted">{i + 1}º</div>
                    <Avatar iniciais={iniciaisR} cor="from-brand to-accent" foto={r.foto_url} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-text">{r.nome}</div>
                      <div className="text-xs text-text-muted">
                        <strong className="text-text">{r.pontos}</strong> pts ·{" "}
                        {r.xp_total} XP · {r.posts} post{r.posts !== 1 ? "s" : ""}
                      </div>
                    </div>
                    {i === 0 && <span className="text-lg">🏆</span>}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Posts */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-32 w-full rounded-3xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <Card className="py-12 text-center">
            <Sparkles className="mx-auto mb-3 h-10 w-10 text-text-muted" />
            <p className="text-sm font-semibold text-text">
              {buscaDebounced ? "Nenhuma pessoa encontrada" : "Seja o primeiro a postar"}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {buscaDebounced
                ? `Não achei posts de "${buscaDebounced}"`
                : "Compartilhe uma conquista pra inspirar a galera"}
            </p>
          </Card>
        ) : (
          <div className="stagger flex flex-col gap-4">
            {posts.map((p) => (
              <div key={p.id} className="animate-fade-in-up">
                <PostCard
                  post={p}
                  isMine={p.user_id === userId}
                  onCurtir={() => toggleCurtida(p.id)}
                  onApagar={() => apagar(p.id)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-text-muted">
          <Sparkles className="h-3.5 w-3.5" />
          {posts.length} {posts.length === 1 ? "post" : "posts"} no feed
        </div>
      </main>

      <ComposerSheet
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        autorNome={nome}
        autorFoto={foto}
        publicar={publicar}
        xp={totalXp}
        licoesConcluidas={totalConcluidas}
      />
    </>
  );
}

function PostCard({
  post,
  isMine,
  onCurtir,
  onApagar,
}: {
  post: PostWithAuthor;
  isMine: boolean;
  onCurtir: () => void;
  onApagar: () => void;
}) {
  const tempo = relativoBR(post.criado_em);
  const iniciais = post.autor_nome
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0] ?? "")
    .join("")
    .toUpperCase() || "U";

  function deletar() {
    if (confirm("Apagar essa publicação?")) onApagar();
  }

  return (
    <Card className="press-sm transition-shadow hover:shadow-soft">
      <div className="flex items-start gap-3">
        <Avatar iniciais={iniciais} cor="from-brand to-brand-bright" foto={post.autor_foto} />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-text">
                {post.autor_nome}
                {isMine && (
                  <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand">
                    você
                  </span>
                )}
              </div>
              <div className="text-xs text-text-muted">
                {post.autor_cargo ? `${post.autor_cargo} · ` : ""}{tempo}
              </div>
            </div>
            {isMine ? (
              <button onClick={deletar} className="text-text-muted hover:text-danger" aria-label="Apagar">
                <Trash2 className="h-4 w-4" />
              </button>
            ) : (
              <button className="text-text-muted hover:text-text" aria-label="Mais">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            )}
          </div>

          {post.badge && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
              {post.badge}
            </div>
          )}
          <p className="mt-3 whitespace-pre-line text-sm text-text">{post.texto}</p>

          <div className="mt-4 flex items-center text-text-muted">
            <button
              onClick={onCurtir}
              className={cn(
                "press inline-flex items-center gap-1.5 text-sm transition-colors duration-200 hover:text-danger",
                post.curtido_por_mim && "text-danger",
              )}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-transform duration-300 ease-spring",
                  post.curtido_por_mim && "fill-danger scale-110",
                )}
              />
              <span className="tabular-nums">{post.curtidas}</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Avatar({
  iniciais,
  cor,
  foto,
  size = "md",
}: {
  iniciais: string;
  cor: string;
  foto?: string | null;
  size?: "sm" | "md";
}) {
  const dims = size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm";
  if (foto) {
    return (
      <div className={cn("shrink-0 overflow-hidden rounded-full border-2 border-border", dims)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={foto} alt={iniciais} className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white",
        dims,
        cor,
      )}
    >
      {iniciais}
    </div>
  );
}

const sugestoes = [
  "Cortei R$ ___ em assinaturas que nem usava!",
  "Bati a meta de poupar R$ ___ esse mês 💪",
  "Comecei minha caixinha de ___ hoje.",
  "Aprendi sobre juros compostos e fiquei chocado.",
];

function ComposerSheet({
  open,
  onClose,
  autorNome,
  autorFoto,
  publicar,
  xp,
  licoesConcluidas,
}: {
  open: boolean;
  onClose: () => void;
  autorNome: string;
  autorFoto: string | null;
  publicar: (texto: string, badge?: string) => Promise<unknown>;
  xp: number;
  licoesConcluidas: number;
}) {
  const toast = useToast();
  const [texto, setTexto] = useState("");
  const [badge, setBadge] = useState<string | undefined>();
  const [enviando, setEnviando] = useState(false);

  const iniciais = autorNome
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0] ?? "")
    .join("")
    .toUpperCase() || "U";

  const badgesDisponiveis = useMemo(() => {
    const out: string[] = [];
    if (licoesConcluidas >= 1)
      out.push(
        `${licoesConcluidas} aula${licoesConcluidas > 1 ? "s" : ""} concluída${licoesConcluidas > 1 ? "s" : ""}`,
      );
    if (xp >= 100) out.push(`${xp} XP no mês`);
    if (licoesConcluidas >= 5) out.push("Módulo 1 concluído");
    return out;
  }, [licoesConcluidas, xp]);

  async function enviar() {
    if (!texto.trim()) return;
    setEnviando(true);
    await publicar(texto.trim(), badge);
    setEnviando(false);
    toast("Publicado!");
    setTexto("");
    setBadge(undefined);
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title="Compartilhar com a galera">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar iniciais={iniciais} cor="from-brand to-brand-bright" foto={autorFoto} />
          <div>
            <div className="text-sm font-semibold text-text">{autorNome}</div>
            <div className="text-xs text-text-muted">Compartilhando no feed</div>
          </div>
        </div>

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={5}
          autoFocus
          maxLength={400}
          placeholder="Conta uma conquista, dica ou mete uma pergunta..."
          className="w-full resize-none rounded-2xl border border-border bg-surface p-4 text-[15px] text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
        />
        <div className="-mt-2 text-right text-xs text-text-muted">{texto.length}/400</div>

        {badgesDisponiveis.length > 0 && (
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              Anexar conquista (opcional)
            </div>
            <div className="flex flex-wrap gap-2">
              {badgesDisponiveis.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBadge(badge === b ? undefined : b)}
                  className={cn(
                    "press rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    badge === b
                      ? "border-brand bg-brand text-white"
                      : "border-border bg-surface text-text hover:border-brand/40",
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Sem ideia? Use uma sugestão
          </div>
          <div className="flex flex-wrap gap-2">
            {sugestoes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setTexto(s)}
                className="press rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted hover:border-brand/40 hover:text-text"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button fullWidth disabled={!texto.trim() || enviando} onClick={enviar}>
            {enviando ? "Publicando..." : "Publicar"} <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Sheet>
  );
}

function relativoBR(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)} h`;
  if (diff < 172800) return "ontem";
  if (diff < 604800) return `há ${Math.floor(diff / 86400)} dias`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
