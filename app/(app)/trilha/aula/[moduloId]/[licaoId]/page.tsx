"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  Lock,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { SessionGate } from "@/components/session-gate";
import { useLessonProgress } from "@/lib/hooks/use-lesson-progress";
import { useGameState } from "@/lib/hooks/use-game-state";
import { LessonContent } from "@/components/lesson-content";
import { VideoPlaceholder } from "@/components/video-placeholder";
import { modulos } from "@/lib/lessons";
import { cn } from "@/lib/utils";

type Fase = "conteudo" | "exercicios" | "resultado";

export default function AulaPage({
  params,
}: {
  params: { moduloId: string; licaoId: string };
}) {
  const { moduloId, licaoId } = params;
  return (
    <SessionGate>{() => <AulaInner moduloId={Number(moduloId)} licaoId={Number(licaoId)} />}</SessionGate>
  );
}

function AulaInner({ moduloId, licaoId }: { moduloId: number; licaoId: number }) {
  const router = useRouter();
  const toast = useToast();
  const { progress, concluirLicao, refresh: refreshProgress } = useLessonProgress();
  const { vidas, ganharXp, perderVida, refresh: refreshGame } = useGameState();

  const modulo = modulos.find((m) => m.id === moduloId);
  const licao = modulo?.licoes.find((l) => l.id === licaoId);

  const jaConcluida = !!progress.find(
    (p) => p.modulo_id === moduloId && p.licao_id === licaoId,
  )?.concluida;

  const [fase, setFase] = useState<Fase>("conteudo");
  const [videoAssistido, setVideoAssistido] = useState(false);
  const [perguntaIdx, setPerguntaIdx] = useState(0);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);

  useEffect(() => {
    setVideoAssistido(jaConcluida);
  }, [jaConcluida]);

  if (!licao || !modulo) {
    return (
      <main className="mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <p className="text-text-muted">Aula não encontrada.</p>
        <Button onClick={() => router.replace("/trilha")} className="mt-4">
          Voltar pra trilha
        </Button>
      </main>
    );
  }

  const pergunta = licao.perguntas[perguntaIdx];
  const total = licao.perguntas.length;
  const respondida = escolhida !== null;
  const acertou = escolhida === pergunta?.correta;

  function proxima() {
    if (!pergunta) return;
    const acertouEssa = escolhida === pergunta.correta;
    if (acertouEssa) {
      setAcertos((a) => a + 1);
    } else if (!jaConcluida) {
      perderVida();
    }
    if (perguntaIdx === total - 1) {
      setFase("resultado");
    } else {
      setPerguntaIdx((i) => i + 1);
      setEscolhida(null);
    }
  }

  async function finalizar() {
    if (!licao) return;
    const xpGanho = Math.round((acertos / total) * licao.xp);
    await concluirLicao(moduloId, licao.id, acertos, xpGanho);
    if (!jaConcluida && xpGanho > 0) {
      await ganharXp(xpGanho);
    }
    toast(xpGanho > 0 ? `+ ${xpGanho} XP conquistados!` : "Aula concluída!");
    // Atualiza stats antes de voltar, pra trilha já mostrar valores novos
    await Promise.all([refreshGame(), refreshProgress()]);
    router.replace("/trilha");
  }

  function sair() {
    router.replace("/trilha");
  }

  return (
    <main className="min-h-[100dvh] bg-bg">
      {/* Header fixo com botão voltar */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={sair}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
            aria-label="Voltar pra trilha"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Módulo {moduloId} · Aula {licaoId}
            </div>
            <div className="truncate text-sm font-bold text-text">{licao.titulo}</div>
          </div>
          <button
            type="button"
            onClick={sair}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-xl px-5 pb-32 pt-6">
        {fase === "conteudo" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-3xl">
                {licao.emoji}
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-text-muted">
                  {licao.subtitulo}
                </div>
                <div className="text-sm font-bold text-text">+ {licao.xp} XP máximo</div>
              </div>
            </div>

            <p className="text-balance text-[15px] font-medium leading-relaxed text-text">
              {licao.hook}
            </p>

            <VideoPlaceholder
              titulo={licao.video.titulo}
              duracao={licao.video.duracao}
              instrutor={licao.video.instrutor}
              jaAssistido={jaConcluida}
              onAssistido={() => setVideoAssistido(true)}
            />

            <div className="space-y-2 border-t border-border pt-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Material de apoio
              </div>
              <LessonContent blocos={licao.conteudo} />
            </div>
          </div>
        )}

        {fase === "exercicios" && pergunta && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={cn(
                      "h-4 w-4 transition",
                      i < vidas ? "fill-danger text-danger" : "text-surface-2",
                    )}
                  />
                ))}
              </div>
              <span className="text-[11px] uppercase tracking-wider text-text-muted">
                Errar custa vida
              </span>
            </div>

            <div className="flex items-center gap-2">
              {licao.perguntas.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition",
                    i < perguntaIdx
                      ? "bg-brand"
                      : i === perguntaIdx
                        ? "bg-brand/50"
                        : "bg-surface-2",
                  )}
                />
              ))}
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-text-muted">
                Pergunta {perguntaIdx + 1} de {total}
              </div>
              <h3 className="mt-2 text-lg font-bold leading-snug text-text">
                {pergunta.enunciado}
              </h3>
            </div>

            <div className="space-y-2">
              {pergunta.opcoes.map((opt, i) => {
                const correto = i === pergunta.correta;
                const estado = !respondida
                  ? "default"
                  : i === escolhida
                    ? correto
                      ? "right"
                      : "wrong"
                    : correto
                      ? "right-faded"
                      : "default";

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={respondida}
                    onClick={() => setEscolhida(i)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm transition",
                      estado === "default" &&
                        "border-border bg-surface text-text hover:border-brand/40",
                      estado === "right" && "border-success bg-success/10 text-success",
                      estado === "right-faded" && "border-success/60 bg-success/5 text-text",
                      estado === "wrong" && "border-danger bg-danger/10 text-danger",
                    )}
                  >
                    <span className="flex-1 font-medium">{opt}</span>
                    {respondida && correto && <Check className="h-5 w-5 text-success" />}
                    {respondida && estado === "wrong" && <X className="h-5 w-5 text-danger" />}
                  </button>
                );
              })}
            </div>

            {respondida && pergunta.explicacao && (
              <div
                className={cn(
                  "rounded-2xl p-3 text-sm",
                  acertou ? "bg-success/10 text-text" : "bg-danger/10 text-text",
                )}
              >
                <strong className={acertou ? "text-success" : "text-danger"}>
                  {acertou ? "Boa! " : "Quase. "}
                </strong>
                {pergunta.explicacao}
              </div>
            )}
          </div>
        )}

        {fase === "resultado" && (
          <div className="space-y-5 text-center">
            <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold text-[#3a2700] shadow-glow">
              <Trophy className="h-9 w-9" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-text-muted">
                Resultado
              </div>
              <div className="mt-1 text-3xl font-extrabold text-text">
                {acertos} <span className="text-text-muted">de {total}</span>
              </div>
            </div>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-text">
              {licao.conclusao}
            </p>
            <div className="rounded-2xl border border-gold/40 bg-gold-soft p-3 text-sm">
              <strong className="text-text">
                + {Math.round((acertos / total) * licao.xp)} XP
              </strong>{" "}
              creditados. Continue a sequência amanhã!
            </div>
          </div>
        )}
      </div>

      {/* CTA fixo no rodapé */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur safe-bottom">
        <div className="mx-auto w-full max-w-xl">
          {fase === "conteudo" && (
            <>
              <Button
                fullWidth
                size="lg"
                disabled={!videoAssistido}
                onClick={() => setFase("exercicios")}
              >
                {videoAssistido ? (
                  <>
                    Começar exercícios <ChevronRight className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Assista o vídeo pra liberar
                  </>
                )}
              </Button>
              {!videoAssistido && (
                <p className="mt-2 text-center text-[11px] text-text-muted">
                  Os exercícios só ficam disponíveis depois que você assistir o vídeo.
                </p>
              )}
            </>
          )}

          {fase === "exercicios" && (
            <Button fullWidth size="lg" disabled={!respondida} onClick={proxima}>
              {perguntaIdx === total - 1 ? "Ver resultado" : "Próxima"}
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}

          {fase === "resultado" && (
            <Button fullWidth size="lg" onClick={finalizar}>
              <Sparkles className="h-5 w-5" />
              Concluir aula
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
