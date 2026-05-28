"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Trash2,
  PiggyBank,
  Plane,
  Car,
  Home,
  GraduationCap,
  HeartHandshake,
  Wallet,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { SessionGate } from "@/components/session-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Donut } from "@/components/donut";
import { useTransacoes } from "@/lib/hooks/use-transacoes";
import { useCaixinhas } from "@/lib/hooks/use-caixinhas";
import { useCategorias } from "@/lib/hooks/use-categorias";
import { getCategoria, porCategoriaDoMes, todayISODate } from "@/lib/aggregates";
import type { Caixinha, Transacao, Tipo } from "@/lib/supabase/types";
import { cn, formatBRL, formatMonths, monthsToGoal } from "@/lib/utils";

export default function CarteiraPage() {
  return (
    <SessionGate>
      {(s) => (
        <CarteiraInner
          sonhoNome={s.sonho}
          valorSonho={s.valorSonho}
        />
      )}
    </SessionGate>
  );
}

function CarteiraInner({
  sonhoNome,
  valorSonho,
}: {
  sonhoNome: string | null;
  valorSonho: number | null;
}) {
  const { transacoes, totaisMes, remove: removeTransacao } = useTransacoes();
  const { caixinhas, remove: removeCaixinha, add: addCaixinha, loading: loadingCaixinhas } = useCaixinhas();
  const { categorias } = useCategorias();

  // Fix retroativo: usuários que passaram pelo onboarding antes da v1.1
  // tinham sonho no profile mas nenhuma caixinha. Cria automaticamente UMA vez.
  // O ref evita corrida: sem ele o effect dispara de novo antes do refetch
  // terminar e cria duplicatas.
  const autoCriado = useRef(false);
  useEffect(() => {
    if (autoCriado.current) return;
    if (loadingCaixinhas) return;
    if (caixinhas.length > 0) return;
    if (!sonhoNome || !valorSonho) return;
    autoCriado.current = true;
    addCaixinha({
      nome: sonhoNome,
      meta: valorSonho,
      atual: 0,
      emoji: "🎯",
      cor_class: "from-brand to-brand-bright",
    });
  }, [loadingCaixinhas, caixinhas.length, sonhoNome, valorSonho, addCaixinha]);

  const porCategoria = useMemo(
    () => porCategoriaDoMes(transacoes, categorias),
    [transacoes, categorias],
  );

  const [hidden, setHidden] = useState(false);
  const [addTransOpen, setAddTransOpen] = useState(false);
  const [addCaixOpen, setAddCaixOpen] = useState(false);
  const [depositoAlvo, setDepositoAlvo] = useState<Caixinha | null>(null);

  const saldo = totaisMes.sobra;
  const aporteSugerido = Math.max(100, Math.round((Math.max(saldo, 200) * 0.4) / 50) * 50);
  const valorAposta =
    porCategoria.find((p) => p.categoria.nome.toLowerCase() === "apostas")?.total ?? 0;

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-xl px-5 pb-10 pt-4">
        {/* Saldo hero */}
        <div className="relative overflow-hidden rounded-3xl gradient-brand p-6 text-white shadow-glow animate-spring-in">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-white/70">
                Sobra do mês
              </div>
              <div className="mt-1 text-3xl font-extrabold tracking-tight tabular-nums">
                {hidden ? "R$ ••••••" : <AnimatedNumber value={saldo} format="brl" />}
              </div>
            </div>
            <button
              onClick={() => setHidden((h) => !h)}
              className="press inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
              aria-label={hidden ? "Mostrar valores" : "Esconder valores"}
            >
              {hidden ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 stagger">
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur animate-fade-in-up">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <ArrowDownLeft className="h-4 w-4" /> Entrou
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums">
                {hidden ? "•••••" : <AnimatedNumber value={totaisMes.receitas} format="brl" />}
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 backdrop-blur animate-fade-in-up">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <ArrowUpRight className="h-4 w-4" /> Saiu
              </div>
              <div className="mt-1 text-lg font-semibold tabular-nums">
                {hidden ? "•••••" : <AnimatedNumber value={totaisMes.despesas} format="brl" />}
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-4 grid grid-cols-2 gap-3 stagger">
          <Button size="md" fullWidth onClick={() => setAddTransOpen(true)} className="press animate-fade-in-up">
            <Plus className="h-4 w-4" /> Lançar transação
          </Button>
          <Button size="md" variant="secondary" fullWidth onClick={() => setAddCaixOpen(true)} className="press animate-fade-in-up">
            <PiggyBank className="h-4 w-4" /> Nova caixinha
          </Button>
        </div>

        {/* Sugestão IA */}
        {saldo > 0 && caixinhas[0] && (
          <Card className="mt-4 border-brand/20 bg-brand-soft">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1 text-sm text-text">
                Você sobrou <strong>{formatBRL(saldo)}</strong> esse mês. Com{" "}
                <strong>{formatBRL(aporteSugerido)}</strong>/mês na caixinha{" "}
                <strong>{caixinhas[0].nome}</strong>, em{" "}
                <strong>
                  {formatMonths(
                    monthsToGoal({
                      goal: Number(caixinhas[0].meta),
                      current: Number(caixinhas[0].atual),
                      monthly: aporteSugerido,
                      annualRate: 0.1,
                    }),
                  )}
                </strong>{" "}
                você chega no objetivo. Bora?
              </div>
            </div>
          </Card>
        )}

        {/* Alerta de aposta */}
        {valorAposta > 0 && (
          <Card className="mt-4 border-danger/30 bg-danger/10">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
              <div className="text-sm text-text">
                <strong className="text-danger">Atenção:</strong> {formatBRL(valorAposta)} em apostas esse
                mês. Esse dinheiro renderia <strong>{formatBRL(valorAposta * Math.pow(1.1, 5))}</strong> em
                5 anos guardado a 10% a.a. Tigrinho não é investimento.
              </div>
            </div>
          </Card>
        )}

        {/* Caixinhas */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Caixinhas de objetivo</h2>
            <span className="text-xs text-text-muted">
              {caixinhas.length} ativa{caixinhas.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 stagger">
            {caixinhas.map((c) => (
              <div key={c.id} className="animate-fade-in-up">
                <CaixinhaCard
                  caixinha={c}
                  onDepositar={() => setDepositoAlvo(c)}
                  onRemover={() => removeCaixinha(c.id)}
                />
              </div>
            ))}
            <button
              onClick={() => setAddCaixOpen(true)}
              className="press animate-fade-in-up flex items-center justify-center rounded-3xl border-2 border-dashed border-border bg-surface p-6 text-text-muted transition hover:border-brand hover:text-brand"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">Nova caixinha</span>
              </div>
            </button>
          </div>
        </section>

        {/* Donut + breakdown */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold tracking-tight">Onde foi o seu dinheiro</h2>
          {porCategoria.length === 0 ? (
            <Card className="text-center text-text-muted">
              <Wallet className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm">Sem despesas esse mês. Lance uma transação pra ver o gráfico.</p>
            </Card>
          ) : (
            <Card>
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <Donut
                  slices={porCategoria.map((p) => ({
                    id: p.categoria.id,
                    valor: p.total,
                    cor: p.categoria.hex,
                  }))}
                  size={170}
                  thickness={26}
                  center={
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-text-muted">Despesas</div>
                      <div className="text-xl font-extrabold leading-tight text-text">
                        {formatBRL(totaisMes.despesas)}
                      </div>
                    </div>
                  }
                />
                <div className="w-full flex-1 space-y-2">
                  {porCategoria.slice(0, 6).map((p) => (
                    <div key={p.categoria.id} className="flex items-center gap-3 text-sm">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ background: p.categoria.hex }}
                      />
                      <span
                        className={cn(
                          "flex-1 truncate font-medium",
                          p.categoria.alerta ? "text-danger" : "text-text",
                        )}
                      >
                        {p.categoria.emoji} {p.categoria.nome}
                      </span>
                      <span className="text-text-muted">{formatBRL(p.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </section>

        {/* Lista de transações */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Lançamentos recentes</h2>
            <span className="text-xs text-text-muted">{totaisMes.transacoes.length} esse mês</span>
          </div>
          <Card className="p-2">
            {totaisMes.transacoes.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-text-muted">
                Sem lançamentos. Toque em &quot;Lançar transação&quot; pra começar.
              </div>
            ) : (
              <ul className="stagger divide-y divide-border">
                {[...totaisMes.transacoes].slice(0, 12).map((t) => (
                  <TransacaoRow key={t.id} t={t} onRemove={removeTransacao} categorias={categorias} />
                ))}
              </ul>
            )}
          </Card>
        </section>
      </main>

      <AddTransacaoSheet open={addTransOpen} onClose={() => setAddTransOpen(false)} />
      <AddCaixinhaSheet open={addCaixOpen} onClose={() => setAddCaixOpen(false)} />
      <DepositoSheet caixinha={depositoAlvo} onClose={() => setDepositoAlvo(null)} />
    </>
  );
}

/* =========================================================
 * Cards / linhas
 * =======================================================*/

function CaixinhaCard({
  caixinha,
  onDepositar,
  onRemover,
}: {
  caixinha: Caixinha;
  onDepositar: () => void;
  onRemover: () => void;
}) {
  const pct = Math.min(100, Math.round((Number(caixinha.atual) / Number(caixinha.meta)) * 100));
  return (
    <Card className="press-sm overflow-hidden p-5 transition-shadow hover:shadow-glow">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl text-white shadow-soft",
            caixinha.cor_class,
          )}
        >
          <span aria-hidden>{caixinha.emoji}</span>
        </div>
        <button
          onClick={onRemover}
          className="press text-text-muted transition-colors hover:text-danger"
          aria-label="Remover caixinha"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 text-sm font-semibold text-text">{caixinha.nome}</div>
      <div className="text-xs text-text-muted tabular-nums">
        <AnimatedNumber value={Number(caixinha.atual)} format="brl" /> de {formatBRL(Number(caixinha.meta))} · {pct}%
      </div>
      <ProgressBar
        value={pct}
        className="mt-3"
        fillClassName={cn("bg-gradient-to-r", caixinha.cor_class)}
      />
      <Button size="sm" variant="secondary" fullWidth className="press mt-4" onClick={onDepositar}>
        Depositar
      </Button>
    </Card>
  );
}

function TransacaoRow({
  t,
  onRemove,
  categorias,
}: {
  t: Transacao;
  onRemove: (id: string) => void;
  categorias: ReturnType<typeof useCategorias>["categorias"];
}) {
  const cat = getCategoria(categorias, t.categoria_id);
  const sign = t.tipo === "receita" ? "+" : "−";
  const valorClass = t.tipo === "receita" ? "text-success" : "text-text";
  const data = new Date(t.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

  function remover() {
    if (confirm("Apagar esse lançamento?")) onRemove(t.id);
  }

  return (
    <li className="group flex animate-fade-in-up items-center gap-3 px-3 py-3 transition-colors hover:bg-surface-2/60">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface-2 text-lg">
        {cat.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-text">{t.descricao}</div>
        <div className="text-xs text-text-muted">
          {cat.nome} · {data}
        </div>
      </div>
      <div className={cn("text-sm font-semibold", valorClass)}>
        {sign} {formatBRL(Number(t.valor))}
      </div>
      <button
        onClick={remover}
        className="ml-1 text-text-muted opacity-0 transition group-hover:opacity-100 hover:text-danger"
        aria-label="Remover lançamento"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}

/* =========================================================
 * Sheets de ações
 * =======================================================*/

function AddTransacaoSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const { add } = useTransacoes();
  const { categorias } = useCategorias();

  const [tipo, setTipo] = useState<Tipo>("despesa");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<string>("");
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [data, setData] = useState<string>(todayISODate());

  const opcoesCategoria = categorias.filter((c) => c.tipo === tipo);

  if (open && categoriaId === null && opcoesCategoria[0]) {
    setCategoriaId(opcoesCategoria[0].id);
  }

  async function salvar() {
    const n = Number(valor.replace(",", "."));
    if (!descricao.trim() || !n || n <= 0) return;
    const err = await add({
      descricao: descricao.trim(),
      valor: n,
      tipo,
      categoria_id: categoriaId,
      data,
    });
    if (err) {
      toast("Erro ao salvar: " + err.message);
      return;
    }
    toast(tipo === "receita" ? "Receita lançada" : "Despesa lançada");
    setDescricao("");
    setValor("");
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title="Lançar transação">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-surface-2 p-1">
          {(["despesa", "receita"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTipo(t);
                setCategoriaId(categorias.find((c) => c.tipo === t)?.id ?? null);
              }}
              className={cn(
                "press rounded-xl py-2 text-sm font-semibold transition",
                tipo === t
                  ? t === "receita"
                    ? "bg-success text-white"
                    : "gradient-brand text-white"
                  : "text-text-muted hover:text-text",
              )}
            >
              {t === "despesa" ? "− Despesa" : "+ Receita"}
            </button>
          ))}
        </div>

        <Input
          label="Descrição"
          placeholder={tipo === "despesa" ? "Ex: mercado, gasolina, tigrinho" : "Ex: salário, freela"}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          autoFocus
        />

        <Input
          label="Valor (R$)"
          inputMode="decimal"
          placeholder="0,00"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text">Categoria</label>
          <div className="flex flex-wrap gap-2">
            {opcoesCategoria.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoriaId(c.id)}
                className={cn(
                  "press flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
                  categoriaId === c.id
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-border bg-surface hover:border-brand/40",
                )}
              >
                <span>{c.emoji}</span>
                <span>{c.nome}</span>
              </button>
            ))}
            {opcoesCategoria.length === 0 && (
              <div className="text-xs text-text-muted">
                Nenhuma categoria desse tipo. Cadastre uma em Perfil → Categorias.
              </div>
            )}
          </div>
        </div>

        <Input label="Data" type="date" value={data} onChange={(e) => setData(e.target.value)} />

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button fullWidth onClick={salvar}>
            Salvar
          </Button>
        </div>
      </div>
    </Sheet>
  );
}

const presetsCaixinha: { nome: string; meta: number; emoji: string; cor: string; icon: React.ReactNode }[] = [
  { nome: "Viagem",        meta: 12000,  emoji: "✈️", cor: "from-brand to-brand-bright", icon: <Plane className="h-5 w-5" /> },
  { nome: "Carro novo",    meta: 65000,  emoji: "🚗", cor: "from-accent to-brand",       icon: <Car className="h-5 w-5" /> },
  { nome: "Casa própria",  meta: 120000, emoji: "🏡", cor: "from-brand-dark to-brand",   icon: <Home className="h-5 w-5" /> },
  { nome: "Faculdade",     meta: 40000,  emoji: "🎓", cor: "from-accent to-brand-bright", icon: <GraduationCap className="h-5 w-5" /> },
  { nome: "Reserva",       meta: 15000,  emoji: "🛟", cor: "from-brand to-success",      icon: <PiggyBank className="h-5 w-5" /> },
  { nome: "Casamento",     meta: 30000,  emoji: "💍", cor: "from-gold to-warning",       icon: <HeartHandshake className="h-5 w-5" /> },
];

function AddCaixinhaSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast();
  const { add } = useCaixinhas();
  const [nome, setNome] = useState("");
  const [meta, setMeta] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [cor, setCor] = useState(presetsCaixinha[0].cor);
  const [aporte, setAporte] = useState("");

  function aplicarPreset(p: (typeof presetsCaixinha)[number]) {
    setNome(p.nome);
    setMeta(String(p.meta));
    setEmoji(p.emoji);
    setCor(p.cor);
  }

  async function salvar() {
    const m = Number(meta.replace(",", "."));
    if (!nome.trim() || !m || m <= 0) return;
    const err = await add({
      nome: nome.trim(),
      meta: m,
      atual: Number(aporte.replace(",", ".")) || 0,
      emoji,
      cor_class: cor,
    });
    if (err) {
      toast("Erro: " + err.message);
      return;
    }
    toast("Caixinha criada");
    setNome("");
    setMeta("");
    setAporte("");
    onClose();
  }

  return (
    <Sheet open={open} onClose={onClose} title="Nova caixinha">
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-text">Inspire-se</label>
          <div className="grid grid-cols-2 gap-2">
            {presetsCaixinha.map((p) => (
              <button
                key={p.nome}
                type="button"
                onClick={() => aplicarPreset(p)}
                className={cn(
                  "press flex items-center gap-2 rounded-2xl border p-3 text-left transition",
                  nome === p.nome ? "border-brand bg-brand-soft" : "border-border hover:border-brand/40",
                )}
              >
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white", p.cor)}>
                  {p.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text">{p.nome}</div>
                  <div className="text-xs text-text-muted">{formatBRL(p.meta)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Input label="Nome da caixinha" placeholder="Ex: trocar de carro" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Input label="Meta (R$)" inputMode="numeric" placeholder="0" value={meta} onChange={(e) => setMeta(e.target.value)} />
        <Input
          label="Já tem algo guardado? (opcional)"
          inputMode="decimal"
          placeholder="0,00"
          value={aporte}
          onChange={(e) => setAporte(e.target.value)}
        />

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button fullWidth onClick={salvar}>
            Criar caixinha
          </Button>
        </div>
      </div>
    </Sheet>
  );
}

function DepositoSheet({ caixinha, onClose }: { caixinha: Caixinha | null; onClose: () => void }) {
  const toast = useToast();
  const { depositar } = useCaixinhas();
  const [valor, setValor] = useState("");

  async function salvar() {
    if (!caixinha) return;
    const v = Number(valor.replace(",", "."));
    if (!v || v <= 0) return;
    await depositar(caixinha.id, v);
    toast(`+ ${formatBRL(v)} em ${caixinha.nome}`);
    setValor("");
    onClose();
  }

  function projecaoMeses(monthly: number) {
    if (!caixinha) return Infinity;
    return monthsToGoal({
      goal: Number(caixinha.meta),
      current: Number(caixinha.atual) + (Number(valor.replace(",", ".")) || 0),
      monthly,
      annualRate: 0.1,
    });
  }

  return (
    <Sheet open={!!caixinha} onClose={onClose} title={caixinha ? `Depositar em ${caixinha.nome}` : ""}>
      {caixinha && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-brand-soft p-4 text-center">
            <div className="text-xs text-text-muted">Saldo atual</div>
            <div className="text-2xl font-extrabold text-text">{formatBRL(Number(caixinha.atual))}</div>
            <div className="text-xs text-text-muted">de {formatBRL(Number(caixinha.meta))}</div>
          </div>

          <Input
            label="Quanto vai depositar? (R$)"
            inputMode="decimal"
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            autoFocus
          />

          <div className="grid grid-cols-3 gap-2">
            {[50, 100, 200].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setValor(String(v))}
                className="press rounded-full border border-border bg-surface py-1.5 text-sm font-medium text-text hover:border-brand/40"
              >
                + R$ {v}
              </button>
            ))}
          </div>

          {valor && Number(valor) > 0 && (
            <div className="flex items-start gap-2 rounded-2xl bg-surface-2 p-3 text-xs text-text-muted">
              <Target className="mt-0.5 h-4 w-4 text-brand" />
              <div>
                Mantendo {formatBRL(Number(valor))}/mês, você chega na meta em{" "}
                <strong className="text-text">{formatMonths(projecaoMeses(Number(valor)))}</strong> com 10% a.a.
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="secondary" fullWidth onClick={onClose}>
              Cancelar
            </Button>
            <Button fullWidth onClick={salvar}>
              Depositar
            </Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}
