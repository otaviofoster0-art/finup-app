/* =========================================================
 * Tipos
 * =======================================================*/

export type ConteudoBloco =
  | { tipo: "titulo"; texto: string }
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "lista"; items: string[] }
  | { tipo: "numero"; valor: string; legenda: string }
  | { tipo: "destaque"; texto: string; intent?: "info" | "alerta" | "exemplo"; titulo?: string };

export type Pergunta = {
  enunciado: string;
  opcoes: string[];
  correta: number;
  explicacao?: string;
};

export type Licao = {
  id: number;
  titulo: string;
  subtitulo: string;
  emoji: string;
  hook: string;        // gancho curto antes do vídeo
  video: {
    titulo: string;
    duracao: string;
    instrutor?: string;
  };
  conteudo: ConteudoBloco[];
  perguntas: Pergunta[];
  xp: number;
  conclusao: string;
};

export type Modulo = {
  id: number;
  titulo: string;
  descricao: string;
  recompensa: string;
  licoes: Licao[];
};

/* =========================================================
 * Conteúdo do Módulo 1 — Bases da educação financeira
 * =======================================================*/

export const licoesModulo1: Licao[] = [
  /* ────────────────────── Aula 1 ────────────────────── */
  {
    id: 1,
    titulo: "Por que dinheiro foge?",
    subtitulo: "Aula 1 · 4 min de leitura",
    emoji: "💭",
    xp: 20,
    hook:
      "Você já chegou no dia 25 sem saber pra onde foi o dinheiro? Não é azar nem falta de salário. É falta de VISIBILIDADE.",
    video: {
      titulo: "Por que dinheiro foge? — entendendo os gastos invisíveis",
      duracao: "3:42",
      instrutor: "Conteúdo FinUp",
    },
    conteudo: [
      { tipo: "titulo", texto: "O efeito dos gastos invisíveis" },
      {
        tipo: "paragrafo",
        texto:
          "A maioria das pessoas controla bem aluguel, conta de luz, compra do mês no mercado. O problema mora em outro lugar: nos pequenos gastos repetidos que ninguém anota. Eles são tão pequenos individualmente que parecem inofensivos, mas se acumulam em silêncio.",
      },
      {
        tipo: "numero",
        valor: "30%",
        legenda: "da renda some, em média, em micro-gastos que a gente nem percebe",
      },
      {
        tipo: "paragrafo",
        texto:
          "Não é exagero. Pesquisas com brasileiros mostram que entre 25% e 35% da renda mensal escorre por gastos diários pequenos. O cérebro humano simplesmente não foi feito pra somar valores pequenos espalhados no tempo.",
      },
      { tipo: "titulo", texto: "Exemplos reais do dia a dia" },
      {
        tipo: "lista",
        items: [
          "Café da manhã na padaria: R$ 18 × 20 dias úteis = R$ 360/mês",
          "Delivery “rapidinho”: R$ 25 × 8 vezes = R$ 200/mês",
          "Assinatura que você esqueceu: R$ 19,90 × 12 meses = R$ 239/ano",
          "Uber pra evitar chuva: R$ 22 × 6 vezes = R$ 132/mês",
        ],
      },
      {
        tipo: "destaque",
        intent: "info",
        titulo: "A primeira regra",
        texto:
          "O que você NÃO mede, você NÃO controla. Não dá pra cortar o que você não vê. Por isso o primeiro passo NÃO é ganhar mais, NÃO é cortar despesas — é ANOTAR. Sem isso, qualquer aumento de salário some na mesma velocidade que entrou.",
      },
      {
        tipo: "destaque",
        intent: "exemplo",
        titulo: "Caso real: Maria, 28 anos, vendedora",
        texto:
          "Ganhava R$ 2.800 e jurava que não sobrava nada. Quando começou a anotar TUDO por 30 dias, descobriu R$ 870/mês em gastos que ela classificava como “pequenos”. Cortou pela metade. Em 6 meses tinha R$ 2.600 guardado pela primeira vez na vida.",
      },
      { tipo: "titulo", texto: "Como começar (sem complicar)" },
      {
        tipo: "lista",
        items: [
          "Anote tudo que entra e sai por 30 dias seguidos — use o FinUp",
          "Não tente julgar ou cortar nada nas primeiras 4 semanas, só ANOTE",
          "No fim do mês, agrupe por categoria e veja a foto real",
          "Aí sim você decide o que ajustar — com informação, não com palpite",
        ],
      },
    ],
    perguntas: [
      {
        enunciado: "Qual o primeiro passo pra parar de “perder” dinheiro?",
        opcoes: [
          "Ganhar mais",
          "Anotar tudo que entra e sai",
          "Cortar todo lazer",
          "Pegar empréstimo",
        ],
        correta: 1,
        explicacao: "Sem visibilidade, qualquer aumento é engolido pelos gastos invisíveis.",
      },
      {
        enunciado: "Em média, quanto da renda mensal a gente “perde de vista”?",
        opcoes: ["Quase nada", "Uns 5%", "Cerca de 30%", "Tudo"],
        correta: 2,
        explicacao: "Estudos mostram que pequenos gastos somam 25-35% da renda mensal.",
      },
      {
        enunciado: "Nos primeiros 30 dias anotando, o que você deve FAZER?",
        opcoes: [
          "Cortar tudo que parecer supérfluo",
          "Apenas observar e anotar sem julgar",
          "Pedir aumento",
          "Não anotar pra não estressar",
        ],
        correta: 1,
        explicacao:
          "Primeiro entenda o padrão. Decisão sem informação vira frustração.",
      },
    ],
    conclusao:
      "Tarefa pra hoje: abra a fatura do seu cartão dos últimos 30 dias e leia, item por item. Você vai se surpreender com 2 ou 3 coisas. Lance no FinUp e comece a ver a foto real.",
  },

  /* ────────────────────── Aula 2 ────────────────────── */
  {
    id: 2,
    titulo: "Receita x Despesa",
    subtitulo: "Aula 2 · 4 min de leitura",
    emoji: "⚖️",
    xp: 25,
    hook:
      "Tem uma conta que vale mais que qualquer outra na sua vida financeira: Receita − Despesa = Sobra. Saber esse número muda o jogo.",
    video: {
      titulo: "Receita, Despesa e Sobra — a conta que muda tudo",
      duracao: "4:08",
      instrutor: "Conteúdo FinUp",
    },
    conteudo: [
      { tipo: "titulo", texto: "Receita: tudo que ENTRA" },
      {
        tipo: "paragrafo",
        texto:
          "Receita é qualquer dinheiro que chega no seu bolso, venha de onde vier: salário, vale-alimentação, comissão, hora-extra, 13º, freela, venda de algo usado, presente em dinheiro, restituição de imposto. Tudo conta.",
      },
      { tipo: "titulo", texto: "Despesa: tudo que SAI" },
      {
        tipo: "paragrafo",
        texto:
          "Despesa é todo dinheiro que sai. Engloba o óbvio (mercado, aluguel, conta de luz) e o que a gente quase sempre esquece: taxa do banco, anuidade do cartão, mensalidade da academia que não vai, café no caminho do trabalho, presente de aniversário.",
      },
      {
        tipo: "destaque",
        intent: "info",
        titulo: "A conta mais importante da sua vida",
        texto:
          "Sobra = Receita − Despesa. Se for negativa, você está se endividando (mesmo que pareça que não). Se for zero, está só apagando incêndio mês a mês. O objetivo do FinUp é fazer essa sobra crescer mês após mês.",
      },
      { tipo: "titulo", texto: "Os 3 cenários de cada mês" },
      {
        tipo: "lista",
        items: [
          "🔴 Sobra negativa — você gastou mais do que ganhou. Cartão, cheque especial, empréstimo: tudo isso é só ADIAR essa conta com juros altíssimos.",
          "🟡 Sobra zerada — bate certinho no fim do mês. Parece bom, mas qualquer imprevisto (carro quebra, dente quebra, parente pede ajuda) te empurra pro vermelho.",
          "🟢 Sobra positiva — sobra dinheiro de verdade. Aqui começa a liberdade: poder escolher investir, viajar, sonhar.",
        ],
      },
      {
        tipo: "numero",
        valor: "R$ 200",
        legenda: "de sobra mensal viram R$ 41 mil em 10 anos investidos a 10% a.a.",
      },
      { tipo: "titulo", texto: "Como aumentar a sobra (na ordem certa)" },
      {
        tipo: "lista",
        items: [
          "1. Cortar despesas invisíveis (assinaturas, taxas, gastinhos)",
          "2. Negociar despesas grandes (internet, plano de celular, energia, juros de cartão)",
          "3. Aumentar a receita (hora-extra, freela, segunda renda)",
        ],
      },
      {
        tipo: "destaque",
        intent: "exemplo",
        titulo: "Caso real: Roberto, 34, mecânico",
        texto:
          "Tinha sobra zerada há 5 anos. Anotou tudo por 60 dias e descobriu R$ 480/mês em despesas que dava pra cortar sem mudar de vida. Sobrou R$ 480. Em 1 ano, R$ 5.760. Investido, em 5 anos vira R$ 38 mil. Sem ganhar 1 real a mais.",
      },
    ],
    perguntas: [
      {
        enunciado: "O que entra na conta de receita?",
        opcoes: [
          "Só o salário fixo",
          "Tudo que entra no bolso (salário, comissão, vale, freela)",
          "Só dinheiro vivo, não conta",
          "Só o que sobra no fim do mês",
        ],
        correta: 1,
      },
      {
        enunciado:
          "Sua sobra esse mês foi R$ 200. Mês passado foi − R$ 400. Qual é a sobra média dos 2 meses?",
        opcoes: ["+ R$ 600", "Zero", "− R$ 100", "− R$ 200"],
        correta: 2,
        explicacao: "(200 + (−400)) / 2 = −100. Na média ainda está no vermelho.",
      },
      {
        enunciado: "Qual a ordem inteligente pra aumentar a sobra?",
        opcoes: [
          "Buscar segundo emprego primeiro",
          "Cortar despesas pequenas, depois negociar as grandes, depois pensar em renda extra",
          "Pedir aumento imediatamente",
          "Cortar tudo que dá prazer",
        ],
        correta: 1,
        explicacao:
          "Cortar é a alavanca mais rápida. Negociar é a próxima. Aumentar renda é a mais difícil e demorada.",
      },
    ],
    conclusao:
      "Sua tarefa: descobrir AGORA qual foi sua sobra do mês passado. Pega o app, soma o que entrou, soma o que saiu e diminui. Se você não souber, esse é exatamente o problema.",
  },

  /* ────────────────────── Aula 3 ────────────────────── */
  {
    id: 3,
    titulo: "O custo real da aposta",
    subtitulo: "Aula 3 · 5 min de leitura",
    emoji: "🎰",
    xp: 30,
    hook:
      "Tigrinho, aposta esportiva, bichinho. A casa SEMPRE vence no longo prazo. Não é opinião — é a matemática que sustenta o negócio delas.",
    video: {
      titulo: "Por que a casa SEMPRE ganha — a matemática das apostas",
      duracao: "5:21",
      instrutor: "Conteúdo FinUp",
    },
    conteudo: [
      { tipo: "titulo", texto: "Por que a casa sempre vence" },
      {
        tipo: "paragrafo",
        texto:
          "Toda casa de aposta — esportiva, cassino, tigrinho, bicho — é montada com uma regra invisível: a expectativa de retorno DO JOGADOR é negativa. Significa que, se você jogar 1.000 vezes, na média você sai perdendo. Quem aposta R$ 100/mês perde, em média, R$ 85 a R$ 95 por mês.",
      },
      {
        tipo: "destaque",
        intent: "alerta",
        titulo: "Aposta NÃO É investimento",
        texto:
          "Investimento tem expectativa de retorno POSITIVA no longo prazo. Aposta tem expectativa NEGATIVA — por design, é como o produto é feito. Ganhar 1 ou 2 vezes não muda essa matemática.",
      },
      { tipo: "titulo", texto: "O custo de oportunidade" },
      {
        tipo: "paragrafo",
        texto:
          "O dinheiro gasto em aposta tem um custo escondido: ele PODERIA estar trabalhando pra você em vez de contra. Na renda fixa simples (10% ao ano), o mesmo dinheiro vira uma coisa completamente diferente em 5 ou 10 anos.",
      },
      {
        tipo: "numero",
        valor: "R$ 7.744",
        legenda: "é quanto R$ 100/mês vira em 5 anos investido a 10% a.a.",
      },
      { tipo: "titulo", texto: "A comparação" },
      {
        tipo: "lista",
        items: [
          "Aposta R$ 100/mês durante 5 anos → saldo médio próximo de R$ 0 (90% perde, perde tudo)",
          "Investe R$ 100/mês durante 5 anos → R$ 7.744 no bolso",
          "Diferença real: ~R$ 7.700 — uma viagem internacional ou entrada de um carro",
        ],
      },
      {
        tipo: "destaque",
        intent: "info",
        titulo: "Se você gosta da emoção, ok — mas com limite",
        texto:
          "Se aposta te dá entretenimento real, trate como CINEMA: define um teto baixo (tipo R$ 30/mês), entra na categoria “lazer” no FinUp, e PARA quando acabar. Nunca tente recuperar a perda apostando mais — esse é o jeito mais rápido de quebrar.",
      },
      {
        tipo: "destaque",
        intent: "exemplo",
        titulo: "Caso real: Carlos, 35, motorista de app",
        texto:
          "Apostava R$ 200/mês há 3 anos. Quando parou e começou a investir o mesmo valor numa CDB, em 1 ano juntou R$ 2.530. Hoje brinca: “minha sorte virou no dia que parei de tentar ter sorte”.",
      },
    ],
    perguntas: [
      {
        enunciado: "Aposta esportiva é uma forma de investimento?",
        opcoes: [
          "Sim, é renda variável",
          "Sim, se você estudar bastante os times",
          "Não. É entretenimento com expectativa NEGATIVA de retorno",
          "Depende do dia",
        ],
        correta: 2,
        explicacao:
          "Por design, a casa sempre tem margem positiva. Ganhar é exceção, perder é a regra.",
      },
      {
        enunciado: "R$ 100/mês a 10% a.a. viram aproximadamente quanto em 5 anos?",
        opcoes: ["R$ 6.000", "R$ 7.700", "R$ 1.200", "R$ 50.000"],
        correta: 1,
        explicacao: "Juros compostos: R$ 100/mês durante 60 meses a 0,8% ao mês ≈ R$ 7.744.",
      },
      {
        enunciado: "Qual a melhor regra se você gosta de apostar?",
        opcoes: [
          "Apostar mais quando tá perdendo pra recuperar",
          "Só apostar com dinheiro emprestado",
          "Definir um teto mensal baixo, classificar como lazer, e parar quando acabar",
          "Apostar tudo de uma vez pra resolver",
        ],
        correta: 2,
        explicacao:
          "Apostar pra recuperar perda é o jeito mais rápido de transformar problema em desastre.",
      },
    ],
    conclusao:
      "Se você apostou esse mês, lance como “Apostas” no FinUp pra ver o número real. Crie uma caixinha “Reserva” no mesmo valor que costuma apostar. Compare em 6 meses.",
  },

  /* ────────────────────── Aula 4 ────────────────────── */
  {
    id: 4,
    titulo: "Caçando assinaturas escondidas",
    subtitulo: "Aula 4 · 4 min de leitura",
    emoji: "📺",
    xp: 25,
    hook:
      "Cada “só R$ 19,90/mês” parece inofensivo. Mas 5 assinaturas de R$ 30 viram R$ 11.500 em 5 anos se você investir o equivalente.",
    video: {
      titulo: "Caçando assinaturas escondidas em 10 minutos",
      duracao: "3:55",
      instrutor: "Conteúdo FinUp",
    },
    conteudo: [
      { tipo: "titulo", texto: "Por que assinatura é o produto perfeito (pra quem cobra)" },
      {
        tipo: "paragrafo",
        texto:
          "Assinatura é o sonho de qualquer negócio: você toma a decisão UMA vez, e a cobrança continua todo mês — pra sempre — até você cancelar. O cérebro humano não foi feito pra somar valores pequenos espalhados no tempo, então a gente simplesmente esquece que tá pagando.",
      },
      {
        tipo: "numero",
        valor: "R$ 1.800",
        legenda: "é o que 5 assinaturas de R$ 30/mês somam em 1 ano (R$ 11.500 em 5 anos investido)",
      },
      { tipo: "titulo", texto: "A caçada em 10 minutos" },
      {
        tipo: "paragrafo",
        texto:
          "Você consegue mapear TODAS as suas assinaturas em uma única tarde, com 10 minutos de trabalho. É só seguir a receita:",
      },
      {
        tipo: "lista",
        items: [
          "Abra a fatura do cartão dos últimos 2 meses (no app do seu banco)",
          "Marque toda cobrança recorrente — mesmo valor + mesma data ≈ assinatura",
          "Liste em 3 colunas: nome, valor, ÚLTIMA vez que você usou",
          "Cancele as que você não usou nas últimas 2 semanas",
          "Para as que sobrarem: compartilha plano família (Netflix, Spotify e Disney+ aceitam até 6 pessoas)",
        ],
      },
      {
        tipo: "destaque",
        intent: "info",
        titulo: "Regra prática",
        texto:
          "Se você esqueceu que ela existia por 2 semanas, é porque ela não está te servindo. Cancele sem culpa. Você pode voltar a assinar quando quiser usar de verdade — não é decisão pra sempre.",
      },
      { tipo: "titulo", texto: "Assinaturas que quase ninguém percebe" },
      {
        tipo: "lista",
        items: [
          "Plano de celular com franquia que você nem usa",
          "Backup de fotos do iCloud / Google Drive que esquece que paga",
          "Aplicativos de produtividade que assinou pra teste e ficou",
          "Apps de meditação, dieta, exercício que abriu 2x",
          "Newsletters pagas, jornais digitais, cursos online “vitalícios”",
          "Serviços do banco: pacote de serviços, cesta de produtos, seguro residencial",
        ],
      },
      {
        tipo: "destaque",
        intent: "exemplo",
        titulo: "Caso real: Jeferson, 31, repositor",
        texto:
          "Achou que tinha 3 assinaturas. Na caçada, descobriu 8. Cancelou 5 (R$ 167/mês). Compartilhou plano família de mais 2 (mais R$ 35/mês). Total: R$ 202/mês de economia. Em 3 anos investido, é R$ 8.500 — quase a entrada de um carro.",
      },
    ],
    perguntas: [
      {
        enunciado: "Por que assinaturas escondidas pesam tanto no orçamento?",
        opcoes: [
          "Porque cada uma é cara individualmente",
          "Porque a gente esquece que paga, e o total se acumula em silêncio",
          "Porque os apps são ruins",
          "Não pesam",
        ],
        correta: 1,
      },
      {
        enunciado: "Quanto custa 5 assinaturas de R$ 30/mês em 1 ano?",
        opcoes: ["R$ 150", "R$ 600", "R$ 1.800", "R$ 360"],
        correta: 2,
        explicacao: "5 × 30 × 12 = R$ 1.800/ano. Em 5 anos a 10%a.a., quase R$ 11.500.",
      },
      {
        enunciado: "Qual o jeito mais rápido de mapear todas suas assinaturas?",
        opcoes: [
          "Tentar lembrar de memória",
          "Olhar a fatura do cartão dos últimos 2 meses procurando cobranças recorrentes",
          "Pesquisar no Google",
          "Pedir pra alguém",
        ],
        correta: 1,
      },
    ],
    conclusao:
      "Tarefa pra hoje: faça a caçada agora. Cancele 1 assinatura. Deposite o valor cancelado na sua caixinha de objetivo no FinUp e veja o gráfico mudar.",
  },

  /* ────────────────────── Aula 5 ────────────────────── */
  {
    id: 5,
    titulo: "Reserva de emergência",
    subtitulo: "Aula 5 · 5 min de leitura",
    emoji: "🛟",
    xp: 35,
    hook:
      "Sem reserva, qualquer imprevisto vira dívida. Com reserva, você dorme em paz mesmo quando o telhado pinga.",
    video: {
      titulo: "Reserva de emergência — o seu seguro de tranquilidade",
      duracao: "4:47",
      instrutor: "Conteúdo FinUp",
    },
    conteudo: [
      { tipo: "titulo", texto: "O que É e o que NÃO É" },
      {
        tipo: "lista",
        items: [
          "✅ É: pra emergência DE VERDADE — perda de emprego, problema de saúde, urgência da família",
          "❌ NÃO É: pra viagem (isso é caixinha de objetivo)",
          "❌ NÃO É: pra trocar a geladeira nova (isso é caixinha)",
          "❌ NÃO É: pra investir em ações (isso é investimento de risco)",
          "❌ NÃO É: pra dar entrada em um carro (isso é planejamento)",
        ],
      },
      { tipo: "titulo", texto: "Quanto guardar?" },
      {
        tipo: "paragrafo",
        texto:
          "A regra é 3 a 6 vezes o seu GASTO mensal (não o salário). Por quê? Porque se você perder a renda, o que você precisa cobrir é o que GASTA todo mês. Se gastar R$ 2.500/mês, reserva ideal é entre R$ 7.500 e R$ 15.000.",
      },
      {
        tipo: "numero",
        valor: "6 meses",
        legenda: "de tranquilidade pra reorganizar a vida se algo der errado",
      },
      {
        tipo: "destaque",
        intent: "info",
        titulo: "Comece pequeno",
        texto:
          "Pra muita gente, 6 vezes o gasto parece impossível. Não importa. Comece com R$ 50/semana, ou R$ 200/mês. O importante é começar HOJE. Em 1 ano com R$ 200/mês você já tem 1 mês de reserva — e isso muda completamente a sua sensação de segurança.",
      },
      { tipo: "titulo", texto: "Onde NÃO guardar" },
      {
        tipo: "destaque",
        intent: "alerta",
        titulo: "Poupança? Não.",
        texto:
          "A poupança rende ABAIXO da inflação na maior parte do tempo. Significa: você está perdendo poder de compra mesmo guardando dinheiro lá. Pior que parado.",
      },
      { tipo: "titulo", texto: "Onde guardar de verdade" },
      {
        tipo: "lista",
        items: [
          "✅ Tesouro Selic — título do governo, resgate em 1 dia útil, segurança máxima",
          "✅ CDB com liquidez diária — emitido por bancos, protegido pelo FGC até R$ 250 mil, rende mais que poupança",
          "❌ Ações ou cripto — varia muito, no dia da emergência pode estar no fundo do poço",
          "❌ Imóvel — você não vende uma casa em 24h se precisar do dinheiro pra cirurgia",
        ],
      },
      {
        tipo: "destaque",
        intent: "exemplo",
        titulo: "Caso real: Patrícia, 42, atendente",
        texto:
          "Começou com R$ 50/semana há 2 anos. Hoje tem 4 meses de reserva no Tesouro Selic. “Quando minha filha precisou fazer cirurgia particular, eu não precisei me endividar nem pedir empréstimo. Esse dinheiro vale ouro — não rende muito, mas dorme tranquila com ele lá.”",
      },
    ],
    perguntas: [
      {
        enunciado: "Pra que serve a reserva de emergência?",
        opcoes: [
          "Pra investir em ações com calma",
          "Pra emergências reais: saúde, desemprego, urgências",
          "Pra viagens em família",
          "Pra trocar o celular",
        ],
        correta: 1,
      },
      {
        enunciado: "Qual o tamanho ideal da reserva de emergência?",
        opcoes: [
          "1 salário guardado",
          "3 a 6 vezes o seu GASTO mensal (não o salário)",
          "R$ 10.000 fixos pra todo mundo",
          "Quanto sobrar no fim do ano",
        ],
        correta: 1,
        explicacao:
          "Reserva é pra cobrir tempo SEM renda. Por isso medimos por GASTO, não por salário.",
      },
      {
        enunciado: "Onde guardar a reserva de emergência?",
        opcoes: [
          "Na poupança, é seguro",
          "Em ações de empresas sólidas, pra render mais",
          "Em investimento de liquidez diária e baixo risco (Tesouro Selic, CDB liquidez diária)",
          "Embaixo do colchão, em casa",
        ],
        correta: 2,
        explicacao:
          "Precisa estar disponível AGORA. Liquidez diária + baixo risco são os critérios.",
      },
    ],
    conclusao:
      "Crie hoje uma caixinha “Reserva de emergência” no FinUp. Meta inicial: 1× seu gasto mensal. Não precisa atingir hoje, precisa COMEÇAR hoje.",
  },

  /* ────────────────────── Aula 6 ────────────────────── */
  {
    id: 6,
    titulo: "Juros compostos: o sócio invisível",
    subtitulo: "Aula 6 · 5 min de leitura",
    emoji: "📈",
    xp: 40,
    hook:
      "Albert Einstein chamou os juros compostos de “oitava maravilha do mundo”. Quem entende, ganha. Quem não entende, paga.",
    video: {
      titulo: "Juros compostos — o efeito bola de neve do dinheiro",
      duracao: "5:32",
      instrutor: "Conteúdo FinUp",
    },
    conteudo: [
      { tipo: "titulo", texto: "Juros simples vs juros compostos" },
      {
        tipo: "paragrafo",
        texto:
          "Em juros SIMPLES, os 10% sempre rendem sobre o valor original. Em juros COMPOSTOS, os 10% rendem sobre o total acumulado (incluindo os juros que já renderam). A diferença parece pequena no início e fica gigante no longo prazo.",
      },
      { tipo: "titulo", texto: "Um exemplo prático" },
      {
        tipo: "paragrafo",
        texto:
          "Você guarda R$ 100 hoje, a 10% ao ano. No fim do ano 1, vira R$ 110. No ano 2, os 10% incidem sobre R$ 110, não R$ 100 — vira R$ 121. No ano 3, sobre R$ 121, vira R$ 133,10. E assim por diante.",
      },
      {
        tipo: "numero",
        valor: "R$ 1.745",
        legenda: "é quanto R$ 100 viram em 30 anos a 10% a.a. SEM você fazer nada",
      },
      { tipo: "titulo", texto: "O segredo: TEMPO" },
      {
        tipo: "paragrafo",
        texto:
          "Mais importante que o VALOR é o TEMPO. Dobrar o tempo é mais impactante que dobrar o valor inicial. Por isso começar cedo, mesmo com pouco, vale mais que começar tarde com muito.",
      },
      { tipo: "titulo", texto: "Veja o efeito bola de neve" },
      {
        tipo: "lista",
        items: [
          "R$ 200/mês durante 10 anos a 10% a.a. = R$ 41.310",
          "R$ 200/mês durante 20 anos a 10% a.a. = R$ 153.139",
          "R$ 200/mês durante 30 anos a 10% a.a. = R$ 452.097",
        ],
      },
      {
        tipo: "destaque",
        intent: "info",
        titulo: "Repare o salto",
        texto:
          "Dobrar o tempo (10 → 20 anos) faz o valor quase QUADRUPLICAR. Triplicar o tempo (10 → 30 anos) faz aumentar 11×. Esse é o efeito exponencial dos juros compostos.",
      },
      { tipo: "titulo", texto: "O outro lado: juros compostos contra você" },
      {
        tipo: "paragrafo",
        texto:
          "A mesma magia funciona ao contrário. Cartão de crédito a 14% AO MÊS, cheque especial a 8% ao mês — esses são juros compostos trabalhando CONTRA você. R$ 1.000 no cartão sem pagar viram R$ 4.300 em 12 meses.",
      },
      {
        tipo: "destaque",
        intent: "exemplo",
        titulo: "Caso real: João, 25, vendedor",
        texto:
          "Se começar a investir R$ 200/mês HOJE até os 60 anos, vai ter R$ 760 mil. Se esperar 10 anos pra começar (35 → 60), vai ter R$ 264 mil. 10 anos de atraso custou R$ 500 mil. O preço do “depois eu começo” é altíssimo.",
      },
    ],
    perguntas: [
      {
        enunciado: "Qual a diferença entre juros simples e juros compostos?",
        opcoes: [
          "Nenhuma na prática",
          "Simples cresce em linha reta; compostos crescem em curva exponencial",
          "Compostos são apenas mais difíceis de calcular",
          "Simples rendem mais",
        ],
        correta: 1,
      },
      {
        enunciado: "Qual o ingrediente MAIS poderoso dos juros compostos?",
        opcoes: ["O valor inicial", "A taxa de juros", "O TEMPO", "A sorte"],
        correta: 2,
        explicacao:
          "Dobrar o tempo importa muito mais que dobrar o valor inicial.",
      },
      {
        enunciado: "Quem deixa dívida no cartão de crédito está sendo afetado por juros compostos…",
        opcoes: [
          "A favor dele",
          "De forma neutra",
          "CONTRA ele — a bola de neve cresce no lado errado",
          "Só se for mais de 6 meses",
        ],
        correta: 2,
        explicacao:
          "A mesma matemática que faz seu investimento crescer faz sua dívida crescer. Eliminar dívida cara é prioridade.",
      },
    ],
    conclusao:
      "A pergunta certa não é “quanto investir”, é “quando começar”. E a resposta sempre é HOJE. R$ 50, R$ 100, qualquer valor — o que importa é começar a contagem do tempo.",
  },

  /* ────────────────────── Aula 7 ────────────────────── */
  {
    id: 7,
    titulo: "Renda fixa de verdade",
    subtitulo: "Aula 7 · 6 min de leitura",
    emoji: "🏦",
    xp: 45,
    hook:
      "Poupança rende pouco e quase sempre perde pra inflação. Existem opções tão seguras e que rendem MUITO mais. Vamos conhecer.",
    video: {
      titulo: "Renda fixa pra leigos — Tesouro, CDB e o FGC",
      duracao: "6:15",
      instrutor: "Conteúdo FinUp",
    },
    conteudo: [
      { tipo: "titulo", texto: "Por que poupança não é mais opção" },
      {
        tipo: "paragrafo",
        texto:
          "Quando a inflação está alta (como nos últimos anos), a poupança rende ABAIXO da inflação. Significa: você está PERDENDO poder de compra mesmo guardando lá. O dinheiro está “seguro” mas vale menos a cada mês.",
      },
      {
        tipo: "numero",
        valor: "−2%",
        legenda: "foi o rendimento real da poupança em 2022 (descontando a inflação)",
      },
      { tipo: "titulo", texto: "As alternativas seguras e melhores" },
      {
        tipo: "lista",
        items: [
          "Tesouro Selic — título emitido pelo governo brasileiro, garantido pelo Tesouro Nacional, resgate em 1 dia útil",
          "CDB Liquidez Diária — emitido por bancos, protegido pelo FGC até R$ 250 mil por CPF/instituição",
          "LCI / LCA — isentas de imposto de renda, prazo maior, rendem muito bem",
          "Tesouro IPCA+ — protege contra inflação, ideal pra objetivos de longo prazo (aposentadoria, faculdade dos filhos)",
        ],
      },
      { tipo: "titulo", texto: "O FGC: seu seguro grátis" },
      {
        tipo: "destaque",
        intent: "info",
        titulo: "Fundo Garantidor de Crédito",
        texto:
          "O FGC protege até R$ 250 mil por CPF por instituição financeira. Se o banco quebrar, você recebe seu dinheiro de volta. Esse seguro é grátis e cobre CDB, LCI, LCA, poupança e mais. Cobertura total: R$ 1 milhão por CPF.",
      },
      { tipo: "titulo", texto: "Que produto pra cada objetivo?" },
      {
        tipo: "lista",
        items: [
          "Reserva de emergência → Tesouro Selic ou CDB com liquidez diária",
          "Objetivo curto (até 2 anos) → CDB pré-fixado ou Tesouro Selic",
          "Objetivo médio (2 a 5 anos) → LCI / LCA (isentas de IR)",
          "Aposentadoria, longo prazo → Tesouro IPCA+ ou previdência privada",
        ],
      },
      { tipo: "titulo", texto: "Como começar com R$ 100" },
      {
        tipo: "lista",
        items: [
          "1. Abra conta numa corretora (XP, Inter, Rico, Nubank, BTG, Avenue, Toro…)",
          "2. Transfira o valor inicial (mínimo geralmente R$ 100)",
          "3. Compre Tesouro Selic ou CDB de liquidez diária",
          "4. Configure aporte mensal automático — esquece e deixa render",
        ],
      },
      {
        tipo: "destaque",
        intent: "exemplo",
        titulo: "Caso real: Renato, 38, supervisor",
        texto:
          "Começou com R$ 100 no Tesouro Selic há 8 anos. Aportou R$ 100/mês com disciplina. Hoje tem R$ 16 mil. “A diferença não está no valor, tá na constância. R$ 100 todo mês muda completamente a sua relação com dinheiro.”",
      },
    ],
    perguntas: [
      {
        enunciado: "Como está o rendimento da poupança hoje, comparado com a inflação?",
        opcoes: [
          "Muito acima da inflação",
          "Pouco acima ou abaixo da inflação (perde poder de compra na maioria do tempo)",
          "Igual ao Tesouro Selic",
          "Acima do CDI",
        ],
        correta: 1,
      },
      {
        enunciado: "Pra que serve o FGC?",
        opcoes: [
          "É um imposto sobre investimentos",
          "É o Fundo Garantidor de Crédito — protege até R$ 250 mil em caso de quebra do banco",
          "É uma tarifa do banco",
          "Não existe",
        ],
        correta: 1,
      },
      {
        enunciado: "Pra reserva de emergência, o que escolher?",
        opcoes: [
          "Ações de empresas sólidas pra render mais",
          "Tesouro Selic ou CDB com liquidez diária",
          "Tesouro IPCA+ de longo prazo",
          "Bitcoin",
        ],
        correta: 1,
        explicacao:
          "Reserva precisa estar disponível AGORA quando der problema. Liquidez diária + baixo risco são os critérios.",
      },
    ],
    conclusao:
      "Sua tarefa: abre uma corretora ainda essa semana. Não precisa investir nada hoje — só ABRA a conta. Esse pequeno passo elimina o maior atrito mental que te impede de começar.",
  },
];

