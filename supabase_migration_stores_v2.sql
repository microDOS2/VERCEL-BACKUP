-- ============================================================
-- microDOS(2) Store Locator v2 - CREATE TABLE + Migration
-- Run ONCE in your Supabase SQL Editor, then click Run
-- ============================================================

-- 1. Create wholesaler_store_locations table (if not exists)
CREATE TABLE IF NOT EXISTS wholesaler_store_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT,
    address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    zip TEXT,
    lat NUMERIC,
    lng NUMERIC,
    phone TEXT,
    email TEXT,
    website TEXT,
    stock TEXT DEFAULT 'In Stock' CHECK (stock IN ('In Stock', 'Low Stock', 'Out of Stock')),
    license_number TEXT,
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    source TEXT DEFAULT 'wholesaler' CHECK (source IN ('wholesaler', 'admin', 'sales_manager')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE wholesaler_store_locations ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY IF NOT EXISTS "wsl_public_read"
    ON wholesaler_store_locations FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "wsl_admin_all"
    ON wholesaler_store_locations FOR ALL USING (true) WITH CHECK (true);

-- 4. Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_wsl_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_wsl_updated_at ON wholesaler_store_locations;
CREATE TRIGGER trg_wsl_updated_at
    BEFORE UPDATE ON wholesaler_store_locations
    FOR EACH ROW EXECUTE FUNCTION update_wsl_timestamp();

-- 5. Migrate data from old stores table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'stores') THEN
        INSERT INTO wholesaler_store_locations (
            user_id, name, address, phone, email, is_active, created_at, updated_at
        )
        SELECT 
            COALESCE(
                (SELECT id FROM users WHERE email = stores.email LIMIT 1),
                '00000000-0000-0000-0000-000000000000'::uuid
            ),
            stores.name,
            stores.address,
            stores.phone,
            stores.email,
            true,
            stores.created_at,
            NOW()
        FROM stores
        WHERE NOT EXISTS (SELECT 1 FROM wholesaler_store_locations WHERE name = stores.name);
    END IF;
END $$;

-- Done! The unified store table is ready.
