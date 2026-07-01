DROP POLICY IF EXISTS "view team profiles" ON public.profiles;
DROP POLICY IF EXISTS "read own team" ON public.teams;
DROP POLICY IF EXISTS "read team products" ON public.products;
DROP POLICY IF EXISTS "create team products" ON public.products;
DROP POLICY IF EXISTS "update only draft products" ON public.products;

CREATE POLICY "view team profiles" ON public.profiles 
FOR SELECT USING (auth.uid() = id OR team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid() LIMIT 1));

CREATE POLICY "read team products" ON public.products 
FOR SELECT USING (team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid() LIMIT 1));

CREATE POLICY "create team products" ON public.products 
FOR INSERT WITH CHECK (team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid() LIMIT 1));

CREATE POLICY "update only draft products" ON public.products 
FOR UPDATE USING (team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid() LIMIT 1) AND status = 'draft')
WITH CHECK (team_id = (SELECT team_id FROM public.profiles WHERE id = auth.uid() LIMIT 1));