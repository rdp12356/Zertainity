-- Create user_saved_careers table
CREATE TABLE IF NOT EXISTS public.user_saved_careers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    career_id text NOT NULL REFERENCES public.careers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    -- Prevent a user from saving the same career twice
    UNIQUE(user_id, career_id)
);

-- Enable RLS
ALTER TABLE public.user_saved_careers ENABLE ROW LEVEL SECURITY;

-- Policies for user_saved_careers
DROP POLICY IF EXISTS "Users can view their own saved careers" ON public.user_saved_careers;
CREATE POLICY "Users can view their own saved careers" 
    ON public.user_saved_careers 
    FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own saved careers" ON public.user_saved_careers;
CREATE POLICY "Users can insert their own saved careers" 
    ON public.user_saved_careers 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own saved careers" ON public.user_saved_careers;
CREATE POLICY "Users can delete their own saved careers" 
    ON public.user_saved_careers 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Admin policies (can view and delete all saved careers)
DROP POLICY IF EXISTS "Users with edit_careers permission can view all saved careers" ON public.user_saved_careers;
CREATE POLICY "Users with edit_careers permission can view all saved careers" 
    ON public.user_saved_careers 
    FOR SELECT 
    USING (public.has_permission(auth.uid(), 'edit_careers'));

DROP POLICY IF EXISTS "Users with edit_careers permission can delete all saved careers" ON public.user_saved_careers;
CREATE POLICY "Users with edit_careers permission can delete all saved careers" 
    ON public.user_saved_careers 
    FOR DELETE 
    USING (public.has_permission(auth.uid(), 'edit_careers'));

-- Add to publications if real-time needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'user_saved_careers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_saved_careers;
  END IF;
END $$;
