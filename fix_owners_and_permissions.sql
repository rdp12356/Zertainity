-- =========================================================================
-- ZERTAINITY - FIX OWNERS AND PERMISSIONS
-- Run this in Supabase SQL Editor to set up owner roles for both administrators
-- =========================================================================

-- Step 1: Set owner role for johanmanoj2009@gmail.com and vineyragesh333@gmail.com
DO $$
DECLARE
  johan_uuid UUID;
  viney_uuid UUID;
BEGIN
  SELECT id INTO johan_uuid FROM auth.users WHERE email = 'johanmanoj2009@gmail.com';
  SELECT id INTO viney_uuid FROM auth.users WHERE email = 'vineyragesh333@gmail.com';
  
  -- Remove any existing 'admin' role from these users
  DELETE FROM public.user_roles 
  WHERE (user_id = johan_uuid OR user_id = viney_uuid) 
  AND role = 'admin';
  
  -- Add 'owner' role to both users
  IF johan_uuid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (johan_uuid, 'owner') 
    ON CONFLICT (user_id, role) DO NOTHING;
    RAISE NOTICE 'Owner role assigned to johanmanoj2009@gmail.com';
  ELSE
    RAISE NOTICE 'User johanmanoj2009@gmail.com not found';
  END IF;
  
  IF viney_uuid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (viney_uuid, 'owner') 
    ON CONFLICT (user_id, role) DO NOTHING;
    RAISE NOTICE 'Owner role assigned to vineyragesh333@gmail.com';
  ELSE
    RAISE NOTICE 'User vineyragesh333@gmail.com not found';
  END IF;
END $$;

-- Step 2: Verify the roles
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  r.role
FROM auth.users u
LEFT JOIN public.user_roles r ON u.id = r.user_id
WHERE u.email IN ('johanmanoj2009@gmail.com', 'vineyragesh333@gmail.com')
ORDER BY u.email;