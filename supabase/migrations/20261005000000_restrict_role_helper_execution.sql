-- Zertainity security hardening: restrict role-check helper RPC execution.
--
-- These helpers are used by RLS policies and trusted database code. They should
-- not be callable by anonymous clients or PUBLIC because they expose role
-- membership as an authorization oracle for arbitrary user IDs.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_owner(uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_owner(uuid) TO authenticated, service_role;
