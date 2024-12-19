-- Create visibility logging table if not exists
CREATE TABLE IF NOT EXISTS visibility_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    changed_from BOOLEAN NOT NULL,
    changed_to BOOLEAN NOT NULL,
    changed_by UUID REFERENCES auth.users(id),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create logging function
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

-- Drop existing is_active column
ALTER TABLE brands DROP COLUMN IF EXISTS is_active;

-- Add visibility column with proper constraints
ALTER TABLE brands 
ADD COLUMN is_visible BOOLEAN NOT NULL DEFAULT true;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_brands_visibility ON brands(is_visible);

-- Update RLS policies to filter by visibility
DROP POLICY IF EXISTS "Anyone can view brands" ON brands;
CREATE POLICY "Anyone can view brands"
    ON brands FOR SELECT
    USING (is_visible = true);

-- Create function to get visible brands only
CREATE OR REPLACE FUNCTION get_visible_brands()
RETURNS SETOF brands
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT * FROM brands WHERE is_visible = true ORDER BY order_index;
$$;

-- Add trigger for logging visibility changes
CREATE TRIGGER log_brand_visibility
    AFTER UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION log_visibility_change();

-- Update existing brands to be visible by default
UPDATE brands SET is_visible = true WHERE is_visible IS NULL;

-- Add constraint to ensure "All Brands" is always visible
ALTER TABLE brands
ADD CONSTRAINT ensure_all_brands_visible
CHECK (
    name != 'All Brands' OR 
    (name = 'All Brands' AND is_visible = true)
);