export function getLicao(id: number) {
  return licoesModulo1.find((l) => l.id === id);
}

/* =========================================================
 * Módulo 2 — Investir sem mistério
 * =======================================================*/
export const licoesModulo2: Licao[] = [
  {
    id: 101,
    titulo: "Por que investir e não só guardar",
    subtitulo: "Aula 1 · 4 min",
    emoji: "🌱",
    xp: 25,
    hook: "Guardar embaixo do colchão (ou na poupança) é perder dinheiro. Inflação come o que você não faz crescer.",
    video: { titulo: "Investir vs. poupar — o cabo de guerra da inflação", duracao: "4:10", instrutor: "Conteúdo FinUp" },
    conteudo: [
      { tipo: "titulo", texto: "Inflação: o ladrão silencioso" },
      { tipo: "paragrafo", texto: "Em 2024 a inflação no Brasil foi ~4,8%. Significa que R$ 100 hoje compram menos do que R$ 100 compravam 1 ano atrás. Guardar parado = ficar pobre devagar." },
      { tipo: "numero", valor: "−4,8%", legenda: "é o quanto seu dinheiro PARADO perdeu em poder de compra em 2024" },
      { tipo: "titulo", texto: "Investir é defesa, não luxo" },
      { tipo: "paragrafo", texto: "Quem investe NÃO precisa ser rico. Precisa só evitar perder. Tesouro Selic já bate inflação. CDB de banco médio bate mais. Não tem mistério." },
      { tipo: "destaque", intent: "info", titulo: "Regra de ouro", texto: "Reserva primeiro (3-6× gasto mensal), depois investe o que sobrar. Nunca investe dinheiro que você pode precisar amanhã." },
    ],
    perguntas: [
      { enunciado: "Por que dinheiro parado perde valor?", opcoes: ["Por culpa do banco", "Por causa da inflação", "Não perde", "Por causa de impostos"], correta: 1, explicacao: "Inflação corrói poder de compra todo ano." },
      { enunciado: "Qual investimento bate inflação com baixo risco?", opcoes: ["Poupança", "Tesouro Selic ou CDB acima de 100% CDI", "Bitcoin", "Apostar no time do coração"], correta: 1 },
      { enunciado: "Investir é pra ricos?", opcoes: ["Sim, abaixo de 10 mil não vale", "Não — começa com R$ 100", "Só pra economista", "Só pra quem entende de Bolsa"], correta: 1 },
    ],
    conclusao: "Próximo passo: separe HOJE 10% da sua renda pra investir. Se não rola 10%, comece com 5%. Mas COMECE.",
  },
  {
    id: 102,
    titulo: "Renda fixa vs renda variável",
    subtitulo: "Aula 2 · 4 min",
    emoji: "📊",
    xp: 25,
    hook: "Existem dois mundos: o previsível (renda fixa) e o que oscila (variável). Cada um serve pra um momento da vida.",
    video: { titulo: "Os 2 mundos: renda fixa e variável", duracao: "4:25" },
    conteudo: [
      { tipo: "titulo", texto: "Renda fixa: você empresta e sabe quanto vai receber" },
      { tipo: "paragrafo", texto: "Você empresta dinheiro pro governo (Tesouro), pra um banco (CDB), ou pra uma empresa (Debênture). Em troca recebe juros previsíveis. Risco baixo." },
      { tipo: "titulo", texto: "Renda variável: você vira sócio" },
      { tipo: "paragrafo", texto: "Ações, fundos imobiliários, ETFs. Você vira dono de parte de uma empresa ou imóvel. Pode ganhar muito ou perder. Volátil." },
      { tipo: "destaque", intent: "alerta", titulo: "Regra inviolável", texto: "Reserva e objetivos de curto prazo (até 2 anos) → renda fixa. Aposentadoria/longo prazo → pode ter renda variável." },
    ],
    perguntas: [
      { enunciado: "O que é renda fixa?", opcoes: ["Salário fixo", "Investimento com retorno previsível", "Imóveis", "Bitcoin"], correta: 1 },
      { enunciado: "Pra reserva de emergência:", opcoes: ["Renda variável pra render mais", "Renda fixa de liquidez diária", "Misto 50/50", "Não importa"], correta: 1 },
      { enunciado: "Renda variável é pra:", opcoes: ["Sempre, é melhor", "Objetivos de longo prazo onde você aguenta oscilação", "Reserva", "Pagar contas"], correta: 1 },
    ],
    conclusao: "Primeiro 100% da reserva em renda fixa de liquidez diária. Depois, comece a explorar renda variável com 5-10% do que tem investido.",
  },
  {
    id: 103,
    titulo: "Tesouro Direto na prática",
    subtitulo: "Aula 3 · 5 min",
    emoji: "🏛️",
    xp: 30,
    hook: "Tesouro Direto = você empresta pro governo brasileiro. O investimento MAIS SEGURO do país, e começa em R$ 30.",
    video: { titulo: "Como funciona o Tesouro Direto", duracao: "5:30" },
    conteudo: [
      { tipo: "titulo", texto: "3 tipos principais" },
      { tipo: "lista", items: [
        "**Tesouro Selic** — segue a taxa Selic. Bom pra reserva de emergência. Liquidez diária.",
        "**Tesouro IPCA+** — paga inflação + um juro fixo. Bom pra longo prazo (aposentadoria).",
        "**Tesouro Prefixado** — você trava uma taxa hoje. Bom quando os juros estão altos e você acha que vão cair.",
      ]},
      { tipo: "numero", valor: "R$ 30", legenda: "é o valor mínimo pra começar a investir no Tesouro Direto" },
      { tipo: "destaque", intent: "exemplo", titulo: "Passo a passo", texto: "1. Abra conta numa corretora (XP, Inter, Nubank, Rico…). 2. Transfira R$ 100. 3. Procure 'Tesouro Selic' e compre. Pronto." },
    ],
    perguntas: [
      { enunciado: "Qual o investimento mais seguro do Brasil?", opcoes: ["Poupança", "Tesouro Direto", "Bitcoin", "FII"], correta: 1 },
      { enunciado: "Pra reserva de emergência, qual escolher?", opcoes: ["Tesouro Selic", "Tesouro IPCA+ 2045", "Tesouro Prefixado 2030", "Tanto faz"], correta: 0, explicacao: "Selic tem liquidez diária e baixíssima volatilidade." },
      { enunciado: "Valor mínimo no Tesouro Direto?", opcoes: ["R$ 1000", "R$ 100", "R$ 30 aproximadamente", "R$ 10.000"], correta: 2 },
    ],
    conclusao: "Hoje à noite: pesquise 'Tesouro Selic' na sua corretora e veja o valor da cota. Não precisa comprar ainda — só veja. Familiaridade vence medo.",
  },
  {
    id: 104,
    titulo: "CDB, LCI, LCA — desmistificando",
    subtitulo: "Aula 4 · 4 min",
    emoji: "🏦",
    xp: 25,
    hook: "Banco não te paga juros bons. Mas existem CDBs, LCIs e LCAs que pagam acima da Selic — e são igualmente seguros.",
    video: { titulo: "CDB, LCI, LCA — siglas explicadas", duracao: "4:15" },
    conteudo: [
      { tipo: "titulo", texto: "O que cada sigla significa" },
      { tipo: "lista", items: [
        "**CDB** — você empresta pra um banco. Banco te paga juros. Tem IR (15-22,5%).",
        "**LCI** — você empresta pro banco que empresta pro setor imobiliário. ISENTO de IR.",
        "**LCA** — mesmo esquema da LCI, mas pro setor agro. Também ISENTO.",
      ]},
      { tipo: "destaque", intent: "info", titulo: "Por que LCI/LCA paga menos no nominal mas vale mais", texto: "Um CDB a 110% do CDI pode render MENOS que uma LCI a 95% do CDI quando você tira o IR. Sempre compare o LÍQUIDO." },
      { tipo: "destaque", intent: "alerta", titulo: "Banco grande paga mal", texto: "CDB de Itaú/Bradesco/Santander geralmente paga 80-90% do CDI. Banco médio (Inter, BTG, Original) paga 100-115%. Diferença enorme no longo prazo." },
    ],
    perguntas: [
      { enunciado: "Qual investimento NÃO paga IR?", opcoes: ["CDB", "LCI e LCA", "Tesouro Selic", "Fundos DI"], correta: 1 },
      { enunciado: "CDB de banco grande tipicamente rende:", opcoes: ["Mais que CDB de banco médio", "Menos que CDB de banco médio", "Igual", "Não dá pra saber"], correta: 1 },
      { enunciado: "O que importa comparar entre investimentos?", opcoes: ["A taxa bruta sempre", "O rendimento LÍQUIDO depois de IR e taxas", "A marca do banco", "A propaganda"], correta: 1 },
    ],
    conclusao: "Sai do banco gigante. Abra conta numa corretora ou banco digital que pague pelo menos 100% do CDI nos CDBs.",
  },
  {
    id: 105,
    titulo: "Imposto de renda nos investimentos",
    subtitulo: "Aula 5 · 5 min",
    emoji: "📋",
    xp: 35,
    hook: "IR sobre investimentos parece complicado mas é simples: quanto mais tempo você deixa, MENOS imposto paga.",
    video: { titulo: "IR em investimentos — tabela regressiva", duracao: "5:00" },
    conteudo: [
      { tipo: "titulo", texto: "Tabela regressiva (renda fixa)" },
      { tipo: "lista", items: [
        "Até 180 dias: 22,5%",
        "181 a 360 dias: 20%",
        "361 a 720 dias: 17,5%",
        "Acima de 720 dias: 15%",
      ]},
      { tipo: "destaque", intent: "info", titulo: "Lição que vale ouro", texto: "Cada vez que você 'troca' de investimento antes de 2 anos, paga mais IR. Plante e DEIXE crescer." },
      { tipo: "titulo", texto: "Isentos de IR" },
      { tipo: "lista", items: ["LCI e LCA", "Poupança (mas rende mal)", "Dividendos de FIIs", "Ações: até R$ 20 mil vendidos no mês, sem IR"] },
    ],
    perguntas: [
      { enunciado: "Quanto mais tempo eu deixo, o IR:", opcoes: ["Aumenta", "Diminui (regressivo)", "Não muda", "Some"], correta: 1 },
      { enunciado: "Qual investimento é isento de IR?", opcoes: ["CDB", "Tesouro Direto", "LCI", "Ações"], correta: 2 },
      { enunciado: "IR menor pra renda fixa começa após:", opcoes: ["30 dias", "180 dias", "720 dias (2 anos)", "10 anos"], correta: 2 },
    ],
    conclusao: "Compre, segure, esqueça. Esse é o mantra do bom investidor de renda fixa: imposto menor, juros compostos trabalhando.",
  },
];

