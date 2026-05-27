"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Camera,
  ChevronRight,
  Edit2,
  Layers,
  LogOut,
  Moon,
  Sparkles,
  Sun,
  Target,
  Trophy,
  Building2,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { SessionGate } from "@/components/session-gate";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { useTransacoes } from "@/lib/hooks/use-transacoes";
import { useCaixinhas } from "@/lib/hooks/use-caixinhas";
import { usePosts } from "@/lib/hooks/use-posts";
import { useSession } from "@/lib/hooks/use-session";
import { updateProfile, type UserSession } from "@/lib/session";
import { cn, formatBRL } from "@/lib/utils";

export default function PerfilPage() {
  return <SessionGate>{(s) => <PerfilInner session={s} />}</SessionGate>;
}

function PerfilInner({ session }: { session: UserSession }) {
  const router = useRouter();
  const toast = useToast();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { signOut, refresh: refreshSession } = useSession();
  const { transacoes } = useTransacoes();
  const { caixinhas } = useCaixinhas();
  const { posts } = usePosts();

  const meusPosts = posts.filter((p) => p.user_id === session.userId).length;

  const [editing, setEditing] = useState(false);
  const [nome, setNome] = useState(session.nome);
  const [bio, setBio] = useState(session.bio ?? "");
  const [empresa, setEmpresa] = useState(session.empresa ?? "");
  const [sonho, setSonho] = useState(session.sonho ?? "");
  const [fotoDataUrl, setFotoDataUrl] = useState<string | null>(session.fotoUrl ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  const iniciais = nome
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0] ?? "")
    .join("")
    .toUpperCase() || "U";

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFotoDataUrl(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  }

  async function salvar() {
    await updateProfile({
      nome,
      bio,
      empresa: empresa || null,
      sonho: sonho || null,
      foto_url: fotoDataUrl,
    });
    await refreshSession();
    setEditing(false);
    toast("Perfil atualizado");
  }

  async function sair() {
    await signOut();
    router.push("/");
  }

  const isDark = mounted ? (resolvedTheme ?? theme) === "dark" : true;

  return (
    <>
      <AppHeader title="Perfil" />
      <main className="mx-auto w-full max-w-xl px-5 pb-10 pt-4">
        {/* Card de identidade */}
        <div className="relative overflow-hidden rounded-3xl gradient-brand p-6 text-white shadow-glow animate-spring-in">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 flex items-center gap-4">
            <button
              onClick={() => editing && fileRef.current?.click()}
              className={cn(
                "press relative h-20 w-20 overflow-hidden rounded-full border-4 border-white/30",
                editing && "hover:border-white",
              )}
              disabled={!editing}
            >
              {fotoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fotoDataUrl} alt="Foto" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/15 text-2xl font-bold">
                  {iniciais}
                </div>
              )}
              {editing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Camera className="h-6 w-6" />
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </button>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Membro FinUp
              </div>
              {editing ? (
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-white/15 px-3 py-1 text-xl font-bold text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              ) : (
                <div className="mt-1 text-2xl font-extrabold leading-tight">{nome}</div>
              )}
              <div className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                <Building2 className="h-4 w-4" />
                {editing ? (
                  <input
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    placeholder="Sua empresa"
                    className="flex-1 rounded bg-white/15 px-2 py-0.5 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                ) : (
                  empresa || "Sem empresa"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio + sonho */}
        <Card className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">Sobre você</h3>
            <button
              onClick={() => (editing ? salvar() : setEditing(true))}
              className="press inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              {editing ? "Salvar" : "Editar"}
              {!editing && <Edit2 className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-text-muted">Bio</label>
              {editing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conta um pouco sobre você..."
                  rows={2}
                  className="mt-1 w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
                />
              ) : (
                <p className="mt-1 text-sm text-text">
                  {bio || <span className="italic text-text-muted">Sem bio ainda. Toque em editar.</span>}
                </p>
              )}
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-brand-soft p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand text-white">
                <Target className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-dark">
                  Sonho atual
                </div>
                {editing ? (
                  <Input
                    value={sonho}
                    onChange={(e) => setSonho(e.target.value)}
                    placeholder="Ex: viagem em família"
                    className="mt-1 bg-white"
                  />
                ) : (
                  <div className="mt-1 text-base font-bold text-text">
                    {sonho || "Defina um sonho"}
                  </div>
                )}
                {session.valorSonho && !editing && (
                  <div className="mt-0.5 text-xs text-text-muted">Meta: {formatBRL(session.valorSonho)}</div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Estatísticas */}
        <Card className="mt-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">Sua atividade no FinUp</h3>
          <div className="mt-3 grid grid-cols-3 gap-3 stagger text-center">
            <Stat icon={<Trophy className="h-5 w-5" />} value={<AnimatedNumber value={transacoes.length} />} label="lançamentos" />
            <Stat icon={<Target className="h-5 w-5" />} value={<AnimatedNumber value={caixinhas.length} />} label="caixinhas" />
            <Stat icon={<Sparkles className="h-5 w-5" />} value={<AnimatedNumber value={meusPosts} />} label="posts" />
          </div>
        </Card>

        {/* Configurações */}
        <Card className="mt-4 p-2">
          <SettingRow
            icon={isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            label="Tema"
            sub={isDark ? "Escuro" : "Claro"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          />
          <Link href="/perfil/categorias">
            <SettingRow
              icon={<Layers className="h-5 w-5" />}
              label="Categorias"
              sub="Personalize suas receitas e despesas"
            />
          </Link>
          <SettingRow
            icon={<LogOut className="h-5 w-5 text-danger" />}
            label="Sair"
            danger
            onClick={sair}
          />
        </Card>

        <div className="mt-6 text-center text-xs text-text-muted">
          FinUp · v0.1 · {session.email}
        </div>
      </main>
    </>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="animate-fade-in-up rounded-2xl bg-surface-2 p-3 transition-shadow hover:shadow-soft">
      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white">
        {icon}
      </div>
      <div className="text-xl font-extrabold leading-none text-text tabular-nums">{value}</div>
      <div className="mt-1 text-[11px] leading-tight text-text-muted">{label}</div>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  sub,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "press flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors duration-200 hover:bg-surface-2",
        danger && "hover:bg-danger/10",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
          danger ? "bg-danger/10" : "bg-brand-soft text-brand",
        )}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className={cn("text-sm font-semibold", danger ? "text-danger" : "text-text")}>{label}</div>
        {sub && <div className="text-xs text-text-muted">{sub}</div>}
      </div>
      {!danger && <ChevronRight className="h-5 w-5 text-text-muted" />}
    </button>
  );
}
