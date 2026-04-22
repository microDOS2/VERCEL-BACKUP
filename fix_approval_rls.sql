-- Fix: Allow admin to approve applications (bypasses RLS for insert + update)
-- Run this in your Supabase SQL Editor

-- 1. RPC to insert a user row (bypasses RLS)
CREATE OR REPLACE FUNCTION insert_user(
  p_id UUID,
  p_email TEXT,
  p_business_name TEXT,
  p_role TEXT,
  p_status TEXT DEFAULT 'approved',
  p_phone TEXT DEFAULT NULL,
  p_address TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_state TEXT DEFAULT NULL,
  p_zip TEXT DEFAULT NULL,
  p_license_number TEXT DEFAULT NULL,
  p_ein TEXT DEFAULT NULL,
  p_website TEXT DEFAULT NULL,
  p_business_type TEXT DEFAULT NULL,
  p_volume_estimate TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO users (
    id, email, business_name, role, status,
    phone, address, city, state, zip,
    license_number, ein, website, business_type, volume_estimate
  ) VALUES (
    p_id, p_email, p_business_name, p_role, p_status,
    p_phone, p_address, p_city, p_state, p_zip,
    p_license_number, p_ein, p_website, p_business_type, p_volume_estimate
  );
END;
$$;

GRANT EXECUTE ON FUNCTION insert_user(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION insert_user(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;

-- 2. RPC to update application status (bypasses RLS)
CREATE OR REPLACE FUNCTION update_application_status(
  p_id UUID,
  p_status TEXT,
  p_auth_user_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE applications
  SET
    status = p_status,
    auth_user_id = p_auth_user_id,
    reviewed_at = NOW()
  WHERE id = p_id;
END;
$$;

GRANT EXECUTE ON FUNCTION update_application_status(UUID, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_application_status(UUID, TEXT, UUID) TO anon;

-- Done!
