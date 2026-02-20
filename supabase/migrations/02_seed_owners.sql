-- 02_seed_owners.sql
-- Description: Assigns Owner role to the primary management accounts

DO $$
DECLARE
    v_user_id UUID;
    v_emails TEXT[] := ARRAY[
        'johan.manoj@zertainity.in',
        'viney.ragesh@zertainity.in',
        'admin@zertainity.in',
        'vineyragesh333@gmail.com',
        'johanmanoj2009@gmail.com'
    ];
    v_email TEXT;
BEGIN
    FOREACH v_email IN ARRAY v_emails
    LOOP
        -- Find the user ID in auth.users
        SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
        
        -- If user exists, grant owner role
        IF v_user_id IS NOT NULL THEN
            INSERT INTO public.user_roles (user_id, role)
            VALUES (v_user_id, 'owner')
            ON CONFLICT (user_id, role) DO NOTHING;
            
            -- Ensure they also have entry in user_profiles
            INSERT INTO public.user_profiles (id, identity_key)
            VALUES (v_user_id, v_email)
            ON CONFLICT (id) DO UPDATE SET identity_key = v_email;
        END IF;
    END LOOP;
END $$;
