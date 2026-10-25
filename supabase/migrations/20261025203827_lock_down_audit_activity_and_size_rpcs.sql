-- Audit logging and server metrics are service-owned, not public RPCs.
-- Executed on production Supabase before PR merge; no existing records changed.
REVOKE EXECUTE ON FUNCTION public.log_user_activity(uuid,text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_user_activity(uuid,text,jsonb) TO service_role;
REVOKE EXECUTE ON FUNCTION public.get_db_size() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_db_size() TO service_role;
REVOKE INSERT ON TABLE public.audit_log FROM PUBLIC, anon, authenticated;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_log;
