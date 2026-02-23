-- =========================================================================
-- ZERTAINITY - COMPLETE DATABASE MIGRATION
-- =========================================================================
-- This is a consolidated migration file for setting up the complete database
-- Run this in your new Lovable Cloud project
-- =========================================================================

-- =========================================================================
-- PART 1: ENUMS
-- =========================================================================

-- App role enum with all role types
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'editor', 'manager', 'owner');

-- App permission enum for granular access control
CREATE TYPE public.app_permission AS ENUM (
  'view_all',
  'edit_careers',
  'edit_colleges',
  'edit_schools',
  'edit_pathways',
  'edit_quiz',
  'view_users',
  'manage_users',
  'manage_roles',
  'manage_permissions',
  'view_audit_logs',
  'export_data'
);

-- =========================================================================
-- PART 2: CORE TABLES
-- =========================================================================

-- Colleges table
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  courses TEXT[],
  cutoffs TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Schools table
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  board TEXT,
  grade_11_cutoff DOUBLE PRECISION,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Role permissions table
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission app_permission NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, permission)
);

-- User profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  date_of_birth DATE,
  phone_number TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Suspended users table
CREATE TABLE public.suspended_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  suspended_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  suspended_by UUID REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User activity log table
CREATE TABLE public.user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit log table
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  before_snapshot JSONB,
  after_snapshot JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- =========================================================================
-- PART 3: ENABLE ROW LEVEL SECURITY
-- =========================================================================

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspended_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- PART 4: SECURITY FUNCTIONS
-- =========================================================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is owner
CREATE OR REPLACE FUNCTION public.is_owner(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'owner'::app_role
  )
$$;

-- Function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission app_permission)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = _user_id
      AND rp.permission = _permission
  )
$$;

-- Function to get all users with their roles (admin only)
CREATE OR REPLACE FUNCTION public.get_all_users_with_roles()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  roles app_role[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id,
    au.email,
    au.created_at,
    au.last_sign_in_at,
    COALESCE(
      array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL),
      ARRAY[]::app_role[]
    ) as roles
  FROM auth.users au
  LEFT JOIN public.user_roles ur ON au.id = ur.user_id
  WHERE public.has_role(auth.uid(), 'admin'::app_role) OR public.is_owner(auth.uid())
  GROUP BY au.id, au.email, au.created_at, au.last_sign_in_at
  ORDER BY au.created_at DESC;
$$;

-- Function to get users with roles (simplified)
CREATE OR REPLACE FUNCTION public.get_users_with_roles()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  roles TEXT[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id as user_id,
    au.email,
    COALESCE(array_agg(ur.role::text) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::text[]) as roles
  FROM auth.users au
  LEFT JOIN public.user_roles ur ON au.id = ur.user_id
  GROUP BY au.id, au.email
  ORDER BY au.email;
$$;

-- Function to log user activities
CREATE OR REPLACE FUNCTION public.log_user_activity(
  p_user_id UUID,
  p_action TEXT,
  p_details JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_activity_log (user_id, action, details)
  VALUES (p_user_id, p_action, p_details);
END;
$$;

-- Function to update user profile updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =========================================================================
-- PART 5: TRIGGERS
-- =========================================================================

-- Trigger to update user profile timestamp
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_user_profile_updated_at();

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- =========================================================================
-- PART 6: INDEXES
-- =========================================================================

CREATE INDEX idx_user_activity_log_user_id ON public.user_activity_log(user_id);
CREATE INDEX idx_user_activity_log_created_at ON public.user_activity_log(created_at DESC);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_target_user_id ON public.audit_log(target_user_id);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- =========================================================================
-- PART 7: RLS POLICIES - COLLEGES
-- =========================================================================

-- Anyone can view colleges
CREATE POLICY "Anyone can view colleges"
ON public.colleges
FOR SELECT
USING (true);

-- Owners and admins can insert colleges
CREATE POLICY "Owners and admins can insert colleges"
ON public.colleges
FOR INSERT
TO authenticated
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Owners and admins can update colleges
CREATE POLICY "Owners and admins can update colleges"
ON public.colleges
FOR UPDATE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Owners and admins can delete colleges
CREATE POLICY "Owners and admins can delete colleges"
ON public.colleges
FOR DELETE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 8: RLS POLICIES - SCHOOLS
-- =========================================================================

-- Anyone can view schools
CREATE POLICY "Anyone can view schools"
ON public.schools
FOR SELECT
USING (true);

-- Owners and admins can insert schools
CREATE POLICY "Owners and admins can insert schools"
ON public.schools
FOR INSERT
TO authenticated
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Owners and admins can update schools
CREATE POLICY "Owners and admins can update schools"
ON public.schools
FOR UPDATE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Owners and admins can delete schools
CREATE POLICY "Owners and admins can delete schools"
ON public.schools
FOR DELETE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 9: RLS POLICIES - USER ROLES
-- =========================================================================

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Owners and admins can manage all roles
CREATE POLICY "Owners and admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Allow first owner or admin setup (when no admin/owner exists)
CREATE POLICY "Allow first owner or admin setup"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  (NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role) 
   AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'owner'::app_role))
  OR public.is_owner(auth.uid()) 
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins/owners can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 10: RLS POLICIES - ROLE PERMISSIONS
-- =========================================================================

