-- ─────────────────────────────────────────────────────────────────────────────
-- Security hardening (2026-08-21)
--
-- 1. Enable RLS on the two tables that were created without it. In Supabase,
--    tables without RLS are fully readable/writable by any client holding the
--    public anon key.
--    - impersonations: one-time admin→student access tokens. If readable,
--      an attacker could consume a token and take over a student session.
--      Must be reachable ONLY by trusted Edge Functions (service role).
--    - content_reviews: editorial workflow records for privileged roles.
-- 2. Guard the unguarded user-enumeration RPC get_users_with_roles() and
--    restrict EXECUTE on both user-listing RPCs to authenticated admins.
--    SECURITY DEFINER functions default to EXECUTE-granted-to-PUBLIC.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1a. impersonations: deny-by-default. No policies are created on purpose:
--     with RLS enabled and zero policies, anon/authenticated clients are
--     denied every operation while service_role keeps bypassing RLS.
ALTER TABLE public.impersonations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impersonations FORCE ROW LEVEL SECURITY;

-- 1b. content_reviews: same deny-by-default posture. Privileged writes go
--     through service-role tooling / edge functions, not direct client writes.
ALTER TABLE public.content_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reviews FORCE ROW LEVEL SECURITY;

-- 2a. get_users_with_roles(): add the same caller guard that
--     get_all_users_with_roles() already has, so non-admin callers get an
--     empty set even if EXECUTE were somehow re-granted later.
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
    au.id AS user_id,
    au.email,
    COALESCE(array_agg(ur.role::text) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::text[]) AS roles
  FROM auth.users au
  LEFT JOIN public.user_roles ur ON au.id = ur.user_id
  WHERE public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role)
  GROUP BY au.id, au.email
  ORDER BY au.email;
$$;

-- 2b. EXECUTE is granted to PUBLIC by default on new functions — revoke it
--     and re-grant only to authenticated sessions.
REVOKE EXECUTE ON FUNCTION public.get_users_with_roles() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_users_with_roles() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_all_users_with_roles() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_all_users_with_roles() TO authenticated;
