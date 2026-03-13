-- =========================================================================
-- ZERTAINITY — COMPLETE FRESH DATABASE SETUP
-- Version: 1.0 | Date: 2026-02-23
-- =========================================================================
-- Run this ONCE on a brand new Supabase project.
-- Go to: Supabase Dashboard → SQL Editor → New query → Paste → Run
--
-- This file sets up:
--   1. Enums & Types
--   2. Core RBAC tables (roles, permissions, profiles)
--   3. Career Engine tables (career_master_data, results, logs, etc.)
--   4. Email tables (email_logs, resend_webhook_logs)
--   5. Row Level Security (RLS) on all tables
--   6. All database functions
--   7. All triggers
--   8. All indexes
--   9. All admin views
--  10. Default permission seeds
--  11. Career master data seeds (20 careers)
--  12. College data seeds (30 top India institutions)
-- =========================================================================


-- =========================================================================
-- PART 1: ENUMS
-- =========================================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'editor', 'manager', 'owner');

CREATE TYPE public.app_permission AS ENUM (
  'view_all',
  'edit_careers',
  'edit_colleges',
  'edit_schools',
  'edit_pathways',
  'edit_quiz',
  'view_users',
  'manage_users',
  'manage_roles',
  'manage_permissions',
  'view_audit_logs',
  'export_data'
);


-- =========================================================================
-- PART 2: CORE RBAC TABLES
-- =========================================================================

-- Colleges
CREATE TABLE public.colleges (
  id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  location    TEXT NOT NULL,
  latitude    DOUBLE PRECISION,
  longitude   DOUBLE PRECISION,
  courses     TEXT[],
  cutoffs     TEXT,
  description TEXT,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Schools
CREATE TABLE public.schools (
  id               UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name             TEXT NOT NULL,
  location         TEXT NOT NULL,
  latitude         DOUBLE PRECISION,
  longitude        DOUBLE PRECISION,
  board            TEXT,
  grade_11_cutoff  DOUBLE PRECISION,
  description      TEXT,
  created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles
CREATE TABLE public.user_roles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role       app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Role permissions
CREATE TABLE public.role_permissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role       app_role NOT NULL,
  permission app_permission NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, permission)
);

-- User profiles
CREATE TABLE public.user_profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url    TEXT,
  date_of_birth DATE,
  phone_number  TEXT,
  bio           TEXT,
  location      TEXT,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Suspended users
CREATE TABLE public.suspended_users (
  user_id      UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  suspended_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  suspended_by UUID REFERENCES auth.users(id),
  reason       TEXT,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User activity log
CREATE TABLE public.user_activity_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL,
  action     TEXT NOT NULL,
  details    JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit log
CREATE TABLE public.audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_user_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action          TEXT NOT NULL,
  before_snapshot JSONB,
  after_snapshot  JSONB,
  ip_address      TEXT,
  user_agent      TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);


-- =========================================================================
-- PART 3: CAREER ENGINE TABLES
-- =========================================================================

