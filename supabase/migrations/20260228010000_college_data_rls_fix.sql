-- =========================================================================
-- ZERTAINITY - COLLEGE DATA RLS FIX
-- =========================================================================

-- Ensure Row Level Security is active
ALTER TABLE public.college_data ENABLE ROW LEVEL SECURITY;

-- 1. college_data public read access
DROP POLICY IF EXISTS "college_data_select_all" ON public.college_data;

CREATE POLICY "college_data_select_all"
ON public.college_data FOR SELECT
USING (true);
