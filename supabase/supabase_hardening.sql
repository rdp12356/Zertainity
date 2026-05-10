-- SECURITY HARDENING TEMPLATE FOR SUPABASE RLS
-- Run this directly inside the Supabase SQL Editor.

-- 1. Enable RLS on core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;

-- 2. Drop any excessively permissive public policies just in case
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;

-- 3. Strict Profile Isolation (Users can ONLY view/update their exact own UUID row)
CREATE POLICY "Strict Profile Isolation"
ON profiles FOR ALL 
USING (auth.uid() = id);

-- 4. Strict Marks Isolation (Users can ONLY access their own test records)
CREATE POLICY "Strict Marks Isolation"
ON marks FOR ALL 
USING (auth.uid() = user_id);

-- 5. Restrict anonymous insertions entirely throughout the DB
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon; -- ONLY if you have public static data like "available_careers". Otherwise REVOKE SELECT too.
