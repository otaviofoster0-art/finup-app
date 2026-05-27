import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * Callback de autenticação:
 *  - confirmação de email (?code=...)
 *  - recovery de senha (?type=recovery)
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

  // Pra recovery, redireciona pra uma página de troca de senha futura. Por enquanto, /perfil.
  if (type === "recovery") {
    return NextResponse.redirect(new URL("/perfil?recovery=1", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
