-- =========================================================================
-- ZERTAINITY - PHASE 1: CAREER ENGINE MIGRATION
-- =========================================================================
-- Adds 7 new tables for the Career Analysis Engine:
--   career_master_data, interest_answers, career_results,
--   ai_logs, email_logs, usage_tracking, college_data
-- =========================================================================

-- =========================================================================
-- PART 1: CAREER MASTER DATA
-- The canonical list of careers with scoring weights
-- =========================================================================

CREATE TABLE public.career_master_data (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_name       TEXT NOT NULL UNIQUE,
  domain            TEXT NOT NULL,                     -- "engineering" | "medical" | "commerce" | "arts" | "law" | "design"
  score_weights     JSONB NOT NULL DEFAULT '{}',       -- { "math": 0.4, "science": 0.3, "interest_tech": 0.3 }
  required_exams    TEXT[] DEFAULT '{}',               -- ["JEE", "BITSAT"]
  top_job_roles     TEXT[] DEFAULT '{}',               -- ["Software Engineer", "Data Scientist"]
  avg_salary_lpa    NUMERIC(5,2),                      -- in lakhs per annum (India)
  growth_outlook    TEXT NOT NULL DEFAULT 'stable'
                    CHECK (growth_outlook IN ('high', 'stable', 'declining')),
  description       TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =========================================================================
-- PART 2: INTEREST ANSWERS
-- Raw quiz responses saved per assessment session
-- =========================================================================

CREATE TABLE public.interest_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id      UUID NOT NULL DEFAULT gen_random_uuid(),
  answers         JSONB NOT NULL DEFAULT '{}',
  -- answers format: { "q1": 4, "q2": 2, "tech_interest": 5, ... }
  education_level TEXT NOT NULL CHECK (education_level IN ('10th', '12th', 'graduate')),
  marks           JSONB NOT NULL DEFAULT '{}',
  -- marks format: { "math": 85, "science": 78, "english": 72, "social": 65 }
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =========================================================================
-- PART 3: CAREER RESULTS
-- Final scored + AI-explained outputs stored per session
-- =========================================================================

CREATE TABLE public.career_results (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id      UUID NOT NULL,
  education_level TEXT NOT NULL CHECK (education_level IN ('10th', '12th', 'graduate')),
  marks           JSONB NOT NULL DEFAULT '{}',
  top_careers     JSONB NOT NULL DEFAULT '[]',
  -- top_careers format:
  -- [{ "rank": 1, "career": "Software Engineer", "matchScore": 87,
  --    "domain": "engineering", "strengths": ["Math","Logic"],
  --    "readinessLevel": "High", "requiredExams": ["JEE"] }]
  ai_explanation  TEXT,            -- NULL if AI was skipped
  ai_model_used   TEXT CHECK (ai_model_used IN ('gemini', 'openrouter', 'rule-based')),
  email_sent      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =========================================================================
-- PART 4: AI LOGS
-- Every AI call is logged for cost monitoring and debugging
-- =========================================================================

CREATE TABLE public.ai_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  career_result_id  UUID REFERENCES public.career_results(id) ON DELETE SET NULL,
  model             TEXT NOT NULL,                   -- "gemini-2.0-flash" | "openrouter/..." | "rule-based"
  prompt_tokens     INTEGER,
  completion_tokens INTEGER,
  total_tokens      INTEGER,
  latency_ms        INTEGER,
  success           BOOLEAN NOT NULL,
  error_message     TEXT,
  created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =========================================================================
-- PART 5: EMAIL LOGS
-- Resend delivery receipts
-- =========================================================================

CREATE TABLE public.email_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email_type  TEXT NOT NULL
              CHECK (email_type IN ('welcome', 'career_result', 'roadmap', 'followup_d3', 'followup_d7')),
  to_email    TEXT NOT NULL,
  resend_id   TEXT,                         -- ID returned by Resend API
  status      TEXT NOT NULL DEFAULT 'sent'
              CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =========================================================================
-- PART 6: USAGE TRACKING
-- Daily per-user AI call quota enforcement
-- =========================================================================

CREATE TABLE public.usage_tracking (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  ai_calls     INTEGER NOT NULL DEFAULT 0,
  tokens_used  INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, date)
);

-- =========================================================================
-- PART 7: COLLEGE DATA (India)
-- Rich institution database with cutoffs
-- =========================================================================

CREATE TABLE public.college_data (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  state           TEXT NOT NULL,
  city            TEXT,
  college_type    TEXT NOT NULL DEFAULT 'Private'
                  CHECK (college_type IN ('IIT', 'NIT', 'BITS', 'IIM', 'AIIMS', 'NLU', 'Central', 'State', 'Deemed', 'Private')),
  ranking_nirf    INTEGER,
  courses         TEXT[] DEFAULT '{}',
  cutoffs         JSONB DEFAULT '{}',
  -- cutoffs: { "general": 90, "obc": 85, "sc": 75, "st": 70 }
  relevant_exams  TEXT[] DEFAULT '{}',
  website         TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =========================================================================
-- PART 8: ENABLE ROW LEVEL SECURITY
-- =========================================================================

ALTER TABLE public.career_master_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interest_answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_results     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_data       ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- PART 9: RLS POLICIES - CAREER MASTER DATA
-- Public read, admin/owner write
-- =========================================================================

CREATE POLICY "career_master_data_select_all"
ON public.career_master_data FOR SELECT
USING (true);

CREATE POLICY "career_master_data_insert_admin"
ON public.career_master_data FOR INSERT
TO authenticated
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "career_master_data_update_admin"
ON public.career_master_data FOR UPDATE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "career_master_data_delete_admin"
ON public.career_master_data FOR DELETE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 10: RLS POLICIES - INTEREST ANSWERS
-- Users own their rows; admins can read all
-- =========================================================================

CREATE POLICY "interest_answers_select_own"
ON public.interest_answers FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "interest_answers_insert_own"
ON public.interest_answers FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "interest_answers_admin_select"
ON public.interest_answers FOR SELECT
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 11: RLS POLICIES - CAREER RESULTS
-- Users own their rows; admins can read all
-- =========================================================================

CREATE POLICY "career_results_select_own"
ON public.career_results FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "career_results_insert_own"
ON public.career_results FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "career_results_update_own"
ON public.career_results FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "career_results_admin_select"
ON public.career_results FOR SELECT
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 12: RLS POLICIES - AI LOGS
-- Edge Functions insert via service_role; admins read
-- =========================================================================

CREATE POLICY "ai_logs_service_insert"
ON public.ai_logs FOR INSERT
WITH CHECK (true);

CREATE POLICY "ai_logs_admin_select"
ON public.ai_logs FOR SELECT
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "ai_logs_own_select"
ON public.ai_logs FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- =========================================================================
-- PART 13: RLS POLICIES - EMAIL LOGS
-- Edge Functions insert via service_role; admins read
-- =========================================================================

CREATE POLICY "email_logs_service_insert"
ON public.email_logs FOR INSERT
WITH CHECK (true);

CREATE POLICY "email_logs_admin_select"
ON public.email_logs FOR SELECT
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 14: RLS POLICIES - USAGE TRACKING
-- Users see their own; admins see all
-- =========================================================================

CREATE POLICY "usage_tracking_select_own"
ON public.usage_tracking FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "usage_tracking_upsert_service"
ON public.usage_tracking FOR INSERT
WITH CHECK (true);

CREATE POLICY "usage_tracking_update_service"
ON public.usage_tracking FOR UPDATE
USING (true);

CREATE POLICY "usage_tracking_admin_select"
ON public.usage_tracking FOR SELECT
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 15: RLS POLICIES - COLLEGE DATA
-- Public read, admin write
-- =========================================================================

CREATE POLICY "college_data_select_all"
ON public.college_data FOR SELECT
USING (true);

CREATE POLICY "college_data_insert_admin"
ON public.college_data FOR INSERT
TO authenticated
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "college_data_update_admin"
ON public.college_data FOR UPDATE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 16: HELPER FUNCTIONS
-- =========================================================================

-- Auto-update career_master_data.updated_at
CREATE OR REPLACE FUNCTION public.update_career_master_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_career_master_data_updated_at
BEFORE UPDATE ON public.career_master_data
FOR EACH ROW EXECUTE FUNCTION public.update_career_master_data_updated_at();

-- Increment AI usage counter for a user on a given date
CREATE OR REPLACE FUNCTION public.increment_ai_usage(
  p_user_id     UUID,
  p_tokens      INTEGER DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usage_tracking (user_id, date, ai_calls, tokens_used)
  VALUES (p_user_id, CURRENT_DATE, 1, p_tokens)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    ai_calls    = usage_tracking.ai_calls + 1,
    tokens_used = usage_tracking.tokens_used + p_tokens;
END;
$$;

-- Get today's AI usage for a user
CREATE OR REPLACE FUNCTION public.get_today_ai_usage(p_user_id UUID)
RETURNS TABLE (ai_calls INTEGER, tokens_used INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(ai_calls, 0)    AS ai_calls,
    COALESCE(tokens_used, 0) AS tokens_used
  FROM public.usage_tracking
  WHERE user_id = p_user_id
    AND date = CURRENT_DATE;
$$;

-- =========================================================================
-- PART 17: INDEXES
-- =========================================================================

CREATE INDEX idx_career_results_user_id     ON public.career_results(user_id);
CREATE INDEX idx_career_results_session_id  ON public.career_results(session_id);
CREATE INDEX idx_career_results_created_at  ON public.career_results(created_at DESC);
CREATE INDEX idx_interest_answers_user_id   ON public.interest_answers(user_id);
CREATE INDEX idx_interest_answers_session   ON public.interest_answers(session_id);
CREATE INDEX idx_ai_logs_user_id            ON public.ai_logs(user_id);
CREATE INDEX idx_ai_logs_result_id          ON public.ai_logs(career_result_id);
CREATE INDEX idx_ai_logs_created_at         ON public.ai_logs(created_at DESC);
CREATE INDEX idx_email_logs_user_id         ON public.email_logs(user_id);
CREATE INDEX idx_usage_tracking_user_date   ON public.usage_tracking(user_id, date);
CREATE INDEX idx_college_data_state         ON public.college_data(state);
CREATE INDEX idx_college_data_type          ON public.college_data(college_type);
CREATE INDEX idx_career_master_domain       ON public.career_master_data(domain);

-- =========================================================================
-- PART 18: SEED DATA - CAREER MASTER DATA
-- 20 careers across 6 domains with scoring weights
-- Weights map to: math, science, english, social, art, commerce
--                 interest_tech, interest_bio, interest_law, interest_art,
--                 interest_biz, interest_social
-- =========================================================================

INSERT INTO public.career_master_data
  (career_name, domain, score_weights, required_exams, top_job_roles, avg_salary_lpa, growth_outlook, description)
VALUES
  -- ENGINEERING DOMAIN
  ('Software Engineer', 'engineering',
   '{"math":0.35,"science":0.25,"interest_tech":0.30,"english":0.10}',
   ARRAY['JEE Main','JEE Advanced','BITSAT'],
   ARRAY['Software Developer','Backend Engineer','Full Stack Developer','SDE-2'],
   12.00, 'high',
   'Design and build software systems, applications, and algorithms.'),

  ('Data Scientist', 'engineering',
   '{"math":0.40,"science":0.20,"interest_tech":0.30,"english":0.10}',
   ARRAY['JEE Main','GATE'],
   ARRAY['Data Scientist','ML Engineer','AI Researcher','Analytics Lead'],
   14.00, 'high',
   'Extract insights from data using statistics, machine learning, and visualisation.'),

  ('Civil Engineer', 'engineering',
   '{"math":0.35,"science":0.30,"interest_tech":0.20,"social":0.15}',
   ARRAY['JEE Main','JEE Advanced'],
   ARRAY['Site Engineer','Structural Designer','Urban Planner','Project Manager'],
   7.50, 'stable',
   'Design and oversee construction of infrastructure like roads, bridges, and buildings.'),

  ('Mechanical Engineer', 'engineering',
   '{"math":0.35,"science":0.35,"interest_tech":0.20,"english":0.10}',
   ARRAY['JEE Main','JEE Advanced','GATE'],
   ARRAY['Mechanical Designer','Manufacturing Engineer','R&D Engineer','Automotive Engineer'],
   8.00, 'stable',
   'Design and analyse mechanical systems, machines, and manufacturing processes.'),

  ('Electronics Engineer', 'engineering',
   '{"math":0.35,"science":0.35,"interest_tech":0.25,"english":0.05}',
   ARRAY['JEE Main','JEE Advanced','GATE'],
   ARRAY['Circuit Designer','Embedded Systems Engineer','VLSI Engineer','IoT Developer'],
   9.00, 'high',
   'Work with electronic circuits, embedded systems, communication, and hardware.'),

  -- MEDICAL DOMAIN
  ('Doctor (MBBS)', 'medical',
   '{"science":0.45,"math":0.15,"interest_bio":0.30,"english":0.10}',
   ARRAY['NEET UG'],
   ARRAY['General Physician','Surgeon','Specialist','Medical Researcher'],
   10.00, 'stable',
   'Diagnose and treat patients, specialise in a branch of medicine after MBBS.'),

  ('Dentist (BDS)', 'medical',
   '{"science":0.40,"math":0.15,"interest_bio":0.35,"english":0.10}',
   ARRAY['NEET UG'],
   ARRAY['General Dentist','Oral Surgeon','Orthodontist','Prosthodontist'],
   7.00, 'stable',
   'Diagnose and treat diseases and conditions that affect the teeth and gums.'),

  ('Pharmacist', 'medical',
   '{"science":0.45,"math":0.20,"interest_bio":0.25,"english":0.10}',
   ARRAY['NEET UG','GPAT'],
   ARRAY['Clinical Pharmacist','Hospital Pharmacist','Drug Researcher','Regulatory Affairs'],
   5.50, 'stable',
   'Dispense medications, counsel patients, and work in clinical or industrial pharma.'),

  ('Biomedical Engineer', 'engineering',
   '{"science":0.35,"math":0.30,"interest_bio":0.20,"interest_tech":0.15}',
   ARRAY['JEE Main','NEET UG'],
   ARRAY['Biomedical Engineer','Medical Device Designer','Clinical Engineer','R&D Scientist'],
   8.00, 'high',
   'Apply engineering principles to biology and medicine to improve healthcare technology.'),

  -- COMMERCE DOMAIN
  ('Chartered Accountant', 'commerce',
   '{"math":0.30,"commerce":0.40,"interest_biz":0.20,"english":0.10}',
   ARRAY['CA Foundation','CA Intermediate','CA Final'],
   ARRAY['CA','Auditor','Tax Consultant','CFO','Finance Manager'],
   10.00, 'stable',
   'Manage financial records, auditing, taxation, and business advisory services.'),

  ('Business Analyst', 'commerce',
   '{"math":0.25,"commerce":0.30,"interest_biz":0.30,"english":0.15}',
   ARRAY['CAT','XAT','GMAT'],
   ARRAY['Business Analyst','Management Consultant','Strategy Lead','Product Manager'],
   11.00, 'high',
   'Analyse data and processes to help organisations make better business decisions.'),

  ('Investment Banker', 'commerce',
   '{"math":0.30,"commerce":0.35,"interest_biz":0.25,"english":0.10}',
   ARRAY['CAT','CFA','MBA'],
   ARRAY['Investment Banker','Financial Analyst','Portfolio Manager','Equity Researcher'],
   15.00, 'high',
   'Raise capital, manage mergers and acquisitions, and advise on financial strategy.'),

  -- ARTS / HUMANITIES DOMAIN
  ('Journalist', 'arts',
   '{"english":0.45,"social":0.30,"interest_social":0.15,"art":0.10}',
   ARRAY['CUET','IIMC Entrance'],
   ARRAY['Reporter','Editor','Correspondent','News Anchor','Content Strategist'],
   5.00, 'stable',
   'Research, write, and report on news stories for print, broadcast, or digital media.'),

  ('Psychologist', 'arts',
   '{"social":0.40,"english":0.30,"interest_social":0.20,"science":0.10}',
   ARRAY['CUET','NET','RCI'],
   ARRAY['Clinical Psychologist','Counsellor','HR Manager','UX Researcher','School Counsellor'],
   6.00, 'high',
   'Study human behaviour and mental processes; help individuals overcome challenges.'),

  ('Graphic Designer', 'design',
   '{"art":0.45,"interest_art":0.35,"english":0.10,"interest_tech":0.10}',
   ARRAY['NID DAT','NIFT','CEED'],
   ARRAY['Graphic Designer','UI Designer','Brand Designer','Illustrator','Art Director'],
   6.00, 'high',
   'Create visual concepts to communicate ideas that inspire and inform audiences.'),

  ('Fashion Designer', 'design',
   '{"art":0.45,"interest_art":0.40,"english":0.10,"social":0.05}',
   ARRAY['NIFT Entrance','NID DAT','Pearl Academy'],
   ARRAY['Fashion Designer','Stylist','Textile Designer','Creative Director','Buyer'],
   5.00, 'stable',
   'Design clothing, accessories, and footwear, and understand consumer preferences.'),

  -- LAW DOMAIN
  ('Lawyer', 'law',
   '{"english":0.40,"social":0.30,"interest_law":0.20,"math":0.10}',
   ARRAY['CLAT','AILET','LSAT India'],
   ARRAY['Advocate','Corporate Lawyer','Criminal Lawyer','Judge','Legal Advisor'],
   8.00, 'stable',
   'Advise clients on legal matters, represent them in court, and draft legal documents.'),

  ('Corporate Lawyer', 'law',
   '{"english":0.35,"social":0.25,"interest_law":0.25,"commerce":0.15}',
   ARRAY['CLAT','AILET','LLM'],
   ARRAY['Corporate Counsel','M&A Lawyer','IPR Attorney','Compliance Officer'],
   14.00, 'high',
   'Specialise in business law: mergers, contracts, IPR, regulatory compliance.'),

  -- ADDITIONAL HIGH-DEMAND
  ('UX Designer', 'design',
   '{"art":0.35,"interest_art":0.25,"interest_tech":0.25,"english":0.15}',
   ARRAY['CEED','NID DAT','BDes Entrance'],
   ARRAY['UX Designer','Product Designer','UX Researcher','Interaction Designer'],
   10.00, 'high',
   'Design user-centred digital experiences for apps, websites, and digital products.'),

  ('Civil Services (IAS/IPS)', 'arts',
   '{"social":0.35,"english":0.30,"math":0.15,"interest_social":0.20}',
   ARRAY['UPSC CSE'],
   ARRAY['IAS Officer','IPS Officer','IFS Officer','IRS Officer'],
   8.00, 'stable',
   'Serve in government administration, police, foreign service, or revenue departments.')

ON CONFLICT (career_name) DO NOTHING;

-- =========================================================================
-- PART 19: SEED DATA - COLLEGE DATA (Top 30 India Institutions)
-- =========================================================================

INSERT INTO public.college_data
  (name, state, city, college_type, ranking_nirf, courses, cutoffs, relevant_exams, website)
VALUES
  ('IIT Bombay', 'Maharashtra', 'Mumbai', 'IIT', 3,
   ARRAY['B.Tech','M.Tech','PhD','MBA'],
   '{"jee_advanced_rank":{"general":500,"obc":1500,"sc":5000,"st":8000}}',
   ARRAY['JEE Advanced'], 'https://www.iitb.ac.in'),

  ('IIT Delhi', 'Delhi', 'New Delhi', 'IIT', 2,
   ARRAY['B.Tech','M.Tech','PhD'],
   '{"jee_advanced_rank":{"general":450,"obc":1400,"sc":4500,"st":7500}}',
   ARRAY['JEE Advanced'], 'https://www.iitd.ac.in'),

  ('IIT Madras', 'Tamil Nadu', 'Chennai', 'IIT', 1,
   ARRAY['B.Tech','M.Tech','PhD','MBA'],
   '{"jee_advanced_rank":{"general":400,"obc":1200,"sc":4000,"st":7000}}',
   ARRAY['JEE Advanced'], 'https://www.iitm.ac.in'),

  ('IIT Kanpur', 'Uttar Pradesh', 'Kanpur', 'IIT', 4,
   ARRAY['B.Tech','M.Tech','PhD'],
   '{"jee_advanced_rank":{"general":550,"obc":1600,"sc":5500,"st":8500}}',
   ARRAY['JEE Advanced'], 'https://www.iitk.ac.in'),

  ('IIT Kharagpur', 'West Bengal', 'Kharagpur', 'IIT', 5,
   ARRAY['B.Tech','M.Tech','PhD','MBA'],
   '{"jee_advanced_rank":{"general":600,"obc":1700,"sc":6000,"st":9000}}',
   ARRAY['JEE Advanced'], 'https://www.iitkgp.ac.in'),

  ('BITS Pilani', 'Rajasthan', 'Pilani', 'BITS', 26,
   ARRAY['B.E.','M.Tech','M.Sc','MBA'],
   '{"bitsat_score":{"general":350,"scholarship":400}}',
   ARRAY['BITSAT'], 'https://www.bits-pilani.ac.in'),

  ('NIT Trichy', 'Tamil Nadu', 'Tiruchirappalli', 'NIT', 8,
   ARRAY['B.Tech','M.Tech','PhD'],
   '{"jee_main_rank":{"general":5000,"obc":15000,"sc":30000,"st":50000}}',
   ARRAY['JEE Main'], 'https://www.nitt.edu'),

  ('NIT Warangal', 'Telangana', 'Warangal', 'NIT', 11,
   ARRAY['B.Tech','M.Tech','PhD'],
   '{"jee_main_rank":{"general":6000,"obc":18000,"sc":35000,"st":55000}}',
   ARRAY['JEE Main'], 'https://www.nitw.ac.in'),

  ('AIIMS Delhi', 'Delhi', 'New Delhi', 'AIIMS', 1,
   ARRAY['MBBS','MD','MS','BSc Nursing'],
   '{"neet_rank":{"general":50,"obc":200,"sc":500,"st":800}}',
   ARRAY['NEET UG'], 'https://www.aiims.edu'),

  ('JIPMER Puducherry', 'Puducherry', 'Puducherry', 'Central', 2,
   ARRAY['MBBS','MD','MS'],
   '{"neet_rank":{"general":200,"obc":600,"sc":1200,"st":2000}}',
   ARRAY['NEET UG'], 'https://jipmer.edu.in'),

  ('IIM Ahmedabad', 'Gujarat', 'Ahmedabad', 'IIM', 1,
   ARRAY['MBA','PGP','PhD'],
   '{"cat_percentile":{"general":99,"nc_obc":98}}',
   ARRAY['CAT'], 'https://www.iima.ac.in'),

  ('IIM Bangalore', 'Karnataka', 'Bengaluru', 'IIM', 2,
   ARRAY['MBA','PGP','PhD'],
   '{"cat_percentile":{"general":99,"nc_obc":97.5}}',
   ARRAY['CAT'], 'https://www.iimb.ac.in'),

  ('IIM Calcutta', 'West Bengal', 'Kolkata', 'IIM', 3,
   ARRAY['MBA','PGP','PhD'],
   '{"cat_percentile":{"general":98.5,"nc_obc":97}}',
   ARRAY['CAT'], 'https://www.iimcal.ac.in'),

  ('NLSIU Bangalore', 'Karnataka', 'Bengaluru', 'NLU', 1,
   ARRAY['BA LLB','LLM','PhD'],
   '{"clat_rank":{"general":50,"obc":200,"sc":400,"st":600}}',
   ARRAY['CLAT'], 'https://www.nls.ac.in'),

  ('NALSAR Hyderabad', 'Telangana', 'Hyderabad', 'NLU', 2,
   ARRAY['BA LLB','LLM','MBA'],
   '{"clat_rank":{"general":80,"obc":250,"sc":500,"st":700}}',
   ARRAY['CLAT'], 'https://www.nalsar.ac.in'),

  ('NIFT Delhi', 'Delhi', 'New Delhi', 'Central', 1,
   ARRAY['B.Des','M.Des','M.FTech'],
   '{"nift_score":{"general":70}}',
   ARRAY['NIFT Entrance'], 'https://www.nift.ac.in'),

  ('NID Ahmedabad', 'Gujarat', 'Ahmedabad', 'Central', 1,
   ARRAY['B.Des','M.Des'],
   '{"nid_dat_score":{"general":65}}',
   ARRAY['NID DAT'], 'https://www.nid.edu'),

  ('Delhi University', 'Delhi', 'New Delhi', 'Central', 12,
   ARRAY['BA','BCom','BSc','MA','MCom'],
   '{"cuet_percentile":{"general":95}}',
   ARRAY['CUET'], 'https://www.du.ac.in'),

  ('Jadavpur University', 'West Bengal', 'Kolkata', 'State', 14,
   ARRAY['B.Tech','BE','MA','MSc'],
   '{"wbjee_rank":{"general":2000}}',
   ARRAY['WBJEE','JEE Main'], 'https://jadavpuruniversity.in'),

  ('Manipal Institute of Technology', 'Karnataka', 'Manipal', 'Deemed', 51,
   ARRAY['B.Tech','M.Tech','BPharm'],
   '{"mit_oet_score":{"general":60}}',
   ARRAY['MET','JEE Main'], 'https://manipal.edu'),

  ('VIT Vellore', 'Tamil Nadu', 'Vellore', 'Deemed', 15,
   ARRAY['B.Tech','M.Tech','MBA','MCA'],
   '{"viteee_score":{"general":120}}',
   ARRAY['VITEEE','JEE Main'], 'https://vit.ac.in'),

  ('SRM Institute of Science and Technology', 'Tamil Nadu', 'Chennai', 'Deemed', 41,
   ARRAY['B.Tech','M.Tech','MBA','MCA'],
   '{"srmjee_score":{"general":100}}',
   ARRAY['SRMJEEE','JEE Main'], 'https://www.srmist.edu.in'),

  ('Christ University', 'Karnataka', 'Bengaluru', 'Deemed', 45,
   ARRAY['BCom','BA','BSc','MBA','LLB'],
   '{"merit_score":{"general":85}}',
   ARRAY['Christ University Entrance'], 'https://christuniversity.in'),

  ('Symbiosis International University', 'Maharashtra', 'Pune', 'Deemed', 56,
   ARRAY['BBA','MBA','BCA','LLB','BA'],
   '{"set_score":{"general":55}}',
   ARRAY['SET'], 'https://www.siu.edu.in'),

  ('Amity University', 'Uttar Pradesh', 'Noida', 'Private', NULL,
   ARRAY['B.Tech','BBA','BA','MBA','LLB'],
   '{"amity_entrance":{"general":50}}',
   ARRAY['Amity JEE'], 'https://www.amity.edu'),

  ('Ashoka University', 'Haryana', 'Sonipat', 'Private', NULL,
   ARRAY['BA','BSc','BCom','MA','PhD'],
   '{"merit_score":{"general":90}}',
   ARRAY['Ashoka Aptitude Test'], 'https://ashoka.edu.in'),

  ('Azim Premji University', 'Karnataka', 'Bengaluru', 'Private', NULL,
   ARRAY['BA','BSc','MEd','MSc','MA'],
   '{"merit_score":{"general":75}}',
   ARRAY['APU Entrance'], 'https://azimpremjiuniversity.edu.in'),

  ('Shiv Nadar University', 'Uttar Pradesh', 'Greater Noida', 'Deemed', 55,
   ARRAY['B.Tech','BBA','BA','MA','PhD'],
   '{"merit_score":{"general":85}}',
   ARRAY['JEE Main','SNUAT'], 'https://snu.edu.in'),

  ('Lovely Professional University', 'Punjab', 'Phagwara', 'Private', 70,
   ARRAY['B.Tech','BBA','BA','MBA','MCA'],
   '{"merit_score":{"general":60}}',
   ARRAY['LPUNEST','JEE Main'], 'https://www.lpu.in'),

  ('Tata Institute of Social Sciences', 'Maharashtra', 'Mumbai', 'Central', 1,
   ARRAY['MSW','MA','MBA','PhD'],
   '{"tiss_net_score":{"general":70}}',
   ARRAY['TISS-NET'], 'https://www.tiss.edu')

ON CONFLICT DO NOTHING;
