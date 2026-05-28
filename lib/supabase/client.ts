"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Cliente Supabase no navegador (singleton).
 * Usa cookies via @supabase/ssr — compatível com server actions.
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias. Veja .env.example.",
    );
  }
  _client = createBrowserClient(url, key, {
    auth: {
      // Processa tokens vindos no hash fragment (#access_token=...) automaticamente.
      // Crítico pro fluxo de recovery, que o Supabase entrega via hash.
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return _client;
}
