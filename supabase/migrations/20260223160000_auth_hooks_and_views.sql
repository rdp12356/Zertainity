-- =========================================================================
-- ZERTAINITY – Auth Hook + Resend SMTP Migration
-- Run AFTER the main career_engine_phase1.sql migration
-- =========================================================================

-- =========================================================================
-- PART 1: Secure the on-user-signup edge function
-- Allow the function to be called only from Supabase Auth hooks
-- (uses service_role internally)
-- =========================================================================

-- Grant usage on the supabase_functions schema to postgres role
-- (needed for auth hooks to call edge functions)
GRANT USAGE ON SCHEMA supabase_functions TO postgres;

-- =========================================================================
-- PART 2: Helper function to check if welcome email was sent
-- =========================================================================

CREATE OR REPLACE FUNCTION public.has_received_welcome_email(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.email_logs
    WHERE user_id = p_user_id
      AND email_type = 'welcome'
      AND status = 'sent'
  );
$$;

-- =========================================================================
-- PART 3: Career result summary view for admin dashboard
-- =========================================================================

CREATE OR REPLACE VIEW public.career_analysis_summary AS
SELECT
  cr.id,
  cr.user_id,
  au.email AS user_email,
  cr.education_level,
  (cr.top_careers -> 0 ->> 'career')   AS top_career,
  (cr.top_careers -> 0 ->> 'matchScore')::INTEGER AS top_match_score,
  cr.ai_model_used,
  cr.email_sent,
  cr.created_at
FROM public.career_results cr
JOIN auth.users au ON cr.user_id = au.id
ORDER BY cr.created_at DESC;

-- Grant access to service role
GRANT SELECT ON public.career_analysis_summary TO service_role;

-- =========================================================================
-- PART 4: Daily AI usage summary view (for cost monitoring)
-- =========================================================================

CREATE OR REPLACE VIEW public.daily_ai_usage_summary AS
SELECT
  date,
  COUNT(DISTINCT user_id) AS unique_users,
  SUM(ai_calls)           AS total_ai_calls,
  SUM(tokens_used)        AS total_tokens_used,
  ROUND(SUM(tokens_used) / 1000.0, 2) AS tokens_k
FROM public.usage_tracking
GROUP BY date
ORDER BY date DESC;

GRANT SELECT ON public.daily_ai_usage_summary TO service_role;

-- =========================================================================
-- PART 5: Email delivery rate view
-- =========================================================================

CREATE OR REPLACE VIEW public.email_delivery_summary AS
SELECT
  email_type,
  COUNT(*)                                                    AS total_sent,
  COUNT(*) FILTER (WHERE status = 'delivered')               AS delivered,
  COUNT(*) FILTER (WHERE status = 'bounced')                 AS bounced,
  COUNT(*) FILTER (WHERE status = 'failed')                  AS failed,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'delivered') * 100.0 / NULLIF(COUNT(*), 0),
    1
  ) AS delivery_rate_pct
FROM public.email_logs
GROUP BY email_type
ORDER BY email_type;

GRANT SELECT ON public.email_delivery_summary TO service_role;

-- =========================================================================
-- PART 6: Resend webhook logs table
-- For tracking Resend delivery status callbacks
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.resend_webhook_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resend_id    TEXT,
  event_type   TEXT NOT NULL,   -- "email.sent" | "email.delivered" | "email.bounced"
  to_email     TEXT,
  payload      JSONB,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.resend_webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resend_webhook_logs_service_insert"
ON public.resend_webhook_logs FOR INSERT
WITH CHECK (true);

CREATE POLICY "resend_webhook_logs_admin_select"
ON public.resend_webhook_logs FOR SELECT
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_resend_webhook_logs_resend_id  ON public.resend_webhook_logs(resend_id);
CREATE INDEX idx_resend_webhook_logs_event_type ON public.resend_webhook_logs(event_type);
