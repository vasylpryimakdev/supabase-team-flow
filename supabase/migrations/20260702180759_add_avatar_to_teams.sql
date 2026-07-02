ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS avatar_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('team-avatars', 'team-avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'team-avatars');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'team-avatars' AND auth.role() = 'authenticated'
);