/* =========================================================
 * Módulo 3 — Dívidas: saindo do vermelho
 * =======================================================*/
export const licoesModulo3: Licao[] = [
  {
    id: 201,
    titulo: "A matemática que mata: juros compostos do mal",
    subtitulo: "Aula 1 · 4 min",
    emoji: "⚠️",
    xp: 25,
    hook: "Juros compostos podem te enriquecer (investindo) ou te destruir (na dívida). É a mesma matemática invertida.",
    video: { titulo: "Como dívidas crescem em bola de neve", duracao: "4:00" },
    conteudo: [
      { tipo: "titulo", texto: "Cheque especial: o pior de todos" },
      { tipo: "paragrafo", texto: "Taxa média do cheque especial no Brasil: 130% AO ANO. Quem usa R$ 1.000 de cheque especial por 12 meses paga R$ 1.300 só de juros." },
      { tipo: "numero", valor: "130%", legenda: "é a taxa anual média do cheque especial. R$ 1.000 vira R$ 2.300 em 1 ano." },
      { tipo: "titulo", texto: "Cartão de crédito rotativo" },
      { tipo: "paragrafo", texto: "Quando você paga o mínimo da fatura, o resto vira rotativo. Taxa: 400% ao ano em alguns bancos. A pior dívida que existe." },
      { tipo: "destaque", intent: "alerta", titulo: "Ordem de prioridade pra quitar", texto: "1. Cartão rotativo, 2. Cheque especial, 3. Empréstimo pessoal, 4. Financiamento de carro, 5. Financiamento imobiliário (último por ter juros menores)." },
    ],
    perguntas: [
      { enunciado: "Pior dívida pra ter?", opcoes: ["Financiamento de carro", "Cartão de crédito rotativo", "Empréstimo da família", "Aluguel atrasado"], correta: 1 },
      { enunciado: "Cheque especial cobra em média:", opcoes: ["10% ao ano", "30%", "130% ao ano", "Nada"], correta: 2 },
      { enunciado: "Por onde começar a quitar?", opcoes: ["Maior dívida", "Menor dívida", "Dívida com juros mais altos", "Dívida mais antiga"], correta: 2, explicacao: "Matemática manda: maior juro primeiro = menos dinheiro perdido." },
    ],
    conclusao: "Liste suas dívidas com a taxa de juros de cada uma. A maior taxa é seu inimigo público número 1.",
  },
  {
    id: 202,
    titulo: "Cartão de crédito: amigo OU inimigo",
    subtitulo: "Aula 2 · 4 min",
    emoji: "💳",
    xp: 25,
    hook: "Cartão de crédito não é dívida — É uma FERRAMENTA. Quem usa certo paga TUDO e ganha milhas. Quem usa errado, paga 400% de juros.",
    video: { titulo: "Como usar cartão sem se queimar", duracao: "4:30" },
    conteudo: [
      { tipo: "titulo", texto: "A regra de ouro do cartão" },
      { tipo: "paragrafo", texto: "Use o cartão SÓ pra coisas que você compraria à vista. E pague SEMPRE o total da fatura. Nunca o mínimo. Nunca parcele a fatura." },
      { tipo: "destaque", intent: "exemplo", titulo: "Quando o cartão vale a pena", texto: "Mercado, gasolina, conta de luz. Você paga no fim do mês com o salário, ganha milhas, e zera. Lucro." },
      { tipo: "destaque", intent: "alerta", titulo: "Sinais de alerta", texto: "Se você usa mais de 30% do limite do cartão, está apertado. Se já parcelou a fatura, PARE de usar o cartão e quite tudo primeiro." },
    ],
    perguntas: [
      { enunciado: "Como usar cartão corretamente?", opcoes: ["Pagar o mínimo todo mês", "Pagar a fatura inteira sempre", "Parcelar tudo", "Não usar nunca"], correta: 1 },
      { enunciado: "Parcelar a fatura é:", opcoes: ["Uma boa ideia", "A pior coisa — juros de 300-400%", "Indiferente", "Recomendado pelo banco"], correta: 1 },
      { enunciado: "Sinal de que você está dependente do cartão:", opcoes: ["Usa mais de 30% do limite todo mês", "Tem cartão", "Compra no débito", "Não tem cartão"], correta: 0 },
    ],
    conclusao: "Se você está parcelando faturas, faça portabilidade do cartão pra um crédito pessoal com juros menores. Renegocie HOJE.",
  },
  {
    id: 203,
    titulo: "Negociando com o banco",
    subtitulo: "Aula 3 · 4 min",
    emoji: "🤝",
    xp: 30,
    hook: "Banco TEM medo de você não pagar. Use isso a seu favor. Negociar dívida não é vergonha — é estratégia.",
    video: { titulo: "Como negociar dívida sem medo", duracao: "4:20" },
    conteudo: [
      { tipo: "titulo", texto: "O segredo que ninguém te contou" },
      { tipo: "paragrafo", texto: "Pra cada R$ 1 de dívida vencida, o banco provisiona como 'pode perder'. Eles preferem receber 40% do que zero. Use isso pra negociar." },
      { tipo: "lista", items: [
        "Ligue ou vá à agência munido da PROPOSTA: 'posso pagar X% à vista'",
        "Comece pedindo 30-40% de desconto",
        "Mire em parcelas que CABEM no seu orçamento (no máximo 20% da renda)",
        "Peça o acordo POR ESCRITO antes de pagar",
      ]},
      { tipo: "destaque", intent: "info", titulo: "Feirões de negociação", texto: "Bancos fazem 'Feirão Limpa Nome' várias vezes no ano. Descontos de até 90% pra dívidas antigas." },
    ],
    perguntas: [
      { enunciado: "Banco prefere:", opcoes: ["Receber 100% sem desconto", "Receber 40% e fechar a dívida", "Esperar pra sempre", "Cobrar judicialmente"], correta: 1 },
      { enunciado: "Antes de pagar acordo, peça:", opcoes: ["Recibo por escrito do acordo", "Conta o dinheiro", "Reza", "Tira foto do gerente"], correta: 0 },
      { enunciado: "Quanto da renda pode comprometer com parcelas?", opcoes: ["Até 50%", "Até 35%", "No máximo 20%", "100%"], correta: 2 },
    ],
    conclusao: "Liste suas dívidas em atraso e ligue HOJE pro banco. Comece pelo maior credor. Você vai se surpreender com o desconto.",
  },
  {
    id: 204,
    titulo: "Bola de neve x avalanche",
    subtitulo: "Aula 4 · 3 min",
    emoji: "❄️",
    xp: 25,
    hook: "Duas estratégias famosas pra quitar dívidas. Uma é matemática. A outra é psicológica. Ambas funcionam.",
    video: { titulo: "Bola de neve vs avalanche", duracao: "3:45" },
    conteudo: [
      { tipo: "titulo", texto: "Avalanche (matemática)" },
      { tipo: "paragrafo", texto: "Quite primeiro a dívida com a MAIOR taxa de juros. Matematicamente é a melhor — você paga menos juros no total." },
      { tipo: "titulo", texto: "Bola de neve (psicológica)" },
      { tipo: "paragrafo", texto: "Quite primeiro a MENOR dívida. Você vê dívida desaparecendo rápido e ganha gás emocional pra seguir." },
      { tipo: "destaque", intent: "info", titulo: "Qual escolher?", texto: "Se você é racional e movido a números → avalanche. Se você precisa de vitórias rápidas pra manter motivação → bola de neve. Ambas levam ao mesmo destino: liberdade." },
    ],
    perguntas: [
      { enunciado: "Avalanche prioriza:", opcoes: ["Menor dívida", "Maior taxa de juros", "Mais antiga", "Aleatório"], correta: 1 },
      { enunciado: "Bola de neve prioriza:", opcoes: ["Maior dívida", "Maior juros", "Menor dívida", "Banco preferido"], correta: 2 },
      { enunciado: "A melhor estratégia é:", opcoes: ["Avalanche sempre", "Bola de neve sempre", "A que você consegue executar até o fim", "Nenhuma"], correta: 2 },
    ],
    conclusao: "Escolha UMA das estratégias hoje. Liste suas dívidas, ordene, e ataque a primeira da lista com tudo.",
  },
  {
    id: 205,
    titulo: "Score de crédito: o que é e como subir",
    subtitulo: "Aula 5 · 4 min",
    emoji: "📈",
    xp: 30,
    hook: "Score é a nota que bancos te dão. Score alto = juros menores, limites maiores, mais oportunidades.",
    video: { titulo: "Score de crédito desmistificado", duracao: "4:10" },
    conteudo: [
      { tipo: "titulo", texto: "Como o score funciona" },
      { tipo: "paragrafo", texto: "Score vai de 0 a 1000. Acima de 700 já é bom. Acima de 900 é excelente. É calculado por empresas como Serasa e Boa Vista, baseado no seu histórico de pagamentos." },
      { tipo: "lista", items: [
        "**Pague contas em dia** (mais impactante)",
        "**Tenha cartão de crédito ativo** com uso baixo (até 30% do limite)",
        "**Cadastre seu CPF** nas notas fiscais (Cadastro Positivo)",
        "**Não peça muitos créditos** num período curto (cada consulta tira pontos)",
      ]},
      { tipo: "destaque", intent: "exemplo", titulo: "Score 850+ na prática", texto: "Você consegue financiamento imobiliário com taxas 30% menores. Cartões com anuidade grátis. Limites maiores em tudo." },
    ],
    perguntas: [
      { enunciado: "Faixa de score 'bom' começa em:", opcoes: ["300", "500", "700", "999"], correta: 2 },
      { enunciado: "O que MAIS impacta o score?", opcoes: ["Idade", "Pagar contas em dia", "Quantos cartões tem", "Salário"], correta: 1 },
      { enunciado: "Uso ideal do limite do cartão:", opcoes: ["100% pra mostrar uso", "Mais que 50%", "Até 30% do limite", "Não importa"], correta: 2 },
    ],
    conclusao: "Cadastre-se em Serasa e veja seu score grátis. Pague as próximas 3 contas em dia e veja o score subir.",
  },
];

