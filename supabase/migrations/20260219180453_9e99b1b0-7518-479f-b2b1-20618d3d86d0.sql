
CREATE TABLE IF NOT EXISTS public.career_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  education_level TEXT NOT NULL,
  top_recommendation TEXT,
  top_match_percent INTEGER,
  all_recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.career_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own career history"
ON public.career_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own career history"
ON public.career_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins and owners can view all career history"
ON public.career_history FOR SELECT
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));
