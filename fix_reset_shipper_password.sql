-- Reset shipper: Delete old, re-create with known password
-- Final password: ShipPass123!

DO $$
DECLARE
    new_id UUID;
BEGIN
    -- 1. Clean up old records
    DELETE FROM public.users WHERE email = 'shipper@microdos2.com';
    DELETE FROM auth.users WHERE email = 'shipper@microdos2.com';

    -- 2. Create auth.users record (confirmed_at is GENERATED, don't insert it)
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data
    ) VALUES (
        gen_random_uuid(),
        'shipper@microdos2.com',
        crypt('ShipPass123!', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"business_name":"Shipping Team","role":"shipping_fulfillment"}'
    )
    RETURNING id INTO new_id;

    -- 3. Create matching public.users record
    INSERT INTO public.users (id, email, business_name, role, status, plain_password)
    VALUES (new_id, 'shipper@microdos2.com', 'Shipping Team', 'shipping_fulfillment', 'approved', 'ShipPass123!');
END $$;

-- Verify
SELECT role, count(*) as count FROM public.users GROUP BY role;
