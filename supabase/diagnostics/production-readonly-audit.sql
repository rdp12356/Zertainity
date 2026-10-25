-- Zertainity: read-only database security diagnostics.
-- Run in the Supabase SQL editor for EACH environment; do not paste results
-- containing personal student data into public issues.
-- Review access controls with two distinct test users separately.

-- 1) Public application tables without RLS, including tables granting API roles.
SELECT c.oid::regclass AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced,
       has_table_privilege('anon', c.oid, 'SELECT') AS anon_can_select,
       has_table_privilege('authenticated', c.oid, 'SELECT') AS signed_in_can_select
FROM pg_class AS c
JOIN pg_namespace AS n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind IN ('r','p')
  AND NOT c.relrowsecurity
ORDER BY 1;

-- 2) Inspect policies, particularly policies for student-owned records.
SELECT schemaname, tablename, policyname, permissive, roles, cmd,
       qual AS using_expression, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3) SECURITY DEFINER functions lacking an explicit fixed search_path.
SELECT p.oid::regprocedure AS function_signature,
       n.nspname AS schema_name, p.prosecdef AS security_definer,
       p.proconfig AS function_settings
FROM pg_proc AS p
JOIN pg_namespace AS n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prosecdef
  AND NOT EXISTS (
    SELECT 1
    FROM unnest(coalesce(p.proconfig, ARRAY[]::text[])) AS cfg(setting)
    WHERE cfg.setting LIKE 'search_path=%'
  )
ORDER BY 1;

-- 4) Extensions located in publicly exposed schemas.
SELECT e.extname, n.nspname AS schema_name
FROM pg_extension AS e
JOIN pg_namespace AS n ON n.oid = e.extnamespace
WHERE n.nspname = 'public'
ORDER BY e.extname;

-- 5) Approximate dataset counts; exact verification needs approved queries.
SELECT relname AS dataset_table, n_live_tup AS estimated_rows,
       last_analyze, last_autoanalyze
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND relname IN ('colleges','schools','exams','careers')
ORDER BY relname;
