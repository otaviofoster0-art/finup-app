/**
 * Assistente financeiro 100% local — roda no navegador, sem API.
 *
 * Motor de regras: cada "intent" tem palavras-chave e uma resposta.
 * Damos um score por interseção de palavras e devolvemos a melhor.
 * Sempre conservador: nunca recomenda aposta, dívida pra investir, etc.
 */

export type LocalContext = {
  nome?: string;
  xp?: number;
  licoesConcluidas?: number;
  sonho?: string | null;
};

type Intent = {
  id: string;
  /** palavras/expressões que ativam essa resposta (já sem acento, minúsculas) */
  keywords: string[];
  /** peso opcional pra desempate (default 1) */
  peso?: number;
  responder: (ctx: LocalContext, pergunta: string) => string;
};

/* ----------------------------------------------------------- utils */

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** acha o primeiro valor em R$ mencionado (ex: "tenho 500 reais", "R$ 1.200,50") */
function extrairValor(pergunta: string): number | null {
  const txt = pergunta.replace(/\s/g, "");
  // tenta formatos: 1.200,50 | 1200,50 | 1200.50 | 1200 | r$1200
  const m = txt.match(/(?:r\$)?(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)/i);
  if (!m) return null;
  let raw = m[1];
  // normaliza pt-BR (1.200,50 -> 1200.50)
  if (raw.includes(",")) {
    raw = raw.replace(/\./g, "").replace(",", ".");
  }
  const n = Number(raw);
  return isNaN(n) ? null : n;
}

