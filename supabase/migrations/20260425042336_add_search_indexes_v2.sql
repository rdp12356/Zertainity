
-- Enable trigram extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Text search indexes for fast ILIKE queries at scale
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'careers') THEN
    CREATE INDEX IF NOT EXISTS idx_careers_name_trgm ON public.careers USING gin (name gin_trgm_ops);
    CREATE INDEX IF NOT EXISTS idx_careers_category ON public.careers (category);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_colleges_name_trgm ON colleges USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_schools_name_trgm ON schools USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_exams_name_trgm ON exams USING gin (name gin_trgm_ops);

-- Category/location indexes for filtering
CREATE INDEX IF NOT EXISTS idx_colleges_location ON colleges (location);
CREATE INDEX IF NOT EXISTS idx_schools_location ON schools (location);
CREATE INDEX IF NOT EXISTS idx_schools_board ON schools (board);
CREATE INDEX IF NOT EXISTS idx_exams_category ON exams (category);
;
