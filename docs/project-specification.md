# Zertainity - Career Guidance Platform

## Project Overview

Zertainity is an AI-powered career guidance platform that helps students discover their ideal career paths through comprehensive assessments, personalized recommendations, and detailed roadmaps from school to their dream careers.

---

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack React Query
- **Routing**: React Router DOM v6
- **Backend**: Supabase (PostgreSQL database, Edge Functions, Authentication)
- **Icons**: Lucide React

---

## Design System

### Philosophy
Apple-inspired premium aesthetic with:
- Minimalist, clean interfaces
- Neutral color palette (no colorful gradients)
- Generous white space
- Clean typography with SF-style fonts
- Subtle shadows and borders
- No decorative images

### Color Tokens (HSL)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --border: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
}
```

### Typography
- Clean, system fonts (SF Pro style)
- Font weights: light (300), regular (400), medium (500), semibold (600)
- Generous line-height and letter-spacing

---

## Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Index | Landing page with hero, features, CTA |
| `/auth` | Auth | Login/signup with email, Google OAuth |
| `/education-level` | EducationLevel | Select current education level |
| `/marks-entry` | MarksEntry | Enter academic performance |
| `/quiz` | Quiz | Interest assessment questionnaire |
| `/results` | Results | AI-generated career recommendations |
| `/pathways` | Pathways | Detailed career roadmaps |
| `/careers` | Careers | Browse all career options |
| `/admin` | Admin | Admin dashboard (role-protected) |
| `/setup` | Setup | First-time admin initialization |

---

## Features

### 1. User Authentication
- Email/password signup and login
- Google OAuth integration
- Session management with automatic redirects
- Protected routes for authenticated users

### 2. Career Assessment Flow
1. Select education level (10th, 12th, Graduate)
2. Enter academic marks/performance
3. Complete interest assessment quiz
4. Receive AI-powered career recommendations
5. Explore detailed career pathways

### 3. Admin Panel
- User management (view, invite, suspend, delete users)
- Role assignment (owner, admin, manager, editor, user)
- Granular permission management
- CSV import for bulk operations
- Audit logging
- Data export functionality

### 4. Role-Based Access Control (RBAC)
Roles hierarchy:
- **Owner**: Full system control, can manage all roles
- **Admin**: User management, all editing permissions
- **Manager**: Can manage users and view audit logs
- **Editor**: Can edit content (careers, colleges, schools, pathways, quiz)
- **User**: Basic access

Permissions:
- `view_all`, `edit_careers`, `edit_colleges`, `edit_schools`
- `edit_pathways`, `edit_quiz`, `view_users`, `manage_users`
- `manage_roles`, `manage_permissions`, `view_audit_logs`, `export_data`

---

## Database Schema

### Enums
```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'editor', 'manager', 'owner');

CREATE TYPE public.app_permission AS ENUM (
  'view_all', 'edit_careers', 'edit_colleges', 'edit_schools',
  'edit_pathways', 'edit_quiz', 'view_users', 'manage_users',
  'manage_roles', 'manage_permissions', 'view_audit_logs', 'export_data'
);
```

### Tables

#### user_roles
```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
```

#### role_permissions
```sql
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission app_permission NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (role, permission)
);
```

#### user_profiles
```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  bio TEXT,
  phone_number TEXT,
  date_of_birth DATE,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### suspended_users
```sql
CREATE TABLE public.suspended_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT,
  suspended_at TIMESTAMPTZ DEFAULT now(),
  suspended_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### audit_log
```sql
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  target_user_id UUID,
  before_snapshot JSONB,
  after_snapshot JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### user_activity_log
```sql
CREATE TABLE public.user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### colleges
```sql
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  courses TEXT[],
  cutoffs TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### schools
```sql
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  board TEXT,
  grade_11_cutoff NUMERIC,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Database Functions

```sql
-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission app_permission)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = _user_id AND rp.permission = _permission
  )
$$;

-- Check if user is owner
CREATE OR REPLACE FUNCTION public.is_owner(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'owner'::app_role
  )
