-- Drop existing policies first
DROP POLICY IF EXISTS "Public read access" ON services;
DROP POLICY IF EXISTS "Public read access" ON accessories;
DROP POLICY IF EXISTS "Public read access" ON news_articles;
DROP POLICY IF EXISTS "Public read access" ON brands;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS log_service_visibility ON services;
DROP TRIGGER IF EXISTS log_accessory_visibility ON accessories;
DROP TRIGGER IF EXISTS log_news_visibility ON news_articles;
DROP TRIGGER IF EXISTS log_brand_visibility ON brands;

-- Drop existing function
DROP FUNCTION IF EXISTS log_visibility_change();

-- Drop existing visibility columns
ALTER TABLE services DROP COLUMN IF EXISTS is_active CASCADE;
ALTER TABLE services DROP COLUMN IF EXISTS is_visible CASCADE;
ALTER TABLE accessories DROP COLUMN IF EXISTS is_active CASCADE;
ALTER TABLE accessories DROP COLUMN IF EXISTS is_visible CASCADE;
ALTER TABLE news_articles DROP COLUMN IF EXISTS is_active CASCADE;
ALTER TABLE news_articles DROP COLUMN IF EXISTS is_visible CASCADE;
ALTER TABLE brands DROP COLUMN IF EXISTS is_active CASCADE;
ALTER TABLE brands DROP COLUMN IF EXISTS is_visible CASCADE;

-- Add new visibility columns
ALTER TABLE services ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE accessories ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE news_articles ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE brands ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;

-- Create indexes
CREATE INDEX idx_services_visibility ON services(is_visible);
CREATE INDEX idx_accessories_visibility ON accessories(is_visible);
CREATE INDEX idx_news_visibility ON news_articles(is_visible);
CREATE INDEX idx_brands_visibility ON brands(is_visible);

-- Create RLS policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Public read policies
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

-- Admin policies
CREATE POLICY "Admin can manage services"
    ON services
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage accessories"
    ON accessories
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage news"
    ON news_articles
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage brands"
    ON brands
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Ensure "All Brands" is always visible
UPDATE brands SET is_visible = true WHERE name = 'All Brands';

ALTER TABLE brands
ADD CONSTRAINT ensure_all_brands_visible
CHECK (
    name != 'All Brands' OR 
    (name = 'All Brands' AND is_visible = true)
);