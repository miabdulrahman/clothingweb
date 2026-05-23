-- ============================================
-- Modest Fashion Platform — Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Categories RLS Policies
CREATE POLICY "Allow public read access to categories" 
  ON categories FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to categories" 
  ON categories FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);


-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  price INTEGER NOT NULL, -- Stored as integer (e.g. 4500 LKR)
  currency TEXT DEFAULT 'LKR',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  fit_notes TEXT,
  fabric TEXT,
  care TEXT,
  delivery_info TEXT DEFAULT 'Delivered within 2-5 days',
  style_label TEXT, -- e.g. "Oversized", "Relaxed Fit", "Premium Linen"
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Products RLS Policies
CREATE POLICY "Allow public read access to products" 
  ON products FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to products" 
  ON products FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);


-- 3. LOOKBOOK ITEMS TABLE
CREATE TABLE IF NOT EXISTS lookbook_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  caption TEXT,
  collection TEXT, -- e.g., "Minimal Basics 2026"
  related_product_ids UUID[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Lookbook
ALTER TABLE lookbook_items ENABLE ROW LEVEL SECURITY;

-- Lookbook RLS Policies
CREATE POLICY "Allow public read access to lookbook_items" 
  ON lookbook_items FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to lookbook_items" 
  ON lookbook_items FOR ALL TO authenticated 
  USING (true) WITH CHECK (true);


-- 4. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'page_view', 'product_view', 'whatsapp_click', etc.
  event_data JSONB DEFAULT '{}'::jsonb,
  page_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Analytics
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Analytics RLS Policies
CREATE POLICY "Allow public insert to analytics_events" 
  ON analytics_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read access to analytics_events" 
  ON analytics_events FOR SELECT TO authenticated USING (true);


-- ============================================
-- SEED DATA
-- ============================================

-- Insert Categories
INSERT INTO categories (id, name, slug, description, image, sort_order) VALUES
('c1000000-0000-0000-0000-000000000001', 'Oversized Basics', 'oversized-basics', 'Everyday essentials designed with a relaxed, modern silhouette.', '/images/mens_oversized_tee.png', 1),
('c1000000-0000-0000-0000-000000000002', 'Linen Collection', 'linen-collection', 'Lightweight, breathable linen pieces for effortless modesty.', '/images/mens_linen_shirt.png', 2),
('c1000000-0000-0000-0000-000000000003', 'Daily Wear', 'daily-wear', 'Comfortable, durable items optimized for daily activities.', '/images/mens_oversized_tee.png', 3),
('c1000000-0000-0000-0000-000000000004', 'Occasion Wear', 'occasion-wear', 'Elevated and formal attire for special gatherings and celebrations.', '/images/mens_kurta_fit.png', 4),
('c1000000-0000-0000-0000-000000000005', 'Travel Fits', 'travel-fits', 'Loose-fitting, packable, and layered outfits perfect for travel.', '/images/mens_streetwear_fit.png', 5),
('c1000000-0000-0000-0000-000000000006', 'Minimal Streetwear', 'minimal-streetwear', 'Contemporary streetwear style with relaxed and modest tailoring.', '/images/mens_streetwear_fit.png', 6),
('c1000000-0000-0000-0000-000000000007', 'Layering Pieces', 'layering-pieces', 'Cardigans, dusters, and vests to add depth and modesty to any look.', '/images/mens_streetwear_fit.png', 7),
('c1000000-0000-0000-0000-000000000008', 'Minimal Accessories', 'minimal-accessories', 'Clean and simple accessories to complete your look.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop', 8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  sort_order = EXCLUDED.sort_order;

-- Insert Products
INSERT INTO products (id, title, slug, description, full_description, price, category_id, sizes, colors, images, featured, in_stock, fit_notes, fabric, care, style_label) VALUES
-- 1. Oversized Premium Tee
('p1000000-0000-0000-0000-000000000001', 'Oversized Premium Tee', 'oversized-premium-tee', 
'Relaxed fit tee designed for clean, modest everyday wear.', 
'A wardrobe staple crafted from heavyweight 240GSM cotton. Designed with a wide crew neck, dropped shoulders, and elbow-length sleeves for a clean, structural drape that provides optimal coverage without bulk.',
4500, 'c1000000-0000-0000-0000-000000000001', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Sand Beige', 'Charcoal Black', 'Off-White', 'Muted Olive'],
ARRAY['/images/mens_oversized_tee.png'],
true, true, 'True to oversized fit. Take your normal size for a relaxed look, or size down for a more standard fit.', '100% Organic Heavyweight Cotton (240 GSM)', 'Machine wash cold, line dry in shade. Iron medium.', 'Oversized Basics'),

-- 2. Relaxed Linen Trouser
('p1000000-0000-0000-0000-000000000002', 'Relaxed Linen Trouser', 'relaxed-linen-trouser', 
'Flowy and breathable trousers crafted from premium washed linen.',
'Designed for warm climates, these relaxed-fit trousers offer maximum comfort and complete coverage. Features a flat-front elasticated waistband at the back, subtle side slip pockets, and a clean fluid drape.',
6800, 'c1000000-0000-0000-0000-000000000002', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Natural Oat', 'Olive Oil', 'Classic Ivory'],
ARRAY['/images/mens_linen_shirt.png'],
true, true, 'Relaxed straight-leg fit. Elastic waistband with drawcord for ultimate comfort.', '100% Pure Flax Linen', 'Hand wash cold or dry clean. Do not tumble dry.', 'Premium Linen'),

-- 3. Men''s Open Duster Cardigan
('p1000000-0000-0000-0000-000000000003', 'Men''s Open Duster Cardigan', 'mens-open-duster-cardigan', 
'A minimalist open-front duster cardigan for elegant daily layering.',
'An unstructured outerwear piece with wide sleeves and side pockets. Made from a premium medium-weight cotton-linen weave that flows beautifully as you walk. Versatile design that pairs perfectly with basic tees or linen trousers.',
8900, 'c1000000-0000-0000-0000-000000000007', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Sage Green', 'Espresso Brown', 'Soft Onyx'],
ARRAY['/images/mens_duster_cardigan.png'],
true, true, 'Designed for a loose, comfortable fit. Take your normal size.', 'Premium Cotton-Linen Blend', 'Machine wash cold, lay flat to dry. Steam iron only.', 'Layering Pieces'),

-- 4. Linen Resort Button-Up
('p1000000-0000-0000-0000-000000000004', 'Linen Resort Button-Up', 'linen-resort-button-up', 
'Relaxed long-line shirt in soft-washed linen for men.',
'A tunic-length button-down shirt featuring a band collar, curved hemline with side slits, and a relaxed boxy cut. Extra length in the back provides flattering coverage.',
5500, 'c1000000-0000-0000-0000-000000000002', ARRAY['M', 'L', 'XL'], ARRAY['Sea Salt White', 'Sage Green', 'Warm Sand'],
ARRAY['/images/mens_resort_shirt.png'],
false, true, 'Relaxed fit. Drop shoulder design.', '100% Organic Linen', 'Gentle machine wash cold. Iron while damp.', 'Premium Linen'),

-- 5. Heavyweight Hooded Duster
('p1000000-0000-0000-0000-000000000005', 'Heavyweight Hooded Duster', 'heavyweight-hooded-duster', 
'Unisex heavy knit duster cardigan with a generous hood.',
'An ankle-length open cardigan constructed from a heavy double-knit cotton blend. Features deep patch pockets, an oversized hood, and rib-knit cuffs. The ultimate streetwear layering piece.',
9800, 'c1000000-0000-0000-0000-000000000006', ARRAY['S-M', 'L-XL'], ARRAY['Slate Grey', 'Olive Drab', 'Camel Sand'],
ARRAY['/images/mens_hooded_duster.png'],
true, true, 'Anatomically designed to fit loosely. S-M covers up to 5''8", L-XL for 5''9" and above.', 'Cotton-Poly Double Knit Blend', 'Cold wash inside out. Dry flat to preserve shape.', 'Streetwear'),

-- 6. Modular Travel Cargo Pants
('p1000000-0000-0000-0000-000000000006', 'Modular Travel Cargo Pants', 'modular-travel-cargo-pants', 
'Loose-fit utility cargos with water-resistant finish.',
'Crafted from lightweight nylon-stretch material, these cargo pants offer maximum comfort for long travel days. Elastic waist with drawstring, articulated knees, and multi-pocket configuration for functionality.',
7200, 'c1000000-0000-0000-0000-000000000005', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Desert Khaki', 'Onyx Black'],
ARRAY['/images/mens_travel_cargo.png'],
false, true, 'Relaxed utility fit. Features adjustable toggles at the ankles.', '92% Nylon, 8% Spandex with DWR Coating', 'Machine wash cold. Tumble dry low.', 'Travel Fits'),

-- 7. Textured Crepe Kurta Tunic
('p1000000-0000-0000-0000-000000000007', 'Textured Crepe Kurta Tunic', 'textured-crepe-kurta-tunic', 
'Elegant high-neck long-line kurta with subtle detailing.',
'An elegant, long-line kurta tunic designed for formal occasions and gatherings. Features a modest clean collar, long sleeves, and a tailored yet comfortable silhouette that provides optimal coverage.',
11200, 'c1000000-0000-0000-0000-000000000004', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Dusty Rose', 'Deep Mulberry', 'Navy Blue'],
ARRAY['/images/mens_kurta_fit.png'],
true, true, 'Regular fit through shoulders, expanding into a relaxed long-line tunic. Perfect for pairing with linen or cotton trousers.', 'Premium Textured Crepe Fabric', 'Hand wash cold or dry clean. Hang dry. Light steam.', 'Occasion Wear'),

-- 8. Essential Layering Slip Tunic
('p1000000-0000-0000-0000-000000000008', 'Essential Layering Slip Tunic', 'essential-layering-slip-tunic', 
'Opaque crew-neck inner layering tunic for men.',
'A straight-cut sleeveless slip tunic designed specifically for layering. Made from non-see-through satin-back crepe. Features a high crew neck and side slits for ease of movement under open cardigans and dusters.',
4200, 'c1000000-0000-0000-0000-000000000007', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Ivory White', 'True Black', 'Warm Nude'],
ARRAY['/images/mens_slip_tunic.png'],
false, true, 'Straight column silhouette. Order your standard size.', 'Satin-Back Crepe', 'Machine wash gentle cold. Iron low.', 'Layering Pieces')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  full_description = EXCLUDED.full_description,
  price = EXCLUDED.price,
  category_id = EXCLUDED.category_id,
  sizes = EXCLUDED.sizes,
  colors = EXCLUDED.colors,
  images = EXCLUDED.images,
  featured = EXCLUDED.featured,
  in_stock = EXCLUDED.in_stock,
  fit_notes = EXCLUDED.fit_notes,
  fabric = EXCLUDED.fabric,
  care = EXCLUDED.care,
  style_label = EXCLUDED.style_label;


-- Insert Lookbook Items
INSERT INTO lookbook_items (id, title, image, caption, collection, related_product_ids) VALUES
('l1000000-0000-0000-0000-000000000001', 'Oversized Minimalism', 
 '/images/mens_hero_bg.png', 
 'A clean combination of our Oversized Premium Tee and Relaxed Linen Trouser in natural, warm sand tones.', 
 'Summer 2026', 
 ARRAY['p1000000-0000-0000-0000-000000000001'::uuid, 'p1000000-0000-0000-0000-000000000002'::uuid]),

('l1000000-0000-0000-0000-000000000002', 'Modern Utility & Layers', 
 '/images/mens_streetwear_fit.png', 
 'Layering with the Heavyweight Hooded Duster and Modular Travel Cargo Pants for an active yet modest urban silhouette.', 
 'Winter 2026', 
 ARRAY['p1000000-0000-0000-0000-000000000005'::uuid, 'p1000000-0000-0000-0000-000000000006'::uuid]),

('l1000000-0000-0000-0000-000000000003', 'Traditional Modernity', 
 '/images/mens_kurta_fit.png', 
 'The Textured Crepe Kurta Tunic paired over our Essential Layering Slip Tunic for structured modest formal look.', 
 'Spring 2026', 
 ARRAY['p1000000-0000-0000-0000-000000000007'::uuid, 'p1000000-0000-0000-0000-000000000008'::uuid])
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  caption = EXCLUDED.caption,
  collection = EXCLUDED.collection,
  related_product_ids = EXCLUDED.related_product_ids;
