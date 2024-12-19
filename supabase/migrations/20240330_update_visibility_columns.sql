-- Drop existing visibility columns if they exist
ALTER TABLE services DROP COLUMN IF EXISTS is_active;
ALTER TABLE accessories DROP COLUMN IF EXISTS is_active;
ALTER TABLE news_articles DROP COLUMN IF EXISTS is_active;

-- Add visibility columns with proper constraints
ALTER TABLE services 
ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE accessories 
ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE news_articles 
ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_services_visibility ON services(is_visible);
CREATE INDEX IF NOT EXISTS idx_accessories_visibility ON accessories(is_visible);
CREATE INDEX IF NOT EXISTS idx_news_articles_visibility ON news_articles(is_visible);

-- Update RLS policies to filter by visibility
DROP POLICY IF EXISTS "Public read access" ON services;
CREATE POLICY "Public read access"
    ON services FOR SELECT
    USING (is_visible = true);

DROP POLICY IF EXISTS "Public read access" ON accessories;
CREATE POLICY "Public read access"
    ON accessories FOR SELECT
    USING (is_visible = true);

DROP POLICY IF EXISTS "Public read access" ON news_articles;
CREATE POLICY "Public read access"
    ON news_articles FOR SELECT
    USING (is_visible = true);

-- Create functions to get visible items only
CREATE OR REPLACE FUNCTION get_visible_services()
RETURNS SETOF services
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT * FROM services WHERE is_visible = true ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION get_visible_accessories()
RETURNS SETOF accessories
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT * FROM accessories WHERE is_visible = true ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION get_visible_news()
RETURNS SETOF news_articles
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT * FROM news_articles WHERE is_visible = true ORDER BY published_at DESC;
$$;

-- Add trigger to log visibility changes
CREATE TABLE IF NOT EXISTS visibility_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    changed_from BOOLEAN NOT NULL,
    changed_to BOOLEAN NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION log_visibility_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_visible IS DISTINCT FROM NEW.is_visible THEN
        INSERT INTO visibility_changes (
            table_name,
            record_id,
            changed_from,
            changed_to,
            changed_by
        ) VALUES (
            TG_TABLE_NAME,
            NEW.id,
            OLD.is_visible,
            NEW.is_visible,
            auth.uid()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for each table
CREATE TRIGGER log_service_visibility
    AFTER UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION log_visibility_change();

CREATE TRIGGER log_accessory_visibility
    AFTER UPDATE ON accessories
    FOR EACH ROW
    EXECUTE FUNCTION log_visibility_change();

CREATE TRIGGER log_news_visibility
    AFTER UPDATE ON news_articles
    FOR EACH ROW
    EXECUTE FUNCTION log_visibility_change();