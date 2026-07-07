create type public.product_status as enum (
  'Draft',
  'Active',
  'Deleted'
);

create table public.products (
  id uuid primary key default uuid_generate_v4(),

  team_id uuid references public.teams(id)
    on delete cascade,

  created_by uuid references public.profiles(id)
    on delete set null,

  title text not null,
  description text,

  image_url text,
  image_path text,

  status public.product_status default 'Draft',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;

create or replace function public.update_product_image_url()
returns trigger
language plpgsql
as $function$
begin
  if new.image_path is null then
    new.image_url := null;
  else
    new.image_url :=
      'https://zsgziqiazpusyvsrbcir.supabase.co/storage/v1/object/public/products/'
      || new.image_path;
  end if;

  return new;
end;
$function$;


create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create policy "Test Policy"
on public.products
for select
to public
using (
  (status)::text <> 'Deleted'::text
);

create trigger trg_update_product_image_url
before insert or update on public.products
for each row
execute function public.update_product_image_url();


create trigger update_products_updated_at
before update on public.products
for each row
execute function public.update_updated_at_column();

create index idx_products_team_id
on public.products using btree (team_id);


create index idx_products_status
on public.products using btree (status);