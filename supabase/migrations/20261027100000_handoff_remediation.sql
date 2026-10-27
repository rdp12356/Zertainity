-- Zertainity handoff remediation: privilege narrowing and atomic administrative writes.
-- Deploy the migration BEFORE deploying the dependent Edge Functions.
-- No data is deleted or rewritten by this migration.
BEGIN;

-- RLS never protects TRUNCATE, REFERENCES or TRIGGER; browser roles should
-- not receive table-level privileges that the application does not use.
REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE TRUNCATE, REFERENCES, TRIGGER ON TABLES FROM anon, authenticated;

-- Keep existing sharing URLs accessible, but require new records to have a
-- signed-in owner (and thus allow the owner to revoke their link later).
DROP POLICY IF EXISTS "Users can insert shared results" ON public.shared_results;
CREATE POLICY "Users can insert their own shared results"
  ON public.shared_results FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id AND user_id IS NOT NULL);

-- Remove equivalent duplicated SELECT policies; the remaining rules are unchanged.
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Careers are viewable by everyone" ON public.careers;

-- A single PostgreSQL transaction changes a role and writes its audit event.
-- The service-role-only grant is essential: callers must first pass JWT and
-- current owner-role validation inside the Edge Function.
CREATE OR REPLACE FUNCTION public.owner_replace_user_role(
  p_actor_user_id uuid,
  p_target_user_id uuid,
  p_previous_role public.app_role,
  p_next_role public.app_role
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = ''
AS $function$
DECLARE changed_rows integer;
BEGIN
  IF p_actor_user_id IS NULL OR p_target_user_id IS NULL
    OR p_actor_user_id = p_target_user_id OR p_next_role IS NULL THEN
    RAISE EXCEPTION 'Invalid role change request' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_actor_user_id AND role = 'owner'::public.app_role
  ) THEN
    RAISE EXCEPTION 'Owner access required' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(p_target_user_id::text));
  IF p_previous_role IS NOT NULL AND p_previous_role <> 'user'::public.app_role THEN
    DELETE FROM public.user_roles
      WHERE user_id = p_target_user_id AND role = p_previous_role;
    GET DIAGNOSTICS changed_rows = ROW_COUNT;
    IF changed_rows <> 1 THEN
      RAISE EXCEPTION 'Stale previous role; reload before retrying' USING ERRCODE = 'P0002';
    END IF;
  END IF;

  IF p_next_role <> 'user'::public.app_role THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_target_user_id, p_next_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  INSERT INTO public.audit_log (user_id, target_user_id, action, before_snapshot, after_snapshot)
  VALUES (p_actor_user_id, p_target_user_id, 'role_changed',
    CASE WHEN p_previous_role IS NULL THEN NULL ELSE pg_catalog.jsonb_build_object('role', p_previous_role::text) END,
    pg_catalog.jsonb_build_object('role', p_next_role::text));
  RETURN true;
END;
$function$;
REVOKE ALL ON FUNCTION public.owner_replace_user_role(uuid,uuid,public.app_role,public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.owner_replace_user_role(uuid,uuid,public.app_role,public.app_role) TO service_role;

-- Profile updates and audit records must either both succeed or both roll back.
CREATE OR REPLACE FUNCTION public.admin_update_profile_audited(
  p_actor_user_id uuid, p_target_user_id uuid, p_changes jsonb
) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER
  SET search_path = ''
AS $function$
DECLARE
  changed_rows integer;
  field_name text;
  field_value jsonb;
BEGIN
  IF p_actor_user_id IS NULL OR p_target_user_id IS NULL
    OR p_changes IS NULL OR pg_catalog.jsonb_typeof(p_changes) <> 'object'
    OR p_changes = '{}'::jsonb THEN
    RAISE EXCEPTION 'Invalid profile update' USING ERRCODE = '22023';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = p_actor_user_id
      AND role IN ('admin'::public.app_role, 'owner'::public.app_role)
  ) THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;
  FOR field_name, field_value IN SELECT key, value FROM pg_catalog.jsonb_each(p_changes)
  LOOP
    IF field_name NOT IN ('display_name', 'phone_number', 'location', 'bio')
      OR (field_value <> 'null'::jsonb AND pg_catalog.jsonb_typeof(field_value) <> 'string')
      OR (field_name = 'bio' AND pg_catalog.length(p_changes ->> field_name) > 2000)
      OR (field_name <> 'bio' AND pg_catalog.length(p_changes ->> field_name) > 200) THEN
      RAISE EXCEPTION 'Invalid profile field' USING ERRCODE = '22023';
    END IF;
  END LOOP;
  UPDATE public.user_profiles
  SET display_name = CASE WHEN p_changes ? 'display_name' THEN p_changes ->> 'display_name' ELSE display_name END,
      phone_number = CASE WHEN p_changes ? 'phone_number' THEN p_changes ->> 'phone_number' ELSE phone_number END,
      location = CASE WHEN p_changes ? 'location' THEN p_changes ->> 'location' ELSE location END,
      bio = CASE WHEN p_changes ? 'bio' THEN p_changes ->> 'bio' ELSE bio END
  WHERE id = p_target_user_id;
  GET DIAGNOSTICS changed_rows = ROW_COUNT;
  IF changed_rows <> 1 THEN
    RAISE EXCEPTION 'Profile not found' USING ERRCODE = 'P0002';
  END IF;
  INSERT INTO public.audit_log (user_id, target_user_id, action, before_snapshot, after_snapshot)
  VALUES (p_actor_user_id, p_target_user_id, 'user_profile_updated', NULL,
    pg_catalog.jsonb_build_object('changed_fields',
      (SELECT pg_catalog.jsonb_agg(key) FROM pg_catalog.jsonb_object_keys(p_changes) AS key)));
  RETURN true;
END;
$function$;
REVOKE ALL ON FUNCTION public.admin_update_profile_audited(uuid,uuid,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_profile_audited(uuid,uuid,jsonb) TO service_role;
COMMIT;
