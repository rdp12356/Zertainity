-- =========================================================================
-- ZERTAINITY - STRICT RLS HARDENING MIGRATION
-- =========================================================================

-- Ensure Row Level Security is active
ALTER TABLE public.career_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- 1. career_results
DROP POLICY IF EXISTS "career_results_insert_own" ON public.career_results;
DROP POLICY IF EXISTS "career_results_select_own" ON public.career_results;
DROP POLICY IF EXISTS "career_results_update_own" ON public.career_results;

CREATE POLICY "Users can insert own career result" ON public.career_results
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own career results" ON public.career_results
FOR SELECT USING (auth.uid() = user_id);

-- 2. interest_answers
DROP POLICY IF EXISTS "interest_answers_insert_own" ON public.interest_answers;
DROP POLICY IF EXISTS "interest_answers_select_own" ON public.interest_answers;

CREATE POLICY "Users can insert own answers" ON public.interest_answers
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own answers" ON public.interest_answers
FOR SELECT USING (auth.uid() = user_id);

-- 3. usage_tracking
DROP POLICY IF EXISTS "usage_tracking_upsert_service" ON public.usage_tracking;
DROP POLICY IF EXISTS "usage_tracking_update_service" ON public.usage_tracking;
DROP POLICY IF EXISTS "usage_tracking_select_own" ON public.usage_tracking;

CREATE POLICY "Users can view own usage" ON public.usage_tracking
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON public.usage_tracking
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- If users update their usage (e.g., via the increment function which uses definer):
CREATE POLICY "Users can update own usage" ON public.usage_tracking
FOR UPDATE USING (auth.uid() = user_id);

-- 4. ai_logs
DROP POLICY IF EXISTS "ai_logs_service_insert" ON public.ai_logs;
DROP POLICY IF EXISTS "ai_logs_own_select" ON public.ai_logs;

CREATE POLICY "Backend only insert AI logs" ON public.ai_logs
FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 5. Revoke ALL public (anon) access completely
REVOKE ALL ON public.career_results FROM anon;
REVOKE ALL ON public.interest_answers FROM anon;
REVOKE ALL ON public.ai_logs FROM anon;
REVOKE ALL ON public.usage_tracking FROM anon;