/* =========================================================
 * Módulo 4 — Renda extra e crescimento
 * =======================================================*/
export const licoesModulo4: Licao[] = [
  {
    id: 301,
    titulo: "Quanto vale o seu trabalho",
    subtitulo: "Aula 1 · 4 min",
    emoji: "💼",
    xp: 25,
    hook: "Muita gente cobra de menos por insegurança. Aprenda a precificar seu trabalho pelo VALOR que entrega, não pelo tempo.",
    video: { titulo: "Precificar trabalho: do tempo pro valor", duracao: "4:30" },
    conteudo: [
      { tipo: "titulo", texto: "A armadilha do preço-hora" },
      { tipo: "paragrafo", texto: "Cobrar por hora limita seu teto. Quem cobra por entrega ou resultado escala. Um designer que cobra R$ 50/h ganha menos que um que cobra R$ 500 pela logo." },
      { tipo: "destaque", intent: "info", titulo: "Pergunta que muda o jogo", texto: "Quanto seu trabalho FAZ o cliente ganhar (ou economizar)? Cobre uma fatia disso." },
      { tipo: "destaque", intent: "exemplo", titulo: "Caso real", texto: "Freelancer ganhava R$ 30/h fazendo planilhas. Mudou pra cobrar 'R$ 500 por planilha completa que economiza 10h do cliente/mês'. Ganha o triplo." },
    ],
    perguntas: [
      { enunciado: "Cobrar por hora é:", opcoes: ["Sempre melhor", "Limita seu teto de renda", "Não importa", "Errado"], correta: 1 },
      { enunciado: "Como aumentar quanto cobra?", opcoes: ["Trabalhar mais horas", "Mostrar quanto valor entrega ao cliente", "Esperar promoção", "Mudar de área"], correta: 1 },
      { enunciado: "Cobrar por entrega faz você:", opcoes: ["Ganhar menos", "Ficar refém do tempo", "Escalar e ser pago pelo valor", "Trabalhar mais"], correta: 2 },
    ],
    conclusao: "Hoje: liste 1 trabalho que você cobra por hora. Pense em transformá-lo num 'pacote' com preço fechado e valor claro.",
  },
  {
    id: 302,
    titulo: "Skills que rendem dinheiro extra",
    subtitulo: "Aula 2 · 4 min",
    emoji: "🛠️",
    xp: 25,
    hook: "Você já tem habilidades que valem dinheiro. Só precisa empacotá-las e oferecer.",
    video: { titulo: "Skills que rendem em 2026", duracao: "4:00" },
    conteudo: [
      { tipo: "titulo", texto: "As 5 categorias de skill remunerável" },
      { tipo: "lista", items: [
        "**Manual**: serviços (eletricista, pet sitter, costura, jardinagem) — alta demanda local",
        "**Digital**: design, social media, copy, edição de vídeo — escalável global",
        "**Conhecimento**: aulas particulares, mentoria, consultoria — alta margem",
        "**Comercial**: vendas, afiliados, representação — comissões altas",
        "**Cuidados**: babá, cuidador de idoso, cozinha — sempre tem demanda",
      ]},
      { tipo: "destaque", intent: "info", titulo: "Começa SIMPLES", texto: "Pegue 1 skill que você já sabe, oferece pra 5 pessoas conhecidas. Não precisa de marca, site nem nada. Boca a boca é seu primeiro motor." },
    ],
    perguntas: [
      { enunciado: "Pra começar uma renda extra, você precisa:", opcoes: ["Site pronto e marca", "Curso superior", "1 skill que já tem e 5 pessoas que confiem em você", "Investimento alto"], correta: 2 },
      { enunciado: "Skill com alta margem:", opcoes: ["Manual", "Conhecimento (aulas, consultoria)", "Operacional", "Burocrática"], correta: 1 },
      { enunciado: "Renda digital tem como vantagem:", opcoes: ["Mais pesado fisicamente", "É escalável globalmente", "Mais regulamentação", "Não rende"], correta: 1 },
    ],
    conclusao: "Liste 3 coisas que você sabe fazer melhor que a média. Escolha uma. Oferece pra 5 pessoas essa semana.",
  },
  {
    id: 303,
    titulo: "Vendas: o motor de toda renda",
    subtitulo: "Aula 3 · 4 min",
    emoji: "🎯",
    xp: 30,
    hook: "Não importa o que você faz: quem sabe vender ganha mais. Vender não é empurrar — é ENTENDER e RESOLVER.",
    video: { titulo: "Vendas pra quem odeia vender", duracao: "4:15" },
    conteudo: [
      { tipo: "titulo", texto: "Vender é ouvir antes de falar" },
      { tipo: "paragrafo", texto: "Bons vendedores fazem perguntas e escutam. Aí oferecem a solução que o cliente já queria. O resto é técnica." },
      { tipo: "lista", items: [
        "**Antes de oferecer**: entenda a dor do cliente",
        "**Apresente o resultado**, não o produto",
        "**Use prova social** (outros clientes, números, depoimentos)",
        "**Diga o preço com confiança** e fique em silêncio",
        "**Não tenha medo do 'não'** — é parte do processo",
      ]},
      { tipo: "destaque", intent: "exemplo", titulo: "Roteiro simples", texto: "1. 'O que mais te incomoda hoje com [tema]?' 2. 'Entendi. E se você conseguisse [resultado desejado]?' 3. 'Posso te ajudar com isso por R$ X.' 4. Silêncio." },
    ],
    perguntas: [
      { enunciado: "Bom vendedor:", opcoes: ["Fala muito e empurra produto", "Ouve mais do que fala", "Não dá descontos", "Vende a qualquer um"], correta: 1 },
      { enunciado: "Você deve apresentar:", opcoes: ["As features do produto", "O resultado que ele resolve pro cliente", "O preço primeiro", "A sua história"], correta: 1 },
      { enunciado: "Depois de dizer o preço:", opcoes: ["Justifica logo", "Dá desconto antes mesmo de pedir", "Fica em silêncio", "Pede desculpa"], correta: 2 },
    ],
    conclusao: "Próxima venda (ou negociação): pergunte mais, escute mais, fale o preço com confiança e fique em silêncio depois.",
  },
  {
    id: 304,
    titulo: "Empreender com pouco",
    subtitulo: "Aula 4 · 4 min",
    emoji: "🚀",
    xp: 30,
    hook: "Não precisa de R$ 50 mil de capital pra empreender. Os maiores negócios começaram pequenos e validaram antes de escalar.",
    video: { titulo: "Empreender lean: começa enxuto", duracao: "4:40" },
    conteudo: [
      { tipo: "titulo", texto: "A mentalidade do lean" },
      { tipo: "paragrafo", texto: "Antes de investir, VALIDA. Antes de comprar estoque, VENDA. Antes de criar app, faça à mão. O dinheiro vem depois da validação, não antes." },
      { tipo: "destaque", intent: "exemplo", titulo: "Como validar uma ideia em 1 semana", texto: "1. Conversa com 10 pessoas do público-alvo. 2. Pergunta sobre o problema, não sobre a solução. 3. Se 7+ confirmam a dor, ofereça resolver. 4. Cobra antes de entregar. 5. Entrega na mão se precisar." },
      { tipo: "destaque", intent: "alerta", titulo: "Erros que matam empresas novas", texto: "1. Gastar antes de vender. 2. Confiar em opinião de amigos. 3. Esconder o produto perfeccionando. 4. Não cobrar. 5. Não medir o que está dando certo." },
    ],
    perguntas: [
      { enunciado: "Empreender exige:", opcoes: ["R$ 50 mil de capital", "Validar antes de investir", "Curso superior", "Sorte"], correta: 1 },
      { enunciado: "Validação ideal:", opcoes: ["Pesquisa de mercado paga", "Vender antes de produzir", "Esperar inspiração", "Copiar concorrente"], correta: 1 },
      { enunciado: "Maior erro de empreendedor novato:", opcoes: ["Vender muito", "Gastar antes de validar com cliente", "Cobrar caro", "Trabalhar de casa"], correta: 1 },
    ],
    conclusao: "Tem uma ideia há tempo? Vá hoje e converse com 3 pessoas que poderiam ser seu cliente. Pergunta antes de pitchar.",
  },
  {
    id: 305,
    titulo: "Negociando aumento de salário",
    subtitulo: "Aula 5 · 4 min",
    emoji: "📈",
    xp: 30,
    hook: "Pedir aumento dá nervoso, mas é UMA conversa por ano que pode te render R$ 10-30 mil/ano. Vale o desconforto.",
    video: { titulo: "Como pedir aumento e receber", duracao: "4:20" },
    conteudo: [
      { tipo: "titulo", texto: "Prepare antes de pedir" },
      { tipo: "lista", items: [
        "**Liste 3-5 resultados** mensuráveis que você entregou no último ano",
        "**Pesquise** o salário da sua função no mercado (Glassdoor, LinkedIn, Vagas)",
        "**Defina o valor que você quer** — específico, não 'um aumento'",
        "**Agende uma conversa** formal — não pegue o chefe de surpresa",
      ]},
      { tipo: "titulo", texto: "Durante a conversa" },
      { tipo: "paragrafo", texto: "Apresente os resultados PRIMEIRO. Mostre como você tá hoje vs. quando entrou. Aí pede. Frase mágica: 'Pelo que entreguei e pela referência de mercado, acho justo um salário de R$ X. Como vocês veem isso?'" },
      { tipo: "destaque", intent: "info", titulo: "Se ouvir 'não'", texto: "Pergunte: 'O que eu precisaria entregar nos próximos 6 meses pra essa conversa ser sim?' Saia com um caminho claro, não vazio." },
    ],
    perguntas: [
      { enunciado: "Antes de pedir aumento:", opcoes: ["Mande email mal-humorado", "Liste resultados que entregou e pesquise mercado", "Espere chefe puxar", "Ameace sair"], correta: 1 },
      { enunciado: "Como apresentar o pedido?", opcoes: ["'Tô precisando de dinheiro'", "'Pela minha entrega e mercado, vejo X como justo'", "'Outros ganham mais'", "Por escrito anônimo"], correta: 1 },
      { enunciado: "Se a resposta for não:", opcoes: ["Ameace pedir demissão", "Pergunte o que precisa entregar pra ser sim", "Reclame", "Aceite calado"], correta: 1 },
    ],
    conclusao: "Calendário: marque pra revisar seu salário 1× por ano. Sempre prepare a conversa com dados.",
  },
];

