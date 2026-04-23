-- Fix roles for both owners
-- This script updates the roles for johanmanoj2009@gmail.com and vineyragesh333@gmail.com

-- First, ensure both users have 'owner' role
-- The actual user IDs will need to be retrieved from auth.users

DO $$
DECLARE
  johan_uuid UUID;
  viney_uuid UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO johan_uuid FROM auth.users WHERE email = 'johanmanoj2009@gmail.com';
  SELECT id INTO viney_uuid FROM auth.users WHERE email = 'vineyragesh333@gmail.com';
  
  -- Print for debugging
  RAISE NOTICE 'Johan UUID: %', johan_uuid;
  RAISE NOTICE 'Viney UUID: %', viney_uuid;
  
  -- Remove any existing 'admin' role from these users
  DELETE FROM public.user_roles 
  WHERE (user_id = johan_uuid OR user_id = viney_uuid) 
  AND role = 'admin';
  
  -- Add 'owner' role to both users (if not already present)
  IF johan_uuid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (johan_uuid, 'owner') 
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  IF viney_uuid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) 
    VALUES (viney_uuid, 'owner') 
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RAISE NOTICE 'Roles updated successfully';
END $$;