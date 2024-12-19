-- Drop existing functions and triggers
DROP FUNCTION IF EXISTS authenticate_dealer CASCADE;
DROP FUNCTION IF EXISTS hash_pin CASCADE;

-- Create extension for password hashing if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update dealers table
ALTER TABLE dealers 
DROP COLUMN IF EXISTS pin CASCADE;

ALTER TABLE dealers
ADD COLUMN pin CHAR(4) NOT NULL DEFAULT '0000' CHECK (pin ~ '^\d{4}$'),
ADD COLUMN last_login TIMESTAMPTZ,
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Create function to authenticate dealer
CREATE OR REPLACE FUNCTION authenticate_dealer(
    dealer_name TEXT,
    pin TEXT
) RETURNS TABLE (
    id UUID,
    name TEXT,
    email TEXT,
    phone TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.name,
        d.email,
        d.phone
    FROM dealers d
    WHERE LOWER(SPLIT_PART(d.name, ' ', 1)) = LOWER(dealer_name)
    AND d.pin = pin
    AND d.status = 'active';

    -- Update last login timestamp
    UPDATE dealers
    SET last_login = NOW()
    WHERE LOWER(SPLIT_PART(name, ' ', 1)) = LOWER(dealer_name)
    AND pin = pin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing dealers with PIN from phone
UPDATE dealers d
SET pin = RIGHT(REGEXP_REPLACE(d.phone, '[^0-9]', '', 'g'), 4)
WHERE pin = '0000';

-- Create RLS policies
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Dealers can view their own data" ON dealers;
CREATE POLICY "Dealers can view their own data"
    ON dealers FOR SELECT
    USING (id = auth.uid() OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Dealers can update their own data" ON dealers;
CREATE POLICY "Dealers can update their own data"
    ON dealers FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Add constraint to ensure phone numbers are unique
ALTER TABLE dealers
ADD CONSTRAINT dealers_phone_unique UNIQUE (phone);

-- Create car_sales table for tracking sales
CREATE TABLE IF NOT EXISTS car_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL,
    dealer_id UUID NOT NULL REFERENCES dealers(id),
    sale_price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2) NOT NULL,
    savings DECIMAL(12, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT positive_prices CHECK (
        sale_price > 0 AND 
        original_price > 0 AND 
        (savings IS NULL OR savings >= 0)
    )
);

-- Create indexes for better performance
CREATE INDEX idx_car_sales_dealer ON car_sales(dealer_id);
CREATE INDEX idx_car_sales_date ON car_sales(created_at);

-- Enable RLS on car_sales
ALTER TABLE car_sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for car_sales
CREATE POLICY "Dealers can view their own sales"
    ON car_sales FOR SELECT
    USING (dealer_id = auth.uid());

-- Create function to handle car sales
CREATE OR REPLACE FUNCTION handle_car_sale()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'sold' AND OLD.status != 'sold' THEN
        INSERT INTO car_sales (
            car_id,
            dealer_id,
            sale_price,
            original_price,
            savings
        ) VALUES (
            NEW.id,
            NEW.dealer_id,
            NEW.price,
            NEW.price + COALESCE(NEW.savings, 0),
            NEW.savings
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for car sales
DROP TRIGGER IF EXISTS on_car_sold ON dealer_cars;
CREATE TRIGGER on_car_sold
    AFTER UPDATE ON dealer_cars
    FOR EACH ROW
    WHEN (NEW.status = 'sold' AND OLD.status != 'sold')
    EXECUTE FUNCTION handle_car_sale();