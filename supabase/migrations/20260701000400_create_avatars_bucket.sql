insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Allow authenticated uploads" on storage.objects 
for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Allow authenticated updates" on storage.objects 
for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Allow public read access" on storage.objects 
for select using (bucket_id = 'avatars');