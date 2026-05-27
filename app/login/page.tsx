"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, Building2, Lock, Mail, User } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/components/ui/toast";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Mode = "entrar" | "criar";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const next = params.get("next") || "/carteira";

  const [mode, setMode] = useState<Mode>("entrar");
  const [nome, setNome] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    const supabase = getSupabaseBrowser();

    try {
      if (mode === "criar") {
        if (nome.trim().length < 2) {
          setErro("Coloca seu nome completo.");
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: {
            data: {
              nome: nome.trim(),
              empresa: empresa.trim() || null,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        // Se confirmação de email estiver desligada, já tem sessão → vai direto
        if (data.session) {
          toast("Conta criada com sucesso!");
          router.push(next);
        } else {
          toast("Verifique seu email pra confirmar a conta.");
          setMode("entrar");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });
        if (error) throw error;
        toast("Bem-vindo de volta!");
        router.push(next);
      }
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Algo deu errado";
      setErro(traducaoErro(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-dvh">
      <div className="pointer-events-none absolute inset-0 gradient-hero" />
      <header className="safe-top relative z-10 mx-auto flex w-full max-w-md items-center justify-between px-6 pt-6">
        <Link
          href="/"
          className="press inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-text"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <ThemeToggle />
      </header>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-80px)] w-full max-w-md flex-col px-6 pb-10 pt-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo variant="mark" className="mb-4 h-14 w-14" />
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === "entrar" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            {mode === "entrar"
              ? "Entre com seu email e senha pra continuar."
              : "Comece sua jornada financeira em menos de 1 minuto."}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-surface-2 p-1">
          {(["entrar", "criar"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setErro(null);
              }}
              className={cn(
                "press rounded-xl py-2 text-sm font-semibold transition",
                mode === m ? "gradient-brand text-white shadow-soft" : "text-text-muted hover:text-text",
              )}
            >
              {m === "entrar" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "criar" && (
            <>
              <Input
                label="Seu nome"
                placeholder="Como gosta de ser chamado"
                leadingIcon={<User className="h-5 w-5" />}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                autoComplete="name"
              />
              <Input
                label="Empresa"
                placeholder="Onde você trabalha (opcional)"
                leadingIcon={<Building2 className="h-5 w-5" />}
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                autoComplete="organization"
              />
            </>
          )}

          <Input
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="voce@email.com"
            leadingIcon={<Mail className="h-5 w-5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Senha"
            type="password"
            autoComplete={mode === "entrar" ? "current-password" : "new-password"}
            placeholder="••••••••"
            leadingIcon={<Lock className="h-5 w-5" />}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            hint={mode === "criar" ? "Mínimo 6 caracteres" : undefined}
            minLength={6}
          />

          {erro && (
            <div className="rounded-2xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
              {erro}
            </div>
          )}

          <Button type="submit" size="lg" fullWidth disabled={loading}>
            {loading
              ? mode === "entrar"
                ? "Entrando..."
                : "Criando conta..."
              : mode === "entrar"
                ? "Entrar"
                : "Criar conta"}
          </Button>

          {mode === "entrar" && (
            <button
              type="button"
              onClick={() => esquecerSenha(email, toast)}
              className="text-center text-sm text-brand hover:underline"
            >
              Esqueci minha senha
            </button>
          )}
        </form>

        <div className="mt-auto pt-10 text-center text-xs text-text-muted">
          Ao criar a conta, você concorda com os{" "}
          <a href="#" className="text-brand hover:underline">
            termos de uso
          </a>{" "}
          do FinUp.
        </div>
      </div>
    </main>
  );
}

async function esquecerSenha(email: string, toast: (m: string) => void) {
  if (!email.trim()) {
    toast("Coloca seu email primeiro");
    return;
  }
  const supabase = getSupabaseBrowser();
  await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
  });
  toast("Se a conta existir, mandamos o link no email");
}

function traducaoErro(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "Email ou senha incorretos.";
  if (m.includes("already registered") || m.includes("already exists"))
    return "Esse email já tem conta. Tente entrar.";
  if (m.includes("password should be at least"))
    return "A senha precisa ter no mínimo 6 caracteres.";
  if (m.includes("email rate limit"))
    return "Muitas tentativas. Aguarde alguns minutos.";
  if (m.includes("user not found")) return "Conta não encontrada.";
  return msg;
}
