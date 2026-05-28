import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * Callback de autenticação. Trata 3 cenários:
 *   1) ?code=...      → confirmação de email no signup, troca por sessão
 *   2) ?type=recovery → veio do "esqueci senha", manda pra /auth/reset-password
 *   3) padrão         → manda pra /carteira (ou ?next=...)
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next") ?? "/carteira";

  if (code) {
    const supabase = getSupabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (type === "recovery") {
    return NextResponse.redirect(new URL("/auth/reset-password", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