-- Career master data — canonical career definitions with scoring weights
CREATE TABLE public.career_master_data (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_name   TEXT NOT NULL UNIQUE,
  domain        TEXT NOT NULL,
  score_weights JSONB NOT NULL DEFAULT '{}',
  required_exams    TEXT[] DEFAULT '{}',
  top_job_roles     TEXT[] DEFAULT '{}',
  avg_salary_lpa    NUMERIC(5,2),
  growth_outlook    TEXT NOT NULL DEFAULT 'stable'
                    CHECK (growth_outlook IN ('high', 'stable', 'declining')),
  description   TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Interest answers — raw quiz responses per session
CREATE TABLE public.interest_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id      UUID NOT NULL DEFAULT gen_random_uuid(),
  answers         JSONB NOT NULL DEFAULT '{}',
  education_level TEXT NOT NULL CHECK (education_level IN ('10th', '12th', 'graduate')),
  marks           JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Career results — final scored + AI-explained output per session
CREATE TABLE public.career_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id      UUID NOT NULL,
  education_level TEXT NOT NULL CHECK (education_level IN ('10th', '12th', 'graduate')),
  marks           JSONB NOT NULL DEFAULT '{}',
  top_careers     JSONB NOT NULL DEFAULT '[]',
  ai_explanation  TEXT,
  ai_model_used   TEXT CHECK (ai_model_used IN ('gemini', 'openrouter', 'rule-based')),
  email_sent      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI logs — every AI call logged for cost monitoring
CREATE TABLE public.ai_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  career_result_id  UUID REFERENCES public.career_results(id) ON DELETE SET NULL,
  model             TEXT NOT NULL,
  prompt_tokens     INTEGER,
  completion_tokens INTEGER,
  total_tokens      INTEGER,
  latency_ms        INTEGER,
  success           BOOLEAN NOT NULL,
  error_message     TEXT,
  created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email logs — Resend delivery receipts
CREATE TABLE public.email_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email_type  TEXT NOT NULL
              CHECK (email_type IN ('welcome', 'career_result', 'roadmap', 'followup_d3', 'followup_d7')),
  to_email    TEXT NOT NULL,
  resend_id   TEXT,
  status      TEXT NOT NULL DEFAULT 'sent'
              CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Usage tracking — daily per-user AI quota enforcement
CREATE TABLE public.usage_tracking (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  ai_calls    INTEGER NOT NULL DEFAULT 0,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

-- College data — India institution database with cutoffs
CREATE TABLE public.college_data (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  state         TEXT NOT NULL,
  city          TEXT,
  college_type  TEXT NOT NULL DEFAULT 'Private'
                CHECK (college_type IN ('IIT', 'NIT', 'BITS', 'IIM', 'AIIMS', 'NLU', 'Central', 'State', 'Deemed', 'Private')),
  ranking_nirf  INTEGER,
  courses       TEXT[] DEFAULT '{}',
  cutoffs       JSONB DEFAULT '{}',
  relevant_exams TEXT[] DEFAULT '{}',
  website       TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Resend webhook logs — raw delivery event callbacks
CREATE TABLE public.resend_webhook_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resend_id    TEXT,
  event_type   TEXT NOT NULL,
  to_email     TEXT,
  payload      JSONB,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);


-- =========================================================================
-- PART 4: ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =========================================================================

ALTER TABLE public.colleges               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspended_users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_master_data     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_answers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_results         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_data           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resend_webhook_logs    ENABLE ROW LEVEL SECURITY;


-- =========================================================================
-- PART 5: SECURITY FUNCTIONS
-- =========================================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_owner(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'owner'::app_role)
$$;

CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission app_permission)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = _user_id AND rp.permission = _permission
  )
$$;

CREATE OR REPLACE FUNCTION public.get_all_users_with_roles()
RETURNS TABLE (id uuid, email text, created_at timestamptz, last_sign_in_at timestamptz, roles app_role[])
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT au.id, au.email, au.created_at, au.last_sign_in_at,
    COALESCE(array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::app_role[]) as roles
  FROM auth.users au
  LEFT JOIN public.user_roles ur ON au.id = ur.user_id
  WHERE public.has_role(auth.uid(), 'admin'::app_role) OR public.is_owner(auth.uid())
  GROUP BY au.id, au.email, au.created_at, au.last_sign_in_at
  ORDER BY au.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_users_with_roles()
RETURNS TABLE (user_id UUID, email TEXT, roles TEXT[])
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT au.id, au.email,
    COALESCE(array_agg(ur.role::text) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::text[]) as roles
  FROM auth.users au
  LEFT JOIN public.user_roles ur ON au.id = ur.user_id
  GROUP BY au.id, au.email ORDER BY au.email;
$$;

