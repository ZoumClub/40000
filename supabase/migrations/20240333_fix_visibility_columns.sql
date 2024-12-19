-- Drop existing columns and constraints
ALTER TABLE services DROP COLUMN IF EXISTS is_visible CASCADE;
ALTER TABLE accessories DROP COLUMN IF EXISTS is_visible CASCADE;
ALTER TABLE news_articles DROP COLUMN IF EXISTS is_visible CASCADE;
ALTER TABLE brands DROP COLUMN IF EXISTS is_visible CASCADE;

-- Add new visibility columns with proper defaults
ALTER TABLE services ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE accessories ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE news_articles ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE brands ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_services_visibility ON services(is_visible);
CREATE INDEX IF NOT EXISTS idx_accessories_visibility ON accessories(is_visible);
CREATE INDEX IF NOT EXISTS idx_news_visibility ON news_articles(is_visible);
CREATE INDEX IF NOT EXISTS idx_brands_visibility ON brands(is_visible);

-- Update RLS policies
DROP POLICY IF EXISTS "Public can view visible services" ON services;
DROP POLICY IF EXISTS "Public can view visible accessories" ON accessories;
DROP POLICY IF EXISTS "Public can view visible news" ON news_articles;
DROP POLICY IF EXISTS "Public can view visible brands" ON brands;

-- Create new policies
CREATE POLICY "Public can view visible services"
    ON services FOR SELECT
    USING (is_visible = true);

CREATE POLICY "Public can view visible accessories"
    ON accessories FOR SELECT
    USING (is_visible = true);

CREATE POLICY "Public can view visible news"
    ON news_articles FOR SELECT
    USING (is_visible = true);

CREATE POLICY "Public can view visible brands"
    ON brands FOR SELECT
    USING (is_visible = true);

-- Set "All Brands" to always be visible
UPDATE brands SET is_visible = true WHERE name = 'All Brands';

-- Add constraint to ensure "All Brands" stays visible
ALTER TABLE brands DROP CONSTRAINT IF EXISTS ensure_all_brands_visible;
ALTER TABLE brands ADD CONSTRAINT ensure_all_brands_visible 
    CHECK (name != 'All Brands' OR (name = 'All Brands' AND is_visible = true));