-- Get the auth user ID for shipper@microdos2.com
SELECT id as auth_id, email
FROM auth.users
WHERE email = 'shipper@microdos2.com';

-- Run this AFTER getting the auth_id above:
-- INSERT INTO public.users (id, email, business_name, role, status, plain_password)
-- VALUES ('<AUTH_ID_FROM_ABOVE>', 'shipper@microdos2.com', 'Shipping Team', 'shipping_fulfillment', 'approved', 'GENERATE_NEW_PASSWORD');
