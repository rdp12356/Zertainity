CREATE OR REPLACE FUNCTION get_db_size()
RETURNS TABLE (size bigint)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT pg_database_size(current_database());
END;
$$;

-- Utility to run TRUNCATE via RPC if needed
CREATE OR REPLACE FUNCTION clear_educational_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  TRUNCATE careers, exams, schools, colleges CASCADE;
END;
$$;
;
