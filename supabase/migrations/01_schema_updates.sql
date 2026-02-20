-- 01_schema_updates.sql
-- Description: Adds position and identity linking support to user_profiles

-- Add position column if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'position') THEN
        ALTER TABLE public.user_profiles ADD COLUMN position TEXT;
    END IF;
END $$;

-- Add identity_key column if not exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'identity_key') THEN
        ALTER TABLE public.user_profiles ADD COLUMN identity_key TEXT;
    END IF;
END $$;

-- Update app_role enum to include 'viewer'
-- Note: Supabase doesn't support ALTER TYPE ADD VALUE in a transaction easily.
-- This script assumes it's run in the SQL editor.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

-- Ensure identity_key index for fast lookups
CREATE INDEX IF NOT EXISTS user_profiles_identity_key_idx ON public.user_profiles (identity_key);

-- Create a function to link profiles based on email
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    v_identity_key TEXT;
    v_existing_profile_id UUID;
BEGIN
    -- Group specific emails by identity_key
    IF NEW.email IN ('johan.manoj@zertainity.in', 'johanmanoj2009@gmail.com') THEN
        v_identity_key := 'johan_manoj_identity';
    ELSIF NEW.email IN ('viney.ragesh@zertainity.in', 'vineyragesh333@gmail.com') THEN
        v_identity_key := 'viney_ragesh_identity';
    ELSE
        v_identity_key := NEW.email;
    END IF;

    -- Check if a profile with this identity_key already exists
    SELECT id INTO v_existing_profile_id FROM public.user_profiles WHERE identity_key = v_identity_key LIMIT 1;

    IF v_existing_profile_id IS NOT NULL THEN
        -- If profile exists, just link this auth user to it (or update if needed)
        -- In a multi-tenant auth system, you might want to handle this differently
        -- For now, we ensure the profile reflects the identity_key
        INSERT INTO public.user_profiles (id, identity_key, display_name)
        VALUES (NEW.id, v_identity_key, NEW.raw_user_meta_data->>'display_name')
        ON CONFLICT (id) DO UPDATE SET identity_key = v_identity_key;
    ELSE
        -- Create new profile
        INSERT INTO public.user_profiles (id, identity_key, display_name)
        VALUES (NEW.id, v_identity_key, NEW.raw_user_meta_data->>'display_name');
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
