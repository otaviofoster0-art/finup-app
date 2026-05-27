-- =====================================================================
-- FinUp — schema inicial
-- =====================================================================
-- Tabelas:
--   profiles            (1×1 com auth.users)
--   user_categories     (categorias customizadas por usuário)
--   transactions        (receitas/despesas)
--   caixinhas           (objetivos de poupança)
--   posts               (feed corporativo)
--   post_likes          (curtidas)
--   lesson_progress     (progresso por aula)
-- =====================================================================

create extension if not exists "pgcrypto";

-- =========================================================
-- 1. PROFILES
-- =========================================================
create table public.profiles (
  id              uuid primary key references auth.users on delete cascade,
  nome            text not null,
  email           text,
  empresa         text,
  cargo           text,
  bio             text,
  sonho           text,
  valor_sonho     numeric,
  foto_url        text,
  onboarding_completo boolean not null default false,
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

create index profiles_nome_idx on public.profiles using gin (to_tsvector('portuguese', nome));
create index profiles_empresa_idx on public.profiles (empresa);

alter table public.profiles enable row level security;

-- Todo mundo logado vê todos os profiles (feed precisa disso)
create policy "profiles_select_all" on public.profiles
  for select to authenticated using (true);

-- Só o dono atualiza
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Só o dono insere o próprio
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

-- =========================================================
-- 2. USER_CATEGORIES
-- =========================================================
create table public.user_categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  nome        text not null,
  tipo        text not null check (tipo in ('receita','despesa')),
  emoji       text not null default '📦',
  cor         text not null default 'bg-text-muted',
  hex         text not null default '#94A3B8',
  alerta      boolean not null default false,
  ordem       integer not null default 100,
  criada_em   timestamptz not null default now()
);

create index user_categories_user_idx on public.user_categories (user_id, tipo, ordem);

alter table public.user_categories enable row level security;

create policy "user_categories_owner_all" on public.user_categories
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- 3. TRANSACTIONS
-- =========================================================
create table public.transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users on delete cascade,
  descricao     text not null,
  valor         numeric(14,2) not null check (valor > 0),
  tipo          text not null check (tipo in ('receita','despesa')),
  categoria_id  uuid references public.user_categories on delete set null,
  data          date not null default current_date,
  criado_em     timestamptz not null default now()
);

create index transactions_user_data_idx on public.transactions (user_id, data desc);

alter table public.transactions enable row level security;

create policy "transactions_owner_all" on public.transactions
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- 4. CAIXINHAS
-- =========================================================
create table public.caixinhas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  nome        text not null,
  meta        numeric(14,2) not null check (meta > 0),
  atual       numeric(14,2) not null default 0 check (atual >= 0),
  emoji       text not null default '🎯',
  cor_class   text not null default 'from-brand to-brand-bright',
  criada_em   timestamptz not null default now()
);

create index caixinhas_user_idx on public.caixinhas (user_id, criada_em desc);

alter table public.caixinhas enable row level security;

create policy "caixinhas_owner_all" on public.caixinhas
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- 5. POSTS (feed visível pra todos)
-- =========================================================
create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  texto       text not null check (length(texto) between 1 and 800),
  badge       text,
  criado_em   timestamptz not null default now()
);

create index posts_criado_idx on public.posts (criado_em desc);
create index posts_user_idx on public.posts (user_id, criado_em desc);

alter table public.posts enable row level security;

-- Qualquer logado pode ler todos os posts
create policy "posts_select_all" on public.posts
  for select to authenticated using (true);

-- Só o dono cria/edita/apaga o próprio
create policy "posts_insert_own" on public.posts
  for insert to authenticated with check (auth.uid() = user_id);
create policy "posts_update_own" on public.posts
  for update to authenticated using (auth.uid() = user_id);
create policy "posts_delete_own" on public.posts
  for delete to authenticated using (auth.uid() = user_id);

