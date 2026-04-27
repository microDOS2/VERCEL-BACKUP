-- 1. Drop the old role check constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- 2. Add updated constraint with shipping_fulfillment
ALTER TABLE public.users ADD CONSTRAINT users_role_check
    CHECK (role IN ('admin', 'sales_manager', 'sales_rep', 'wholesaler', 'distributor', 'influencer', 'shipping_fulfillment'));

-- 3. Now insert the shipper user
INSERT INTO public.users (id, email, business_name, role, status, plain_password)
VALUES ('6ae6c7a3-7749-4a5c-a90b-362f6bbceb33', 'shipper@microdos2.com', 'Shipping Team', 'shipping_fulfillment', 'approved', 'ShipPass123!');

-- 4. Verify
SELECT role, count(*) as count FROM public.users GROUP BY role;
