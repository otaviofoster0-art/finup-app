"use client";

import { Bell } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "@/lib/hooks/use-session";

export function AppHeader({ title }: { title?: string }) {
  const { profile } = useSession();
  const primeiroNome = profile?.nome?.split(" ")[0];

  return (
    <header className="safe-top sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 px-5 py-3">
        <div className="flex items-center gap-3">
          <Logo variant="mark" className="h-9 w-9" />
          <div className="leading-tight">
            {title ? (
              <div className="text-lg font-bold text-text">{title}</div>
            ) : (
              <>
                <div className="text-[11px] uppercase tracking-wider text-text-muted">Olá,</div>
                <div className="text-sm font-semibold text-text">{primeiroNome ?? "tudo bem?"}</div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-muted hover:text-text"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-bright" />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
