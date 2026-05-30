-- =====================================================================
-- 0004 — Funções atômicas pra XP e vidas (evita stale state no client)
-- =====================================================================
-- ganhar_xp e perder_vida fazem o cálculo no servidor, de forma atômica,
-- imunes a problemas de closure/timing no React. Recalculam nível e streak.
-- =====================================================================

create or replace function public.ganhar_xp(p_xp integer)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.profiles;
begin
  update public.profiles
  set xp_total = xp_total + greatest(0, p_xp),
      nivel = floor(sqrt((xp_total + greatest(0, p_xp))::float / 50)) + 1,
      streak = case
                 when streak_last_day = current_date then greatest(1, streak)
                 when streak_last_day = current_date - 1 then streak + 1
                 else 1
               end,
      streak_last_day = current_date
  where id = auth.uid()
  returning * into r;
  return r;
end;
$$;

create or replace function public.perder_vida()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.profiles;
begin
  update public.profiles
  set vidas = greatest(0, vidas - 1),
      vidas_proxima_recarga = case
        when vidas >= 5 or vidas_proxima_recarga is null
          then now() + interval '4 hours'
        else vidas_proxima_recarga
      end
  where id = auth.uid() and vidas > 0
  returning * into r;

  if r.id is null then
    select * into r from public.profiles where id = auth.uid();
  end if;
  return r;
end;
$$;

grant execute on function public.ganhar_xp(integer) to authenticated;
grant execute on function public.perder_vida() to authenticated;
