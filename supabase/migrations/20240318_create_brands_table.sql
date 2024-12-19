-- Create brands table
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view brands"
    ON brands FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage brands"
    ON brands
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Insert default brands
INSERT INTO brands (name, logo_url, order_index) VALUES
    ('All Brands', '/brands/all-brands.png', 0),
    ('BMW', 'https://www.car-logos.org/wp-content/uploads/2011/09/bmw.png', 1),
    ('Mercedes', 'https://www.car-logos.org/wp-content/uploads/2011/09/mercedes.png', 2),
    ('Audi', 'https://www.car-logos.org/wp-content/uploads/2011/09/audi.png', 3),
    ('Toyota', 'https://www.car-logos.org/wp-content/uploads/2011/09/toyota.png', 4),
    ('Honda', 'https://www.car-logos.org/wp-content/uploads/2011/09/honda.png', 5),
    ('Lexus', 'https://www.car-logos.org/wp-content/uploads/2011/09/lexus.png', 6),
    ('Porsche', 'https://www.car-logos.org/wp-content/uploads/2011/09/porsche.png', 7);