-- Keep the already-created share token function signature, but never expose old stored student names.
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
         sr.top_recommendation, sr.top_match_percent, NULL::text AS display_name, sr.created_at
  FROM public.shared_results AS sr
  WHERE sr.slug = p_slug
    AND p_slug ~ '^[a-z0-9]{12}$'
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.get_shared_result_by_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_shared_result_by_slug(text) TO anon, authenticated, service_role;

-- Settings used for operational administration are never public configuration.
DROP POLICY IF EXISTS "Allow public read access on site_settings" ON public.site_settings;
CREATE POLICY "Only public presentation settings readable"
  ON public.site_settings FOR SELECT TO anon, authenticated
  USING (key IN ('siteTitle','metaDescription','support_email','openRegistration','maintenanceMode','maintenance_mode'));