CREATE OR REPLACE FUNCTION public.log_user_activity(p_user_id UUID, p_action TEXT, p_details JSONB DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_activity_log (user_id, action, details) VALUES (p_user_id, p_action, p_details);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_profile_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Career engine helpers
CREATE OR REPLACE FUNCTION public.update_career_master_data_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.increment_ai_usage(p_user_id UUID, p_tokens INTEGER DEFAULT 0)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.usage_tracking (user_id, date, ai_calls, tokens_used)
  VALUES (p_user_id, CURRENT_DATE, 1, p_tokens)
  ON CONFLICT (user_id, date)
  DO UPDATE SET ai_calls = usage_tracking.ai_calls + 1, tokens_used = usage_tracking.tokens_used + p_tokens;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_today_ai_usage(p_user_id UUID)
RETURNS TABLE (ai_calls INTEGER, tokens_used INTEGER)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(ai_calls, 0), COALESCE(tokens_used, 0)
  FROM public.usage_tracking WHERE user_id = p_user_id AND date = CURRENT_DATE;
$$;

CREATE OR REPLACE FUNCTION public.has_received_welcome_email(p_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.email_logs
    WHERE user_id = p_user_id AND email_type = 'welcome' AND status = 'sent'
  );
$$;


-- =========================================================================
-- PART 6: TRIGGERS
-- =========================================================================

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_user_profile_updated_at();

CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

CREATE TRIGGER trg_career_master_data_updated_at
  BEFORE UPDATE ON public.career_master_data
  FOR EACH ROW EXECUTE FUNCTION public.update_career_master_data_updated_at();


-- =========================================================================
-- PART 7: INDEXES
-- =========================================================================

-- Core RBAC
CREATE INDEX idx_user_activity_log_user_id    ON public.user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_created_at ON public.user_activity_log(created_at DESC);
CREATE INDEX idx_audit_log_user_id            ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_target_user_id     ON public.audit_log(target_user_id);
CREATE INDEX idx_audit_log_created_at         ON public.audit_log(created_at DESC);

-- Career engine
CREATE INDEX idx_career_results_user_id       ON public.career_results(user_id);
CREATE INDEX idx_career_results_session_id    ON public.career_results(session_id);
CREATE INDEX idx_career_results_created_at    ON public.career_results(created_at DESC);
CREATE INDEX idx_interest_answers_user_id     ON public.interest_answers(user_id);
CREATE INDEX idx_interest_answers_session     ON public.interest_answers(session_id);
CREATE INDEX idx_ai_logs_user_id              ON public.ai_logs(user_id);
CREATE INDEX idx_ai_logs_result_id            ON public.ai_logs(career_result_id);
CREATE INDEX idx_ai_logs_created_at           ON public.ai_logs(created_at DESC);
CREATE INDEX idx_email_logs_user_id           ON public.email_logs(user_id);
CREATE INDEX idx_usage_tracking_user_date     ON public.usage_tracking(user_id, date);
CREATE INDEX idx_college_data_state           ON public.college_data(state);
CREATE INDEX idx_college_data_type            ON public.college_data(college_type);
CREATE INDEX idx_career_master_domain         ON public.career_master_data(domain);
CREATE INDEX idx_resend_webhook_resend_id     ON public.resend_webhook_logs(resend_id);
CREATE INDEX idx_resend_webhook_event_type    ON public.resend_webhook_logs(event_type);


-- =========================================================================
-- PART 8: RLS POLICIES
-- =========================================================================

-- ── Colleges ──────────────────────────────────────────────────────────────
CREATE POLICY "colleges_select_all"    ON public.colleges FOR SELECT USING (true);
CREATE POLICY "colleges_insert_admin"  ON public.colleges FOR INSERT TO authenticated WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "colleges_update_admin"  ON public.colleges FOR UPDATE TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "colleges_delete_admin"  ON public.colleges FOR DELETE TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── Schools ───────────────────────────────────────────────────────────────
CREATE POLICY "schools_select_all"    ON public.schools FOR SELECT USING (true);
CREATE POLICY "schools_insert_admin"  ON public.schools FOR INSERT TO authenticated WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "schools_update_admin"  ON public.schools FOR UPDATE TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "schools_delete_admin"  ON public.schools FOR DELETE TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── User Roles ────────────────────────────────────────────────────────────
CREATE POLICY "user_roles_select_own"       ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_roles_manage_admin"     ON public.user_roles FOR ALL TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "user_roles_first_setup"      ON public.user_roles FOR INSERT TO authenticated WITH CHECK (
  (NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role) AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner'::app_role))
  OR public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role)
);
CREATE POLICY "user_roles_delete_admin"     ON public.user_roles FOR DELETE TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── Role Permissions ──────────────────────────────────────────────────────
CREATE POLICY "role_permissions_select_all"     ON public.role_permissions FOR SELECT USING (true);
CREATE POLICY "role_permissions_manage_admin"   ON public.role_permissions FOR ALL USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── User Profiles ─────────────────────────────────────────────────────────
CREATE POLICY "user_profiles_select_own"    ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "user_profiles_update_own"    ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "user_profiles_insert_own"    ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "user_profiles_admin_select"  ON public.user_profiles FOR SELECT USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── Suspended Users ───────────────────────────────────────────────────────
CREATE POLICY "suspended_users_admin_select"  ON public.suspended_users FOR SELECT USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "suspended_users_admin_manage"  ON public.suspended_users FOR ALL USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── Activity & Audit Logs ─────────────────────────────────────────────────
CREATE POLICY "activity_log_admin_select"  ON public.user_activity_log FOR SELECT USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "activity_log_own_select"    ON public.user_activity_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "activity_log_insert"        ON public.user_activity_log FOR INSERT WITH CHECK (true);
CREATE POLICY "audit_log_admin_select"     ON public.audit_log FOR SELECT USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "audit_log_insert"           ON public.audit_log FOR INSERT WITH CHECK (true);

