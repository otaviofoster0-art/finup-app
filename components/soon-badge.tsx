import { Sparkles } from "lucide-react";

export function SoonBadge({ label = "Em construção" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold">
      <Sparkles className="h-3 w-3" />
      {label}
    </span>
  );
}
