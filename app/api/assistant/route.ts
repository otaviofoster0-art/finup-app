import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { FINUP_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Assistente offline: a variável ANTHROPIC_API_KEY não está configurada. Adicione no Vercel → Settings → Environment Variables.",
      },
      { status: 503 },
    );
  }

  // Garante que só usuários autenticados chamam (evita abuso da API key)
  const supabase = getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as { messages?: ChatMessage[] } | null;
  if (!body?.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "Mensagens inválidas" }, { status: 400 });
  }

  // Validação básica
  const messages = body.messages
    .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: m.content.slice(0, 4000),
    }))
    .slice(-12); // só últimas 12 mensagens pra não exagerar

  // Contexto do usuário pra personalizar
  const [{ data: profile }, { data: progress }, { data: transacoes }] = await Promise.all([
    supabase.from("profiles").select("nome,empresa,sonho,valor_sonho,situacao,onboarding_completo").eq("id", user.id).maybeSingle(),
    supabase.from("lesson_progress").select("modulo_id,licao_id,concluida,xp_ganho").eq("user_id", user.id),
    supabase.from("transactions").select("tipo,valor,categoria_id,data").eq("user_id", user.id).order("data", { ascending: false }).limit(30),
  ]);

  const xp = (progress ?? []).reduce((a, b) => a + (b.xp_ganho ?? 0), 0);
  const concluidas = (progress ?? []).filter((p) => p.concluida).length;

  const userContext = `# Contexto do usuário (use pra personalizar, NÃO mencione literalmente)
Nome: ${profile?.nome ?? "desconhecido"}
Empresa: ${profile?.empresa ?? "não informada"}
Sonho atual: ${profile?.sonho ?? "ainda não definiu"}${profile?.valor_sonho ? ` (meta R$ ${profile.valor_sonho})` : ""}
XP total na Trilha: ${xp}
Lições concluídas: ${concluidas}
Últimas ${transacoes?.length ?? 0} transações: ${transacoes && transacoes.length > 0 ? JSON.stringify(transacoes) : "nenhuma"}
`;

  const anthropic = new Anthropic({ apiKey });

  try {
    const completion = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: FINUP_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" }, // cache prompt pra economizar
        },
        {
          type: "text",
          text: userContext,
        },
      ],
      messages,
    });

    const textBlock = completion.content.find((c) => c.type === "text");
    const reply = textBlock && textBlock.type === "text" ? textBlock.text : "";

    return NextResponse.json({ reply });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    console.error("[assistant] ", msg);
    return NextResponse.json(
      { error: "O assistente teve um problema. Tente de novo em instantes." },
      { status: 500 },
    );
  }
}
