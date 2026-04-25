-- ============================================================
-- Fix: Remove ::TEXT casts from jsonb_build_object in audit_log inserts
-- All RPCs that log to audit_log had jsonb::TEXT which causes 42804 type error
-- Run ALL of this in Supabase SQL Editor
-- ============================================================

-- 1. Fix accept_transfer (manager self-service)
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
  SELECT * INTO v_transfer FROM assignment_transfers WHERE id = p_transfer_id;
  SELECT business_name INTO v_rep_name FROM users WHERE id = v_transfer.rep_id;
  SELECT business_name INTO v_account_name FROM users WHERE id = v_transfer.account_id;

  UPDATE assignment_transfers
  SET status = 'accepted', resolved_at = NOW()
  WHERE id = p_transfer_id AND new_manager_id = auth.uid();

  INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, user_id, created_at)
  VALUES (
    'transfer_accepted', 'assignment_transfers', p_transfer_id::TEXT,
    jsonb_build_object('status', 'pending', 'rep', v_rep_name, 'account', v_account_name),
    jsonb_build_object('status', 'accepted', 'resolved_by_manager_id', auth.uid()),
    auth.uid(), NOW()
  );
END;
$$;

-- 2. Fix reject_transfer (manager self-service)
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
  SELECT * INTO v_transfer FROM assignment_transfers WHERE id = p_transfer_id;
  v_account_id := v_transfer.account_id;
  SELECT business_name INTO v_rep_name FROM users WHERE id = v_transfer.rep_id;
  SELECT business_name INTO v_account_name FROM users WHERE id = v_transfer.account_id;

  IF v_account_id IS NOT NULL THEN
    DELETE FROM rep_account_assignments WHERE account_id = v_account_id;
  END IF;

  UPDATE assignment_transfers
  SET status = 'rejected', resolved_at = NOW()
  WHERE id = p_transfer_id AND new_manager_id = auth.uid();

  INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, user_id, created_at)
  VALUES (
    'transfer_rejected', 'assignment_transfers', p_transfer_id::TEXT,
    jsonb_build_object('status', 'pending', 'rep', v_rep_name, 'account', v_account_name),
    jsonb_build_object('status', 'rejected', 'resolved_by_manager_id', auth.uid()),
    auth.uid(), NOW()
  );
END;
$$;

-- 3. Fix admin_resolve_transfer (admin override)
DROP FUNCTION IF EXISTS admin_resolve_transfer(UUID, TEXT);
CREATE OR REPLACE FUNCTION admin_resolve_transfer(p_transfer_id UUID, p_status TEXT)
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
  SELECT role = 'admin' INTO v_is_admin FROM users WHERE id = auth.uid();
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Access denied: admin only';
  END IF;

  SELECT * INTO v_transfer FROM assignment_transfers WHERE id = p_transfer_id;
  v_account_id := v_transfer.account_id;
  SELECT business_name INTO v_rep_name FROM users WHERE id = v_transfer.rep_id;
  SELECT business_name INTO v_account_name FROM users WHERE id = v_transfer.account_id;

  IF p_status = 'rejected' AND v_account_id IS NOT NULL THEN
    DELETE FROM rep_account_assignments WHERE account_id = v_account_id;
  END IF;

  UPDATE assignment_transfers
  SET status = p_status, resolved_at = NOW()
  WHERE id = p_transfer_id;

  INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, user_id, created_at)
  VALUES (
    'transfer_' || p_status, 'assignment_transfers', p_transfer_id::TEXT,
    jsonb_build_object('status', 'pending', 'rep', v_rep_name, 'account', v_account_name),
    jsonb_build_object('status', p_status, 'resolved_by_admin_id', auth.uid()),
    auth.uid(), NOW()
  );
END;
$$;

