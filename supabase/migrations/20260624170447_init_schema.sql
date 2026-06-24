create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique not null,
  created_at timestamptz default now()
);

create table team_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  role text default 'member',
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  created_by uuid not null references auth.users(id),

  title text not null,
  description text,
  image text,

  status text not null
    check (status in ('draft', 'active', 'deleted'))
    default 'draft',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_team_members_team_id on team_members(team_id);
create index idx_products_team_id on products(team_id);
create index idx_products_status on products(status);
create index idx_products_created_at on products(created_at);

create index products_search_idx
on products
using gin(to_tsvector('english', title || ' ' || coalesce(description, '')));

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
before update on products
for each row
execute function set_updated_at();

create trigger profiles_updated_at
before update on profiles
for each row
execute function set_updated_at();

alter table profiles enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table products enable row level security;

create policy "own profile select"
on profiles for select
using (id = auth.uid());

create policy "own profile insert"
on profiles for insert
with check (id = auth.uid());

create policy "own profile update"
on profiles for update
using (id = auth.uid());

create policy "read own team"
on teams for select
using (
  id in (
    select team_id from team_members
    where user_id = auth.uid()
  )
);

create policy "create team"
on teams for insert
with check (auth.uid() is not null);

create policy "read membership"
on team_members for select
using (user_id = auth.uid());

create policy "insert membership (self only)"
on team_members for insert
with check (user_id = auth.uid());

create policy "read team products"
on products for select
using (
  team_id in (
    select team_id from team_members
    where user_id = auth.uid()
  )
);

create policy "create team products"
on products for insert
with check (
  team_id in (
    select team_id from team_members
    where user_id = auth.uid()
  )
);

create policy "update only draft products"
on products for update
using (
  team_id in (
    select team_id from team_members
    where user_id = auth.uid()
  )
  and status = 'draft'
)
with check (
  status in ('draft', 'active')
);

create policy "no hard delete"
on products for delete
using (false);