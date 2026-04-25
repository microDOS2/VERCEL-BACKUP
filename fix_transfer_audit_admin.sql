-- ============================================================
-- Fix: Add audit logging to transfer workflow + Admin Transfer History RPCs
-- Run ALL of this in Supabase SQL Editor, then click Run
-- ============================================================

-- 1. Ensure audit_log RLS allows inserts from authenticated users
--    (This should already exist from previous phases, but safe to re-ensure)
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit_log_insert_auth" ON audit_log;
CREATE POLICY "audit_log_insert_auth"
  ON audit_log FOR INSERT
  WITH CHECK (true);

-- 2. Recreate trigger function with audit logging
--    This fires when a rep's manager_id changes (admin re-assignment)
CREATE OR REPLACE FUNCTION handle_rep_manager_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_assignment RECORD;
  v_old_manager_name TEXT;
  v_new_manager_name TEXT;
BEGIN
  -- Only act on sales_rep role changes
  IF NEW.role != 'sales_rep' THEN
    RETURN NEW;
  END IF;

  -- Fetch manager names for audit logging
  SELECT business_name INTO v_old_manager_name FROM users WHERE id = OLD.manager_id;
  SELECT business_name INTO v_new_manager_name FROM users WHERE id = NEW.manager_id;

  -- For each account this rep is assigned to, create a transfer request
  FOR v_assignment IN
    SELECT * FROM rep_account_assignments WHERE rep_id = NEW.id
  LOOP
    -- Create transfer record
    INSERT INTO assignment_transfers (
      rep_id,
      account_id,
      old_manager_id,
      new_manager_id,
      status,
      created_at
    ) VALUES (
      NEW.id,
      v_assignment.account_id,
      OLD.manager_id,
      NEW.manager_id,
      'pending',
      NOW()
    );

    -- Audit log: transfer created
    INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, user_id, created_at)
    VALUES (
      'transfer_created',
      'assignment_transfers',
      v_assignment.account_id::TEXT,
      jsonb_build_object(
        'rep_id', NEW.id,
        'rep_name', NEW.business_name,
        'old_manager_id', OLD.manager_id,
        'old_manager_name', v_old_manager_name,
        'account_id', v_assignment.account_id
      )::TEXT,
      jsonb_build_object(
        'new_manager_id', NEW.manager_id,
        'new_manager_name', v_new_manager_name
      )::TEXT,
      auth.uid(),
      NOW()
    );
  END LOOP;

  RETURN NEW;
END;
$$;

-- 3. Drop + recreate trigger
DROP TRIGGER IF EXISTS rep_manager_change_trigger ON users;
CREATE TRIGGER rep_manager_change_trigger
  AFTER UPDATE OF manager_id ON users
  FOR EACH ROW
  WHEN (OLD.manager_id IS DISTINCT FROM NEW.manager_id)
  EXECUTE FUNCTION handle_rep_manager_change();

-- 4. Update accept_transfer RPC to log audit
DROP FUNCTION IF EXISTS accept_transfer(UUID);
CREATE OR REPLACE FUNCTION accept_transfer(p_transfer_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transfer RECORD;
  v_rep_name TEXT;
  v_account_name TEXT;
BEGIN
  SELECT * INTO v_transfer
  FROM assignment_transfers
  WHERE id = p_transfer_id;

  SELECT business_name INTO v_rep_name FROM users WHERE id = v_transfer.rep_id;
  SELECT business_name INTO v_account_name FROM users WHERE id = v_transfer.account_id;

  -- Mark accepted
  UPDATE assignment_transfers
  SET status = 'accepted',
      resolved_at = NOW()
  WHERE id = p_transfer_id
    AND new_manager_id = auth.uid();

  -- Audit log
  INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, user_id, created_at)
  VALUES (
    'transfer_accepted',
    'assignment_transfers',
    p_transfer_id::TEXT,
    jsonb_build_object('status', 'pending', 'rep', v_rep_name, 'account', v_account_name)::TEXT,
    jsonb_build_object('status', 'accepted', 'resolved_by_manager_id', auth.uid())::TEXT,
    auth.uid(),
    NOW()
  );
END;
$$;

