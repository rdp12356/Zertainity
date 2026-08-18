-- Create careers table
CREATE TABLE IF NOT EXISTS public.careers (
    id text PRIMARY KEY,
    title text NOT NULL,
    category text NOT NULL,
    salary text,
    demand text,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view careers
DROP POLICY IF EXISTS "Careers are viewable by everyone" ON public.careers;
CREATE POLICY "Careers are viewable by everyone" 
    ON public.careers 
    FOR SELECT 
    USING (true);

-- Policy: Only users with 'edit_careers' permission can modify careers
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

-- Add realtime publication for careers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'careers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.careers;
  END IF;
END $$;
