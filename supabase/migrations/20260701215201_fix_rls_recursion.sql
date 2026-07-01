CREATE OR REPLACE FUNCTION public.get_my_team_id() 
RETURNS uuid AS $$

  SELECT team_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

DROP POLICY IF EXISTS "view team profiles" ON public.profiles;

CREATE POLICY "view team profiles" ON public.profiles 
FOR SELECT USING (
  auth.uid() = id OR team_id = public.get_my_team_id()
);

DROP POLICY IF EXISTS "read team products" ON public.products;
DROP POLICY IF EXISTS "create team products" ON public.products;
DROP POLICY IF EXISTS "update only draft products" ON public.products;

CREATE POLICY "read team products" ON public.products 
FOR SELECT USING (
  team_id = public.get_my_team_id()
);

CREATE POLICY "create team products" ON public.products 
FOR INSERT WITH CHECK (
  team_id = public.get_my_team_id()
);

CREATE POLICY "update only draft products" ON public.products 
FOR UPDATE USING (
  team_id = public.get_my_team_id() AND status = 'draft'
)
WITH CHECK (
  team_id = public.get_my_team_id()
);