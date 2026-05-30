"use client";

import { useEffect, useState } from "react";
import { Check, ChevronRight, Heart, Lock, Sparkles, Trophy, X } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useLessonProgress } from "@/lib/hooks/use-lesson-progress";
import { useGameState } from "@/lib/hooks/use-game-state";
import { LessonContent } from "@/components/lesson-content";
import { VideoPlaceholder } from "@/components/video-placeholder";
import { type Licao } from "@/lib/lessons";
import { cn } from "@/lib/utils";

type LessonModalProps = {
  licao: Licao | null;
  moduloId: number;
  onClose: () => void;
  onConcluida?: (xp: number) => void;
};

type Fase = "conteudo" | "exercicios" | "resultado";

export function LessonModal({ licao, moduloId, onClose, onConcluida }: LessonModalProps) {
  const toast = useToast();
  const { progress, concluirLicao } = useLessonProgress();
  const { vidas, ganharXp, perderVida } = useGameState();
  const jaConcluida = !!progress.find((p) => p.licao_id === licao?.id && p.modulo_id === moduloId)?.concluida;

  const [fase, setFase] = useState<Fase>("conteudo");
  const [videoAssistido, setVideoAssistido] = useState(false);
  const [perguntaIdx, setPerguntaIdx] = useState(0);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);

  // reset ao abrir aula nova
  useEffect(() => {
    if (licao) {
      setFase("conteudo");
      setVideoAssistido(jaConcluida);
      setPerguntaIdx(0);
      setEscolhida(null);
      setAcertos(0);
    }
  }, [licao?.id, jaConcluida]);

  if (!licao) return null;

  const pergunta = licao.perguntas[perguntaIdx];
  const total = licao.perguntas.length;
  const respondida = escolhida !== null;
  const acertou = escolhida === pergunta?.correta;

  function proxima() {
    const acertouEssa = escolhida === pergunta.correta;
    if (acertouEssa) {
      setAcertos((a) => a + 1);
    } else if (!jaConcluida) {
      // Erro custa uma vida (não cobra em revisão de aula já feita)
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
    onConcluida?.(xpGanho);
    toast(`+ ${xpGanho} XP conquistados!`);
    onClose();
  }

  return (
    <Sheet open={!!licao} onClose={onClose} title={licao.titulo} side="center">
      {fase === "conteudo" && (
        <div className="space-y-5">
          {/* hero da aula */}
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-3xl">
              {licao.emoji}
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider text-text-muted">{licao.subtitulo}</div>
              <div className="text-sm font-bold text-text">+ {licao.xp} XP máximo</div>
            </div>
          </div>

          {/* hook */}
          <p className="text-balance text-[15px] font-medium leading-relaxed text-text">{licao.hook}</p>

          {/* vídeo */}
          <VideoPlaceholder
            titulo={licao.video.titulo}
            duracao={licao.video.duracao}
            instrutor={licao.video.instrutor}
            jaAssistido={jaConcluida}
            onAssistido={() => setVideoAssistido(true)}
          />

          {/* conteúdo escrito */}
          <div className="space-y-2 border-t border-border pt-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Material de apoio
            </div>
            <LessonContent blocos={licao.conteudo} />
          </div>

          {/* CTA */}
          <div className="sticky bottom-0 -mx-6 mt-4 border-t border-border bg-surface/95 px-6 py-3 backdrop-blur">
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
          </div>
        </div>
      )}

      {fase === "exercicios" && pergunta && (
        <div className="space-y-5">
          {/* Vidas */}
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

          {/* progresso */}
          <div className="flex items-center gap-2">
            {licao.perguntas.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition",
                  i < perguntaIdx ? "bg-brand" : i === perguntaIdx ? "bg-brand/50" : "bg-surface-2",
                )}
              />
            ))}
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-text-muted">
              Pergunta {perguntaIdx + 1} de {total}
            </div>
            <h3 className="mt-2 text-lg font-bold leading-snug text-text">{pergunta.enunciado}</h3>
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
                    estado === "default" && "border-border bg-surface text-text hover:border-brand/40",
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

          <div className="sticky bottom-0 -mx-6 border-t border-border bg-surface/95 px-6 py-3 backdrop-blur">
            <Button fullWidth size="lg" disabled={!respondida} onClick={proxima}>
              {perguntaIdx === total - 1 ? "Ver resultado" : "Próxima"}
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {fase === "resultado" && (
        <div className="space-y-5 text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold text-[#3a2700] shadow-glow">
            <Trophy className="h-9 w-9" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-text-muted">Resultado</div>
            <div className="mt-1 text-3xl font-extrabold text-text">
              {acertos} <span className="text-text-muted">de {total}</span>
            </div>
          </div>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-text">{licao.conclusao}</p>
          <div className="rounded-2xl border border-gold/40 bg-gold-soft p-3 text-sm">
            <strong className="text-text">+ {Math.round((acertos / total) * licao.xp)} XP</strong>{" "}
            creditados. Continue a sequência amanhã!
          </div>
          <div className="sticky bottom-0 -mx-6 border-t border-border bg-surface/95 px-6 py-3 backdrop-blur">
            <Button fullWidth size="lg" onClick={finalizar}>
              <Sparkles className="h-5 w-5" />
              Concluir aula
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
