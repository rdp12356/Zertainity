-- Create user_roles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_roles') THEN
    CREATE TABLE public.user_roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      role app_role NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      UNIQUE (user_id, role)
    );
    
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create or replace the has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Drop existing policies if they exist and recreate
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
  DROP POLICY IF EXISTS "Allow first admin setup" ON public.user_roles;
END $$;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow first admin to be created (when no admin exists)
CREATE POLICY "Allow first admin setup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
  OR public.has_role(auth.uid(), 'admin')
);

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create or replace RPC function to get users with their roles
CREATE OR REPLACE FUNCTION public.get_users_with_roles()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  roles TEXT[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id as user_id,
    au.email,
    COALESCE(array_agg(ur.role::text) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::text[]) as roles
  FROM auth.users au
  LEFT JOIN public.user_roles ur ON au.id = ur.user_id
  GROUP BY au.id, au.email
  ORDER BY au.email;
$$;