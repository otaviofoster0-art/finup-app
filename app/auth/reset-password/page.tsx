"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, Lock } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/components/ui/toast";
import { getSupabaseBrowser } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const toast = useToast();

  // estado: checando sessão temporária do recovery
  const [estado, setEstado] = useState<"verificando" | "pronto" | "invalido" | "salvo">("verificando");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowser();
      // Depois do exchangeCodeForSession no /auth/callback, deve haver uma sessão válida
      const { data: { session } } = await supabase.auth.getSession();
      setEstado(session ? "pronto" : "invalido");
    })();
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (senha.length < 6) {
      setErro("A senha precisa ter ao menos 6 caracteres.");
      return;
    }
    if (senha !== senha2) {
      setErro("As senhas não batem.");
      return;
    }

    setSalvando(true);
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.updateUser({ password: senha });
    setSalvando(false);

    if (error) {
      setErro(error.message);
      return;
    }

    setEstado("salvo");
    toast("Senha atualizada!");
    setTimeout(() => router.push("/carteira"), 1200);
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
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo variant="mark" className="mb-4 h-14 w-14" />
          <h1 className="text-3xl font-bold tracking-tight">Redefinir senha</h1>
          <p className="mt-2 text-sm text-text-muted">
            Crie uma nova senha pra continuar.
          </p>
        </div>

        {estado === "verificando" && (
          <div className="flex flex-col items-center gap-3 py-10 text-sm text-text-muted">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
            Verificando seu link...
          </div>
        )}

        {estado === "invalido" && (
          <div className="rounded-2xl border border-danger/30 bg-danger/10 p-5 text-sm text-text">
            <div className="flex items-start gap-3">
              <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
              <div>
                <div className="font-semibold text-danger">Link inválido ou expirado.</div>
                <p className="mt-1 text-text-muted">
                  Volte pra tela de login e peça um novo email de recuperação.
                </p>
                <Link href="/login" className="mt-3 inline-block font-semibold text-brand hover:underline">
                  Ir pra tela de login
                </Link>
              </div>
            </div>
          </div>
        )}

        {estado === "pronto" && (
          <form onSubmit={salvar} className="flex flex-col gap-4">
            <Input
              label="Nova senha"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              leadingIcon={<Lock className="h-5 w-5" />}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={6}
              hint="Mínimo 6 caracteres"
              autoFocus
            />
            <Input
              label="Confirmar nova senha"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              leadingIcon={<Lock className="h-5 w-5" />}
              value={senha2}
              onChange={(e) => setSenha2(e.target.value)}
              required
              minLength={6}
            />

            {erro && (
              <div className="rounded-2xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                {erro}
              </div>
            )}

            <Button type="submit" size="lg" fullWidth disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar nova senha"}
            </Button>
          </form>
        )}

        {estado === "salvo" && (
          <div className="rounded-2xl border border-success/30 bg-success/10 p-5 text-sm text-text">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-success" />
              <div>
                <div className="font-semibold text-success">Senha atualizada com sucesso!</div>
                <p className="mt-1 text-text-muted">Te levando pro app em instantes...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
