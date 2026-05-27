import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "gold";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "gradient-brand text-white shadow-soft hover:shadow-glow hover:brightness-110 active:brightness-95",
  secondary:
    "bg-surface text-text border border-border hover:border-brand/40 hover:bg-surface-2",
  ghost:
    "bg-transparent text-text hover:bg-surface-2",
  outline:
    "bg-transparent border border-brand text-brand hover:bg-brand/10",
  gold:
    "bg-gold text-[#3a2700] hover:brightness-105 active:brightness-95 shadow-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", fullWidth, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "press inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-spring disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
});