-- ── Career Master Data ────────────────────────────────────────────────────
CREATE POLICY "career_master_select_all"    ON public.career_master_data FOR SELECT USING (true);
CREATE POLICY "career_master_insert_admin"  ON public.career_master_data FOR INSERT TO authenticated WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "career_master_update_admin"  ON public.career_master_data FOR UPDATE TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "career_master_delete_admin"  ON public.career_master_data FOR DELETE TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── Interest Answers ──────────────────────────────────────────────────────
CREATE POLICY "interest_answers_select_own"   ON public.interest_answers FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "interest_answers_insert_own"   ON public.interest_answers FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "interest_answers_admin_select" ON public.interest_answers FOR SELECT TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── Career Results ────────────────────────────────────────────────────────
CREATE POLICY "career_results_select_own"   ON public.career_results FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "career_results_insert_own"   ON public.career_results FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "career_results_update_own"   ON public.career_results FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "career_results_admin_select" ON public.career_results FOR SELECT TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── AI Logs ───────────────────────────────────────────────────────────────
CREATE POLICY "ai_logs_service_insert"  ON public.ai_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "ai_logs_own_select"      ON public.ai_logs FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "ai_logs_admin_select"    ON public.ai_logs FOR SELECT TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── Email Logs ────────────────────────────────────────────────────────────
CREATE POLICY "email_logs_service_insert"  ON public.email_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "email_logs_admin_select"    ON public.email_logs FOR SELECT TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── Usage Tracking ────────────────────────────────────────────────────────
CREATE POLICY "usage_tracking_select_own"     ON public.usage_tracking FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "usage_tracking_insert_service" ON public.usage_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY "usage_tracking_update_service" ON public.usage_tracking FOR UPDATE USING (true);
CREATE POLICY "usage_tracking_admin_select"   ON public.usage_tracking FOR SELECT TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── College Data ──────────────────────────────────────────────────────────
CREATE POLICY "college_data_select_all"    ON public.college_data FOR SELECT USING (true);
CREATE POLICY "college_data_insert_admin"  ON public.college_data FOR INSERT TO authenticated WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "college_data_update_admin"  ON public.college_data FOR UPDATE TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- ── Resend Webhook Logs ───────────────────────────────────────────────────
CREATE POLICY "resend_webhook_insert"       ON public.resend_webhook_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "resend_webhook_admin_select" ON public.resend_webhook_logs FOR SELECT TO authenticated USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));


-- =========================================================================
-- PART 9: ADMIN VIEWS
-- =========================================================================

CREATE OR REPLACE VIEW public.career_analysis_summary AS
SELECT
  cr.id,
  cr.user_id,
  au.email                                                 AS user_email,
  cr.education_level,
  (cr.top_careers -> 0 ->> 'career')                      AS top_career,
  (cr.top_careers -> 0 ->> 'matchScore')::INTEGER          AS top_match_score,
  cr.ai_model_used,
  cr.email_sent,
  cr.created_at
FROM public.career_results cr
JOIN auth.users au ON cr.user_id = au.id
ORDER BY cr.created_at DESC;

CREATE OR REPLACE VIEW public.daily_ai_usage_summary AS
SELECT
  date,
  COUNT(DISTINCT user_id)   AS unique_users,
  SUM(ai_calls)             AS total_ai_calls,
  SUM(tokens_used)          AS total_tokens_used,
  ROUND(SUM(tokens_used) / 1000.0, 2) AS tokens_k
FROM public.usage_tracking
GROUP BY date ORDER BY date DESC;

CREATE OR REPLACE VIEW public.email_delivery_summary AS
SELECT
  email_type,
  COUNT(*)                                                       AS total_sent,
  COUNT(*) FILTER (WHERE status = 'delivered')                   AS delivered,
  COUNT(*) FILTER (WHERE status = 'bounced')                     AS bounced,
  COUNT(*) FILTER (WHERE status = 'failed')                      AS failed,
  ROUND(COUNT(*) FILTER (WHERE status = 'delivered') * 100.0 / NULLIF(COUNT(*), 0), 1) AS delivery_rate_pct
FROM public.email_logs
GROUP BY email_type ORDER BY email_type;

GRANT SELECT ON public.career_analysis_summary  TO service_role;
GRANT SELECT ON public.daily_ai_usage_summary   TO service_role;
GRANT SELECT ON public.email_delivery_summary   TO service_role;


-- =========================================================================
-- PART 10: DEFAULT ROLE PERMISSIONS
-- =========================================================================

