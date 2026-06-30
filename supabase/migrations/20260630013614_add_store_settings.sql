/*
# Add Store Settings Table

1. New Tables
- `store_settings` - Store configuration
  - `id` (uuid, primary key)
  - `store_name` (text, default 'NongkiStore')
  - `phone_number` (text)
  - `address` (text)
  - `updated_at` (timestamp)

2. Security
- Enable RLS on store_settings.
- Allow anon + authenticated full CRUD (single-tenant).

3. Notes
- Single row table for store configuration
- Admin can update phone number and other settings
*/

CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text NOT NULL DEFAULT 'NongkiStore',
  phone_number text DEFAULT '',
  address text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Policies (anon + authenticated for single-tenant)
DROP POLICY IF EXISTS "anon_select_store_settings" ON store_settings;
CREATE POLICY "anon_select_store_settings" ON store_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_store_settings" ON store_settings;
CREATE POLICY "anon_insert_store_settings" ON store_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_store_settings" ON store_settings;
CREATE POLICY "anon_update_store_settings" ON store_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Insert default settings
INSERT INTO store_settings (store_name, phone_number, address) VALUES
  ('NongkiStore', '081234567890', 'Jl. Contoh No. 123')
ON CONFLICT DO NOTHING;
