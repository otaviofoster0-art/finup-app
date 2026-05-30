"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Flame, Heart, KeyRound, Lock, Star, Trophy } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { SessionGate } from "@/components/session-gate";
import { Card } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ProgressBar } from "@/components/ui/progress-bar";
import { LessonModal } from "@/components/lesson-modal";
import { SkipQuizModal } from "@/components/skip-quiz-modal";
import { modulos, type Licao, type Modulo } from "@/lib/lessons";
import { useLessonProgress } from "@/lib/hooks/use-lesson-progress";
import { useGameState } from "@/lib/hooks/use-game-state";
import { cn } from "@/lib/utils";

type LessonStatus = "completed" | "current" | "locked";

export default function TrilhaPage() {
  return <SessionGate>{() => <TrilhaInner />}</SessionGate>;
}

function TrilhaInner() {
  const { progress, refresh: refreshProgress } = useLessonProgress();
  const game = useGameState();
  const [moduloAtivoId, setModuloAtivoId] = useState<number>(1);
  const moduloAtivo = modulos.find((m) => m.id === moduloAtivoId) ?? modulos[0];
  const [aberta, setAberta] = useState<Licao | null>(null);
  const [provaSkip, setProvaSkip] = useState<Modulo | null>(null);

  return (
    <>
      <AppHeader title="Trilha" />
      <main className="mx-auto w-full max-w-xl px-5 pb-10 pt-4">
        {/* Game stats */}
        <div className="grid grid-cols-4 gap-2 stagger">
          <StatCard
            icon={<Flame className="h-5 w-5" />}
            value={<AnimatedNumber value={game.streak} />}
            label="streak"
            color="text-warning bg-warning/10"
          />
          <StatCard
            icon={<Star className="h-5 w-5" />}
            value={<AnimatedNumber value={game.xpTotal} />}
            label="XP"
            color="text-brand bg-brand-soft"
          />
          <StatCard
            icon={<Trophy className="h-5 w-5" />}
            value={<AnimatedNumber value={game.nivel} />}
            label="nível"
            color="text-gold bg-gold-soft"
          />
          <StatCard
            icon={<Heart className="h-5 w-5" />}
            value={<AnimatedNumber value={game.vidas} />}
            label="vidas"
            color="text-danger bg-danger/10"
          />
        </div>

        {/* Barra de nível */}
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] uppercase tracking-wider text-text-muted">
            <span>Nível {game.nivel}</span>
            <span className="tabular-nums">
              {game.xpDoNivel}/{game.xpDoProximo} XP
            </span>
          </div>
          <ProgressBar value={game.pctNivel} />
        </div>

        {/* Seletor de módulo */}
        <div className="mt-6 -mx-1 overflow-x-auto pb-1">
          <div className="flex gap-2 px-1">
            {modulos.map((m) => {
              const ativo = m.id === moduloAtivoId;
              const concluidasMod = progress.filter((p) => p.modulo_id === m.id && p.concluida).length;
              const desbloqueado = isModuloDesbloqueado(m, progress);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => desbloqueado && setModuloAtivoId(m.id)}
                  disabled={!desbloqueado}
                  className={cn(
                    "press shrink-0 rounded-2xl border px-4 py-2 text-left transition",
                    ativo
                      ? "border-brand bg-brand-soft"
                      : "border-border bg-surface hover:border-brand/30",
                    !desbloqueado && "cursor-not-allowed opacity-50",
                  )}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Módulo {m.id}
                    {!desbloqueado && <Lock className="ml-1 inline h-3 w-3" />}
                  </div>
                  <div className="text-sm font-bold text-text">{m.titulo}</div>
                  <div className="text-[11px] text-text-muted">
                    {concluidasMod}/{m.licoes.length} aulas
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Módulo hero */}
        <ModuloHero modulo={moduloAtivo} progress={progress} />

        {/* Recompensa */}
        <Card className="mt-4 flex items-center gap-3 border-gold/30 bg-gold-soft">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold text-[#3a2700]">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="flex-1 text-sm">
            <strong className="text-text">{moduloAtivo.recompensa}</strong>{" "}
            <span className="text-text-muted">ao concluir este módulo.</span>
          </div>
        </Card>

        {/* Banner do capítulo */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Sua jornada</h2>
            <span className="text-xs text-text-muted">Toque pra abrir uma aula</span>
          </div>

          <div className="relative mb-3 overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-r from-brand-soft to-accent-soft p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-soft">
                <Star className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                  Capítulo {moduloAtivo.id} · {moduloAtivo.titulo}
                </div>
                <div className="text-sm font-bold text-text">{moduloAtivo.descricao}</div>
              </div>
            </div>
          </div>

          <JornadaPath
            modulo={moduloAtivo}
            progress={progress}
            onAbrir={(l) => setAberta(l)}
          />

          {/* Próximo módulo */}
          {moduloAtivo.id < modulos.length && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-dashed border-border bg-surface-2/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface text-text-muted">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Próximo capítulo
                  </div>
                  <div className="text-sm font-bold text-text">
                    Módulo {moduloAtivo.id + 1} — {modulos[moduloAtivo.id]?.titulo}
                  </div>
                  <div className="text-xs text-text-muted">
                    Desbloqueia ao concluir o atual — ou faça a prova de skip
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setProvaSkip(moduloAtivo)}
                className="press mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90"
              >
                <KeyRound className="h-4 w-4" />
                Já sei isso — fazer prova pra pular
              </button>
            </div>
          )}
        </section>
      </main>

      <LessonModal
        licao={aberta}
        moduloId={moduloAtivo.id}
        onClose={() => setAberta(null)}
        onConcluida={() => {
          // Recarrega game state (streak/XP/vidas) e progresso após aula
          game.refresh();
          refreshProgress();
        }}
      />
      <SkipQuizModal
        modulo={provaSkip}
        onClose={() => setProvaSkip(null)}
        onAprovado={() => {
          refreshProgress();
          game.refresh();
          // Pula visualização para o próximo módulo
          if (provaSkip && provaSkip.id < modulos.length) {
            setModuloAtivoId(provaSkip.id + 1);
          }
        }}
      />
    </>
  );
}

