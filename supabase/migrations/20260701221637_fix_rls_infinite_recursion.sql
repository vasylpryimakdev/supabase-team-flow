DROP POLICY IF EXISTS "read own team" ON public.teams;

CREATE POLICY "read team by member" ON public.teams
FOR SELECT 
USING (
  id = public.get_my_team_id()
);