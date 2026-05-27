"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/hooks/use-session";
import { profileToSession, type UserSession } from "@/lib/session";
import { AppShellSkeleton } from "@/components/skeletons";

export function SessionGate({ children }: { children: (session: UserSession) => React.ReactNode }) {
  const router = useRouter();
  const { profile, userId, loading } = useSession();

  useEffect(() => {
    if (loading) return;
    if (!userId) {
      router.replace("/login");
      return;
    }
    if (profile && !profile.onboarding_completo) {
      router.replace("/onboarding");
    }
  }, [loading, userId, profile, router]);

  if (loading || !profile) {
    return <AppShellSkeleton />;
  }

  return <div className="animate-fade-in-up">{children(profileToSession(profile))}</div>;
}