INSERT INTO public.role_permissions (role, permission) VALUES
  -- Owner: all permissions
  ('owner', 'view_all'), ('owner', 'edit_careers'), ('owner', 'edit_colleges'),
  ('owner', 'edit_schools'), ('owner', 'edit_pathways'), ('owner', 'edit_quiz'),
  ('owner', 'view_users'), ('owner', 'manage_users'), ('owner', 'manage_roles'),
  ('owner', 'manage_permissions'), ('owner', 'view_audit_logs'), ('owner', 'export_data'),
  -- Admin: all except manage_permissions
  ('admin', 'view_all'), ('admin', 'edit_careers'), ('admin', 'edit_colleges'),
  ('admin', 'edit_schools'), ('admin', 'edit_pathways'), ('admin', 'edit_quiz'),
  ('admin', 'view_users'), ('admin', 'manage_users'), ('admin', 'manage_roles'),
  ('admin', 'view_audit_logs'), ('admin', 'export_data'),
  -- Manager
  ('manager', 'view_all'), ('manager', 'view_users'), ('manager', 'manage_users'), ('manager', 'view_audit_logs'),
  -- Editor
  ('editor', 'view_all'), ('editor', 'edit_careers'), ('editor', 'edit_colleges'),
  ('editor', 'edit_schools'), ('editor', 'edit_pathways'), ('editor', 'edit_quiz'),
  -- User
  ('user', 'view_all')
ON CONFLICT (role, permission) DO NOTHING;


-- =========================================================================
-- PART 11: SET OWNER AFTER SIGNUP
-- =========================================================================
-- After signing up with the owner email, run this block manually
-- Replace the email below with your actual owner email, then uncomment:

-- DO $$
-- DECLARE owner_uuid UUID;
-- BEGIN
--   SELECT id INTO owner_uuid FROM auth.users WHERE email = 'johan.manoj@zertainity.in';
--   IF owner_uuid IS NOT NULL THEN
--     INSERT INTO public.user_roles (user_id, role) VALUES (owner_uuid, 'owner'::app_role)
--     ON CONFLICT (user_id, role) DO NOTHING;
--   END IF;
-- END $$;


-- =========================================================================
-- PART 12: CAREER MASTER DATA SEED (20 Careers)
-- =========================================================================

INSERT INTO public.career_master_data
  (career_name, domain, score_weights, required_exams, top_job_roles, avg_salary_lpa, growth_outlook, description)
