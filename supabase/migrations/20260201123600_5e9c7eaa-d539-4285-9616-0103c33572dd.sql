-- Fix PUBLIC_DATA_EXPOSURE: Restrict role_permissions SELECT policy to authenticated users only
DROP POLICY IF EXISTS "Anyone can view role permissions" ON public.role_permissions;

CREATE POLICY "Authenticated users can view role permissions" 
ON public.role_permissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);