"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Plane,
  Car,
  Home,
  GraduationCap,
  PiggyBank,
  HeartHandshake,
  Frown,
  Meh,
  Smile,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "@/lib/hooks/use-session";
import { updateProfile } from "@/lib/session";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { cn, formatBRL } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3;
type Situacao = "no_vermelho" | "no_zero" | "sobra_pouca" | "sobra_boa";

const sonhosPresets: { label: string; value: number; icon: React.ReactNode; emoji: string }[] = [
  { label: "Viagem pra Disney",       value: 18000, icon: <Plane className="h-5 w-5" />, emoji: "🏰" },
  { label: "Carro novo",              value: 65000, icon: <Car className="h-5 w-5" />, emoji: "🚗" },
  { label: "Casa própria",            value: 120000, icon: <Home className="h-5 w-5" />, emoji: "🏡" },
  { label: "Faculdade dos filhos",    value: 40000, icon: <GraduationCap className="h-5 w-5" />, emoji: "🎓" },
  { label: "Reserva de emergência",   value: 15000, icon: <PiggyBank className="h-5 w-5" />, emoji: "🛟" },
  { label: "Casamento",               value: 30000, icon: <HeartHandshake className="h-5 w-5" />, emoji: "💍" },
];

const situacoes: { value: Situacao; label: string; desc: string; icon: React.ReactNode }[] = [
  { value: "no_vermelho", label: "Estou no vermelho", desc: "Gasto mais do que ganho ou tenho dívidas pesando.", icon: <Frown className="h-6 w-6" /> },
  { value: "no_zero",     label: "Fica zerado todo mês", desc: "Pago as contas, mas não sobra nada pra guardar.", icon: <Meh className="h-6 w-6" /> },
  { value: "sobra_pouca", label: "Sobra um pouco",    desc: "Consigo guardar algo, mas quero mais controle.", icon: <Smile className="h-6 w-6" /> },
  { value: "sobra_boa",   label: "Tenho uma boa folga", desc: "Quero aprender a investir e fazer o dinheiro render.", icon: <PartyPopper className="h-6 w-6" /> },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { userId, profile, loading, refresh } = useSession();
  const [step, setStep] = useState<Step>(0);

  // step 0
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [fotoDataUrl, setFotoDataUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // step 1
  const [sonho, setSonho] = useState<string>("");
  const [valorSonho, setValorSonho] = useState<number>(0);

  // step 2
  const [situacao, setSituacao] = useState<Situacao | null>(null);

  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      router.replace("/login");
      return;
    }
    if (profile) {
      setNome(profile.nome ?? "");
      setEmpresa(profile.empresa ?? "");
      setFotoDataUrl(profile.foto_url ?? null);
      setSonho(profile.sonho ?? "");
      setValorSonho(profile.valor_sonho == null ? 0 : Number(profile.valor_sonho));
    }
  }, [loading, userId, profile, router]);

  const progress = ((step + 1) / 4) * 100;

  function next() {
    if (step < 3) setStep((s) => (s + 1) as Step);
  }
  function back() {
    if (step > 0) setStep((s) => (s - 1) as Step);
    else router.push("/");
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFotoDataUrl(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  async function finalizar() {
    setSalvando(true);
    await updateProfile({
      nome: nome.trim() || "Funcionário",
      empresa: empresa.trim() || null,
      foto_url: fotoDataUrl,
      sonho: sonho.trim() || null,
      valor_sonho: valorSonho || null,
      onboarding_completo: true,
      bio: sonho ? `Indo atrás de ${sonho.toLowerCase()}.` : null,
    });

    // Cria a primeira caixinha automaticamente baseada no sonho
    if (sonho.trim() && valorSonho > 0 && userId) {
      const emojiPreset = sonhosPresets.find((p) => p.label === sonho.trim())?.emoji ?? "🎯";
      const supabase = getSupabaseBrowser();
      // Só insere se ainda não houver caixinha (evita duplicação se o user voltar)
      const { count } = await supabase
        .from("caixinhas")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      if (!count) {
        await supabase.from("caixinhas").insert({
          user_id: userId,
          nome: sonho.trim(),
          meta: valorSonho,
          atual: 0,
          emoji: emojiPreset,
          cor_class: "from-brand to-brand-bright",
        });
      }
    }

    await refresh();
    router.push("/carteira");
  }

  const canAdvance =
    (step === 0 && nome.trim().length > 1) ||
    (step === 1 && sonho.trim().length > 1 && valorSonho > 0) ||
    (step === 2 && situacao !== null) ||
    step === 3;

  return (
    <main className="relative min-h-dvh">
      <div className="pointer-events-none absolute inset-0 gradient-hero" />

      <header className="safe-top relative z-10 mx-auto w-full max-w-xl px-6 pt-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={back}
            className="press inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-text"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Logo variant="mark" className="h-9 w-9" />
          <ThemeToggle />
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full gradient-brand transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-right text-xs text-text-muted">Passo {step + 1} de 4</div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-xl px-6 pb-32 pt-8">
        <div key={step} className="animate-fade-in">
          {step === 0 && (
            <div>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
                Vamos começar do começo: <span className="text-gradient-brand">como você se chama?</span>
              </h1>
              <p className="mt-3 text-text-muted">
                Seu nome aparece pros colegas no feed. Pode usar como prefere ser chamado.
              </p>

              <div className="mt-8 flex flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="press group relative h-28 w-28 overflow-hidden rounded-full border-2 border-dashed border-border bg-surface-2 transition hover:border-brand"
                >
                  {fotoDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotoDataUrl} alt="Foto" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-text-muted">
                      <Camera className="h-7 w-7" />
                      <span className="mt-1 text-[11px]">Adicionar foto</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhoto}
                  />
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <Input
                  label="Seu nome"
                  placeholder="Ex: Otávio Foster"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoFocus
                />
                <Input
                  label="Empresa onde trabalha"
                  placeholder="Ex: Padaria do João"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  hint="Pode ser qualquer empresa. Você muda depois se precisar."
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
                Qual é o <span className="text-gradient-brand">sonho</span> que vai te puxar pra frente?
              </h1>
              <p className="mt-3 text-text-muted">
                Esse vira sua primeira caixinha. A gente calcula quanto e por quanto tempo guardar pra chegar lá.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {sonhosPresets.map((p) => {
                  const active = sonho === p.label;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        setSonho(p.label);
                        setValorSonho(p.value);
                      }}
                      className={cn(
                        "press flex items-center gap-3 rounded-2xl border bg-surface p-4 text-left transition",
                        active
                          ? "border-brand shadow-glow ring-2 ring-brand/20"
                          : "border-border hover:border-brand/30",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          active ? "bg-brand text-white" : "bg-brand-soft text-brand",
                        )}
                      >
                        {p.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-text">{p.label}</div>
                        <div className="text-xs text-text-muted">{formatBRL(p.value)}</div>
                      </div>
                      {active && <Check className="h-5 w-5 text-brand" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Nome do sonho"
                  placeholder="Ex: viagem em família"
                  value={sonho}
                  onChange={(e) => setSonho(e.target.value)}
                />
                <Input
                  label="Quanto custa? (R$)"
                  type="number"
                  inputMode="numeric"
                  placeholder="0"
                  value={valorSonho || ""}
                  onChange={(e) => setValorSonho(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
                Como anda sua <span className="text-gradient-brand">situação financeira</span> hoje?
              </h1>
              <p className="mt-3 text-text-muted">
                Sem julgamento, tá? A gente usa essa resposta pra personalizar a trilha e as sugestões.
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {situacoes.map((s) => {
                  const active = situacao === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSituacao(s.value)}
                      className={cn(
                        "press flex items-start gap-4 rounded-2xl border bg-surface p-4 text-left transition",
                        active
                          ? "border-brand shadow-glow ring-2 ring-brand/20"
                          : "border-border hover:border-brand/30",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                          active ? "bg-brand text-white" : "bg-brand-soft text-brand",
                        )}
                      >
                        {s.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-text">{s.label}</div>
                        <div className="mt-1 text-sm text-text-muted">{s.desc}</div>
                      </div>
                      {active && <Check className="mt-1 h-5 w-5 text-brand" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand text-white shadow-glow">
                <Sparkles className="h-9 w-9" />
              </div>
              <h1 className="text-balance text-4xl font-extrabold tracking-tight">
                Tudo pronto, <span className="text-gradient-brand">{nome.split(" ")[0] || "amigo"}!</span>
              </h1>
              <p className="mt-4 max-w-md text-balance text-text-muted">
                Sua jornada começa agora. Você vai encontrar três pontos de apoio dentro do FinUp:
              </p>

              <div className="mt-8 grid w-full grid-cols-1 gap-3">
                <ReadyItem title="Carteira" desc="Categorize gastos, monte caixinhas, veja quanto falta pro sonho." />
                <ReadyItem title="Trilha" desc="Aulas curtas com recompensa real ao concluir cada módulo." />
                <ReadyItem title="Feed" desc="Comemore com a galera e vire embaixador da educação financeira." />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* bottom CTA fixo */}
      <div className="fixed inset-x-0 bottom-0 z-20 safe-bottom border-t border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 px-6 py-4">
          {step > 0 && (
            <Button variant="secondary" size="lg" onClick={back}>
              Voltar
            </Button>
          )}
          {step < 3 ? (
            <Button size="lg" fullWidth disabled={!canAdvance} onClick={next}>
              Continuar <ArrowRight className="h-5 w-5" />
            </Button>
          ) : (
            <Button size="lg" fullWidth disabled={salvando} onClick={finalizar}>
              {salvando ? "Salvando..." : "Entrar no FinUp"} <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}

function ReadyItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 text-left">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
        <Check className="h-4 w-4" />
      </div>
      <div>
        <div className="font-semibold text-text">{title}</div>
        <div className="text-sm text-text-muted">{desc}</div>
      </div>
    </div>
  );
}
