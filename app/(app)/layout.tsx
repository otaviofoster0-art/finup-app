import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh pb-24">
      {children}
      <BottomNav />
    </div>
  );
}
