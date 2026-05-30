import Link from "next/link";
import { ArrowRight, BarChart3, GraduationCap, Users, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function WelcomePage() {
  return (
    <main className="relative min-h-dvh overflow-hidden">
      {/* gradient hero background */}
      <div className="pointer-events-none absolute inset-0 gradient-hero" />

      {/* topo */}
      <header className="safe-top relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6">
        <Logo variant="mark" className="h-10 w-10" />
        <ThemeToggle />
      </header>

      {/* hero */}
      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-12 pt-12 text-center md:pt-20">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-medium text-brand">
          <Sparkles className="h-3.5 w-3.5" />
          Educação financeira que vira hábito
        </span>

        <h1 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
          <span className="text-gradient-brand">Transforme seu futuro</span>
          <br />
          financeiro.
        </h1>

        <p className="mt-6 max-w-xl text-balance text-base text-text-muted md:text-lg">
          Organize seu dinheiro, aprenda no seu ritmo com lições curtas estilo
          Duolingo e comemore cada conquista com a comunidade.
        </p>

        <div className="mt-10 flex w-full max-w-sm flex-col gap-3 sm:max-w-md sm:flex-row">
          <Link href="/onboarding" className="flex-1">
            <Button size="lg" fullWidth>
              Começar agora <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login" className="flex-1">
            <Button size="lg" variant="secondary" fullWidth>
              Já tenho conta
            </Button>
          </Link>
        </div>

        {/* features */}
        <div className="stagger mt-20 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Carteira inteligente"
            desc="Categorize receitas e despesas, crie caixinhas de objetivo e veja em quanto tempo chega no seu sonho."
          />
          <FeatureCard
            icon={<GraduationCap className="h-6 w-6" />}
            title="Trilha do conhecimento"
            desc="Aulas curtas estilo Duolingo: XP, streak, vidas e provas pra pular o que você já sabe."
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Comunidade FinUp"
            desc="Feed pra trocar ideias, ranking global e badges. Aprenda junto com quem está nessa também."
          />
        </div>
      </section>

      <footer className="relative z-10 pb-8 text-center text-xs text-text-muted">
        FinUp · Educação financeira que transforma futuros
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="press-sm group animate-fade-in-up rounded-3xl border border-border bg-surface/80 p-6 text-left shadow-soft backdrop-blur transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-brand/30 hover:shadow-glow">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-transform duration-300 ease-spring group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <h3 className="mb-1.5 text-lg font-semibold text-text">{title}</h3>
      <p className="text-sm text-text-muted">{desc}</p>
    </div>
  );
}
