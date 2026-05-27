import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-2xl", className)} />;
}

/** Shell esqueleto: header + hero + 2 cards. Usado durante checagem de sessão. */
export function AppShellSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl animate-fade-in px-5 pb-24 pt-3">
      {/* header */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* hero */}
      <Skeleton className="mt-3 h-40 w-full rounded-3xl" />

      {/* cards */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Skeleton className="h-12 w-full rounded-full" />
        <Skeleton className="h-12 w-full rounded-full" />
      </div>

      <div className="mt-6 space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    </div>
  );
}
