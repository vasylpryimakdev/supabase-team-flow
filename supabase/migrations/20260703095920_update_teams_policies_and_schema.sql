DROP POLICY IF EXISTS "update team by member" ON public.teams;
DROP POLICY IF EXISTS "update team by owner" ON public.teams;

CREATE POLICY "update team by owner" 
ON public.teams 
FOR UPDATE 
TO authenticated 
USING (
  id IN (
    SELECT team_id 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'owner'
  )
);