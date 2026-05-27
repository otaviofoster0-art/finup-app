"use client";

type Slice = { id: string; valor: number; cor: string };

/**
 * Donut chart SVG (sem dependência externa). Recebe fatias com `cor` em formato
 * CSS válido (ex: "hsl(var(--brand))" ou "#1948C9").
 */
export function Donut({
  slices,
  size = 180,
  thickness = 26,
  center,
}: {
  slices: Slice[];
  size?: number;
  thickness?: number;
  center?: React.ReactNode;
}) {
  const total = slices.reduce((a, b) => a + b.valor, 0);
  const r = size / 2 - thickness / 2;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={c} cy={c} r={r} stroke="hsl(var(--surface-2))" strokeWidth={thickness} fill="none" />
        {total > 0 &&
          slices.map((s) => {
            const len = (s.valor / total) * circumference;
            const seg = (
              <circle
                key={s.id}
                cx={c}
                cy={c}
                r={r}
                stroke={s.cor}
                strokeWidth={thickness}
                strokeLinecap="butt"
                fill="none"
                strokeDasharray={`${len} ${circumference - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return seg;
          })}
      </svg>
      {center && (
        <div className="absolute inset-0 flex items-center justify-center text-center">{center}</div>
      )}
    </div>
  );
}