/* =========================================================
 * Módulo 5 — Patrimônio e longo prazo
 * =======================================================*/
export const licoesModulo5: Licao[] = [
  {
    id: 401,
    titulo: "Aposentadoria: começar cedo importa",
    subtitulo: "Aula 1 · 5 min",
    emoji: "🌅",
    xp: 35,
    hook: "Quem começa a guardar pra aposentadoria aos 25 tem 4× mais que quem começa aos 40 — mesmo guardando o mesmo valor.",
    video: { titulo: "O preço de esperar pra começar", duracao: "5:00" },
    conteudo: [
      { tipo: "titulo", texto: "A matemática brutal dos juros compostos no longo prazo" },
      { tipo: "paragrafo", texto: "Ana começa aos 25 anos e investe R$ 300/mês até os 60. João começa aos 40 e investe R$ 600/mês até os 60. A 8%a.a., quem tem mais no fim?" },
      { tipo: "numero", valor: "R$ 690 mil", legenda: "Ana acumula. João, mesmo investindo o DOBRO, fica com R$ 340 mil." },
      { tipo: "destaque", intent: "info", titulo: "O fator decisivo é o TEMPO", texto: "Não é quanto. É QUANDO. Cada década perdida custa MUITO mais que o triplo do esforço depois." },
    ],
    perguntas: [
      { enunciado: "O fator mais importante pra aposentadoria:", opcoes: ["Quanto você ganha", "Quando você começa", "Em que investe", "A inflação"], correta: 1 },
      { enunciado: "Quem começa 15 anos antes:", opcoes: ["Tem 2x mais", "Tem 4x mais com o mesmo aporte", "Tem o mesmo", "Tem menos"], correta: 1 },
      { enunciado: "Estratégia ótima pros 20+:", opcoes: ["Gastar tudo, depois penso", "Investir o que sobrar do mês", "Investir 10-15% da renda automaticamente", "Esperar ficar rico primeiro"], correta: 2 },
    ],
    conclusao: "Hoje: programe um aporte automático mensal numa corretora. Mesmo que seja R$ 50. O importante é COMEÇAR.",
  },
  {
    id: 402,
    titulo: "Previdência privada vs Tesouro",
    subtitulo: "Aula 2 · 4 min",
    emoji: "🏛️",
    xp: 30,
    hook: "Banco te empurra previdência privada. Quase sempre você sai ganhando MAIS com Tesouro IPCA+ direto. Vamos ver por quê.",
    video: { titulo: "Previdência privada na real", duracao: "4:30" },
    conteudo: [
      { tipo: "titulo", texto: "PGBL vs VGBL" },
      { tipo: "lista", items: [
        "**PGBL** — abate até 12% da renda no IR. Vale só se você declara IR completo.",
        "**VGBL** — não abate. IR só no resgate, sobre o rendimento.",
      ]},
      { tipo: "destaque", intent: "alerta", titulo: "O problema com previdências de banco", texto: "Taxas de administração de 2-4% ao ano + carregamento na entrada/saída. Em 30 anos, isso COME 30-50% do seu patrimônio." },
      { tipo: "titulo", texto: "Alternativa: Tesouro IPCA+ longo" },
      { tipo: "paragrafo", texto: "Tesouro IPCA+ 2055, taxa de 0,1% ao ano (corretora boa). Você paga MUITO menos taxa e rende mais." },
    ],
    perguntas: [
      { enunciado: "Maior problema das previdências de banco:", opcoes: ["Baixa rentabilidade", "Taxas administrativas altas", "Risco alto", "Inflação"], correta: 1 },
      { enunciado: "PGBL faz sentido pra:", opcoes: ["Todo mundo", "Quem faz declaração completa de IR", "Quem ganha pouco", "Quem é autônomo"], correta: 1 },
      { enunciado: "Alternativa mais simples:", opcoes: ["Bitcoin", "Tesouro IPCA+ de longo prazo direto", "Poupança", "Ações"], correta: 1 },
    ],
    conclusao: "Tem previdência de banco? Verifique a taxa de administração. Se for >1,5%a.a., considere migrar pra Tesouro IPCA+ direto.",
  },
  {
    id: 403,
    titulo: "Comprar ou alugar imóvel?",
    subtitulo: "Aula 3 · 5 min",
    emoji: "🏠",
    xp: 35,
    hook: "Pergunta de R$ 500 mil. A resposta não é universal — depende do imóvel, do preço e do que você faria com o dinheiro.",
    video: { titulo: "Comprar vs alugar: a conta real", duracao: "5:00" },
    conteudo: [
      { tipo: "titulo", texto: "A conta que você precisa fazer" },
      { tipo: "paragrafo", texto: "Compare: (a) custo do financiamento (juros + IPTU + condomínio + manutenção) por mês com (b) aluguel + investir a diferença a 8%a.a." },
      { tipo: "destaque", intent: "exemplo", titulo: "Caso real", texto: "Imóvel R$ 500k, entrada 20%, parcela R$ 4.500/mês 30 anos. Aluguel mesma região: R$ 2.200. Diferença R$ 2.300/mês investida a 8%a.a. em 30 anos = R$ 3,4 MI." },
      { tipo: "destaque", intent: "info", titulo: "Quando comprar faz sentido", texto: "1. Você sabe que vai ficar 10+ anos. 2. Preço do imóvel está abaixo do justo (15-20% abaixo da média do bairro). 3. Aluguel similar custa mais que a parcela." },
    ],
    perguntas: [
      { enunciado: "Comprar é melhor quando:", opcoes: ["Sempre", "Você sabe que vai ficar 10+ anos no imóvel", "Banco oferece taxa boa", "Família pressiona"], correta: 1 },
      { enunciado: "No alugar+investir, o que matemática diz:", opcoes: ["Sempre perde pro comprar", "Pode ser MUITO melhor financeiramente", "É indiferente", "Não dá pra calcular"], correta: 1 },
      { enunciado: "Custo HIDDEN de comprar:", opcoes: ["IPTU, condomínio, manutenção, taxa do financiamento", "Só os juros", "Nada", "Só o preço da casa"], correta: 0 },
    ],
    conclusao: "Antes de financiar, faça a conta detalhada por 5 anos. Use uma planilha. A decisão emocional pode custar caro.",
  },
  {
    id: 404,
    titulo: "Seguros essenciais",
    subtitulo: "Aula 4 · 4 min",
    emoji: "🛡️",
    xp: 30,
    hook: "Seguros não são gastos — são proteção contra cenários catastróficos. Os essenciais são poucos.",
    video: { titulo: "Os 3 seguros que valem a pena", duracao: "4:00" },
    conteudo: [
      { tipo: "titulo", texto: "Os 3 essenciais" },
      { tipo: "lista", items: [
        "**Seguro de vida** — pra quem TEM dependentes (filhos, cônjuge sem renda). Cobre 10-20× sua renda anual.",
        "**Plano de saúde** — emergências médicas privadas custam R$ 30k+ facilmente. Plano de R$ 300-600/mês evita catástrofe.",
        "**Seguro do imóvel** — incêndio, raio, explosão. R$ 30-50/mês evita perder o patrimônio principal.",
      ]},
      { tipo: "destaque", intent: "alerta", titulo: "Seguros que geralmente NÃO valem", texto: "Seguro de celular (pague à vista, é menos), garantia estendida (custa quase o produto), seguro de TV/eletrodomésticos." },
    ],
    perguntas: [
      { enunciado: "Seguro de vida é essencial pra:", opcoes: ["Todo mundo", "Quem tem dependentes", "Solteiros", "Aposentados"], correta: 1 },
      { enunciado: "Seguro de celular vale:", opcoes: ["Sempre", "Geralmente não — custa quase o produto", "Sim, sempre vale", "Não sei"], correta: 1 },
      { enunciado: "Plano de saúde:", opcoes: ["É luxo", "Pode evitar gasto catastrófico em emergência", "Não vale a pena nunca", "Só pra idoso"], correta: 1 },
    ],
    conclusao: "Revise: você tem seguro de vida proporcional aos seus dependentes? Plano de saúde mesmo simples? Seguro do imóvel se for proprietário?",
  },
  {
    id: 405,
    titulo: "Legado: protegendo quem você ama",
    subtitulo: "Aula 5 · 5 min",
    emoji: "❤️",
    xp: 40,
    hook: "Educação financeira não é só pra você. É pra sua família continuar bem depois que você se for. Planejamento sucessório não é luxo de rico.",
    video: { titulo: "Herança e sucessão: o básico", duracao: "5:15" },
    conteudo: [
      { tipo: "titulo", texto: "Por que isso importa" },
      { tipo: "paragrafo", texto: "No Brasil, inventário sem testamento pode demorar 3-5 anos e custar 5-10% do patrimônio em taxas. Com planejamento, pode ser instantâneo." },
      { tipo: "lista", items: [
        "**Faça testamento** — mesmo simples, vale registrado em cartório (R$ 300-1000)",
        "**Use beneficiários** — em previdência, seguro de vida e contas conjuntas",
        "**Documente patrimônio** — uma planilha simples com contas, investimentos, imóveis",
        "**Converse com família** — segredos só pioram a transição",
      ]},
      { tipo: "destaque", intent: "info", titulo: "ITCMD: o imposto da herança", texto: "Varia de 2% a 8% por estado. Existem estratégias legais pra reduzir (doação em vida, holding familiar pra patrimônios maiores)." },
    ],
    perguntas: [
      { enunciado: "Inventário sem testamento:", opcoes: ["É rápido", "Pode demorar anos e custar 5-10% do patrimônio", "Não existe", "É grátis"], correta: 1 },
      { enunciado: "Maneira simples de proteger família:", opcoes: ["Esconder bens", "Indicar beneficiários em previdência e seguros", "Não falar do assunto", "Esperar"], correta: 1 },
      { enunciado: "ITCMD é:", opcoes: ["Imposto da herança", "Imposto da renda", "Imposto do IPVA", "Não existe"], correta: 0 },
    ],
    conclusao: "Esse mês: faça uma planilha simples listando contas, investimentos e seguros. Compartilhe com alguém de confiança. Esse é o primeiro passo.",
  },
];

