-- ─────────────────────────────────────────────────────────────────────────────
-- Ensure Careers Schema, Trigram Search Indexes, and RLS Policies (2026-08-22)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Ensure required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Ensure public.careers base table exists
CREATE TABLE IF NOT EXISTS public.careers (
    id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name text,
    title text,
    slug text,
    category text NOT NULL DEFAULT 'General',
    salary text,
    demand text,
    education text,
    official_source_url text,
    tagline text,
    overview text,
    salary_entry text,
    salary_mid text,
    salary_senior text,
    skills text[],
    entrance_exams text[],
    created_at timestamptz DEFAULT now()
);

-- 3. Ensure all columns exist on existing production tables
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'General';
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS salary text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS demand text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS education text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS official_source_url text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS tagline text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS overview text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS salary_entry text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS salary_mid text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS salary_senior text;
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS skills text[];
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS entrance_exams text[];
ALTER TABLE IF EXISTS public.careers ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- 4. Fast search and filter indexes
CREATE INDEX IF NOT EXISTS idx_careers_name_trgm ON public.careers USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_careers_category ON public.careers (category);

-- 5. Row Level Security & Authorization Policies
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Careers are viewable by everyone" ON public.careers;
CREATE POLICY "Careers are viewable by everyone" 
    ON public.careers 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Users with edit_careers permission can insert careers" ON public.careers;
CREATE POLICY "Users with edit_careers permission can insert careers"
    ON public.careers
    FOR INSERT
    WITH CHECK (public.has_permission(auth.uid(), 'edit_careers'));

DROP POLICY IF EXISTS "Users with edit_careers permission can update careers" ON public.careers;
CREATE POLICY "Users with edit_careers permission can update careers"
    ON public.careers
    FOR UPDATE
    USING (public.has_permission(auth.uid(), 'edit_careers'))
    WITH CHECK (public.has_permission(auth.uid(), 'edit_careers'));

DROP POLICY IF EXISTS "Users with edit_careers permission can delete careers" ON public.careers;
CREATE POLICY "Users with edit_careers permission can delete careers"
    ON public.careers
    FOR DELETE
    USING (public.has_permission(auth.uid(), 'edit_careers'));

-- 6. Realtime sync publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'careers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.careers;
  END IF;
END $$;
