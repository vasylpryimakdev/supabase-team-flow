create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  avatar_url text,
  team_id uuid references public.teams(id) on delete set null,
  role text default 'member',
  avatar_path text,

  constraint profiles_role_check
    check (role = any (array['owner'::text, 'member'::text]))
);

alter table public.profiles enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create policy "own profile insert"
on public.profiles
for insert
to public
with check (
  id = auth.uid()
);


create policy "own profile update"
on public.profiles
for update
to public
using (
  id = auth.uid()
);


create policy "view team profiles"
on public.profiles
for select
to public
using (
  auth.uid() = id
  or team_id = get_my_team_id()
);

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create index idx_profiles_team_id
on public.profiles using btree (team_id);