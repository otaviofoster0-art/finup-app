"use client";

import { CheckCircle2 } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type Toast = { id: string; mensagem: string; intent?: "success" | "info" };

type ToastCtx = (mensagem: string, intent?: "success" | "info") => void;

const Ctx = createContext<ToastCtx>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback<ToastCtx>((mensagem, intent = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((ts) => [...ts, { id, mensagem, intent }]);
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 2800);
  }, []);

  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4 safe-top">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-brand/30 bg-surface/95 px-4 py-2.5 text-sm font-medium text-text shadow-glow backdrop-blur animate-scale-in"
          >
            <CheckCircle2 className="h-4 w-4 text-brand" />
            {t.mensagem}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  return useContext(Ctx);
}
