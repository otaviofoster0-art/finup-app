# FinUp

> Educação financeira que transforma futuros.

App de benefício corporativo: ajuda funcionários a controlar despesas, aprender sobre dinheiro via trilha estilo Duolingo e compartilhar conquistas com colegas.

**Stack**: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (Auth + Postgres + Realtime).

---

## ⚡ Setup rápido

```bash
# 1) Instale dependências
npm install

# 2) Configure suas variáveis de ambiente
cp .env.example .env.local
# edite .env.local com a URL e anon key do seu projeto Supabase

# 3) Rode
npm run dev
```

Abre em [http://localhost:3000](http://localhost:3000).

---

## 🚀 Criando o projeto Supabase (1 vez só)

Você tem dois caminhos. Escolha um.

### Opção A — Pela interface web (mais simples)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta.
2. Clique em **New project**. Dê um nome (ex: `finup-prod`), defina uma senha forte pro banco e escolha a região (`sa-east-1` se for público no Brasil).
3. Aguarde ~2 minutos enquanto provisiona.
4. Depois de criado, vá em **Settings → API**. Copie:
   - **Project URL** → cola em `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → cola em `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Vá em **SQL Editor → New query**. Cole o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) e clique **Run**.

Pronto. App já funciona ponta a ponta.

### Opção B — Pelo Supabase CLI

```bash
# 1) Faça login (abre o navegador uma vez)
npx supabase login

# 2) Crie um novo projeto na sua organização
npx supabase projects create finup-prod --region sa-east-1

# 3) Linka esse repo com o projeto remoto
#    (pega o project-ref na URL do dashboard, ex: abcdefghijklm.supabase.co → "abcdefghijklm")
npx supabase link --project-ref SEU_PROJECT_REF

# 4) Aplica todas as migrações (cria as tabelas, RLS, triggers)
npx supabase db push

# 5) Coloca as credenciais no .env.local
#    Settings → API → copia URL e anon key
```

---

## 🔐 Segurança

- **Nenhum secret vai pro git**: tudo sensível mora em `.env.local`, que está no `.gitignore`.
- **RLS (Row Level Security)** está ATIVA em todas as tabelas — cada usuário só lê/escreve seus próprios dados.
- O **`anon key` é público por design** (vai no bundle do navegador). A segurança vem das RLS policies, não dela.
- Confirmação de email está **desligada por padrão em dev** (`supabase/config.toml`). Em produção: ligue em **Authentication → Email**.

---

## 📁 Estrutura

```
prospera-app/
├── app/                       # rotas Next.js
│   ├── (app)/                 # área autenticada (Carteira, Trilha, Feed, Perfil)
│   ├── auth/callback/         # callback de email/recovery
│   ├── login/                 # login + signup com Supabase Auth
│   ├── onboarding/            # fluxo de boas-vindas
│   └── page.tsx               # welcome / landing
├── components/                # UI compartilhada
├── lib/
│   ├── hooks/                 # hooks de dados (Supabase)
│   ├── supabase/              # cliente + tipos
│   ├── lessons.ts             # conteúdo de 5 módulos de aulas
│   ├── session.ts             # helpers de perfil
│   └── utils.ts               # cn, BRL, juros compostos
├── supabase/
│   ├── config.toml            # configuração local
│   └── migrations/            # SQL
└── middleware.ts              # proteção de rotas
```

---

## 🧱 Schema do banco

7 tabelas, todas com **RLS ativa**:

| Tabela | RLS | Realtime |
|---|---|---|
| `profiles` | leitura por qualquer logado, escrita só do dono | — |
| `user_categories` | só o dono lê e escreve | — |
| `transactions` | só o dono lê e escreve | — |
| `caixinhas` | só o dono lê e escreve | — |
| `posts` | leitura por qualquer logado, escrita só do dono | ✅ |
| `post_likes` | leitura por qualquer logado, escrita só do dono | ✅ |
| `lesson_progress` | leitura por qualquer logado, escrita só do dono | — |

**Trigger automático no signup**: ao criar conta, o banco cria um `profile` vazio e popula 12 categorias padrão de receita/despesa pra esse usuário.

Há ainda a **view** `posts_with_author` que junta `posts` + `profiles` + contagem de likes pra otimizar o feed.

---

## 🎬 Vídeos das aulas

O componente `VideoPlaceholder` simula um player com barra de progresso. Pra colocar vídeo real depois:

1. Suba o vídeo no YouTube/Vimeo (ou no Supabase Storage).
2. Em `lib/lessons.ts`, adicione o campo `video.url` na lição.
3. No `components/video-placeholder.tsx`, troque o bloco de "play simulado" por um `<iframe>` ou `<video>` real e dispare `onAssistido()` quando terminar (`onEnded` event).

---

## 📤 Push pro GitHub

```bash
# 1) Crie um repo NOVO em https://github.com/new (não inicialize com README)
# 2) Copie a URL (ex: https://github.com/SEU_USUARIO/finup-app.git)

# 3) Conecte e suba
git remote add origin https://github.com/SEU_USUARIO/finup-app.git
git branch -M main
git push -u origin main
```

Em deploys (Vercel, Netlify, Railway): adicione as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no painel da plataforma. Nunca commit elas.

---

## 🛠 Comandos úteis

```bash
npm run dev        # dev server
npm run build      # build de produção
npm run start      # roda o build
npm run lint       # linter
```

---

## ✨ Roadmap curto

- [ ] Vídeos reais nas aulas (YouTube/Vimeo embed)
- [ ] Comentários em posts
- [ ] Notificações in-app
- [ ] Integração com Open Finance pra importar extrato
- [ ] Painel administrativo pra empresas (RH ver engajamento)
- [ ] App nativo (Capacitor ou React Native)
