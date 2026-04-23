-- Insert default permissions for all roles
DO $$
DECLARE
  -- Owner gets all permissions
  owner_perms TEXT[] := ARRAY[
    'view_all', 'edit_careers', 'edit_colleges', 'edit_schools',
    'edit_pathways', 'edit_quiz', 'view_users', 'manage_users',
    'manage_roles', 'manage_permissions', 'view_audit_logs', 'export_data'
  ];
  
  -- Admin gets most permissions (except manage_permissions)
  admin_perms TEXT[] := ARRAY[
    'view_all', 'edit_careers', 'edit_colleges', 'edit_schools',
    'edit_pathways', 'edit_quiz', 'view_users', 'manage_users',
    'manage_roles', 'view_audit_logs', 'export_data'
  ];
  
  -- Manager gets view and manage_users
  manager_perms TEXT[] := ARRAY[
    'view_all', 'view_users', 'manage_users', 'view_audit_logs'
  ];
  
  -- Editor can edit content
  editor_perms TEXT[] := ARRAY[
    'view_all', 'edit_careers', 'edit_colleges', 'edit_schools',
    'edit_pathways', 'edit_quiz'
  ];
  
  -- User gets basic view
  user_perms TEXT[] := ARRAY['view_all'];
  
  r TEXT;
  p TEXT;
BEGIN
  -- Clear existing permissions (optional - remove if you want to preserve custom changes)
  -- DELETE FROM public.role_permissions;
  
  -- Insert owner permissions
  FOREACH p IN ARRAY owner_perms LOOP
    INSERT INTO public.role_permissions (role, permission) 
    VALUES ('owner', p::app_permission) 
    ON CONFLICT (role, permission) DO NOTHING;
  END LOOP;
  
  -- Insert admin permissions
  FOREACH p IN ARRAY admin_perms LOOP
    INSERT INTO public.role_permissions (role, permission) 
    VALUES ('admin', p::app_permission) 
    ON CONFLICT (role, permission) DO NOTHING;
  END LOOP;
  
  -- Insert manager permissions
  FOREACH p IN ARRAY manager_perms LOOP
    INSERT INTO public.role_permissions (role, permission) 
    VALUES ('manager', p::app_permission) 
    ON CONFLICT (role, permission) DO NOTHING;
  END LOOP;
  
  -- Insert editor permissions
  FOREACH p IN ARRAY editor_perms LOOP
    INSERT INTO public.role_permissions (role, permission) 
    VALUES ('editor', p::app_permission) 
    ON CONFLICT (role, permission) DO NOTHING;
  END LOOP;
  
  -- Insert user permissions
  FOREACH p IN ARRAY user_perms LOOP
    INSERT INTO public.role_permissions (role, permission) 
    VALUES ('user', p::app_permission) 
    ON CONFLICT (role, permission) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Default permissions inserted successfully';
END $$;