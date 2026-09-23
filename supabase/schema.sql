-- World counter for Neon Odometer.
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

-- 1. One table with exactly one row that holds the shared number.
create table if not exists public.world_counter (
  id smallint primary key default 1 check (id = 1),
  value bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.world_counter (id) values (1)
on conflict (id) do nothing;

-- 2. Row Level Security: visitors may only READ the row.
--    There are no insert, update or delete policies, so nobody can
--    change the number directly or set it to 999999.
alter table public.world_counter enable row level security;

drop policy if exists "Anyone can read the world counter" on public.world_counter;
create policy "Anyone can read the world counter"
  on public.world_counter
  for select
  to anon, authenticated
  using (true);

-- 3. The only way to change the number: add exactly 1.
--    "security definer" lets the function update the row even though
--    visitors themselves have no update rights.
create or replace function public.increment_world_counter()
returns bigint
language sql
security definer
set search_path = ''
as $$
  update public.world_counter
  set value = value + 1, updated_at = now()
  where id = 1
  returning value;
$$;

revoke all on function public.increment_world_counter() from public;
grant execute on function public.increment_world_counter() to anon, authenticated;

-- 4. Realtime: send every change to connected browsers instantly.
do $$
begin
  alter publication supabase_realtime add table public.world_counter;
exception
  when duplicate_object then null;
end;
$$;
