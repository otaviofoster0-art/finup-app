"use client";

import { getSupabaseBrowser } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

export type UserSession = {
  userId: string;
  nome: string;
  email: string;
  empresa: string | null;
  cargo: string | null;
  bio: string | null;
  sonho: string | null;
  valorSonho: number | null;
  fotoUrl: string | null;
  onboardingCompleto: boolean;
};

/**
 * Carrega o profile do usuário atual (server-side ou client-side).
 * Retorna null se não estiver logado.
 */
export async function getCurrentSession(): Promise<UserSession | null> {
  const supabase = getSupabaseBrowser();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!data) return null;
  return profileToSession(data as Profile);
}

export function profileToSession(p: Profile): UserSession {
  return {
    userId: p.id,
    nome: p.nome,
    email: p.email ?? "",
    empresa: p.empresa,
    cargo: p.cargo,
    bio: p.bio,
    sonho: p.sonho,
    valorSonho: p.valor_sonho == null ? null : Number(p.valor_sonho),
    fotoUrl: p.foto_url,
    onboardingCompleto: p.onboarding_completo,
  };
}

export async function updateProfile(patch: Partial<Profile>) {
  const supabase = getSupabaseBrowser();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("profiles").update(patch).eq("id", user.id);
}

export async function signOut() {
  const supabase = getSupabaseBrowser();
  await supabase.auth.signOut();
}