-- Anyone can view role permissions
CREATE POLICY "Anyone can view role permissions"
ON public.role_permissions
FOR SELECT
USING (true);

-- Owners and admins can manage permissions
CREATE POLICY "Owners and admins can manage permissions"
ON public.role_permissions
FOR ALL
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 11: RLS POLICIES - USER PROFILES
-- =========================================================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Admins and owners can view all profiles
CREATE POLICY "Admins and owners can view all profiles"
ON public.user_profiles
FOR SELECT
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 12: RLS POLICIES - SUSPENDED USERS
-- =========================================================================

-- Admins and owners can view suspended users
CREATE POLICY "Admins and owners can view suspended users"
ON public.suspended_users
FOR SELECT
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Admins and owners can manage suspended users
CREATE POLICY "Admins and owners can manage suspended users"
ON public.suspended_users
FOR ALL
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================================
-- PART 13: RLS POLICIES - ACTIVITY LOGS
-- =========================================================================

-- Owners and admins can view all activity logs
CREATE POLICY "Owners and admins can view all activity logs"
ON public.user_activity_log
FOR SELECT
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own activity logs
CREATE POLICY "Users can view their own activity logs"
ON public.user_activity_log
FOR SELECT
USING (user_id = auth.uid());

-- System can insert activity logs
CREATE POLICY "System can insert activity logs"
ON public.user_activity_log
FOR INSERT
WITH CHECK (true);

-- =========================================================================
-- PART 14: RLS POLICIES - AUDIT LOGS
-- =========================================================================

-- Owners and admins can view audit logs
CREATE POLICY "Owners and admins can view audit logs"
ON public.audit_log
FOR SELECT
USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.audit_log
FOR INSERT
WITH CHECK (true);

-- =========================================================================
-- PART 15: DEFAULT PERMISSIONS DATA
-- =========================================================================

-- Insert default permissions for each role
INSERT INTO public.role_permissions (role, permission) VALUES
  -- Owner permissions (all)
  ('owner', 'view_all'),
  ('owner', 'edit_careers'),
  ('owner', 'edit_colleges'),
  ('owner', 'edit_schools'),
  ('owner', 'edit_pathways'),
  ('owner', 'edit_quiz'),
  ('owner', 'view_users'),
  ('owner', 'manage_users'),
  ('owner', 'manage_roles'),
  ('owner', 'manage_permissions'),
  ('owner', 'view_audit_logs'),
  ('owner', 'export_data'),
  -- Admin permissions (all except manage_permissions)
  ('admin', 'view_all'),
  ('admin', 'edit_careers'),
  ('admin', 'edit_colleges'),
  ('admin', 'edit_schools'),
  ('admin', 'edit_pathways'),
  ('admin', 'edit_quiz'),
  ('admin', 'view_users'),
  ('admin', 'manage_users'),
  ('admin', 'manage_roles'),
  ('admin', 'view_audit_logs'),
  ('admin', 'export_data')
ON CONFLICT (role, permission) DO NOTHING;

-- =========================================================================
-- PART 16: SET OWNER (Update email as needed)
-- =========================================================================

-- After a user signs up with the owner email, run this to set them as owner:
-- Replace 'your-owner-email@example.com' with the actual owner email

-- DO $$
-- DECLARE
--   user_uuid UUID;
-- BEGIN
--   SELECT id INTO user_uuid
--   FROM auth.users
--   WHERE email = 'your-owner-email@example.com';
--   
--   IF user_uuid IS NOT NULL THEN
--     INSERT INTO public.user_roles (user_id, role)
--     VALUES (user_uuid, 'owner'::app_role)
--     ON CONFLICT (user_id, role) DO NOTHING;
--   END IF;
-- END $$;
