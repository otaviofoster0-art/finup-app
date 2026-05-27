import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, leadingIcon, id, ...props },
  ref,
) {
  const inputId = id ?? props.name ?? label;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="pointer-events-none absolute left-4 text-text-muted">{leadingIcon}</span>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "h-12 w-full rounded-2xl border border-border bg-surface px-4 text-[15px] text-text placeholder:text-text-muted/70 transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15",
            leadingIcon && "pl-11",
            error && "border-danger focus:border-danger focus:ring-danger/15",
            className,
          )}
          {...props}
        />
      </div>
      {(hint || error) && (
        <p className={cn("text-xs", error ? "text-danger" : "text-text-muted")}>{error ?? hint}</p>
      )}
    </div>
  );
});
