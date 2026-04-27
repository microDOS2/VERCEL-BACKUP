-- Fix: confirmed_at is a generated column, can't be updated directly
-- Only update email_confirmed_at which triggers confirmed_at automatically

CREATE OR REPLACE FUNCTION public.confirm_user_email(p_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE auth.users 
    SET email_confirmed_at = NOW(),
        updated_at = NOW()
    WHERE email = p_email 
      AND email_confirmed_at IS NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.confirm_user_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_user_email(TEXT) TO anon;

-- Fix existing shipper@microdos2.com
SELECT confirm_user_email('shipper@microdos2.com');

-- Verify
SELECT email, email_confirmed_at, confirmed_at 
FROM auth.users 
WHERE email = 'shipper@microdos2.com';
