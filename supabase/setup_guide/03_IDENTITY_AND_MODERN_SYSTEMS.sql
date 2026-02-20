-- 03_IDENTITY_AND_MODERN_SYSTEMS.sql
-- Run this third to enable multi-provider identity merging and advanced triggers

-- 1. Identity Linking Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    v_identity_key TEXT;
    v_existing_profile_id UUID;
BEGIN
    -- Map linked emails to a singular identity_key
    IF NEW.email IN ('johan.manoj@zertainity.in', 'johanmanoj2009@gmail.com') THEN
        v_identity_key := 'johan_manoj_identity';
    ELSIF NEW.email IN ('viney.ragesh@zertainity.in', 'vineyragesh333@gmail.com') THEN
        v_identity_key := 'viney_ragesh_identity';
    ELSE
        v_identity_key := NEW.email;
    END IF;

    -- Check for existing identity
    SELECT id INTO v_existing_profile_id FROM public.user_profiles WHERE identity_key = v_identity_key LIMIT 1;

    IF v_existing_profile_id IS NOT NULL THEN
        -- Link new auth user to existing identity
        INSERT INTO public.user_profiles (id, identity_key, display_name, avatar_url)
        VALUES (
            NEW.id, 
            v_identity_key, 
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name'),
            NEW.raw_user_meta_data->>'avatar_url'
        )
        ON CONFLICT (id) DO UPDATE SET identity_key = v_identity_key;
    ELSE
        -- Fresh identity
        INSERT INTO public.user_profiles (id, identity_key, display_name, avatar_url)
        VALUES (
            NEW.id, 
            v_identity_key, 
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name'),
            NEW.raw_user_meta_data->>'avatar_url'
        );
    END IF;

    -- Default role assignment (Viewer for all new users, owners seeded manually)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'viewer'::app_role)
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Profile Sync Trigger (Propagate changes across linked accounts)
CREATE OR REPLACE FUNCTION public.sync_linked_profiles()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.identity_key IS NOT NULL THEN
        UPDATE public.user_profiles
        SET 
            display_name = NEW.display_name,
            avatar_url = NEW.avatar_url,
            phone_number = NEW.phone_number,
            location = NEW.location,
            position = NEW.position,
            updated_at = now()
        WHERE identity_key = NEW.identity_key
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_updated_sync ON public.user_profiles;
CREATE TRIGGER on_profile_updated_sync
  AFTER UPDATE ON public.user_profiles
  FOR EACH ROW
  WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION public.sync_linked_profiles();