/* =========================================================
 * Catálogo de módulos
 * =======================================================*/

export const modulos: Modulo[] = [
  {
    id: 1,
    titulo: "Bases da educação financeira",
    descricao: "Onde tudo começa",
    recompensa: "Badge + 100 XP bônus",
    licoes: licoesModulo1,
  },
  {
    id: 2,
    titulo: "Investir sem mistério",
    descricao: "Da reserva ao Tesouro Direto, sem termos chatos",
    recompensa: "Badge + 150 XP bônus",
    licoes: licoesModulo2,
  },
  {
    id: 3,
    titulo: "Saindo do vermelho",
    descricao: "Estratégias pra zerar dívidas e nunca mais voltar pra elas",
    recompensa: "Badge + 150 XP bônus",
    licoes: licoesModulo3,
  },
  {
    id: 4,
    titulo: "Renda extra e crescimento",
    descricao: "Como aumentar quanto você ganha — venda, freela ou empreender",
    recompensa: "Badge + 200 XP bônus",
    licoes: licoesModulo4,
  },
  {
    id: 5,
    titulo: "Patrimônio e longo prazo",
    descricao: "Aposentadoria, imóveis, seguros e legado familiar",
    recompensa: "Badge + 200 XP bônus",
    licoes: licoesModulo5,
  },
];

/** Acha uma aula pelo id em qualquer módulo */
export function getLicaoGlobal(id: number) {
  for (const m of modulos) {
    const l = m.licoes.find((x) => x.id === id);
    if (l) return { modulo: m, licao: l };
  }
  return null;
}
