-- Shared results table for public shareable links
CREATE TABLE IF NOT EXISTS public.shared_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  education_level TEXT NOT NULL,
  strengths TEXT,
  recommendations JSONB NOT NULL,
  top_recommendation TEXT,
  top_match_percent INTEGER,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shared_results ENABLE ROW LEVEL SECURITY;

-- Anyone can read a shared result by slug (public share)
CREATE POLICY "Anyone can view shared results"
ON public.shared_results
FOR SELECT
USING (true);

-- Authenticated users can insert their own shared results
CREATE POLICY "Users can insert shared results"
ON public.shared_results
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can delete their own shared results
CREATE POLICY "Users can delete their own shared results"
ON public.shared_results
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
