-- Applied to production Supabase 2026-10-26.
-- Restrict high-trust role and permission changes, keeping existing accounts untouched.
DROP POLICY IF EXISTS "Owners and admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Owners manage role assignments"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.is_owner((select auth.uid())))
  WITH CHECK (public.is_owner((select auth.uid())));
CREATE POLICY "Admins manage nonprivileged role assignments"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role((select auth.uid()), 'admin'::public.app_role)
         AND role IN ('user'::public.app_role,'editor'::public.app_role,'manager'::public.app_role))
  WITH CHECK (public.has_role((select auth.uid()), 'admin'::public.app_role)
         AND role IN ('user'::public.app_role,'editor'::public.app_role,'manager'::public.app_role));
DROP POLICY IF EXISTS "Owners and admins can manage permissions" ON public.role_permissions;
CREATE POLICY "Only owners can manage role permission grants"
  ON public.role_permissions FOR ALL TO authenticated
  USING (public.is_owner((select auth.uid())))
  WITH CHECK (public.is_owner((select auth.uid())));
-- RLS helper functions are permitted as a small boolean capability only for the calling user's own ID.
-- This prevents arbitrary-account owner / admin status enumeration via Data API RPCs.
CREATE OR REPLACE FUNCTION public.is_owner(_user_id uuid) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT COALESCE((SELECT auth.uid()) = _user_id, FALSE)
    AND EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'owner'::public.app_role);
$$;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT COALESCE((SELECT auth.uid()) = _user_id, FALSE)
    AND EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission public.app_permission) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT COALESCE((SELECT auth.uid()) = _user_id, FALSE)
    AND EXISTS(SELECT 1 FROM public.user_roles ur JOIN public.role_permissions rp ON ur.role = rp.role
      WHERE ur.user_id = _user_id AND rp.permission = _permission);
$$;
-- Defend against unsafe resolution of unqualified identifiers in preexisting functions.
ALTER FUNCTION public.clear_educational_data() SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.get_db_size() SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.update_updated_at_column() SET search_path = pg_catalog, public, pg_temp;
ALTER FUNCTION public.update_user_profile_updated_at() SET search_path = pg_catalog, public, pg_temp;