VALUES
  ('Software Engineer', 'engineering', '{"math":0.35,"science":0.25,"interest_tech":0.30,"english":0.10}', ARRAY['JEE Main','JEE Advanced','BITSAT'], ARRAY['Software Developer','Backend Engineer','Full Stack Developer','SDE-2'], 12.00, 'high', 'Design and build software systems, applications, and algorithms.'),
  ('Data Scientist', 'engineering', '{"math":0.40,"science":0.20,"interest_tech":0.30,"english":0.10}', ARRAY['JEE Main','GATE'], ARRAY['Data Scientist','ML Engineer','AI Researcher','Analytics Lead'], 14.00, 'high', 'Extract insights from data using statistics, machine learning, and visualisation.'),
  ('Civil Engineer', 'engineering', '{"math":0.35,"science":0.30,"interest_tech":0.20,"social":0.15}', ARRAY['JEE Main','JEE Advanced'], ARRAY['Site Engineer','Structural Designer','Urban Planner','Project Manager'], 7.50, 'stable', 'Design and oversee construction of infrastructure.'),
  ('Mechanical Engineer', 'engineering', '{"math":0.35,"science":0.35,"interest_tech":0.20,"english":0.10}', ARRAY['JEE Main','JEE Advanced','GATE'], ARRAY['Mechanical Designer','Manufacturing Engineer','Automotive Engineer'], 8.00, 'stable', 'Design and analyse mechanical systems and manufacturing processes.'),
  ('Electronics Engineer', 'engineering', '{"math":0.35,"science":0.35,"interest_tech":0.25,"english":0.05}', ARRAY['JEE Main','JEE Advanced','GATE'], ARRAY['Circuit Designer','Embedded Systems Engineer','VLSI Engineer','IoT Developer'], 9.00, 'high', 'Work with electronic circuits, embedded systems, and hardware.'),
  ('Doctor (MBBS)', 'medical', '{"science":0.45,"math":0.15,"interest_bio":0.30,"english":0.10}', ARRAY['NEET UG'], ARRAY['General Physician','Surgeon','Specialist','Medical Researcher'], 10.00, 'stable', 'Diagnose and treat patients; specialise after MBBS.'),
  ('Dentist (BDS)', 'medical', '{"science":0.40,"math":0.15,"interest_bio":0.35,"english":0.10}', ARRAY['NEET UG'], ARRAY['General Dentist','Oral Surgeon','Orthodontist','Prosthodontist'], 7.00, 'stable', 'Diagnose and treat diseases affecting teeth and gums.'),
  ('Pharmacist', 'medical', '{"science":0.45,"math":0.20,"interest_bio":0.25,"english":0.10}', ARRAY['NEET UG','GPAT'], ARRAY['Clinical Pharmacist','Hospital Pharmacist','Drug Researcher','Regulatory Affairs'], 5.50, 'stable', 'Dispense medications and work in clinical or industrial pharma.'),
  ('Biomedical Engineer', 'engineering', '{"science":0.35,"math":0.30,"interest_bio":0.20,"interest_tech":0.15}', ARRAY['JEE Main','NEET UG'], ARRAY['Biomedical Engineer','Medical Device Designer','Clinical Engineer'], 8.00, 'high', 'Apply engineering to biology and medicine to improve healthcare technology.'),
  ('Chartered Accountant', 'commerce', '{"math":0.30,"commerce":0.40,"interest_biz":0.20,"english":0.10}', ARRAY['CA Foundation','CA Intermediate','CA Final'], ARRAY['CA','Auditor','Tax Consultant','CFO','Finance Manager'], 10.00, 'stable', 'Manage financial records, auditing, taxation, and business advisory.'),
  ('Business Analyst', 'commerce', '{"math":0.25,"commerce":0.30,"interest_biz":0.30,"english":0.15}', ARRAY['CAT','XAT','GMAT'], ARRAY['Business Analyst','Management Consultant','Strategy Lead','Product Manager'], 11.00, 'high', 'Analyse data and processes to help organisations make better decisions.'),
  ('Investment Banker', 'commerce', '{"math":0.30,"commerce":0.35,"interest_biz":0.25,"english":0.10}', ARRAY['CAT','CFA','MBA'], ARRAY['Investment Banker','Financial Analyst','Portfolio Manager','Equity Researcher'], 15.00, 'high', 'Raise capital, manage M&A, and advise on financial strategy.'),
  ('Journalist', 'arts', '{"english":0.45,"social":0.30,"interest_social":0.15,"art":0.10}', ARRAY['CUET','IIMC Entrance'], ARRAY['Reporter','Editor','Correspondent','News Anchor','Content Strategist'], 5.00, 'stable', 'Research, write, and report news for print, broadcast, or digital media.'),
  ('Psychologist', 'arts', '{"social":0.40,"english":0.30,"interest_social":0.20,"science":0.10}', ARRAY['CUET','NET','RCI'], ARRAY['Clinical Psychologist','Counsellor','HR Manager','UX Researcher'], 6.00, 'high', 'Study human behaviour and help individuals overcome challenges.'),
  ('Graphic Designer', 'design', '{"art":0.45,"interest_art":0.35,"english":0.10,"interest_tech":0.10}', ARRAY['NID DAT','NIFT','CEED'], ARRAY['Graphic Designer','UI Designer','Brand Designer','Illustrator','Art Director'], 6.00, 'high', 'Create visual concepts to communicate ideas that inspire audiences.'),
  ('Fashion Designer', 'design', '{"art":0.45,"interest_art":0.40,"english":0.10,"social":0.05}', ARRAY['NIFT Entrance','NID DAT','Pearl Academy'], ARRAY['Fashion Designer','Stylist','Textile Designer','Creative Director'], 5.00, 'stable', 'Design clothing and accessories; understand consumer preferences.'),
  ('Lawyer', 'law', '{"english":0.40,"social":0.30,"interest_law":0.20,"math":0.10}', ARRAY['CLAT','AILET','LSAT India'], ARRAY['Advocate','Corporate Lawyer','Criminal Lawyer','Judge','Legal Advisor'], 8.00, 'stable', 'Advise clients on legal matters and represent them in court.'),
  ('Corporate Lawyer', 'law', '{"english":0.35,"social":0.25,"interest_law":0.25,"commerce":0.15}', ARRAY['CLAT','AILET','LLM'], ARRAY['Corporate Counsel','M&A Lawyer','IPR Attorney','Compliance Officer'], 14.00, 'high', 'Specialise in business law: mergers, contracts, IPR, compliance.'),
  ('UX Designer', 'design', '{"art":0.35,"interest_art":0.25,"interest_tech":0.25,"english":0.15}', ARRAY['CEED','NID DAT','BDes Entrance'], ARRAY['UX Designer','Product Designer','UX Researcher','Interaction Designer'], 10.00, 'high', 'Design user-centred digital experiences for apps and websites.'),
  ('Civil Services (IAS/IPS)', 'arts', '{"social":0.35,"english":0.30,"math":0.15,"interest_social":0.20}', ARRAY['UPSC CSE'], ARRAY['IAS Officer','IPS Officer','IFS Officer','IRS Officer'], 8.00, 'stable', 'Serve in government administration, police, or foreign service.')
ON CONFLICT (career_name) DO NOTHING;


