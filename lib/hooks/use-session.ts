"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

export type SessionState = {
  userId: string | null;
  profile: Profile | null;
  loading: boolean;
};

/**
 * Hook de sessão: busca o user e o profile dele.
 * Recarrega a página quando o estado de auth muda (login/logout em outra aba etc).
 */
export function useSession(): SessionState & { refresh: () => Promise<void>; signOut: () => Promise<void> } {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const supabase = getSupabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setUserId(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    setUserId(user.id);
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    setProfile(data ?? null);
    setLoading(false);
  }

  async function signOut() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    setUserId(null);
    setProfile(null);
    router.push("/");
    router.refresh();
  }

  useEffect(() => {
    refresh();
    const supabase = getSupabaseBrowser();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { userId, profile, loading, refresh, signOut };
}