function isModuloDesbloqueado(m: Modulo, progress: Awaited<ReturnType<typeof useLessonProgress>["progress"]> | { modulo_id: number; concluida: boolean }[]) {
  if (m.id === 1) return true;
  // pra desbloquear módulo N, todas as aulas do módulo N-1 precisam estar concluídas
  const anterior = modulos.find((x) => x.id === m.id - 1);
  if (!anterior) return false;
  const concluidasAnterior = progress.filter((p) => p.modulo_id === m.id - 1 && p.concluida).length;
  return concluidasAnterior >= anterior.licoes.length;
}

function ModuloHero({ modulo, progress }: { modulo: Modulo; progress: { modulo_id: number; licao_id: number; concluida: boolean }[] }) {
  const concluidas = progress.filter((p) => p.modulo_id === modulo.id && p.concluida).length;
  const pct = (concluidas / modulo.licoes.length) * 100;
  return (
    <div className="relative mt-6 overflow-hidden rounded-3xl gradient-brand p-6 text-white shadow-glow animate-spring-in">
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Módulo {modulo.id}
          </div>
          <div className="mt-1 text-xl font-extrabold leading-tight">{modulo.titulo}</div>
          <div className="mt-2 text-sm text-white/80 tabular-nums">
            <AnimatedNumber value={concluidas} /> de {modulo.licoes.length} aulas concluídas
          </div>
          <ProgressBar
            value={pct}
            className="mt-3"
            trackClassName="bg-white/20"
            fillClassName="bg-white"
          />
        </div>
        <div className="ml-2 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold text-[#3a2700] shadow-lg transition-transform hover:rotate-6 hover:scale-110">
          <Trophy className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <div className="press-sm animate-fade-in-up rounded-2xl border border-border bg-surface p-3 text-center transition-shadow hover:shadow-soft">
      <div className={cn("mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full", color)}>
        {icon}
      </div>
      <div className="text-xl font-extrabold leading-none text-text tabular-nums">{value}</div>
      <div className="mt-1 text-[11px] leading-tight text-text-muted">{label}</div>
    </div>
  );
}

/* =========================================================
 * Jornada com caminhos curvos SVG
 * =======================================================*/

const zigzag = [
  "translate-x-0",
  "translate-x-14",
  "translate-x-24",
  "translate-x-14",
  "translate-x-0",
  "-translate-x-14",
  "-translate-x-24",
  "-translate-x-14",
  "translate-x-0",
];

