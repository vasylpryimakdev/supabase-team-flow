create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_at timestamptz default now(),
  avatar_path text,
  avatar_url text
);

alter table public.teams enable row level security;

create or replace function public.get_my_team_id()
returns uuid
language sql
stable
security definer
as $function$
  select team_id
  from public.profiles
  where id = auth.uid()
  limit 1;
$function$;

create policy "create team"
on public.teams
for insert
to public
with check (
  auth.uid() is not null
);


create policy "read team by member"
on public.teams
for select
to public
using (
  id = get_my_team_id()
);


create policy "update team by owner"
on public.teams
for update
to authenticated
using (
  id in (
    select profiles.team_id
    from profiles
    where profiles.id = auth.uid()
      and profiles.role = 'owner'
  )
);

create or replace function public.clear_profile_role()
returns trigger
language plpgsql
as $function$
begin
  update profiles
  set role = null
  where team_id = old.id;

  return old;
end;
$function$;

create trigger clear_profile_role_trigger
before delete on public.teams
for each row
execute function public.clear_profile_role();

create unique index teams_pkey
on public.teams using btree (id);

create unique index teams_invite_code_key
on public.teams using btree (invite_code);