-- =========================================================
-- 6. POST_LIKES
-- =========================================================
create table public.post_likes (
  post_id    uuid not null references public.posts on delete cascade,
  user_id    uuid not null references auth.users on delete cascade,
  criado_em  timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index post_likes_post_idx on public.post_likes (post_id);

alter table public.post_likes enable row level security;

create policy "post_likes_select_all" on public.post_likes
  for select to authenticated using (true);
create policy "post_likes_insert_own" on public.post_likes
  for insert to authenticated with check (auth.uid() = user_id);
create policy "post_likes_delete_own" on public.post_likes
  for delete to authenticated using (auth.uid() = user_id);

-- =========================================================
-- 7. LESSON_PROGRESS
-- =========================================================
create table public.lesson_progress (
  user_id     uuid not null references auth.users on delete cascade,
  modulo_id   integer not null,
  licao_id    integer not null,
  concluida   boolean not null default false,
  acertos     integer not null default 0,
  xp_ganho    integer not null default 0,
  concluida_em timestamptz,
  primary key (user_id, licao_id)
);

create index lesson_progress_user_idx on public.lesson_progress (user_id, modulo_id);

alter table public.lesson_progress enable row level security;

-- Todo mundo lê pra montar ranking
create policy "lesson_progress_select_all" on public.lesson_progress
  for select to authenticated using (true);
create policy "lesson_progress_owner_write" on public.lesson_progress
  for insert to authenticated with check (auth.uid() = user_id);
create policy "lesson_progress_owner_update" on public.lesson_progress
  for update to authenticated using (auth.uid() = user_id);

-- =========================================================
-- 8. TRIGGER: auto-criar profile + categorias default no signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  nome_default text := coalesce(
    new.raw_user_meta_data->>'nome',
    split_part(new.email, '@', 1)
  );
begin
  -- profile
  insert into public.profiles (id, email, nome, empresa)
  values (
    new.id,
    new.email,
    nome_default,
    coalesce(new.raw_user_meta_data->>'empresa', null)
  );

  -- categorias padrão (despesas)
  insert into public.user_categories (user_id, nome, tipo, emoji, cor, hex, alerta, ordem) values
    (new.id, 'Salário',           'receita', '💼', 'bg-success',      '#3FB87A', false,  1),
    (new.id, 'Bônus / Comissão',  'receita', '🎯', 'bg-success',      '#58C492', false,  2),
    (new.id, 'Renda extra',       'receita', '💸', 'bg-success',      '#7AD1A6', false,  3),
    (new.id, 'Mercado',           'despesa', '🛒', 'bg-brand',        '#1948C9', false, 10),
    (new.id, 'Moradia',           'despesa', '🏠', 'bg-accent',       '#5BA0FF', false, 11),
    (new.id, 'Transporte',        'despesa', '🚌', 'bg-accent',       '#2D7CFF', false, 12),
    (new.id, 'Assinaturas',       'despesa', '📺', 'bg-warning',      '#F59E0B', true,  13),
    (new.id, 'Apostas',           'despesa', '🎰', 'bg-danger',       '#E04646', true,  14),
    (new.id, 'Festa / Lazer',     'despesa', '🍻', 'bg-warning',      '#F0B130', true,  15),
    (new.id, 'Saúde',             'despesa', '❤️', 'bg-brand-bright', '#0A2A6E', false, 16),
    (new.id, 'Educação',          'despesa', '📚', 'bg-brand',        '#3164D8', false, 17),
    (new.id, 'Outros',            'despesa', '📦', 'bg-text-muted',   '#94A3B8', false, 99);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================
-- 9. VIEW: posts com dados do autor (otimização)
-- =========================================================
create or replace view public.posts_with_author as
select
  p.*,
  pr.nome      as autor_nome,
  pr.empresa   as autor_empresa,
  pr.cargo     as autor_cargo,
  pr.foto_url  as autor_foto,
  (select count(*) from public.post_likes pl where pl.post_id = p.id) as curtidas,
  exists (
    select 1 from public.post_likes pl
    where pl.post_id = p.id and pl.user_id = auth.uid()
  ) as curtido_por_mim
from public.posts p
join public.profiles pr on pr.id = p.user_id;

grant select on public.posts_with_author to authenticated;

-- =========================================================
-- 10. REALTIME — habilitar publicação pra posts e likes
-- =========================================================
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.post_likes;
