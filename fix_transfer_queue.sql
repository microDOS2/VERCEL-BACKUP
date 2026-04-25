-- ============================================================
-- Fix: Transfer Queue RLS Bypass + Safe Accept/Reject RPCs
-- Run ALL of this in Supabase SQL Editor, then click Run
-- Then refresh /sales-manager-dashboard
-- ============================================================

-- 1. Ensure resolved_at column exists on assignment_transfers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'assignment_transfers' AND column_name = 'resolved_at'
  ) THEN
    ALTER TABLE assignment_transfers ADD COLUMN resolved_at TIMESTAMPTZ;
  END IF;
END $$;

-- 2. Drop existing functions to avoid signature conflicts
DROP FUNCTION IF EXISTS get_pending_transfers(UUID);
DROP FUNCTION IF EXISTS accept_transfer(UUID);
DROP FUNCTION IF EXISTS reject_transfer(UUID);

-- 3. get_pending_transfers: returns all pending transfers for a manager as JSONB
--    Includes nested rep + account objects so the frontend can use the same shape
CREATE OR REPLACE FUNCTION get_pending_transfers(p_manager_id UUID)
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', t.id,
        'rep_id', t.rep_id,
        'account_id', t.account_id,
        'old_manager_id', t.old_manager_id,
        'new_manager_id', t.new_manager_id,
        'status', t.status,
        'created_at', t.created_at,
        'resolved_at', t.resolved_at,
        'rep', jsonb_build_object('id', r.id, 'business_name', r.business_name, 'email', r.email),
        'account', jsonb_build_object('id', a.id, 'business_name', a.business_name, 'role', a.role)
      ) ORDER BY t.created_at DESC
    ),
    '[]'::jsonb
  )
  FROM assignment_transfers t
  LEFT JOIN users r ON r.id = t.rep_id
  LEFT JOIN users a ON a.id = t.account_id
  WHERE t.new_manager_id = p_manager_id
    AND t.status = 'pending';
$$;

-- 4. accept_transfer: mark a transfer accepted (only by the new manager)
CREATE OR REPLACE FUNCTION accept_transfer(p_transfer_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE assignment_transfers
  SET status = 'accepted',
      resolved_at = NOW()
  WHERE id = p_transfer_id
    AND new_manager_id = auth.uid();
END;
$$;

-- 5. reject_transfer: mark a transfer rejected + remove rep assignment
CREATE OR REPLACE FUNCTION reject_transfer(p_transfer_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_account_id UUID;
BEGIN
  -- Look up the account id for this transfer (verifying caller is new manager)
  SELECT account_id INTO v_account_id
  FROM assignment_transfers
  WHERE id = p_transfer_id
    AND new_manager_id = auth.uid();

  -- Remove the rep assignment from the account
  IF v_account_id IS NOT NULL THEN
    DELETE FROM rep_account_assignments WHERE account_id = v_account_id;
  END IF;

  -- Mark transfer rejected
  UPDATE assignment_transfers
  SET status = 'rejected',
      resolved_at = NOW()
  WHERE id = p_transfer_id
    AND new_manager_id = auth.uid();
END;
$$;

-- 6. Grant execute permissions
GRANT EXECUTE ON FUNCTION get_pending_transfers(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_transfers(UUID) TO anon;
GRANT EXECUTE ON FUNCTION accept_transfer(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION accept_transfer(UUID) TO anon;
GRANT EXECUTE ON FUNCTION reject_transfer(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_transfer(UUID) TO anon;

-- 7. (Optional) Add direct RLS policies so the dashboard can also query without RPC if needed
--    These are permissive for authenticated users who are the new manager
ALTER TABLE assignment_transfers ENABLE ROW LEVEL SECURITY;

-- Drop any old conflicting policies first (ignore errors)
DROP POLICY IF EXISTS "assignment_transfers_select_new_mgr" ON assignment_transfers;
DROP POLICY IF EXISTS "assignment_transfers_update_new_mgr" ON assignment_transfers;
DROP POLICY IF EXISTS "assignment_transfers_insert_auth"    ON assignment_transfers;

CREATE POLICY "assignment_transfers_select_new_mgr"
  ON assignment_transfers FOR SELECT
  USING (new_manager_id = auth.uid());

CREATE POLICY "assignment_transfers_update_new_mgr"
  ON assignment_transfers FOR UPDATE
  USING (new_manager_id = auth.uid());

CREATE POLICY "assignment_transfers_insert_auth"
  ON assignment_transfers FOR INSERT
  WITH CHECK (true);
