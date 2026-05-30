"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, KeyRound, Trophy, X } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { useLessonProgress } from "@/lib/hooks/use-lesson-progress";
import { useGameState } from "@/lib/hooks/use-game-state";
import { type Modulo, type Pergunta } from "@/lib/lessons";
import { cn } from "@/lib/utils";

const ACERTO_MINIMO = 0.8;
const PERGUNTAS_NA_PROVA = 8;

type Props = {
  modulo: Modulo | null;
  onClose: () => void;
  onAprovado?: () => void;
};

/**
 * Prova de skip de módulo. Amostra perguntas do módulo,
 * exige ≥80% pra desbloquear o próximo (marca todas as aulas como concluídas).
 */
export function SkipQuizModal({ modulo, onClose, onAprovado }: Props) {
  const toast = useToast();
  const { concluirLicao } = useLessonProgress();
  const { ganharXp } = useGameState();

  const perguntas = useMemo<Pergunta[]>(() => {
    if (!modulo) return [];
    const todas = modulo.licoes.flatMap((l) => l.perguntas);
    return embaralhar(todas).slice(0, Math.min(PERGUNTAS_NA_PROVA, todas.length));
  }, [modulo]);

  const [idx, setIdx] = useState(0);
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [fase, setFase] = useState<"intro" | "prova" | "resultado">("intro");
  const [aplicando, setAplicando] = useState(false);

  useEffect(() => {
    if (modulo) {
      setIdx(0);
      setEscolhida(null);
      setAcertos(0);
      setFase("intro");
    }
  }, [modulo?.id]);

  if (!modulo) return null;

  const pergunta = perguntas[idx];
  const total = perguntas.length;
  const respondida = escolhida !== null;
  const acertou = escolhida === pergunta?.correta;
  const pctAcerto = total ? acertos / total : 0;
  const aprovado = pctAcerto >= ACERTO_MINIMO;

  function proxima() {
    if (escolhida === pergunta.correta) setAcertos((a) => a + 1);
    if (idx === total - 1) {
      setFase("resultado");
    } else {
      setIdx((i) => i + 1);
      setEscolhida(null);
    }
  }

  async function aplicarSkip() {
    if (!modulo) return;
    setAplicando(true);
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setAplicando(false);
      return;
    }

    // Marca todas as lições do módulo como concluídas
    const rows = modulo.licoes.map((l) => ({
      user_id: user.id,
      modulo_id: modulo.id,
      licao_id: l.id,
      concluida: true,
      acertos: 0,
      xp_ganho: 0,
      concluida_em: new Date().toISOString(),
    }));
    await supabase.from("lesson_progress").upsert(rows, { onConflict: "user_id,licao_id" });

    // Registra o skip
    await supabase.from("modulos_pulados").upsert(
      {
        user_id: user.id,
        modulo_id: modulo.id,
        acertos,
        total,
      },
      { onConflict: "user_id,modulo_id" },
    );

    // Dá XP proporcional como reconhecimento (50 XP por skip)
    await ganharXp(50);

    // Refresh do progresso vai acontecer no parent via callback
    setAplicando(false);
    toast(`Módulo ${modulo.id} desbloqueado!`);
    onAprovado?.();
    onClose();
  }

  return (
    <Sheet open={!!modulo} onClose={onClose} title="Prova pra pular módulo" side="center">
      {fase === "intro" && (
        <div className="space-y-5">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand">
            <KeyRound className="h-7 w-7" />
          </div>
          <div className="text-center">
            <div className="text-xs uppercase tracking-wider text-text-muted">Módulo {modulo.id}</div>
            <div className="mt-1 text-xl font-extrabold text-text">{modulo.titulo}</div>
          </div>
          <div className="space-y-2 rounded-2xl bg-surface-2 p-4 text-sm text-text">
            <p>
              <strong>{total} perguntas</strong> sobre o conteúdo do módulo.
            </p>
            <p>
              Acerte <strong>{Math.ceil(total * ACERTO_MINIMO)} ou mais ({Math.round(ACERTO_MINIMO * 100)}%)</strong> pra
              desbloquear o próximo módulo e pular todas as aulas deste.
            </p>
            <p className="text-text-muted">
              Se reprovar, nada acontece — você pode tentar de novo ou fazer as aulas normalmente.
            </p>
          </div>
          <Button fullWidth size="lg" onClick={() => setFase("prova")}>
            Começar prova <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {fase === "prova" && pergunta && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            {perguntas.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition",
                  i < idx ? "bg-brand" : i === idx ? "bg-brand/50" : "bg-surface-2",
                )}
              />
            ))}
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-text-muted">
              Pergunta {idx + 1} de {total}
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
                {acertou ? "Certo. " : "Errou. "}
              </strong>
              {pergunta.explicacao}
            </div>
          )}

          <div className="sticky bottom-0 -mx-6 border-t border-border bg-surface/95 px-6 py-3 backdrop-blur">
            <Button fullWidth size="lg" disabled={!respondida} onClick={proxima}>
              {idx === total - 1 ? "Ver resultado" : "Próxima"} <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {fase === "resultado" && (
        <div className="space-y-5 text-center">
          <div
            className={cn(
              "mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full shadow-glow",
              aprovado ? "bg-gold text-[#3a2700]" : "bg-danger/15 text-danger",
            )}
          >
            {aprovado ? <Trophy className="h-9 w-9" /> : <X className="h-9 w-9" />}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-text-muted">Resultado</div>
            <div className="mt-1 text-3xl font-extrabold text-text">
              {acertos} <span className="text-text-muted">de {total}</span>
            </div>
            <div className="mt-1 text-sm font-semibold text-text-muted">
              {Math.round(pctAcerto * 100)}% — precisa de {Math.round(ACERTO_MINIMO * 100)}%
            </div>
          </div>
          {aprovado ? (
            <p className="text-[15px] leading-relaxed text-text">
              Você dominou esse conteúdo. Vamos pular pra próxima etapa e ganhar +50 XP de bônus.
            </p>
          ) : (
            <p className="text-[15px] leading-relaxed text-text">
              Quase. Você ainda pode fazer as aulas pra fechar as lacunas e voltar quando se sentir pronto.
            </p>
          )}
          <div className="sticky bottom-0 -mx-6 border-t border-border bg-surface/95 px-6 py-3 backdrop-blur">
            {aprovado ? (
              <Button fullWidth size="lg" disabled={aplicando} onClick={aplicarSkip}>
                {aplicando ? "Aplicando..." : "Desbloquear próximo módulo"}
              </Button>
            ) : (
              <Button fullWidth size="lg" variant="secondary" onClick={onClose}>
                Voltar pra trilha
              </Button>
            )}
          </div>
        </div>
      )}
    </Sheet>
  );
}

function embaralhar<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
