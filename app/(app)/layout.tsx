import type { ReactNode } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { AIAssistant } from "@/components/ai-assistant";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh pb-24">
      {children}
      <AIAssistant />
      <BottomNav />
    </div>
  );
}
