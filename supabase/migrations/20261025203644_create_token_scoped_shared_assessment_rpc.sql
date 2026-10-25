-- Safe public lookup of intentionally shared assessment summaries.
-- The share slug is a 12-character capability token; do not expose user_id/id.
-- Deployment phase 1: create the RPC before switching the frontend.
CREATE OR REPLACE FUNCTION public.get_shared_result_by_slug(p_slug text)
RETURNS TABLE (
  education_level text,
  strengths text,
  recommendations jsonb,
  top_recommendation text,
  top_match_percent integer,
  display_name text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT sr.education_level, sr.strengths, sr.recommendations,
         sr.top_recommendation, sr.top_match_percent, sr.display_name, sr.created_at
  FROM public.shared_results AS sr
  WHERE sr.slug = p_slug
    AND p_slug ~ '^[a-z0-9]{12}$'
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.get_shared_result_by_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_shared_result_by_slug(text) TO anon, authenticated, service_role;
