-- Applied to connected Supabase production project on 2026-10-26. No student records affected.
-- Durable atomic quotas for paid AI operations (works across Supabase Edge isolates).
-- Service-role only: callers never directly choose or reset their quotas.
CREATE TABLE IF NOT EXISTS public.api_request_limits (
  endpoint text NOT NULL,
  bucket_key text NOT NULL,
  window_started timestamptz NOT NULL DEFAULT now(),
  hits integer NOT NULL DEFAULT 0,
  PRIMARY KEY (endpoint, bucket_key)
);
ALTER TABLE public.api_request_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.api_request_limits FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.api_request_limits TO service_role;

CREATE OR REPLACE FUNCTION public.consume_ai_quota(
  p_key text, p_endpoint text, p_limit integer, p_window_seconds integer
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE granted boolean;
BEGIN
  IF length(p_key) < 12 OR length(p_key) > 128
    OR p_endpoint NOT IN ('support-chat', 'explain-analysis')
    OR p_limit NOT BETWEEN 1 AND 60
    OR p_window_seconds NOT BETWEEN 60 AND 86400 THEN
    RETURN false;
  END IF;

  INSERT INTO public.api_request_limits(endpoint, bucket_key, hits, window_started)
  VALUES(p_endpoint, p_key, 1, now())
  ON CONFLICT(endpoint, bucket_key) DO UPDATE SET
    hits = CASE
      WHEN public.api_request_limits.window_started <= now() - make_interval(secs => p_window_seconds)
        THEN 1
      ELSE public.api_request_limits.hits + 1
    END,
    window_started = CASE
      WHEN public.api_request_limits.window_started <= now() - make_interval(secs => p_window_seconds)
        THEN now()
      ELSE public.api_request_limits.window_started
    END
  RETURNING hits <= p_limit INTO granted;
  RETURN COALESCE(granted, false);
END;
$$;
REVOKE ALL ON FUNCTION public.consume_ai_quota(text,text,integer,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_ai_quota(text,text,integer,integer) TO service_role;

