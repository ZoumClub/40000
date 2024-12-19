-- Add is_active column to services table
ALTER TABLE services
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Add is_active column to accessories table
ALTER TABLE accessories
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Add is_active column to news_articles table
ALTER TABLE news_articles
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Create indexes for better query performance
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_accessories_is_active ON accessories(is_active);
CREATE INDEX idx_news_articles_is_active ON news_articles(is_active);

-- Update RLS policies to filter by is_active for public access
DROP POLICY IF EXISTS "Public read access" ON services;
CREATE POLICY "Public read access"
    ON services FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Public read access" ON accessories;
CREATE POLICY "Public read access"
    ON accessories FOR SELECT
    USING (is_active = true);

DROP POLICY IF EXISTS "Public read access" ON news_articles;
CREATE POLICY "Public read access"
    ON news_articles FOR SELECT
    USING (is_active = true);

-- Update hooks to filter by is_active
CREATE OR REPLACE FUNCTION get_active_services()
RETURNS SETOF services
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT * FROM services WHERE is_active = true ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION get_active_accessories()
RETURNS SETOF accessories
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT * FROM accessories WHERE is_active = true ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION get_active_news()
RETURNS SETOF news_articles
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT * FROM news_articles WHERE is_active = true ORDER BY published_at DESC;
$$;