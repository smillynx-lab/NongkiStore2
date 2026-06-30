/*
# Create NongkiStore Game Store Database

1. New Tables
- `categories` - Item categories (Seeds, Pets, Gear, Sheckles)
- `pet_sizes` - Pet size filter options (Normal, Big, Huge)
- `items` - Game items with rarity system

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated full CRUD.

3. Notes
- Seeds: Dragon's Breath, Hypno Bloom, etc.
- Pets: Bunny, Frog, Owl, etc. with size filter
- Gear: Watering Can, Sprinklers, Mushrooms
- Sheckles: Currency items catalog
*/

-- Drop existing tables
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS pet_sizes CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS store_settings CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Create categories
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '',
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create pet sizes
CREATE TABLE pet_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create items
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(15,2) NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  image_url text,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  pet_size_id uuid REFERENCES pet_sizes(id) ON DELETE SET NULL,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  rarity text DEFAULT 'Common',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "anon_crud_categories" ON categories FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_crud_pet_sizes" ON pet_sizes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_crud_items" ON items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Insert categories
INSERT INTO categories (name, slug, icon, description) VALUES
  ('Seeds', 'seeds', '🌱', 'Tanaman dan bibit langka'),
  ('Pets', 'pets', '🐾', 'Hewan peliharaan fantastis'),
  ('Gear', 'gear', '🔧', 'Peralatan dan alat'),
  ('Sheckles', 'sheckles', '💰', 'Katalog mata uang');

-- Insert pet sizes
INSERT INTO pet_sizes (name) VALUES ('Normal'), ('Big'), ('Huge');