function brl(v: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

/** valor futuro de aporte mensal a juros compostos */
function futuroMensal(aporte: number, meses: number, taxaAnual = 0.1): number {
  const i = Math.pow(1 + taxaAnual, 1 / 12) - 1;
  return aporte * ((Math.pow(1 + i, meses) - 1) / i);
}

const primeiroNome = (ctx: LocalContext) => (ctx.nome ? ctx.nome.split(" ")[0] : "");

/* ----------------------------------------------------------- intents */

const intents: Intent[] = [
  /* Saudação / quem é você */
  {
    id: "saudacao",
    keywords: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "eai", "opa", "tudo bem", "quem e voce", "o que voce faz", "como funciona", "me ajuda", "pode ajudar"],
    peso: 0.5,
    responder: (ctx) =>
      `Oi${primeiroNome(ctx) ? `, ${primeiroNome(ctx)}` : ""}! 👋 Sou o assistente do FinUp. Posso te ajudar a:\n\n- **Organizar o orçamento** e priorizar gastos\n- **Sair de dívidas** sem se enrolar\n- **Começar a investir** do jeito seguro\n- **Tirar dúvidas das aulas** da Trilha\n\nÉ só perguntar do seu jeito. O que tá pegando hoje?`,
  },

  /* Sobrou dinheiro / onde guardar */
  {
    id: "onde_guardar",
    keywords: [
      "onde guardar", "onde colocar", "onde por", "onde investir", "onde aplicar",
      "sobrou", "sobrando", "sobra", "guardar dinheiro", "o que fazer com",
      "tenho dinheiro", "ganhei um dinheiro", "recebi um dinheiro", "13 salario",
      "decimo terceiro", "guardar onde", "fazer render", "melhor lugar pra guardar",
    ],
    peso: 2.2,
    responder: (ctx, pergunta) => {
      const valor = extrairValor(pergunta);
      const intro = valor && valor >= 50
        ? `Boa pergunta${primeiroNome(ctx) ? `, ${primeiroNome(ctx)}` : ""}! Com **${brl(valor)}** sobrando, segue a ordem segura:`
        : `Boa pergunta! A ordem segura pra qualquer dinheiro que sobra é:`;
      let extra = "";
      if (valor && valor >= 50) {
        extra = `\n\n💡 Se você ainda não tem reserva, esses **${brl(valor)}** vão pra lá. Se já tem, jogue numa caixinha de objetivo${ctx.sonho ? ` (tipo "${ctx.sonho}")` : ""} ou num Tesouro Selic. Em 5 anos a 10% a.a., ${brl(valor)} viram **${brl(valor * Math.pow(1.1, 5))}**.`;
      }
      return `${intro}\n\n**1.** Tem dívida cara (cartão, cheque especial)? Quita primeiro — nenhum investimento rende mais que os juros que você paga.\n**2.** Sem reserva de emergência? Monte ela: 3 a 6× seu gasto mensal, em **Tesouro Selic** ou **CDB liquidez diária**.\n**3.** Já tem reserva? Aí sim: caixinha de objetivo, Tesouro IPCA+ (longo prazo), ou CDB que pague 100%+ do CDI.\n\nNunca em poupança parada (rende mal), nunca em aposta, nunca em "oportunidade garantida".${extra}`;
    },
  },

  /* Apostas — recusa firme */
  {
    id: "apostas",
    keywords: ["aposta", "apostar", "tigrinho", "tigre", "bet", "betano", "cassino", "loteria", "jogo do bicho", "aviator", "blaze"],
    peso: 3,
    responder: () =>
      `Vou ser direto porque isso importa: **aposta não é investimento, é despesa.** 🎰\n\nA matemática é cruel: a casa SEMPRE tem margem positiva. No longo prazo, quem aposta perde — não é questão de sorte, é design do produto.\n\nUm exemplo real: **R$ 100/mês em apostas** somam R$ 1.200/ano que viram quase nada. Os mesmos **R$ 100/mês investidos a 10% a.a. viram ${brl(futuroMensal(100, 60))}** em 5 anos.\n\nSe aposta te dá prazer, trata como lazer e bota um teto BAIXO — nunca como forma de ganhar dinheiro. Quer que eu te mostre como redirecionar esse valor pra uma caixinha?`,
  },

  /* Reserva de emergência */
  {
    id: "reserva",
    keywords: ["reserva", "emergencia", "emergencial", "imprevisto", "colchao", "guardar pra emergencia"],
    peso: 2,
    responder: () =>
      `**Reserva de emergência** é a primeira prioridade depois de quitar dívida cara. É o seu seguro contra imprevistos (perder emprego, problema de saúde, carro quebrado).\n\n**Quanto:** de 3 a 6 vezes o seu GASTO mensal (não a renda). Se você gasta R$ 2.000/mês, mire entre R$ 6.000 e R$ 12.000.\n\n**Onde guardar:** lugar seguro e de resgate imediato — **Tesouro Selic** ou **CDB com liquidez diária** de banco que pague 100%+ do CDI. Nunca em ações ou cripto (oscilam justo quando você precisa).\n\nComeça com pouco: R$ 50/semana já é começo. O importante é a constância. Quer montar uma caixinha de reserva agora?`,
  },

  /* Dívida / sair do vermelho */
  {
    id: "divida",
    keywords: ["divida", "dividas", "devendo", "vermelho", "cheque especial", "rotativo", "atrasado", "negativado", "serasa", "spc", "nome sujo", "emprestimo", "consignado"],
    peso: 2,
    responder: () =>
      `Sair de dívida tem ordem certa. Bora:\n\n**1. Liste tudo com a taxa de juros de cada uma.** O inimigo nº 1 é a de maior juro.\n\n**2. Ataque nesta ordem:** cartão rotativo (até 400% a.a.) → cheque especial (~130% a.a.) → empréstimo pessoal → financiamentos.\n\n**3. Negocie.** O banco prefere receber 40% a não receber nada. Peça desconto à vista, mire parcelas que cabem em até 20% da sua renda, e exija o acordo POR ESCRITO antes de pagar. Procure os "Feirões Limpa Nome".\n\n**4. Pare de usar o cartão** até quitar o rotativo.\n\nNão pegue empréstimo novo pra "juntar tudo" sem comparar a taxa final. Quer que eu te ajude a montar a lista de prioridade?`,
  },

  /* Cartão de crédito */
  {
    id: "cartao",
    keywords: ["cartao", "credito", "fatura", "limite", "parcelar", "parcelamento", "rotativo do cartao", "quitar o cartao", "quitar cartao", "pagar o cartao", "pagar a fatura", "a vista ou parcelado", "vale a pena quitar", "antecipar fatura"],
    peso: 1.5,
    responder: () =>
      `**Cartão de crédito é ferramenta, não dinheiro extra.** A regra de ouro:\n\n- Use SÓ pra coisas que você compraria à vista\n- Pague **a fatura inteira** todo mês, nunca o mínimo\n- **Nunca parcele a fatura** (juros de 300-400% a.a.)\n\nSinal de alerta: se você usa mais de 30% do limite todo mês ou já parcelou fatura, tá apertado. Nesse caso, troque a dívida do cartão por um crédito pessoal com juro menor e pare de usar o cartão até equilibrar.\n\nUsado certo, ele até ajuda (organiza gastos, rende milhas). Usado errado, é a pior dívida que existe.`,
  },

  /* Começar a investir */
  {
    id: "investir",
    keywords: ["investir", "investimento", "aplicar", "render", "rendimento", "tesouro", "cdb", "lci", "lca", "renda fixa", "comecar a investir", "do zero", "primeiro investimento", "comprar acao", "acoes", "fii", "fundo", "corretora", "diversificar"],
    peso: 1.4,
    responder: (ctx) =>
      `Investir não é coisa de rico — começa com R$ 100. Mas a ORDEM importa${primeiroNome(ctx) ? `, ${primeiroNome(ctx)}` : ""}:\n\n**Antes de investir:** quite dívida cara e monte a reserva de emergência.\n\n**Depois, do mais seguro pro mais arrojado:**\n1. **Tesouro Selic / CDB liquidez diária** — pra reserva e curto prazo\n2. **Tesouro IPCA+ / CDB de prazo** — médio prazo (1-5 anos), protege da inflação\n3. **Tesouro IPCA+ longo / previdência boa** — aposentadoria\n4. **Ações/FIIs** — só depois de tudo acima, com horizonte de 5+ anos e dinheiro que não fará falta\n\n**Passo prático:** abre conta numa corretora (Nubank, Inter, XP, Rico…), transfere R$ 100, compra Tesouro Selic. Pronto, você é investidor. Fuja de qualquer "rendimento garantido alto" — é golpe.`,
  },

  /* Poupança */
  {
    id: "poupanca",
    keywords: ["poupanca", "poupar na poupanca", "deixar na poupanca", "caderneta"],
    peso: 2,
    responder: () =>
      `A **poupança é segura, mas rende mal** — geralmente perto ou abaixo da inflação, ou seja, seu dinheiro perde poder de compra com o tempo.\n\nA boa notícia: existem opções igualmente seguras que rendem mais:\n- **Tesouro Selic** (garantido pelo governo)\n- **CDB com liquidez diária** de banco médio (protegido pelo FGC até R$ 250 mil)\n\nAmbos têm resgate rápido como a poupança, mas pagam bem mais. Pra reserva de emergência, prefira esses. A poupança só vale se for o único lugar que você consegue mexer hoje — mas vale migrar assim que der.`,
  },

  /* Quanto guardar por mês */
  {
    id: "quanto_guardar",
    keywords: ["quanto guardar", "quanto poupar", "quanto investir por mes", "percentual", "porcentagem", "50 30 20", "regra dos", "orcamento", "dividir o salario"],
    peso: 1.5,
    responder: () => {
      return `Uma referência simples e conservadora é a **regra 50-30-20**:\n\n- **50%** da renda pras necessidades (moradia, comida, transporte, contas)\n- **30%** pros desejos (lazer, streaming, rolê)\n- **20%** pra poupar/investir e quitar dívidas\n\nSe 20% tá longe da sua realidade hoje, **comece com 5% e suba aos poucos.** O hábito vale mais que o valor no início.\n\nDica de ouro: separe a poupança **no dia que o salário cai**, não no fim do mês. "Pague-se primeiro" — o que sobra pra guardar nunca sobra.`;
    },
  },

  /* Juros compostos */
  {
    id: "juros",
    keywords: ["juros compostos", "juros", "como rende", "bola de neve do dinheiro", "exponencial", "rende sozinho"],
    peso: 1.5,
    responder: () =>
      `**Juros compostos** é o dinheiro rendendo sobre o rendimento — o que faz a grana crescer sozinha com o tempo.\n\nExemplo: R$ 100 a 10% a.a. viram R$ 110 no 1º ano. No 2º, os 10% incidem sobre R$ 110 = R$ 121. E assim cresce em curva, não em linha reta.\n\nO ingrediente mais poderoso é o **TEMPO**, não o valor. Guardar **R$ 200/mês por 30 anos** a 10% a.a. vira mais de **${brl(futuroMensal(200, 360))}** — e você só depositou R$ 72.000.\n\nÉ por isso que começar cedo (mesmo com pouco) vence começar tarde com muito. Quer ver a conta pro seu caso? Me diz quanto você consegue guardar por mês.`,
  },

  /* Como economizar / cortar gastos */
  {
    id: "economizar",
    keywords: ["economizar", "cortar gastos", "gastar menos", "assinatura", "assinaturas", "sobrar mais", "diminuir gasto", "gasto invisivel", "onde estou gastando"],
    peso: 1.2,
    responder: () =>
      `O dinheiro foge mais pelos **gastos pequenos repetidos** do que pelos grandes. Pra cortar sem sofrer:\n\n**1. Cace assinaturas.** Olha a fatura dos últimos 2 meses. 5 assinaturas de R$ 30 = R$ 1.800/ano. Cancela o que você não usou nas últimas 2 semanas.\n\n**2. Delivery e café fora.** R$ 25 de delivery 8x/mês = R$ 200. Não precisa zerar, só reduzir.\n\n**3. Lance tudo no FinUp por 30 dias.** Quando você VÊ pra onde vai, fica fácil decidir o que cortar.\n\nA meta não é viver na miséria — é tirar dos gastos que não te dão prazer real e jogar pro seu sonho. Use a aba Carteira pra enxergar isso.`,
  },

  /* Caixinhas / sonhos / objetivos */
  {
    id: "caixinha",
    keywords: ["caixinha", "caixinhas", "sonho", "objetivo", "meta", "juntar pra", "comprar um", "viagem", "carro", "casa", "quero comprar"],
    peso: 1.2,
    responder: (ctx, pergunta) => {
      const valor = extrairValor(pergunta);
      const base = `As **caixinhas** servem pra separar dinheiro por objetivo, sem misturar tudo numa conta só. Cada sonho tem sua caixinha, e o FinUp calcula quanto guardar por mês.`;
      if (valor && valor >= 100) {
        const meta12 = valor / 12;
        const meta24 = valor / 24;
        return `${base}\n\nPra um objetivo de **${brl(valor)}**:\n- Guardando **${brl(meta12)}/mês**, você chega em ~1 ano\n- Guardando **${brl(meta24)}/mês**, em ~2 anos\n\nE se investir esse aporte a 10% a.a., chega um pouco mais rápido por causa do rendimento. Cria a caixinha na aba Carteira e o app acompanha pra você. 🎯`;
      }
      return `${base}\n\nMe diz quanto custa o seu objetivo${ctx.sonho ? ` (${ctx.sonho}?)` : ""} que eu calculo quanto guardar por mês. Ex: "quero juntar 12000 pra uma viagem".`;
    },
  },

  /* Aposentadoria */
  {
    id: "aposentadoria",
    keywords: ["aposentadoria", "aposentar", "previdencia", "inss", "futuro longo", "pgbl", "vgbl", "longo prazo"],
    peso: 1.5,
    responder: () =>
      `**Aposentadoria** é o objetivo onde o tempo trabalha mais a seu favor. Quem começa aos 25 acumula MUITO mais que quem começa aos 40 — mesmo guardando menos.\n\n**Pra começar:**\n- Programe um aporte automático mensal (mesmo R$ 50) numa corretora\n- Pro longo prazo, **Tesouro IPCA+** é ótimo: protege da inflação e trava um juro real\n- Cuidado com **previdência privada de banco**: muitas cobram taxa de 2-4% a.a. que come 30-50% do seu patrimônio em 30 anos. Compare sempre a taxa\n\nA pergunta certa não é "quanto investir" e sim "quando começar". A resposta é: hoje.`,
  },

  /* Renda extra */
  {
    id: "renda_extra",
    keywords: ["renda extra", "ganhar mais", "dinheiro extra", "freela", "freelance", "segunda renda", "trabalho extra", "empreender", "vender", "aumentar renda"],
    peso: 1.2,
    responder: () =>
      `Organizar gasto é metade do jogo — aumentar a renda é a outra. Algumas ideias de baixo custo pra começar:\n\n- **Use uma habilidade que você já tem** (conserto, aulas, design, social media, cozinha) e ofereça pra 5 pessoas conhecidas. Boca a boca é o primeiro motor\n- **Cobre por entrega/resultado**, não por hora — escala melhor\n- **Venda o que não usa** pra formar um capital inicial\n- Antes de investir em qualquer "negócio", **valide vendendo primeiro**\n\nMódulo 4 da Trilha é todo sobre isso. Quer que eu te aponte por onde começar com base no que você sabe fazer?`,
  },

  /* Score de crédito */
  {
    id: "score",
    keywords: ["score", "pontuacao de credito", "serasa score", "limpar nome", "subir score", "credito aprovado"],
    peso: 1.5,
    responder: () =>
      `**Score** é a nota (0 a 1000) que mostra o quão confiável você é pra pagar. Acima de 700 já é bom.\n\n**Como subir:**\n- **Pague contas em dia** — é o que mais pesa\n- Tenha um cartão ativo com uso BAIXO (até 30% do limite)\n- Cadastre seu CPF nas notas (Cadastro Positivo)\n- Não peça vários créditos num período curto\n- Mantenha dados atualizados no Serasa\n\nScore alto = juros menores em financiamento, mais limite, anuidade grátis. Leva alguns meses de constância, mas funciona.`,
  },

  /* Glossário: CDI, Selic, FGC */
  {
    id: "glossario",
    keywords: ["o que e cdi", "que e cdi", "o que e selic", "o que e fgc", "o que significa", "ipca", "inflacao", "o que e tesouro"],
    peso: 1.3,
    responder: () =>
      `Os termos que mais aparecem, sem enrolação:\n\n- **Selic:** a taxa básica de juros do Brasil. Referência pra quase tudo\n- **CDI:** taxa que anda colada na Selic. Investimentos rendem "% do CDI" (100% do CDI ≈ render igual ao CDI)\n- **IPCA:** o índice oficial da inflação. "Tesouro IPCA+" paga inflação + um juro fixo\n- **FGC:** Fundo Garantidor de Crédito. Protege até **R$ 250 mil por banco** se a instituição quebrar (cobre poupança, CDB, LCI, LCA)\n- **Liquidez:** quão rápido você resgata. "Liquidez diária" = cai na hora\n\nQuer que eu explique algum em mais detalhe?`,
  },

  /* Comprar vs alugar */
  {
    id: "comprar_alugar",
    keywords: ["comprar ou alugar", "alugar ou comprar", "financiar imovel", "financiamento imovel", "casa propria", "vale a pena comprar"],
    peso: 1.5,
    responder: () =>
      `Não existe resposta única — depende da conta. Compare:\n\n**(a)** custo real de comprar = parcela + IPTU + condomínio + manutenção + juros do financiamento\n**(b)** aluguel + investir a diferença\n\nMuita gente se surpreende: em vários casos, **alugar e investir a diferença rende mais** que comprar financiado a juros altos.\n\n**Comprar faz sentido quando:** você vai ficar 10+ anos no imóvel, o preço está abaixo do justo da região, e a parcela é próxima do aluguel.\n\nAntes de financiar, faz a conta detalhada por 5 anos numa planilha. Decisão de R$ 300 mil merece 1 hora de cálculo.`,
  },

  /* Ajuda com a trilha / aula */
  {
    id: "trilha",
    keywords: ["aula", "trilha", "exercicio", "modulo", "licao", "nao entendi", "me explica a aula", "duvida da aula"],
    peso: 1,
    responder: (ctx) =>
      `Claro! Posso explicar qualquer conceito das aulas com outras palavras.${ctx.licoesConcluidas ? ` Você já mandou bem em ${ctx.licoesConcluidas} aula(s), então tá no caminho. 👏` : ""}\n\nMe diz qual assunto travou — por exemplo: "não entendi juros compostos", "o que é reserva de emergência", "por que aposta perde dinheiro". Aí eu destrincho de forma simples, com exemplo numérico.`,
  },
];

