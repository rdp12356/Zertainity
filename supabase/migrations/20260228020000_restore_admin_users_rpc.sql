-- Restore RPC for fetching users
CREATE OR REPLACE FUNCTION public.get_all_users_with_roles()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  roles app_role[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id,
    au.email,
    au.created_at,
    au.last_sign_in_at,
    COALESCE(
      array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL),
      ARRAY[]::app_role[]
    ) as roles
  FROM auth.users au
  LEFT JOIN public.user_roles ur ON au.id = ur.user_id
  WHERE public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'owner'::app_role)
  GROUP BY au.id, au.email, au.created_at, au.last_sign_in_at
  ORDER BY au.created_at DESC;
$$;

-- Ensure role_permissions table exists
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  permission text NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, permission)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "role_permissions_select_all" ON public.role_permissions;
CREATE POLICY "role_permissions_select_all" ON public.role_permissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "role_permissions_all_owner" ON public.role_permissions;
CREATE POLICY "role_permissions_all_owner" ON public.role_permissions FOR ALL
USING (public.has_role(auth.uid(), 'owner'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'owner'::app_role));
