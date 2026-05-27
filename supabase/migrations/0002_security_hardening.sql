-- =====================================================================
-- 0002 — hardening de segurança
-- =====================================================================
-- Problema: a policy original em `profiles` permitia que qualquer
-- usuário logado lesse TODOS os profiles, incluindo email e foto.
-- Solução: profiles passa a ser owner-only; criamos uma VIEW pública
-- com apenas as colunas seguras (sem email, sem valor_sonho).
-- =====================================================================

-- 1) Tira a policy permissiva e cria owner-only
drop policy if exists "profiles_select_all" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);

-- 2) View pública com colunas seguras (sem email, sem valor_sonho)
--    Views por padrão rodam com privilégios do owner (postgres), o que
--    significa que bypassa RLS. Como expomos só colunas não-sensíveis,
--    é o trade-off correto pra feed/ranking funcionarem.
create or replace view public.public_profiles as
select
  id,
  nome,
  empresa,
  cargo,
  bio,
  sonho,
  foto_url,
  criado_em
from public.profiles;

grant select on public.public_profiles to authenticated;
grant select on public.public_profiles to anon;

-- 3) Garantir que posts_with_author continua bypass-RLS (security_invoker = false)
--    e expõe APENAS colunas seguras
create or replace view public.posts_with_author as
select
  p.id,
  p.user_id,
  p.texto,
  p.badge,
  p.criado_em,
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

-- 4) Garantir que ranking de lessons NÃO vaza email
--    A view abaixo pode ser usada no futuro pra mostrar ranking sem email
create or replace view public.lesson_ranking as
select
  lp.user_id,
  pr.nome,
  pr.empresa,
  pr.foto_url,
  sum(lp.xp_ganho) as xp_total,
  count(*) filter (where lp.concluida) as licoes_concluidas
from public.lesson_progress lp
join public.profiles pr on pr.id = lp.user_id
group by lp.user_id, pr.nome, pr.empresa, pr.foto_url;

grant select on public.lesson_ranking to authenticated;