/* fallback quando nada bate bem */
function fallback(ctx: LocalContext): string {
  return `Hmm, não tenho certeza se entendi${primeiroNome(ctx) ? `, ${primeiroNome(ctx)}` : ""}. 🤔\n\nEu sou especialista em **dinheiro e educação financeira**. Posso ajudar com:\n\n- Sair de dívidas · montar reserva · começar a investir\n- Cortar gastos · planejar um sonho · entender juros\n- Cartão de crédito · score · aposentadoria · comprar x alugar\n\nTenta reformular ou escolhe um desses temas. Pra decisões muito específicas (qual produto exato, planejamento de herança), o ideal é um assessor certificado pela CVM.`;
}

/* recusas pra coisas fora do escopo */
const FORA_ESCOPO = ["receita de bolo", "redacao", "trabalho escolar", "piada", "namoro", "futebol", "politica"];

/* ----------------------------------------------------------- motor */

export function responderLocal(pergunta: string, ctx: LocalContext = {}): string {
  const norm = normalizar(pergunta);

  if (!norm) return fallback(ctx);

  // fora de escopo explícito
  if (FORA_ESCOPO.some((f) => norm.includes(normalizar(f)))) {
    return `Essa eu deixo passar 😅 — sou focado só em **educação financeira**. Mas se tiver qualquer dúvida sobre dinheiro, dívida, investimento ou seus sonhos, manda que eu ajudo!`;
  }

  let melhor: { intent: Intent; score: number } | null = null;

  for (const intent of intents) {
    let score = 0;
    for (const kw of intent.keywords) {
      if (norm.includes(kw)) {
        // palavra-chave maior = match mais específico = mais peso
        score += (kw.split(" ").length) * (intent.peso ?? 1);
      }
    }
    if (score > 0 && (!melhor || score > melhor.score)) {
      melhor = { intent, score };
    }
  }

  if (!melhor) return fallback(ctx);
  return melhor.intent.responder(ctx, pergunta);
}
