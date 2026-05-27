"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = (mounted ? resolvedTheme ?? theme : "dark") === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-muted transition hover:text-text hover:border-brand/40",
        className,
      )}
    >
      <Sun className={cn("h-5 w-5 transition", isDark ? "scale-0 opacity-0" : "scale-100 opacity-100")} />
      <Moon className={cn("absolute h-5 w-5 transition", isDark ? "scale-100 opacity-100" : "scale-0 opacity-0")} />
    </button>
  );
}
