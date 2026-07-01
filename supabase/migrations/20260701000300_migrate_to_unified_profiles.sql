alter table public.profiles 
  add column if not exists avatar_url text,
  add column if not exists team_id uuid references public.teams(id) on delete set null,
  add column if not exists role text check (role in ('owner', 'member')) default 'member';

create index if not exists idx_profiles_team_id on public.profiles(team_id);

update public.profiles p
set 
  team_id = tm.team_id,
  role = coalesce(tm.role, 'member')
from public.team_members tm
where p.id = tm.user_id;

drop table if exists public.team_members cascade;

alter table public.products 
  drop constraint if exists products_created_by_fkey,
  add constraint products_created_by_profiles_fkey 
    foreign key (created_by) references public.profiles(id) on delete cascade;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url, role, team_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    'member',
    null
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer
set search_path = public;

drop policy if exists "read own team" on public.teams;
drop policy if exists "read team products" on public.products;
drop policy if exists "create team products" on public.products;
drop policy if exists "update only draft products" on public.products;
drop policy if exists "own profile select" on public.profiles;

create policy "view team profiles"
on public.profiles for select
using (
  id = auth.uid() 
  or team_id = (select team_id from public.profiles where id = auth.uid())
);

create policy "read own team"
on public.teams for select
using (
  id = (select team_id from public.profiles where id = auth.uid())
);

create policy "read team products"
on public.products for select
using (
  team_id = (select team_id from public.profiles where id = auth.uid())
);

create policy "create team products"
on public.products for insert
with check (
  team_id = (select team_id from public.profiles where id = auth.uid())
);

create policy "update only draft products"
on public.products for update
using (
  team_id = (select team_id from public.profiles where id = auth.uid())
  and status = 'draft'
)
with check (
  status in ('draft', 'active', 'deleted')
);