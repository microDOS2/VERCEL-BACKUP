-- Diagnostic: Check shipper account state
-- 1. Check auth.users
SELECT email, email_confirmed_at, confirmed_at, id as auth_id
FROM auth.users 
WHERE email = 'shipper@microdos2.com';

-- 2. Check public.users table (this is what the admin reads)
SELECT id, email, business_name, role, status, plain_password, created_at
FROM public.users
WHERE email = 'shipper@microdos2.com';

-- 3. If plain_password is missing, show what columns exist
-- Also count total users by role to see if RLS is filtering
SELECT role, count(*) as count 
FROM public.users 
GROUP BY role;
