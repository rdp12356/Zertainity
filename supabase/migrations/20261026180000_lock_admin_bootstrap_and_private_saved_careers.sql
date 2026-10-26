-- Hand-off security: fix the first-admin bootstrap and eliminate editor access to private bookmarks.
-- Existing roles and student records are not changed.
-- The setup-admin Edge Function has its own INITIAL_ADMIN_EMAIL guard and uses service_role.
DROP POLICY IF EXISTS "Allow first owner or admin setup" ON public.user_roles;

-- "edit_careers" means catalog maintenance, not permission to view students' saved choices.
DROP POLICY IF EXISTS "Users with edit_careers permission can delete all saved careers" ON public.user_saved_careers;
DROP POLICY IF EXISTS "Users with edit_careers permission can view all saved careers" ON public.user_saved_careers;

-- Account-directory RPCs run only from role-checking service-role Edge Functions.
REVOKE EXECUTE ON FUNCTION public.get_all_users_with_roles() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_users_with_roles() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_users_with_roles() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_users_with_roles() TO service_role;

-- Trigger functions must not be directly invokable through PostgREST.
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
