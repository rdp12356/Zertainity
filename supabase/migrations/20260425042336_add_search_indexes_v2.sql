
-- Enable trigram extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Text search indexes for fast ILIKE queries at scale
CREATE INDEX IF NOT EXISTS idx_careers_name_trgm ON careers USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_colleges_name_trgm ON colleges USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_schools_name_trgm ON schools USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_exams_name_trgm ON exams USING gin (name gin_trgm_ops);

-- Category/location indexes for filtering
CREATE INDEX IF NOT EXISTS idx_careers_category ON careers (category);
CREATE INDEX IF NOT EXISTS idx_colleges_location ON colleges (location);
CREATE INDEX IF NOT EXISTS idx_schools_location ON schools (location);
CREATE INDEX IF NOT EXISTS idx_schools_board ON schools (board);
CREATE INDEX IF NOT EXISTS idx_exams_category ON exams (category);
;
