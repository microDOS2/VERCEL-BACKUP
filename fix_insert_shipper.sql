-- Insert the shipper user into public.users with the auth_id from the query
INSERT INTO public.users (id, email, business_name, role, status, plain_password)
VALUES ('6ae6c7a3-7749-4a5c-a90b-362f6bbceb33', 'shipper@microdos2.com', 'Shipping Team', 'shipping_fulfillment', 'approved', 'ShipPass123!');

-- Verify
SELECT role, count(*) as count 
FROM public.users 
GROUP BY role;
