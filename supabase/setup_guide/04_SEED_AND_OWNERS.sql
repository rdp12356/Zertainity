-- 04_SEED_AND_OWNERS.sql
-- Run this last to set up permissions and primary owners

-- 1. Seed Permissions
INSERT INTO public.role_permissions (role, permission) VALUES
  ('owner', 'view_all'), ('owner', 'edit_careers'), ('owner', 'edit_colleges'), 
  ('owner', 'edit_schools'), ('owner', 'edit_pathways'), ('owner', 'edit_quiz'), 
  ('owner', 'view_users'), ('owner', 'manage_users'), ('owner', 'manage_roles'), 
  ('owner', 'manage_permissions'), ('owner', 'view_audit_logs'), ('owner', 'export_data'),
  ('admin', 'view_all'), ('admin', 'edit_careers'), ('admin', 'edit_colleges'), 
  ('admin', 'edit_schools'), ('admin', 'edit_pathways'), ('admin', 'edit_quiz'), 
  ('admin', 'view_users'), ('admin', 'manage_users'), ('admin', 'manage_roles'),
  ('editor', 'view_all'), ('editor', 'edit_careers'), ('editor', 'edit_colleges'), 
  ('editor', 'edit_schools'), ('editor', 'edit_pathways')
ON CONFLICT (role, permission) DO NOTHING;

-- 2. Seed Owners (Manually add roles for specific user emails)
DO $$
DECLARE
  v_email TEXT;
  v_user_id UUID;
  v_emails TEXT[] := ARRAY['johan.manoj@zertainity.in', 'johanmanoj2009@gmail.com', 'viney.ragesh@zertainity.in', 'vineyragesh333@gmail.com'];
BEGIN
  FOREACH v_email IN ARRAY v_emails LOOP
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
    IF v_user_id IS NOT NULL THEN
      -- Ensure Owner Role
      INSERT INTO public.user_roles (user_id, role)
      VALUES (v_user_id, 'owner'::app_role)
      ON CONFLICT (user_id, role) DO NOTHING;
      
      -- Ensure Profile exists
      INSERT INTO public.user_profiles (id, display_name)
      VALUES (v_user_id, 'Platform Owner')
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END LOOP;
END $$;

-- 3. Seed Quiz Questions
INSERT INTO public.quiz_questions (subject, question, options, order_index) VALUES
('Mathematics', 'How interested are you in solving complex mathematical problems?', ARRAY['Not interested', 'Slightly interested', 'Moderately interested', 'Very interested', 'Extremely interested'], 1),
('Science', 'How much do you enjoy conducting experiments and understanding scientific concepts?', ARRAY['Not interested', 'Slightly interested', 'Moderately interested', 'Very interested', 'Extremely interested'], 2),
('Literature', 'How passionate are you about reading, writing, and analyzing texts?', ARRAY['Not interested', 'Slightly interested', 'Moderately interested', 'Very interested', 'Extremely interested'], 3),
('History', 'How interested are you in learning about past events and their impact on society?', ARRAY['Not interested', 'Slightly interested', 'Moderately interested', 'Very interested', 'Extremely interested'], 4),
('Arts', 'How creative do you feel when expressing yourself through art, music, or design?', ARRAY['Not interested', 'Slightly interested', 'Moderately interested', 'Very interested', 'Extremely interested'], 5),
('Technology', 'How enthusiastic are you about working with computers and emerging technologies?', ARRAY['Not interested', 'Slightly interested', 'Moderately interested', 'Very interested', 'Extremely interested'], 6)
ON CONFLICT DO NOTHING;

