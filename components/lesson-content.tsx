import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConteudoBloco } from "@/lib/lessons";

export function LessonContent({ blocos }: { blocos: ConteudoBloco[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocos.map((b, i) => (
        <Bloco key={i} b={b} />
      ))}
    </div>
  );
}

function Bloco({ b }: { b: ConteudoBloco }) {
  if (b.tipo === "titulo") {
    return (
      <h4 className="mt-2 text-base font-bold tracking-tight text-text">{b.texto}</h4>
    );
  }

  if (b.tipo === "paragrafo") {
    return (
      <p className="whitespace-pre-line text-[15px] leading-relaxed text-text">{b.texto}</p>
    );
  }

  if (b.tipo === "lista") {
    return (
      <ul className="flex flex-col gap-2 pl-1">
        {b.items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-[15px] leading-relaxed text-text">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <span dangerouslySetInnerHTML={{ __html: escapeAndBold(it) }} />
          </li>
        ))}
      </ul>
    );
  }

  if (b.tipo === "numero") {
    return (
      <div className="my-1 flex items-center gap-4 rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-soft to-accent-soft p-4">
        <div className="text-3xl font-extrabold tracking-tight text-gradient-brand">{b.valor}</div>
        <div className="flex-1 text-[13px] leading-tight text-text">{b.legenda}</div>
      </div>
    );
  }

  if (b.tipo === "destaque") {
    const intent = b.intent ?? "info";
    const styles = {
      info: {
        wrap: "border-brand/25 bg-brand-soft",
        icon: "text-brand",
        Icon: Info,
      },
      alerta: {
        wrap: "border-danger/30 bg-danger/10",
        icon: "text-danger",
        Icon: AlertTriangle,
      },
      exemplo: {
        wrap: "border-gold/30 bg-gold-soft",
        icon: "text-gold",
        Icon: Lightbulb,
      },
    }[intent];

    const Icon = styles.Icon;
    return (
      <div className={cn("flex items-start gap-3 rounded-2xl border p-4", styles.wrap)}>
        <div className={cn("mt-0.5", styles.icon)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          {b.titulo && <div className="mb-1 text-sm font-bold text-text">{b.titulo}</div>}
          <div
            className="whitespace-pre-line text-[14px] leading-relaxed text-text"
            dangerouslySetInnerHTML={{ __html: escapeAndBold(b.texto) }}
          />
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Mini-parser de Markdown: troca **negrito** por <strong>, escapa < e >.
 */
function escapeAndBold(s: string) {
  const escaped = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
