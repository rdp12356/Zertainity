-- Phase 2 of slug-only share migration, applied after Cloudflare production cutover.
-- Public links continue through public.get_shared_result_by_slug(text), not table scans.
-- No existing shared result records are deleted or modified.
DROP POLICY IF EXISTS "Anyone can view shared results" ON public.shared_results;

CREATE POLICY "Users can view their own shared results"
  ON public.shared_results
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can view shared results"
  ON public.shared_results
  FOR SELECT TO authenticated
  USING (
    public.is_owner((select auth.uid()))
    OR public.has_role((select auth.uid()), 'admin'::public.app_role)
  );

REVOKE SELECT ON public.shared_results FROM anon;
