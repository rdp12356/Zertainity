-- 02_FUNCTIONS_AND_POLICIES.sql
-- Run this second to establish logic and security

-- 1. Utility Functions
CREATE OR REPLACE FUNCTION public.is_owner(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'owner'::app_role);
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission app_permission)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = _user_id AND rp.permission = _permission
  );
$$;

-- 2. Policies for user_roles
CREATE POLICY "Owners and admins can manage roles" ON public.user_roles
FOR ALL USING (public.is_owner(auth.uid()) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow first owner setup" ON public.user_roles
FOR INSERT WITH CHECK (NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role IN ('owner', 'admin')));

-- 3. Policies for user_profiles
CREATE POLICY "Users view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.user_profiles FOR SELECT 
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- 4. Policies for Logging
CREATE POLICY "System insert audit" ON public.audit_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view audit" ON public.audit_log FOR SELECT 
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System insert activity" ON public.user_activity_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own activity" ON public.user_activity_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins view all activity" ON public.user_activity_log FOR SELECT 
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

-- 5. Policies for colleges/schools
CREATE POLICY "Anyone view data" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Anyone view schools" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Admins manage data" ON public.colleges FOR ALL 
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Admins manage schools" ON public.schools FOR ALL 
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- 6. CMS for Careers, Pathways, and Quiz
CREATE POLICY "Anyone view careers" ON public.careers FOR SELECT USING (true);
CREATE POLICY "Anyone view pathways" ON public.pathways FOR SELECT USING (true);
CREATE POLICY "Anyone view quiz" ON public.quiz_questions FOR SELECT USING (true);

CREATE POLICY "Admins manage careers" ON public.careers FOR ALL 
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins manage pathways" ON public.pathways FOR ALL 
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins manage quiz" ON public.quiz_questions FOR ALL 
USING (is_owner(auth.uid()) OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

