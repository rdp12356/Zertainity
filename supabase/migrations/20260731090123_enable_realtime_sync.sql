-- Enable realtime for user_saved_careers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'user_saved_careers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_saved_careers;
  END IF;
END $$;

-- Enable realtime for user_profiles (in case they edit other details)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'user_profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
  END IF;
END $$;
