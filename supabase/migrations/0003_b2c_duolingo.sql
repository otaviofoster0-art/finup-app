-- =====================================================================
-- 0003 — B2C + game mechanics estilo Duolingo
-- =====================================================================
-- Adiciona em profiles: xp_total, nivel, streak, streak_last_day,
-- vidas, vidas_proxima_recarga.
-- Cria tabela modulos_pulados pra registrar provas de skip.
-- Atualiza view lesson_ranking pra usar xp_total agregado do profile
-- (passa a refletir XP de aulas + skip).
-- =====================================================================

alter table public.profiles
  add column if not exists xp_total integer not null default 0,
  add column if not exists nivel integer not null default 1,
  add column if not exists streak integer not null default 0,
  add column if not exists streak_last_day date,
  add column if not exists vidas integer not null default 5 check (vidas between 0 and 5),
  add column if not exists vidas_proxima_recarga timestamptz;

-- =========================================================
-- modulos_pulados — registro de quem passou em prova de skip
-- =========================================================
create table if not exists public.modulos_pulados (
  user_id      uuid not null references auth.users on delete cascade,
  modulo_id    integer not null,
  acertos      integer not null,
  total        integer not null,
  criado_em    timestamptz not null default now(),
  primary key (user_id, modulo_id)
);

alter table public.modulos_pulados enable row level security;

create policy "modulos_pulados_owner_read" on public.modulos_pulados
  for select to authenticated using (auth.uid() = user_id);
create policy "modulos_pulados_owner_insert" on public.modulos_pulados
  for insert to authenticated with check (auth.uid() = user_id);

-- =========================================================
-- Ranking — agora usa xp_total do profile (cobre aulas + skip)
-- =========================================================
create or replace view public.lesson_ranking as
select
  pr.id as user_id,
  pr.nome,
  pr.empresa,
  pr.foto_url,
  coalesce(pr.xp_total, 0) as xp_total,
  coalesce(pr.nivel, 1) as nivel,
  coalesce(pr.streak, 0) as streak,
  coalesce((
    select count(*) from public.lesson_progress lp
    where lp.user_id = pr.id and lp.concluida
  ), 0) as licoes_concluidas
from public.profiles pr
where pr.onboarding_completo;

grant select on public.lesson_ranking to authenticated;
