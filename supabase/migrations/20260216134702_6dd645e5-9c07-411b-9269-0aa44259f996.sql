-- Fix: Restrict audit_log INSERT to only authenticated users (not anon)
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_log;
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Fix: Restrict user_activity_log INSERT to only authenticated users
DROP POLICY IF EXISTS "System can insert activity logs" ON public.user_activity_log;
CREATE POLICY "Authenticated users can insert activity logs"
ON public.user_activity_log
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());