-- 4. Fix transfer_accounts_batch_json (Phase 4)
DROP FUNCTION IF EXISTS transfer_accounts_batch_json(UUID, UUID, JSONB);
CREATE OR REPLACE FUNCTION transfer_accounts_batch_json(
  p_source_manager_id UUID,
  p_target_manager_id UUID,
  p_transfers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transfer RECORD;
  v_account_id UUID;
  v_rep_id UUID;
  v_rep_name TEXT;
  v_account_name TEXT;
  v_old_manager_name TEXT;
  v_target_manager_name TEXT;
  v_moved_accounts INT := 0;
  v_moved_reps INT := 0;
  v_transfer_count INT := 0;
  v_cross_territory_count INT := 0;
  v_is_admin BOOLEAN;
BEGIN
  SELECT role = 'admin' INTO v_is_admin FROM users WHERE id = auth.uid();
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Access denied: admin only';
  END IF;

  IF p_source_manager_id = p_target_manager_id THEN
    RAISE EXCEPTION 'Source and target manager cannot be the same';
  END IF;

  IF p_transfers IS NULL OR jsonb_array_length(p_transfers) = 0 THEN
    RAISE EXCEPTION 'No transfers specified';
  END IF;

  SELECT business_name INTO v_old_manager_name FROM users WHERE id = p_source_manager_id;
  SELECT business_name INTO v_target_manager_name FROM users WHERE id = p_target_manager_id;

  PERFORM set_config('app.is_batch_transfer', 'true', true);

  FOR v_transfer IN
    SELECT (elem->>'account_id')::UUID as account_id,
           NULLIF(elem->>'rep_id', '')::UUID as rep_id
    FROM jsonb_array_elements(p_transfers) as elem
  LOOP
    v_account_id := v_transfer.account_id;
    v_rep_id := v_transfer.rep_id;

    SELECT business_name INTO v_account_name FROM users WHERE id = v_account_id;

    UPDATE users
    SET manager_id = p_target_manager_id
    WHERE id = v_account_id AND manager_id = p_source_manager_id;

    v_moved_accounts := v_moved_accounts + 1;

    INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, user_id, created_at)
    VALUES (
      'account_transferred', 'users', v_account_id::TEXT,
      jsonb_build_object('manager_id', p_source_manager_id, 'manager_name', v_old_manager_name),
      jsonb_build_object('manager_id', p_target_manager_id, 'manager_name', v_target_manager_name),
      auth.uid(), NOW()
    );

    IF v_rep_id IS NOT NULL THEN
      SELECT business_name INTO v_rep_name FROM users WHERE id = v_rep_id;

      UPDATE users SET manager_id = p_target_manager_id WHERE id = v_rep_id;

      v_moved_reps := v_moved_reps + 1;

      INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, user_id, created_at)
      VALUES (
        'rep_transferred', 'users', v_rep_id::TEXT,
        jsonb_build_object('old_manager_id', p_source_manager_id, 'old_manager_name', v_old_manager_name, 'rep_name', v_rep_name),
        jsonb_build_object('new_manager_id', p_target_manager_id, 'new_manager_name', v_target_manager_name),
        auth.uid(), NOW()
      );

      INSERT INTO assignment_transfers (rep_id, account_id, old_manager_id, new_manager_id, status, created_at)
      VALUES (v_rep_id, v_account_id, p_source_manager_id, p_target_manager_id, 'pending', NOW());

      v_transfer_count := v_transfer_count + 1;
    ELSE
      v_cross_territory_count := v_cross_territory_count + 1;
    END IF;
  END LOOP;

  PERFORM set_config('app.is_batch_transfer', 'false', true);

  RETURN jsonb_build_object(
    'moved_accounts', v_moved_accounts,
    'moved_reps', v_moved_reps,
    'transfer_count', v_transfer_count,
    'cross_territory_count', v_cross_territory_count
  );
END;
$$;

-- 5. Fix trigger function handle_rep_manager_change
DROP TRIGGER IF EXISTS rep_manager_change_trigger ON users;
DROP FUNCTION IF EXISTS handle_rep_manager_change();
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
  v_is_batch TEXT;
BEGIN
  BEGIN
    v_is_batch := current_setting('app.is_batch_transfer', true);
  EXCEPTION WHEN OTHERS THEN
    v_is_batch := 'false';
  END;
  IF v_is_batch = 'true' THEN
    RETURN NEW;
  END IF;

  IF NEW.role != 'sales_rep' THEN
    RETURN NEW;
  END IF;

  SELECT business_name INTO v_old_manager_name FROM users WHERE id = OLD.manager_id;
  SELECT business_name INTO v_new_manager_name FROM users WHERE id = NEW.manager_id;

  FOR v_assignment IN
    SELECT * FROM rep_account_assignments WHERE rep_id = NEW.id
  LOOP
    INSERT INTO assignment_transfers (rep_id, account_id, old_manager_id, new_manager_id, status, created_at)
    VALUES (NEW.id, v_assignment.account_id, OLD.manager_id, NEW.manager_id, 'pending', NOW());

    INSERT INTO audit_log (action, table_name, record_id, old_data, new_data, user_id, created_at)
    VALUES (
      'transfer_created', 'assignment_transfers', v_assignment.account_id::TEXT,
      jsonb_build_object('rep_id', NEW.id, 'rep_name', NEW.business_name, 'old_manager_id', OLD.manager_id, 'old_manager_name', v_old_manager_name, 'account_id', v_assignment.account_id),
      jsonb_build_object('new_manager_id', NEW.manager_id, 'new_manager_name', v_new_manager_name),
      auth.uid(), NOW()
    );
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER rep_manager_change_trigger
  AFTER UPDATE OF manager_id ON users
  FOR EACH ROW
  WHEN (OLD.manager_id IS DISTINCT FROM NEW.manager_id)
  EXECUTE FUNCTION handle_rep_manager_change();

-- 6. Re-grant permissions
GRANT EXECUTE ON FUNCTION accept_transfer(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION accept_transfer(UUID) TO anon;
GRANT EXECUTE ON FUNCTION reject_transfer(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_transfer(UUID) TO anon;
GRANT EXECUTE ON FUNCTION admin_resolve_transfer(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_resolve_transfer(UUID, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION transfer_accounts_batch_json(UUID, UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION transfer_accounts_batch_json(UUID, UUID, JSONB) TO anon;
GRANT EXECUTE ON FUNCTION get_pending_transfers(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_transfers(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_all_transfers() TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_transfers() TO anon;
