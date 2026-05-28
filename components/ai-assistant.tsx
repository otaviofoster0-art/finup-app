"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const SUGESTOES = [
  "Tenho R$ 500 sobrando. Onde guardar?",
  "Vale a pena quitar o cartão à vista?",
  "Como começar a investir do zero?",
  "Estou com dívida no nubank. O que faço?",
];

const SAUDACAO = `Oi! Sou o assistente do FinUp 👋

Posso te ajudar com:
- **Organizar suas finanças** (orçamento, caixinhas, prioridades)
- **Tirar dúvidas das aulas** da Trilha
- **Decisões do dia a dia** (quitar dívida, começar a investir, etc)

Sempre **conservador** — nunca vou te mandar apostar ou tomar dívida pra investir.

O que tá te tirando o sono hoje? 💭`;

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: SAUDACAO },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // auto-scroll pro fim quando nova msg chega
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // foca o input quando abre
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  // ESC fecha
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Bloqueia scroll do body quando aberto
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function enviar(texto: string) {
    const msg = texto.trim();
    if (!msg || loading) return;
    setErro(null);
    const next: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Erro ao chamar o assistente");
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      }
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro de rede");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    enviar(input);
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar(input);
    }
  }

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir assistente financeiro"
        className={cn(
          "press fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-glow transition-transform safe-bottom",
          "gradient-brand hover:scale-110",
          open && "pointer-events-none opacity-0",
        )}
      >
        <Bot className="h-7 w-7" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-extrabold text-[#3a2700] ring-2 ring-bg">
          AI
        </span>
      </button>

      {/* Modal de chat */}
      {open && (
        <div className="fixed inset-0 z-40 h-[100dvh] w-screen overflow-hidden">
          <button
            aria-label="Fechar"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in"
          />
          <div className="pointer-events-none absolute inset-0 flex h-full w-full items-end sm:items-center sm:justify-center">
            <div className="pointer-events-auto relative flex h-[88dvh] w-full max-w-xl flex-col overflow-hidden border border-border bg-surface shadow-soft animate-scale-in sm:h-[80dvh] sm:rounded-3xl sm:mx-3 rounded-t-3xl safe-bottom">
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full gradient-brand text-white shadow-soft">
                    <Bot className="h-5 w-5" />
                    <span className="absolute inset-0 animate-pulse-soft rounded-full bg-brand/30" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text">FinUp Assistente</div>
                    <div className="text-[11px] text-text-muted">
                      Educação financeira conservadora · IA
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="press inline-flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-surface-2 hover:text-text"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Lista de mensagens */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
              >
                <div className="flex flex-col gap-3">
                  {messages.map((m, i) => (
                    <MessageBubble key={i} role={m.role} content={m.content} />
                  ))}
                  {loading && <Typing />}
                </div>
              </div>

              {/* Sugestões (só na 1ª msg) */}
              {messages.length === 1 && !loading && (
                <div className="border-t border-border px-4 py-3">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Pra começar
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGESTOES.map((s) => (
                      <button
                        key={s}
                        onClick={() => enviar(s)}
                        disabled={loading}
                        className="press rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted hover:border-brand/40 hover:text-text"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Erro */}
              {erro && (
                <div className="border-t border-danger/30 bg-danger/10 px-4 py-2.5 text-xs text-danger">
                  {erro}
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="flex shrink-0 items-end gap-2 border-t border-border bg-surface px-3 py-3"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Pergunte sobre dinheiro..."
                  rows={1}
                  maxLength={1000}
                  disabled={loading}
                  className="max-h-40 min-h-[44px] flex-1 resize-none rounded-2xl border border-border bg-surface-2 px-4 py-2.5 text-[15px] text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="press inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full gradient-brand text-white shadow-soft disabled:opacity-50"
                  aria-label="Enviar"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>

              {/* Disclaimer */}
              <div className="shrink-0 border-t border-border bg-surface-2/50 px-4 py-2 text-center text-[10px] text-text-muted">
                <Sparkles className="mr-1 inline h-3 w-3" />
                Conteúdo educacional. Pra decisões de investimento que valem muito, consulte um assessor certificado.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex w-full animate-fade-in-up", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-brand text-white">
          <Bot className="h-3.5 w-3.5" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
          isUser
            ? "bg-brand text-white"
            : "bg-surface-2 text-text",
        )}
        dangerouslySetInnerHTML={{ __html: formatMessage(content) }}
      />
    </div>
  );
}

function Typing() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-brand text-white">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="rounded-2xl bg-surface-2 px-4 py-3">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-text-muted" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 animate-pulse rounded-full bg-text-muted" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 animate-pulse rounded-full bg-text-muted" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Mini formatador de markdown: **negrito** → <strong>.
 * Escapa < > & primeiro pra evitar XSS.
 */
function formatMessage(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