-- 5. Update reject_transfer RPC to log audit
DROP FUNCTION IF EXISTS reject_transfer(UUID);
CREATE OR REPLACE FUNCTION reject_transfer(p_transfer_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transfer RECORD;
  v_account_id UUID;
  v_rep_name TEXT;
  v_account_name TEXT;
BEGIN
  SELECT * INTO v_transfer
  FROM assignment_transfers
  WHERE id = p_transfer_id;

  v_account_id := v_transfer.account_id;
  SELECT business_name INTO v_rep_name FROM users WHERE id = v_transfer.rep_id;
  SELECT business_name INTO v_account_name FROM users WHERE id = v_transfer.account_id;

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

  -- Audit log
  INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, user_id, created_at)
  VALUES (
    'transfer_rejected',
    'assignment_transfers',
    p_transfer_id::TEXT,
    jsonb_build_object('status', 'pending', 'rep', v_rep_name, 'account', v_account_name)::TEXT,
    jsonb_build_object('status', 'rejected', 'resolved_by_manager_id', auth.uid())::TEXT,
    auth.uid(),
    NOW()
  );
END;
$$;

-- 6. Admin RPC: get_all_transfers — returns ALL transfers for admin history view
DROP FUNCTION IF EXISTS get_all_transfers();
CREATE OR REPLACE FUNCTION get_all_transfers()
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
        'account', jsonb_build_object('id', a.id, 'business_name', a.business_name, 'role', a.role),
        'old_manager', jsonb_build_object('id', om.id, 'business_name', om.business_name, 'email', om.email),
        'new_manager', jsonb_build_object('id', nm.id, 'business_name', nm.business_name, 'email', nm.email)
      ) ORDER BY t.created_at DESC
    ),
    '[]'::jsonb
  )
  FROM assignment_transfers t
  LEFT JOIN users r ON r.id = t.rep_id
  LEFT JOIN users a ON a.id = t.account_id
  LEFT JOIN users om ON om.id = t.old_manager_id
  LEFT JOIN users nm ON nm.id = t.new_manager_id;
$$;

-- 7. Admin RPC: admin_resolve_transfer — admin can accept/reject any pending transfer
DROP FUNCTION IF EXISTS admin_resolve_transfer(UUID, TEXT);
CREATE OR REPLACE FUNCTION admin_resolve_transfer(
  p_transfer_id UUID,
  p_status TEXT  -- 'accepted' or 'rejected'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transfer RECORD;
  v_account_id UUID;
  v_rep_name TEXT;
  v_account_name TEXT;
  v_is_admin BOOLEAN;
BEGIN
  -- Verify caller is admin
  SELECT role = 'admin' INTO v_is_admin FROM users WHERE id = auth.uid();
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Access denied: admin only';
  END IF;

  SELECT * INTO v_transfer FROM assignment_transfers WHERE id = p_transfer_id;
  v_account_id := v_transfer.account_id;
  SELECT business_name INTO v_rep_name FROM users WHERE id = v_transfer.rep_id;
  SELECT business_name INTO v_account_name FROM users WHERE id = v_transfer.account_id;

  -- If rejecting, remove rep assignment
  IF p_status = 'rejected' AND v_account_id IS NOT NULL THEN
    DELETE FROM rep_account_assignments WHERE account_id = v_account_id;
  END IF;

  -- Update transfer status
  UPDATE assignment_transfers
  SET status = p_status,
      resolved_at = NOW()
  WHERE id = p_transfer_id;

  -- Audit log
  INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, user_id, created_at)
  VALUES (
    'transfer_' || p_status,
    'assignment_transfers',
    p_transfer_id::TEXT,
    jsonb_build_object('status', 'pending', 'rep', v_rep_name, 'account', v_account_name)::TEXT,
    jsonb_build_object('status', p_status, 'resolved_by_admin_id', auth.uid())::TEXT,
    auth.uid(),
    NOW()
  );
END;
$$;

-- 8. Grant execute permissions
GRANT EXECUTE ON FUNCTION get_all_transfers() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_transfers() TO anon;
GRANT EXECUTE ON FUNCTION admin_resolve_transfer(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_resolve_transfer(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION accept_transfer(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION accept_transfer(UUID) TO anon;
GRANT EXECUTE ON FUNCTION reject_transfer(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_transfer(UUID) TO anon;
