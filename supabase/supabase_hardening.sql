-- =========================================================================
-- ZERTAINITY - DATABASE SECURITY HARDENING & RLS POLICIES
-- =========================================================================
-- Run this script in the Supabase SQL Editor to enforce strict security controls.

-- ─────────────────────────────────────────────────────────────────────────
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE IF EXISTS public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.suspended_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.career_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.shared_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.impersonations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.content_reviews ENABLE ROW LEVEL SECURITY;

-- Clean up any legacy or duplicate policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.user_profiles;
DROP POLICY IF EXISTS "Strict Profile Isolation" ON public.user_profiles;
DROP POLICY IF EXISTS "Strict Marks Isolation" ON public.user_profiles;

-- ─────────────────────────────────────────────────────────────────────────
-- 2. STRICT PROFILE ISOLATION (USER PROFILES)
-- ─────────────────────────────────────────────────────────────────────────
-- Users can view, update, and insert their own profile records
CREATE POLICY "Strict Profile Isolation - Select"
ON public.user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Strict Profile Isolation - Insert"
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Strict Profile Isolation - Update"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins and owners can view all profiles
CREATE POLICY "Admins and owners can view all profiles"
ON public.user_profiles FOR SELECT
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));


-- ─────────────────────────────────────────────────────────────────────────
-- 3. IMPERSONATION TOKENS SECURITY
-- ─────────────────────────────────────────────────────────────────────────
-- Impersonation rows are highly sensitive. Only admins and owners can view/manage them.
-- Deno Edge Functions using the service role bypass RLS and can consume them securely.
CREATE POLICY "Admins and owners can manage impersonations"
ON public.impersonations FOR ALL
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));


-- ─────────────────────────────────────────────────────────────────────────
-- 4. CONTENT REVIEW QUEUE SECURITY
-- ─────────────────────────────────────────────────────────────────────────
-- Submitters can create and track their own reviews. Reviewers/Admins can manage them.
-- No delete policies are defined to preserve audit trails.
CREATE POLICY "Submitters can insert reviews"
ON public.content_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = submitter_id);

CREATE POLICY "Submitters can view their own reviews"
ON public.content_reviews FOR SELECT
TO authenticated
USING (auth.uid() = submitter_id);

CREATE POLICY "Reviewers/Admins can view all reviews"
ON public.content_reviews FOR SELECT
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'manager'::app_role));

CREATE POLICY "Reviewers/Admins can update reviews"
ON public.content_reviews FOR UPDATE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'manager'::app_role));


-- ─────────────────────────────────────────────────────────────────────────
-- 5. ANONYMOUS ROLE RESTRICTIONS
-- ─────────────────────────────────────────────────────────────────────────
-- First, revoke all privileges on all tables in public schema from 'anon'
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;

-- Grant SELECT only on public reference and sharing tables
GRANT SELECT ON public.colleges TO anon;
GRANT SELECT ON public.schools TO anon;
GRANT SELECT ON public.exams TO anon;
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT ON public.shared_results TO anon;

-- Output verification message when executed
SELECT 'Database security hardening successfully applied!' as status;
