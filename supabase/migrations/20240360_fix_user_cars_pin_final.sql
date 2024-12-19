-- Drop existing PIN-related objects
DROP TRIGGER IF EXISTS validate_pin_trigger ON user_cars;
DROP FUNCTION IF EXISTS validate_pin();
DROP FUNCTION IF EXISTS authenticate_car_owner();
DROP FUNCTION IF EXISTS set_current_pin();

-- Recreate user_cars table with correct structure
CREATE TABLE IF NOT EXISTS user_cars_new (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_name VARCHAR(255) NOT NULL,
    pin CHAR(4) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    mileage_range VARCHAR(50) NOT NULL,
    previous_owners INTEGER NOT NULL DEFAULT 0,
    fuel_type VARCHAR(50) NOT NULL,
    transmission VARCHAR(50) NOT NULL,
    body_type VARCHAR(50) NOT NULL,
    exterior_color VARCHAR(50) NOT NULL,
    interior_color VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Add constraints
    CONSTRAINT pin_format CHECK (pin ~ '^\d{4}$'),
    CONSTRAINT valid_year CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    CONSTRAINT valid_price CHECK (price > 0),
    CONSTRAINT valid_previous_owners CHECK (previous_owners >= 0),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'sold'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_cars_pin ON user_cars_new(pin);
CREATE INDEX IF NOT EXISTS idx_user_cars_status ON user_cars_new(status);
CREATE INDEX IF NOT EXISTS idx_user_cars_brand ON user_cars_new(brand);

-- Copy data if old table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'user_cars') THEN
        INSERT INTO user_cars_new (
            id, seller_name, pin, brand, model, year, price, 
            mileage_range, previous_owners, fuel_type, transmission,
            body_type, exterior_color, interior_color, status,
            created_at, updated_at
        )
        SELECT 
            id, seller_name, COALESCE(pin, '0000'), brand, model, year, price,
            mileage_range, previous_owners, fuel_type, transmission,
            body_type, exterior_color, interior_color, status,
            created_at, updated_at
        FROM user_cars;
    END IF;
END $$;

-- Drop old table and rename new one
DROP TABLE IF EXISTS user_cars CASCADE;
ALTER TABLE user_cars_new RENAME TO user_cars;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_cars_updated_at
    BEFORE UPDATE ON user_cars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE user_cars ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view approved cars"
    ON user_cars FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Users can manage their cars"
    ON user_cars
    USING (pin = current_setting('app.current_pin', true))
    WITH CHECK (pin = current_setting('app.current_pin', true));

-- Create helper functions
CREATE OR REPLACE FUNCTION authenticate_car_owner(car_id UUID, pin TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_cars
        WHERE id = car_id
        AND pin = pin
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION set_current_pin(pin TEXT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_pin', pin, false);
END;
$$ LANGUAGE plpgsql;