-- Handoff audit: remove unauthorized privilege escalation and cross-student saved career access.
DROP POLICY IF EXISTS "Allow first owner or admin setup" ON public.user_roles;
DROP POLICY IF EXISTS "Users with edit_careers permission can delete all saved careers" ON public.user_saved_careers;
DROP POLICY IF EXISTS "Users with edit_careers permission can view all saved careers" ON public.user_saved_careers;

-- Client-side admin fallback must not expose email/role directory RPCs.
REVOKE EXECUTE ON FUNCTION public.get_all_users_with_roles() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_users_with_roles() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users_with_roles() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_users_with_roles() TO service_role;

-- These are trigger-only functions, not browser RPCs.
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

-- Permission predicates are only meaningful for the authenticated caller.
-- Prevent public role enumeration by supplying a different user's UUID.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT _user_id = (SELECT auth.uid()) AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission public.app_permission)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT _user_id = (SELECT auth.uid()) AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = _user_id AND rp.permission = _permission
  );
$$;
CREATE OR REPLACE FUNCTION public.is_owner(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT _user_id = (SELECT auth.uid()) AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'owner'::public.app_role
  );
$$;
