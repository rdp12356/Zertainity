-- Phase 2: Track suspended users in a separate table
CREATE TABLE IF NOT EXISTS public.suspended_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  suspended_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  suspended_by UUID REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.suspended_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and owners can view suspended users"
ON public.suspended_users
FOR SELECT
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins and owners can manage suspended users"
ON public.suspended_users
FOR ALL
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Phase 3: Create permissions system
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

CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission app_permission NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, permission)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view role permissions"
ON public.role_permissions
FOR SELECT
USING (true);

CREATE POLICY "Owners and admins can manage permissions"
ON public.role_permissions
FOR ALL
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Phase 4: Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  date_of_birth DATE,
  phone_number TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins and owners can view all profiles"
ON public.user_profiles
FOR SELECT
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_user_profile_updated_at();

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

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- Insert default permissions for each role
INSERT INTO public.role_permissions (role, permission) VALUES
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