-- Insert Seeds
INSERT INTO items (name, description, price, category_id, rarity, is_featured) VALUES
  ('Dragon''s Breath', 'Tanaman megah dengan lidah api', 5000000, (SELECT id FROM categories WHERE slug='seeds'), 'Legendary', true),
  ('Hypno Bloom', 'Bunga hipnotis yang memukau', 3500000, (SELECT id FROM categories WHERE slug='seeds'), 'Mythic', true),
  ('Moon Bloom', 'Mekar di bawah sinar bulan', 2800000, (SELECT id FROM categories WHERE slug='seeds'), 'Mythic', false),
  ('Venom Spitter', 'Tanaman beracun pemangsa', 2200000, (SELECT id FROM categories WHERE slug='seeds'), 'Legendary', false),
  ('Poison Apple', 'Buah terlarang penuh racun', 1800000, (SELECT id FROM categories WHERE slug='seeds'), 'Epic', false),
  ('Pomegranate', 'Buah delima merah segar', 1200000, (SELECT id FROM categories WHERE slug='seeds'), 'Epic', false),
  ('Venus Fly Trap', 'Pemangsa serangga legendaris', 2500000, (SELECT id FROM categories WHERE slug='seeds'), 'Legendary', false),
  ('Ghost Pepper', 'Cabai paling pedas dunia', 800000, (SELECT id FROM categories WHERE slug='seeds'), 'Rare', false),
  ('Sunflower', 'Bunga matahari cerah', 150000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Poison Ivy', 'Tanaman rambat beracun', 600000, (SELECT id FROM categories WHERE slug='seeds'), 'Rare', false),
  ('Cherry', 'Buah ceri manis', 200000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Acorn', 'Biji ekor kecil', 100000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Glow Mushroom', 'Jamur bercahaya di kegelapan', 450000, (SELECT id FROM categories WHERE slug='seeds'), 'Rare', true),
  ('Mango', 'Buah mangga tropis', 300000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Horned Melon', 'Melon bertanduk eksotis', 700000, (SELECT id FROM categories WHERE slug='seeds'), 'Rare', false),
  ('Coconut', 'Kelapa segar dari pantai', 250000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Dragon Fruit', 'Buah naga lezat', 550000, (SELECT id FROM categories WHERE slug='seeds'), 'Rare', false),
  ('Baby Cactus', 'Kaktus mini lucu', 180000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Grape', 'Anggur segar', 280000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Banana', 'Pisang kuning matang', 120000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Green Bean', 'Kacang hijau renyah', 80000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Mushroom', 'Jamur liar segar', 150000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Pineapple', 'Nanas tropis manis', 320000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Cactus', 'Kaktus gurun tangguh', 220000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Corn', 'Jagung manis', 90000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Bamboo', 'Bambu elegan', 400000, (SELECT id FROM categories WHERE slug='seeds'), 'Rare', false),
  ('Apple', 'Apel merah segar', 170000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Tomato', 'Tomat merah matang', 110000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Tulip', 'Bunga tulip indah', 350000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Blueberry', 'Blueberry segar', 190000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Strawberry', 'Stroberi manis', 210000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false),
  ('Carrot', 'Wortel oranye', 50000, (SELECT id FROM categories WHERE slug='seeds'), 'Common', false);

-- Insert Normal Pets
INSERT INTO items (name, description, price, category_id, pet_size_id, rarity, is_featured) VALUES
  ('Bunny', 'Kelinci imut dan lincah', 500000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Common', true),
  ('Frog', 'Katak hijau gemar melompat', 400000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Common', false),
  ('Owl', 'Burung hantu bijaksana', 800000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Rare', true),
  ('Deer', 'Rusa anggun hutan', 1200000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Rare', false),
  ('Bee', 'Lebah pekerja rajin', 600000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Common', false),
  ('Robin', 'Burung robin nyanyian', 450000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Common', false),
  ('Monkey', 'Monyet cerdas dan lincah', 950000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Rare', false),
  ('Golden Dragonfly', 'Capung emas langkah', 3500000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Legendary', true),
  ('Unicorn', 'Kuda mitos bersurat', 8000000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Mythic', true),
  ('Bear', 'Beruang kuat tangguh', 1500000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Epic', false),
  ('Raccoon', 'Rakun nakal cerdas', 750000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Rare', false),
  ('Black Dragon', 'Naga hitam legenda', 15000000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Mythic', true),
  ('Ice Serpent', 'Ular es mematikan', 6000000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Legendary', false),
  ('Turtle', 'Kura-kura sabar', 550000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Normal'), 'Common', false);

-- Insert Big Pets
INSERT INTO items (name, description, price, category_id, pet_size_id, rarity, is_featured) VALUES
  ('Bunny', 'Kelinci imut dan lincah (Besar)', 2000000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Big'), 'Rare', false),
  ('Owl', 'Burung hantu bijaksana (Besar)', 3200000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Big'), 'Epic', false),
  ('Unicorn', 'Kuda mitos bersurat (Besar)', 32000000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Big'), 'Mythic', false),
  ('Black Dragon', 'Naga hitam legenda (Besar)', 60000000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Big'), 'Mythic', true);

-- Insert Huge Pets
INSERT INTO items (name, description, price, category_id, pet_size_id, rarity, is_featured) VALUES
  ('Bunny', 'Kelinci imut dan lincah (Raksasa)', 8000000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Huge'), 'Legendary', false),
  ('Unicorn', 'Kuda mitos bersurat (Raksasa)', 128000000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Huge'), 'Mythic', true),
  ('Black Dragon', 'Naga hitam legenda (Raksasa)', 240000000, (SELECT id FROM categories WHERE slug='pets'), (SELECT id FROM pet_sizes WHERE name='Huge'), 'Mythic', true);

-- Insert Gear
INSERT INTO items (name, description, price, category_id, rarity, is_featured) VALUES
  ('Common Watering Can', 'Penyiram tanaman standar', 100000, (SELECT id FROM categories WHERE slug='gear'), 'Common', false),
  ('Basic Sprinkler', 'Sprinkler otomatis dasar', 250000, (SELECT id FROM categories WHERE slug='gear'), 'Common', false),
  ('Uncommon Sprinkler', 'Sprinkler lebih efisien', 500000, (SELECT id FROM categories WHERE slug='gear'), 'Uncommon', false),
  ('Rare Sprinkler', 'Sprinkler langka bertenaga', 1500000, (SELECT id FROM categories WHERE slug='gear'), 'Rare', true),
  ('Super Sprinkler', 'Sprinkler super canggih', 5000000, (SELECT id FROM categories WHERE slug='gear'), 'Epic', true),
  ('Speed Mushroom', 'Jamur peningkat kecepatan', 800000, (SELECT id FROM categories WHERE slug='gear'), 'Rare', false),
  ('Jump Mushroom', 'Jamur peningkat lompatan', 700000, (SELECT id FROM categories WHERE slug='gear'), 'Rare', false),
  ('Gnome', 'Patung gnome taman', 150000, (SELECT id FROM categories WHERE slug='gear'), 'Common', false),
  ('Shrink Mushroom', 'Jamur pengecil ukuran', 1200000, (SELECT id FROM categories WHERE slug='gear'), 'Epic', false),
  ('Supersize Mushroom', 'Jamur pembesar raksasa', 2000000, (SELECT id FROM categories WHERE slug='gear'), 'Epic', true),
  ('Invisibility Mushroom', 'Jamur tembus pandang', 8000000, (SELECT id FROM categories WHERE slug='gear'), 'Legendary', true),
  ('Super Watering Can', 'Penyiram super efisien', 3000000, (SELECT id FROM categories WHERE slug='gear'), 'Epic', false),
  ('Basic Pot', 'Pot tanaman dasar', 50000, (SELECT id FROM categories WHERE slug='gear'), 'Common', false);

-- Insert Sheckles (Currency Items)
INSERT INTO items (name, description, price, category_id, rarity, is_featured) VALUES
  ('Sheckle Coin', 'Koin Sheckle perak', 10000, (SELECT id FROM categories WHERE slug='sheckles'), 'Common', false),
  ('Sheckle Stack', 'Tumpukan 100 Sheckles', 1000000, (SELECT id FROM categories WHERE slug='sheckles'), 'Common', false),
  ('Golden Sheckle', 'Sheckle emas langka', 500000, (SELECT id FROM categories WHERE slug='sheckles'), 'Rare', true),
  ('Sheckle Pouch', 'Kantong 1000 Sheckles', 10000000, (SELECT id FROM categories WHERE slug='sheckles'), 'Epic', true),
  ('Sheckle Chest', 'Peti 10000 Sheckles', 100000000, (SELECT id FROM categories WHERE slug='sheckles'), 'Legendary', true),
  ('Sheckle Vault', 'Brankas 100000 Sheckles', 1000000000, (SELECT id FROM categories WHERE slug='sheckles'), 'Mythic', true);
