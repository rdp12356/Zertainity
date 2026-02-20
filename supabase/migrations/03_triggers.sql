-- 03_triggers.sql
-- Description: Ensures activity logging and profile linkage

-- Trigger to create/link profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update all linked profiles when one is updated
CREATE OR REPLACE FUNCTION public.sync_linked_profiles()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.identity_key IS NOT NULL AND (
        OLD.display_name IS DISTINCT FROM NEW.display_name OR
        OLD.avatar_url IS DISTINCT FROM NEW.avatar_url OR
        OLD.position IS DISTINCT FROM NEW.position OR
        OLD.bio IS DISTINCT FROM NEW.bio OR
        OLD.location IS DISTINCT FROM NEW.location OR
        OLD.phone_number IS DISTINCT FROM NEW.phone_number
    ) THEN
        UPDATE public.user_profiles
        SET 
            display_name = NEW.display_name,
            avatar_url = NEW.avatar_url,
            position = NEW.position,
            bio = NEW.bio,
            location = NEW.location,
            phone_number = NEW.phone_number,
            updated_at = now()
        WHERE identity_key = NEW.identity_key
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_profile_updated
  AFTER UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_linked_profiles();
