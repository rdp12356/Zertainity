-- Grant full Zertainity Studio access only to explicitly authorized, email-verified identities.
-- Email names are invitations, NOT proof of identity. Never merge legacy Gmail users
-- or permit an unconfirmed signup to become privileged.
CREATE TABLE IF NOT EXISTS public.admin_email_entitlements (
  email text PRIMARY KEY,
  role public.app_role NOT NULL DEFAULT 'owner'::public.app_role,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT approved_admin_role CHECK (role = 'owner'::public.app_role),
  CONSTRAINT canonical_admin_email CHECK (email = lower(btrim(email)))
);
ALTER TABLE public.admin_email_entitlements ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_email_entitlements FROM PUBLIC, anon, authenticated;
-- Intentionally no public RLS policies: the entitlement roster is private.
INSERT INTO public.admin_email_entitlements(email, role) VALUES
  ('johan.manoj@zertainity.in', 'owner'::public.app_role),
  ('viney.ragesh@zertainity.in', 'owner'::public.app_role),
  ('admin@zertainity.in', 'owner'::public.app_role)
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

CREATE OR REPLACE FUNCTION public.grant_verified_admin_entitlement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND NEW.email IS NOT NULL THEN
    INSERT INTO public.user_roles(user_id, role)
    SELECT NEW.id, entitlement.role
    FROM public.admin_email_entitlements AS entitlement
    WHERE entitlement.email = lower(btrim(NEW.email))
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.grant_verified_admin_entitlement() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_verified_admin_entitlement ON auth.users;
CREATE TRIGGER on_auth_user_verified_admin_entitlement
AFTER INSERT OR UPDATE OF email, email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_verified_admin_entitlement();

-- Backfill only existing confirmed accounts on the explicit roster.
INSERT INTO public.user_roles(user_id, role)
SELECT u.id, e.role
FROM auth.users u
JOIN public.admin_email_entitlements e ON e.email = lower(btrim(u.email))
WHERE u.email_confirmed_at IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;
