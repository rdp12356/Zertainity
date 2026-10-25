-- Applied to Zertainity Supabase project on 2026-10-25 (UTC).
-- Release security remediation; no application rows modified.
-- IMPORTANT: a SECURITY DEFINER function with TRUNCATE ... CASCADE was
-- callable by both anonymous and logged-in users. Protect it from browsers.
REVOKE EXECUTE ON FUNCTION public.clear_educational_data() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.clear_educational_data() TO service_role;

-- These blanket permissive policies previously made any logged-in student
-- able to mutate or delete public college, school, exam and career records.
-- Dedicated admin/owner policies exist and remain in force.
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.colleges;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.schools;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.exams;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.careers;

-- Grouped public views must honor table RLS rather than view-owner privileges.
ALTER VIEW public.grouped_colleges SET (security_invoker = true);
ALTER VIEW public.grouped_schools SET (security_invoker = true);