$$;

-- Get all users with their roles (admin only)
CREATE OR REPLACE FUNCTION public.get_all_users_with_roles()
RETURNS TABLE(
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  roles app_role[]
)
LANGUAGE sql SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id, au.email, au.created_at, au.last_sign_in_at,
    COALESCE(array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::app_role[]) as roles
  FROM auth.users au
  LEFT JOIN public.user_roles ur ON au.id = ur.user_id
  WHERE public.has_role(auth.uid(), 'admin'::app_role)
  GROUP BY au.id, au.email, au.created_at, au.last_sign_in_at
  ORDER BY au.created_at DESC
$$;
```

---

## Edge Functions

### 1. setup-admin
First-time admin setup - grants owner role to the first user who accesses it.

### 2. invite-user
Send email invitations to new users.

### 3. update-user-role
Add or remove roles from users (owner/admin only).

### 4. suspend-user
Suspend a user account with reason.

### 5. unsuspend-user
Restore a suspended user account.

### 6. delete-user
Permanently delete a user account.

### 7. export-users
Export user data as CSV.

### 8. send-notification
Send notifications to users.

---

## Row-Level Security (RLS) Policies

All tables have RLS enabled. Key policies:

```sql
-- user_roles: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- user_roles: Owners can manage all roles
CREATE POLICY "Owners can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.is_owner(auth.uid()));

-- user_profiles: Users can view and edit their own profile
CREATE POLICY "Users can manage own profile"
ON public.user_profiles FOR ALL
TO authenticated
USING (id = auth.uid());

-- role_permissions: Anyone can view permissions
CREATE POLICY "Anyone can view role permissions"
ON public.role_permissions FOR SELECT
TO authenticated
USING (true);
```

---

## Component Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── CSVImport.tsx
│   │   ├── EmailConfigToggle.tsx
│   │   ├── PermissionsManager.tsx
│   │   └── UserProfileCard.tsx
│   └── ui/
│       └── [shadcn components]
├── hooks/
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── usePermission.tsx
├── integrations/
│   ├── lovable/
│   │   └── index.ts (OAuth helper)
│   └── supabase/
│       ├── client.ts
│       └── types.ts
├── pages/
│   ├── Admin.tsx
│   ├── Auth.tsx
│   ├── Careers.tsx
│   ├── EducationLevel.tsx
│   ├── Index.tsx
│   ├── MarksEntry.tsx
│   ├── NotFound.tsx
│   ├── Pathways.tsx
│   ├── Quiz.tsx
│   ├── Results.tsx
│   └── Setup.tsx
└── lib/
    └── utils.ts
```

---

## Key Implementation Notes

1. **Authentication Flow**:
   - Users can sign up/in with email+password or Google OAuth
   - Email confirmation is required (not auto-confirmed)
   - Authenticated users are redirected from /auth to home

2. **Admin Setup**:
   - First user to access /setup becomes the owner
   - Subsequent admins must be promoted via Admin panel
   - johanmanoj2009@gmail.com is hardcoded as owner during initialization

3. **Security**:
   - All sensitive operations go through Edge Functions
   - RLS policies protect all database tables
   - Role checks use security definer functions to prevent recursion

4. **Responsive Design**:
   - Mobile-first approach
   - Hamburger menu on mobile
   - Cards and grids adapt to screen size

---

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

---

## Getting Started

1. Set up a Supabase project
2. Run the database migration from `docs/complete-database-migration.sql`
3. Configure authentication providers (Email, Google OAuth)
4. Deploy edge functions
5. Set environment variables
6. Build and deploy the frontend

---

## Default Role Permissions

| Role | Permissions |
|------|-------------|
| Owner | All permissions |
| Admin | view_all, view_users, manage_users, manage_roles, view_audit_logs, export_data, all edit_* |
| Manager | view_all, view_users, manage_users, view_audit_logs |
| Editor | view_all, edit_careers, edit_colleges, edit_schools, edit_pathways, edit_quiz |
| User | view_all |