-- =========================================================================
-- PART 13: COLLEGE DATA SEED (30 Top India Institutions)
-- =========================================================================

INSERT INTO public.college_data (name, state, city, college_type, ranking_nirf, courses, cutoffs, relevant_exams, website) VALUES
  ('IIT Bombay',   'Maharashtra', 'Mumbai',              'IIT', 3,  ARRAY['B.Tech','M.Tech','PhD','MBA'],        '{"jee_advanced_rank":{"general":500}}',  ARRAY['JEE Advanced'], 'https://www.iitb.ac.in'),
  ('IIT Delhi',    'Delhi',       'New Delhi',           'IIT', 2,  ARRAY['B.Tech','M.Tech','PhD'],              '{"jee_advanced_rank":{"general":450}}',  ARRAY['JEE Advanced'], 'https://www.iitd.ac.in'),
  ('IIT Madras',   'Tamil Nadu',  'Chennai',             'IIT', 1,  ARRAY['B.Tech','M.Tech','PhD','MBA'],        '{"jee_advanced_rank":{"general":400}}',  ARRAY['JEE Advanced'], 'https://www.iitm.ac.in'),
  ('IIT Kanpur',   'Uttar Pradesh','Kanpur',             'IIT', 4,  ARRAY['B.Tech','M.Tech','PhD'],              '{"jee_advanced_rank":{"general":550}}',  ARRAY['JEE Advanced'], 'https://www.iitk.ac.in'),
  ('IIT Kharagpur','West Bengal', 'Kharagpur',           'IIT', 5,  ARRAY['B.Tech','M.Tech','PhD','MBA'],        '{"jee_advanced_rank":{"general":600}}',  ARRAY['JEE Advanced'], 'https://www.iitkgp.ac.in'),
  ('IIT Roorkee',  'Uttarakhand', 'Roorkee',             'IIT', 6,  ARRAY['B.Tech','M.Tech','PhD'],              '{"jee_advanced_rank":{"general":700}}',  ARRAY['JEE Advanced'], 'https://www.iitr.ac.in'),
  ('IIT Hyderabad','Telangana',   'Hyderabad',           'IIT', 9,  ARRAY['B.Tech','M.Tech','PhD'],              '{"jee_advanced_rank":{"general":2000}}', ARRAY['JEE Advanced'], 'https://www.iith.ac.in'),
  ('BITS Pilani',  'Rajasthan',   'Pilani',              'BITS',26, ARRAY['B.E.','M.Tech','M.Sc','MBA'],         '{"bitsat_score":{"general":350}}',       ARRAY['BITSAT'],       'https://www.bits-pilani.ac.in'),
  ('NIT Trichy',   'Tamil Nadu',  'Tiruchirappalli',     'NIT', 8,  ARRAY['B.Tech','M.Tech','PhD'],              '{"jee_main_rank":{"general":5000}}',     ARRAY['JEE Main'],     'https://www.nitt.edu'),
  ('NIT Warangal', 'Telangana',   'Warangal',            'NIT', 11, ARRAY['B.Tech','M.Tech','PhD'],              '{"jee_main_rank":{"general":6000}}',     ARRAY['JEE Main'],     'https://www.nitw.ac.in'),
  ('NIT Surathkal','Karnataka',   'Mangaluru',           'NIT', 13, ARRAY['B.Tech','M.Tech','PhD'],              '{"jee_main_rank":{"general":7000}}',     ARRAY['JEE Main'],     'https://www.nitk.ac.in'),
  ('AIIMS Delhi',  'Delhi',       'New Delhi',           'AIIMS',1, ARRAY['MBBS','MD','MS','BSc Nursing'],       '{"neet_rank":{"general":50}}',           ARRAY['NEET UG'],      'https://www.aiims.edu'),
  ('JIPMER',       'Puducherry',  'Puducherry',          'Central',2,ARRAY['MBBS','MD','MS'],                    '{"neet_rank":{"general":200}}',          ARRAY['NEET UG'],      'https://jipmer.edu.in'),
  ('IIM Ahmedabad','Gujarat',     'Ahmedabad',           'IIM', 1,  ARRAY['MBA','PGP','PhD'],                   '{"cat_percentile":{"general":99}}',      ARRAY['CAT'],          'https://www.iima.ac.in'),
  ('IIM Bangalore','Karnataka',   'Bengaluru',           'IIM', 2,  ARRAY['MBA','PGP','PhD'],                   '{"cat_percentile":{"general":99}}',      ARRAY['CAT'],          'https://www.iimb.ac.in'),
  ('IIM Calcutta', 'West Bengal', 'Kolkata',             'IIM', 3,  ARRAY['MBA','PGP','PhD'],                   '{"cat_percentile":{"general":98.5}}',    ARRAY['CAT'],          'https://www.iimcal.ac.in'),
  ('NLSIU Bangalore','Karnataka', 'Bengaluru',           'NLU', 1,  ARRAY['BA LLB','LLM','PhD'],                '{"clat_rank":{"general":50}}',           ARRAY['CLAT'],         'https://www.nls.ac.in'),
  ('NALSAR Hyderabad','Telangana','Hyderabad',           'NLU', 2,  ARRAY['BA LLB','LLM','MBA'],                '{"clat_rank":{"general":80}}',           ARRAY['CLAT'],         'https://www.nalsar.ac.in'),
  ('NIFT Delhi',   'Delhi',       'New Delhi',           'Central',1,ARRAY['B.Des','M.Des','M.FTech'],           '{"nift_score":{"general":70}}',          ARRAY['NIFT Entrance'],'https://www.nift.ac.in'),
  ('NID Ahmedabad','Gujarat',     'Ahmedabad',           'Central',1,ARRAY['B.Des','M.Des'],                     '{"nid_dat_score":{"general":65}}',       ARRAY['NID DAT'],      'https://www.nid.edu'),
  ('Delhi University','Delhi',    'New Delhi',           'Central',12,ARRAY['BA','BCom','BSc','MA','MCom'],      '{"cuet_percentile":{"general":95}}',     ARRAY['CUET'],         'https://www.du.ac.in'),
  ('Jadavpur University','West Bengal','Kolkata',        'State',14, ARRAY['B.Tech','BE','MA','MSc'],            '{"wbjee_rank":{"general":2000}}',        ARRAY['WBJEE','JEE Main'],'https://jadavpuruniversity.in'),
  ('VIT Vellore',  'Tamil Nadu',  'Vellore',             'Deemed',15,ARRAY['B.Tech','M.Tech','MBA','MCA'],       '{"viteee_score":{"general":120}}',       ARRAY['VITEEE','JEE Main'],'https://vit.ac.in'),
  ('Manipal Institute of Technology','Karnataka','Manipal','Deemed',51,ARRAY['B.Tech','M.Tech','BPharm'],       '{"mit_oet_score":{"general":60}}',       ARRAY['MET','JEE Main'],'https://manipal.edu'),
  ('SRM Institute','Tamil Nadu',  'Chennai',             'Deemed',41,ARRAY['B.Tech','M.Tech','MBA','MCA'],       '{"srmjee_score":{"general":100}}',       ARRAY['SRMJEEE','JEE Main'],'https://www.srmist.edu.in'),
  ('Christ University','Karnataka','Bengaluru',          'Deemed',45,ARRAY['BCom','BA','BSc','MBA','LLB'],       '{"merit_score":{"general":85}}',         ARRAY['Christ University Entrance'],'https://christuniversity.in'),
  ('Ashoka University','Haryana', 'Sonipat',             'Private',NULL,ARRAY['BA','BSc','BCom','MA','PhD'],     '{"merit_score":{"general":90}}',         ARRAY['Ashoka Aptitude Test'],'https://ashoka.edu.in'),
  ('Shiv Nadar University','Uttar Pradesh','Greater Noida','Deemed',55,ARRAY['B.Tech','BBA','BA','MA','PhD'],   '{"merit_score":{"general":85}}',         ARRAY['JEE Main','SNUAT'],'https://snu.edu.in'),
  ('TISS Mumbai',  'Maharashtra', 'Mumbai',              'Central',1,ARRAY['MSW','MA','MBA','PhD'],              '{"tiss_net_score":{"general":70}}',      ARRAY['TISS-NET'],     'https://www.tiss.edu'),
  ('Lovely Professional University','Punjab','Phagwara', 'Private',70,ARRAY['B.Tech','BBA','BA','MBA','MCA'],   '{"merit_score":{"general":60}}',         ARRAY['LPUNEST','JEE Main'],'https://www.lpu.in')
ON CONFLICT DO NOTHING;


-- =========================================================================
-- ✅ SETUP COMPLETE
-- All tables, functions, triggers, indexes, RLS policies, and seed data
-- have been created. The database is ready.
--
-- NEXT STEPS:
-- 1. Sign up with your owner email in the app
-- 2. Uncomment and run the SET OWNER block (Part 11) with your email
-- 3. Configure Supabase Auth SMTP with Resend
-- 4. Add Supabase Secrets: GEMINI_API_KEY, OPENROUTER_API_KEY, RESEND_API_KEY
-- 5. Deploy edge functions via Supabase CLI
-- =========================================================================
