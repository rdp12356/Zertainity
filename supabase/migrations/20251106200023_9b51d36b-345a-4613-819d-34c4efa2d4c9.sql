-- Create a function to check if user has owner role
CREATE OR REPLACE FUNCTION public.is_owner(_user_id UUID)
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
      AND role = 'owner'::app_role
  )
$$;

-- Update RLS policies to include owner privileges
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert colleges" ON public.colleges;
DROP POLICY IF EXISTS "Admins can update colleges" ON public.colleges;
DROP POLICY IF EXISTS "Admins can delete colleges" ON public.colleges;
DROP POLICY IF EXISTS "Admins can insert schools" ON public.schools;
DROP POLICY IF EXISTS "Admins can update schools" ON public.schools;
DROP POLICY IF EXISTS "Admins can delete schools" ON public.schools;

-- Owners and admins can manage all roles
CREATE POLICY "Owners and admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Owners and admins can manage colleges
CREATE POLICY "Owners and admins can insert colleges"
ON public.colleges
FOR INSERT
TO authenticated
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owners and admins can update colleges"
ON public.colleges
FOR UPDATE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owners and admins can delete colleges"
ON public.colleges
FOR DELETE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Owners and admins can manage schools
CREATE POLICY "Owners and admins can insert schools"
ON public.schools
FOR INSERT
TO authenticated
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owners and admins can update schools"
ON public.schools
FOR UPDATE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owners and admins can delete schools"
ON public.schools
FOR DELETE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Allow first owner or admin setup
DROP POLICY IF EXISTS "Allow first admin setup" ON public.user_roles;

CREATE POLICY "Allow first owner or admin setup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  (NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role) 
   AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner'::app_role))
  OR public.is_owner(auth.uid()) 
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Insert owner role for johanmanoj2009@gmail.com
DO $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Get the user ID for johanmanoj2009@gmail.com
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = 'johanmanoj2009@gmail.com';
  
  IF user_uuid IS NOT NULL THEN
    -- Insert owner role if it doesn't exist
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_uuid, 'owner'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;