function JornadaPath({
  modulo,
  progress,
  onAbrir,
}: {
  modulo: Modulo;
  progress: { modulo_id: number; licao_id: number; concluida: boolean }[];
  onAbrir: (l: Licao) => void;
}) {
  const lessons = useMemo(() => {
    return modulo.licoes.map((l, idx) => {
      const concluida = !!progress.find((p) => p.modulo_id === modulo.id && p.licao_id === l.id)?.concluida;
      const anterior = idx === 0
        ? true
        : !!progress.find(
            (p) => p.modulo_id === modulo.id && p.licao_id === modulo.licoes[idx - 1].id,
          )?.concluida;
      const status: LessonStatus = concluida ? "completed" : anterior ? "current" : "locked";
      return { licao: l, status, offsetClass: zigzag[idx % zigzag.length] };
    });
  }, [modulo, progress]);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [segments, setSegments] = useState<{ d: string; completed: boolean }[]>([]);
  const [boxH, setBoxH] = useState(0);

  const recalc = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const cRect = c.getBoundingClientRect();
    setBoxH(cRect.height);

    const points = nodeRefs.current.map((n) => {
      if (!n) return null;
      const r = n.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - cRect.left,
        y: r.top + r.height / 2 - cRect.top,
      };
    });

    const out: { d: string; completed: boolean }[] = [];
    const R = 50;

    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      if (!a || !b) continue;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;

      const sx = a.x + ux * R;
      const sy = a.y + uy * R;
      const ex = b.x - ux * R;
      const ey = b.y - uy * R;

      const midX = (sx + ex) / 2;
      const midY = (sy + ey) / 2;
      const bulge = 38;
      const horizontalSign = Math.sign(dx) || (i % 2 === 0 ? 1 : -1);
      const cx = midX + bulge * horizontalSign;
      const cy = midY;

      out.push({
        d: `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
        completed: lessons[i].status === "completed",
      });
    }
    setSegments(out);
  }, [lessons]);

  useLayoutEffect(() => {
    recalc();
  }, [recalc]);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => recalc());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", recalc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalc);
    };
  }, [recalc]);

  return (
    <div ref={containerRef} className="stagger relative flex flex-col items-center gap-12 py-6">
      <svg className="pointer-events-none absolute inset-0 z-0" width="100%" height={boxH || "100%"} aria-hidden>
        {segments.map((s, i) => (
          <path
            key={i}
            d={s.d}
            stroke={s.completed ? "hsl(var(--brand))" : "hsl(var(--border))"}
            strokeOpacity={s.completed ? 0.55 : 1}
            strokeWidth="7"
            strokeDasharray="1 16"
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </svg>

      {lessons.map((l, idx) => (
        <div
          key={l.licao.id}
          ref={(el) => {
            nodeRefs.current[idx] = el;
          }}
          className={cn("relative z-10 flex w-full justify-center transition-transform duration-500 ease-spring", l.offsetClass)}
        >
          <LessonNode
            licao={l.licao}
            status={l.status}
            onClick={() => l.status !== "locked" && onAbrir(l.licao)}
          />
        </div>
      ))}
    </div>
  );
}

function LessonNode({
  licao,
  status,
  onClick,
}: {
  licao: Licao;
  status: LessonStatus;
  onClick: () => void;
}) {
  const layers =
    status === "completed"
      ? { face: "bg-gradient-to-br from-brand-bright to-brand text-white", base: "bg-brand-dark", label: "text-text" }
      : status === "current"
        ? { face: "gradient-brand text-white", base: "bg-brand-dark", label: "text-text font-bold" }
        : { face: "bg-surface-2 text-text-muted", base: "bg-border", label: "text-text-muted" };

  const isLocked = status === "locked";

  return (
    <div className="relative flex animate-fade-in-up flex-col items-center">
      {status === "current" && (
        <div className="pointer-events-none absolute -top-9 z-20 flex flex-col items-center animate-bob">
          <div className="whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brand shadow-glow ring-2 ring-brand">
            Começar
          </div>
          <svg width="16" height="9" viewBox="0 0 16 9" fill="none" className="-mt-[1px]" aria-hidden>
            <path d="M 1 0 L 8 8 L 15 0" fill="white" stroke="hsl(var(--brand))" strokeWidth="2" strokeLinejoin="round" />
            <rect x="2" y="-2" width="12" height="2" fill="white" />
          </svg>
        </div>
      )}

      <div className="relative h-[5.5rem] w-[5.5rem]">
        {status === "current" && (
          <>
            <span aria-hidden className="absolute inset-0 animate-ring-pulse rounded-full bg-brand/40" />
            <span aria-hidden className="absolute inset-0 animate-pulse-soft rounded-full bg-brand/15" />
          </>
        )}

        <div className={cn("absolute inset-0 translate-y-2 rounded-full", layers.base, isLocked && "opacity-50")} />

        <button
          onClick={onClick}
          disabled={isLocked}
          aria-label={isLocked ? `Aula ${licao.titulo} (bloqueada)` : `Abrir aula: ${licao.titulo}`}
          className={cn(
            "relative flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full shadow-soft transition-transform duration-150 ease-spring",
            layers.face,
            isLocked
              ? "cursor-not-allowed opacity-70 grayscale"
              : "cursor-pointer hover:translate-y-0 active:translate-y-1.5",
          )}
        >
          <span className="text-4xl drop-shadow-sm" aria-hidden>
            {isLocked ? <Lock className="h-9 w-9" /> : licao.emoji}
          </span>

          {status === "completed" && (
            <span aria-hidden className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-[#3a2700] shadow-soft ring-2 ring-bg">
              <Star className="h-4 w-4 fill-current" strokeWidth={2} />
            </span>
          )}

          {status === "current" && (
            <span aria-hidden className="absolute -bottom-1 -right-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold text-[#3a2700] shadow-soft ring-2 ring-bg">
              +{licao.xp}XP
            </span>
          )}
        </button>
      </div>

      <div className={cn("mt-3 max-w-[180px] text-balance text-center text-[13px] leading-tight", layers.label)}>
        {licao.titulo}
      </div>
    </div>
  );
}
