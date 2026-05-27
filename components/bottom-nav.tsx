"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { Wallet, GraduationCap, Users, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/carteira", label: "Carteira", Icon: Wallet },
  { href: "/trilha", label: "Trilha", Icon: GraduationCap },
  { href: "/feed", label: "Feed", Icon: Users },
  { href: "/perfil", label: "Perfil", Icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();
  const activeIdx = Math.max(0, tabs.findIndex((t) => pathname?.startsWith(t.href)));

  // Indicador deslizante: medimos a posição/tamanho do item ativo
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  });

  useLayoutEffect(() => {
    const el = refs.current[activeIdx];
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const elRect = el.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    setIndicator({
      left: elRect.left - parentRect.left,
      width: elRect.width,
      ready: true,
    });
  }, [activeIdx, pathname]);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 safe-bottom border-t border-border bg-surface/85 backdrop-blur-md">
      <ul className="relative mx-auto flex w-full max-w-xl items-stretch justify-around px-2">
        {/* indicador deslizante */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-1.5 h-[3px] rounded-full bg-brand transition-all duration-500 ease-spring",
            indicator.ready ? "opacity-100" : "opacity-0",
          )}
          style={{
            left: indicator.left + indicator.width / 2 - 14,
            width: 28,
          }}
        />

        {tabs.map(({ href, label, Icon }, i) => {
          const active = i === activeIdx;
          return (
            <li key={href} ref={(el) => { refs.current[i] = el; }} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "press relative flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition-colors duration-300",
                  active ? "text-brand" : "text-text-muted hover:text-text",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-12 items-center justify-center rounded-full transition-all duration-300 ease-spring",
                    active ? "bg-brand-soft scale-100" : "scale-95",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-300 ease-spring",
                      active && "scale-110",
                    )}
                  />
                </span>
                <span className={cn("transition-colors", active && "font-semibold")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
