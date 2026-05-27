"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

type VideoPlaceholderProps = {
  titulo: string;
  duracao: string;
  instrutor?: string;
  onAssistido: () => void;
  jaAssistido?: boolean;
};

/**
 * Player de vídeo simulado. Em produção será trocado por um <video> ou embed real
 * (YouTube/Vimeo). No protótipo, ao clicar em play, simulamos o "assistir"
 * com uma barra de progresso de ~6s e disparamos onAssistido ao final.
 */
export function VideoPlaceholder({
  titulo,
  duracao,
  instrutor,
  onAssistido,
  jaAssistido = false,
}: VideoPlaceholderProps) {
  const [state, setState] = useState<"idle" | "playing" | "done">(jaAssistido ? "done" : "idle");
  const [progresso, setProgresso] = useState(jaAssistido ? 100 : 0);
  const raf = useRef<number | null>(null);
  const inicio = useRef<number>(0);

  useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  function play() {
    if (state !== "idle") return;
    setState("playing");
    inicio.current = performance.now();
    const duracaoMs = 6000;

    function tick(now: number) {
      const pct = Math.min(100, ((now - inicio.current) / duracaoMs) * 100);
      setProgresso(pct);
      if (pct < 100) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setState("done");
        onAssistido();
      }
    }
    raf.current = requestAnimationFrame(tick);
  }

  function pular() {
    if (state === "done") return;
    if (raf.current) cancelAnimationFrame(raf.current);
    setProgresso(100);
    setState("done");
    onAssistido();
  }

  return (
    <div className="space-y-2">
      {/* Player */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl gradient-brand shadow-soft">
        {/* Decoração */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -left-10 top-1/3 h-32 w-32 rounded-full bg-white/40 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-accent/40 blur-3xl" />
        </div>

        {/* Conteúdo central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
          {state === "idle" && (
            <button
              onClick={play}
              className="group flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-dark shadow-glow transition hover:scale-110 active:scale-95 sm:h-20 sm:w-20"
              aria-label="Assistir vídeo"
            >
              <Play className="h-7 w-7 translate-x-0.5 fill-current sm:h-8 sm:w-8" />
            </button>
          )}

          {state === "playing" && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur sm:h-20 sm:w-20">
                <Volume2 className="h-7 w-7 animate-pulse" />
              </div>
              <div className="text-xs uppercase tracking-wider text-white/80">Reproduzindo…</div>
            </div>
          )}

          {state === "done" && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-glow sm:h-20 sm:w-20">
                <Check className="h-8 w-8" />
              </div>
              <div className="text-xs uppercase tracking-wider text-white/80">Vídeo assistido</div>
            </div>
          )}
        </div>

        {/* Top-left tag */}
        <div className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          {state === "done" ? "Concluído" : "Vídeo-aula"}
        </div>

        {/* Top-right duration */}
        <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {duracao}
        </div>

        {/* Bottom: title + progress */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 pb-3 pt-6 text-white">
          <div className="line-clamp-2 text-sm font-bold leading-snug">{titulo}</div>
          {instrutor && <div className="text-[11px] text-white/70">{instrutor}</div>}
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className={cn(
                "h-full rounded-full transition-[width]",
                state === "done" ? "bg-success" : "bg-white",
              )}
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </div>

      {/* Helper text + skip */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">
          {state === "idle" && "Assista o vídeo pra liberar os exercícios."}
          {state === "playing" && "Reproduzindo… aguarde acabar pra liberar."}
          {state === "done" && (
            <span className="font-semibold text-success">
              ✓ Pronto — pode começar os exercícios.
            </span>
          )}
        </span>
        {state !== "done" && (
          <button
            onClick={pular}
            className="font-medium text-text-muted underline-offset-2 hover:text-text hover:underline"
            title="Pula a espera (só no protótipo)"
          >
            pular (demo)
          </button>
        )}
      </div>

      {/* Aviso protótipo */}
      <div className="rounded-xl border border-dashed border-border bg-surface-2/50 p-2.5 text-[11px] leading-snug text-text-muted">
        🎬 <strong className="text-text">Placeholder de vídeo.</strong> Aqui vai entrar o player real
        (YouTube / Vimeo / vídeo próprio). No protótipo, "Pular" libera os exercícios na hora pra você testar o fluxo.
      </div>
    </div>
  );
}
