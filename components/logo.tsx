import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "mark" | "wordmark";
  className?: string;
  monochrome?: boolean;
};

/**
 * Logo FinUp.
 * - "mark" = só o símbolo (F + barras + seta).
 * - "wordmark" = símbolo + "FinUp" + tagline.
 *
 * Geometria desenhada pra bater com a arte original.
 */
export function Logo({ variant = "mark", className, monochrome = false }: LogoProps) {
  const fill = monochrome ? "currentColor" : undefined;

  if (variant === "wordmark") {
    return (
      <svg
        viewBox="0 0 520 280"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-14 w-auto", className)}
        aria-label="FinUp"
      >
        <defs>
          <linearGradient id="wm-mk" x1="20" y1="20" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0A2A6E" />
            <stop offset="0.5" stopColor="#1948C9" />
            <stop offset="1" stopColor="#2D7CFF" />
          </linearGradient>
          <linearGradient id="wm-arrow" x1="105" y1="180" x2="210" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2D7CFF" />
            <stop offset="1" stopColor="#8EBCFF" />
          </linearGradient>
          <linearGradient id="wm-text" x1="220" y1="80" x2="520" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0A2A6E" />
            <stop offset="1" stopColor="#1F62E3" />
          </linearGradient>
        </defs>

        {/* símbolo */}
        <g>
          <path
            d="M 30 32 Q 30 28 34 28 L 130 28 Q 134 28 134 32 L 134 52 Q 134 56 130 56 L 60 56 L 60 96 L 108 96 Q 112 96 112 100 L 112 118 Q 112 122 108 122 L 60 122 L 60 188 Q 60 192 56 192 L 34 192 Q 30 192 30 188 Z"
            fill={fill ?? "url(#wm-mk)"}
          />
          <rect x="120" y="148" width="18" height="44" rx="5" fill={fill ?? "url(#wm-mk)"} />
          <rect x="146" y="118" width="18" height="74" rx="5" fill={fill ?? "url(#wm-mk)"} />
          <rect x="172" y="86" width="18" height="106" rx="5" fill={fill ?? "url(#wm-mk)"} />
          <line
            x1="118"
            y1="170"
            x2="180"
            y2="62"
            stroke={fill ?? "url(#wm-arrow)"}
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path d="M 196 48 L 158 48 L 196 86 Z" fill={fill ?? "url(#wm-arrow)"} />
        </g>

        {/* wordmark FinUp */}
        <text
          x="240"
          y="148"
          fontSize="96"
          fontWeight="900"
          fill={fill ?? "url(#wm-text)"}
          letterSpacing="-4"
          fontFamily="Inter, 'Segoe UI', system-ui, sans-serif"
        >
          FinUp
        </text>

        {/* tagline com linhas laterais */}
        <line x1="230" y1="200" x2="260" y2="200" stroke={fill ?? "#1948C9"} strokeWidth="1.5" />
        <line x1="478" y1="200" x2="508" y2="200" stroke={fill ?? "#1948C9"} strokeWidth="1.5" />
        <text
          x="369"
          y="206"
          fontSize="13"
          fontWeight="700"
          fill={fill ?? "#1948C9"}
          letterSpacing="3"
          textAnchor="middle"
          fontFamily="Inter, 'Segoe UI', system-ui, sans-serif"
        >
          EDUCAÇÃO FINANCEIRA
        </text>
        <text
          x="369"
          y="232"
          fontSize="13"
          fontWeight="700"
          fill={fill ?? "#1948C9"}
          letterSpacing="3"
          textAnchor="middle"
          fontFamily="Inter, 'Segoe UI', system-ui, sans-serif"
        >
          QUE TRANSFORMA FUTUROS
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-10", className)}
      aria-label="FinUp"
    >
      <defs>
        <linearGradient id="mk-grad-c" x1="20" y1="20" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0A2A6E" />
          <stop offset="0.5" stopColor="#1948C9" />
          <stop offset="1" stopColor="#2D7CFF" />
        </linearGradient>
        <linearGradient id="mk-arrow-c" x1="105" y1="180" x2="210" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2D7CFF" />
          <stop offset="1" stopColor="#8EBCFF" />
        </linearGradient>
      </defs>
      <path
        d="M 30 32 Q 30 28 34 28 L 130 28 Q 134 28 134 32 L 134 52 Q 134 56 130 56 L 60 56 L 60 96 L 108 96 Q 112 96 112 100 L 112 118 Q 112 122 108 122 L 60 122 L 60 188 Q 60 192 56 192 L 34 192 Q 30 192 30 188 Z"
        fill={fill ?? "url(#mk-grad-c)"}
      />
      <rect x="120" y="148" width="18" height="44" rx="5" fill={fill ?? "url(#mk-grad-c)"} />
      <rect x="146" y="118" width="18" height="74" rx="5" fill={fill ?? "url(#mk-grad-c)"} />
      <rect x="172" y="86" width="18" height="106" rx="5" fill={fill ?? "url(#mk-grad-c)"} />
      <line
        x1="118"
        y1="170"
        x2="180"
        y2="62"
        stroke={fill ?? "url(#mk-arrow-c)"}
        strokeWidth="13"
        strokeLinecap="round"
      />
      <path d="M 196 48 L 158 48 L 196 86 Z" fill={fill ?? "url(#mk-arrow-c)"} />
    </svg>
  );
}
