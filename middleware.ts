import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match em tudo exceto arquivos estáticos e rotas /api.
     * /api/* faz auth internamente quando precisa (ex: /api/assistant).
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.webp$).*)",
  ],
};
