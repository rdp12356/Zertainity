-- Additive storage for versioned analysis configuration and immutable report inputs/results.
CREATE TABLE IF NOT EXISTS public.analysis_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), algorithm_version text NOT NULL,
  name text NOT NULL, configuration jsonb NOT NULL, active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(), created_by uuid REFERENCES auth.users(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS analysis_configurations_one_active_version ON public.analysis_configurations (algorithm_version) WHERE active;
CREATE TABLE IF NOT EXISTS public.career_scoring_profiles (
  id text PRIMARY KEY, algorithm_version text NOT NULL, profile jsonb NOT NULL,
  active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES auth.users(id), algorithm_version text NOT NULL,
  input_snapshot jsonb NOT NULL, result jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analysis_results_user_created_at ON public.analysis_results (user_id, created_at DESC);
ALTER TABLE public.analysis_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_scoring_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Analysis configurations are readable" ON public.analysis_configurations FOR SELECT USING (true);
CREATE POLICY "Career scoring profiles are readable" ON public.career_scoring_profiles FOR SELECT USING (true);
CREATE POLICY "Users can read their analysis results" ON public.analysis_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their analysis results" ON public.analysis_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Editors can manage analysis configurations" ON public.analysis_configurations FOR ALL USING (public.has_permission(auth.uid(), 'edit_careers')) WITH CHECK (public.has_permission(auth.uid(), 'edit_careers'));
CREATE POLICY "Editors can manage career scoring profiles" ON public.career_scoring_profiles FOR ALL USING (public.has_permission(auth.uid(), 'edit_careers')) WITH CHECK (public.has_permission(auth.uid(), 'edit_careers'));

INSERT INTO public.analysis_configurations (algorithm_version, name, configuration, active)
SELECT '1.0', 'Analysis Engine v1 defaults',
  '{"career_weights":{"academic":0.40,"interest":0.25,"skills":0.20,"aptitude":0.10,"preferences":0.05}}'::jsonb,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.analysis_configurations
  WHERE algorithm_version = '1.0' AND active
);
