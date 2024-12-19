-- Drop existing tables
DROP TABLE IF EXISTS user_car_bids CASCADE;
DROP TABLE IF EXISTS user_car_features CASCADE;
DROP TABLE IF EXISTS user_cars CASCADE;

-- Create user_cars table
CREATE TABLE user_cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_name VARCHAR(255) NOT NULL,
    pin CHAR(4) NOT NULL CHECK (pin ~ '^\d{4}$'),
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    price DECIMAL(12, 2) NOT NULL CHECK (price > 0),
    mileage_range VARCHAR(50) NOT NULL,
    previous_owners INTEGER NOT NULL DEFAULT 0 CHECK (previous_owners >= 0),
    fuel_type VARCHAR(50) NOT NULL,
    transmission VARCHAR(50) NOT NULL,
    body_type VARCHAR(50) NOT NULL,
    exterior_color VARCHAR(50) NOT NULL,
    interior_color VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_car_features junction table
CREATE TABLE user_car_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES user_cars(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (car_id, feature_id)
);

-- Create user_car_bids table
CREATE TABLE user_car_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES user_cars(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES dealers(id),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_cars_pin ON user_cars(pin);
CREATE INDEX idx_user_car_features_car ON user_car_features(car_id);
CREATE INDEX idx_user_car_bids_car ON user_car_bids(car_id);
CREATE INDEX idx_user_car_bids_dealer ON user_car_bids(dealer_id);

-- Enable RLS
ALTER TABLE user_cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_car_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_car_bids ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view all cars"
    ON user_cars FOR SELECT
    USING (true);

CREATE POLICY "Users can insert cars"
    ON user_cars FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their cars"
    ON user_cars FOR UPDATE
    USING (pin = current_setting('app.current_pin', true))
    WITH CHECK (pin = current_setting('app.current_pin', true));

CREATE POLICY "Users can delete their cars"
    ON user_cars FOR DELETE
    USING (pin = current_setting('app.current_pin', true));

-- Features policies
CREATE POLICY "Anyone can view car features"
    ON user_car_features FOR SELECT
    USING (true);

CREATE POLICY "Users can insert car features"
    ON user_car_features FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM user_cars
        WHERE user_cars.id = car_id
        AND user_cars.pin = current_setting('app.current_pin', true)
    ));

-- Bids policies
CREATE POLICY "Anyone can view bids"
    ON user_car_bids FOR SELECT
    USING (true);

CREATE POLICY "Dealers can create bids"
    ON user_car_bids FOR INSERT
    WITH CHECK (dealer_id = auth.uid());

-- Grant necessary permissions
GRANT ALL ON user_cars TO authenticated;
GRANT ALL ON user_car_features TO authenticated;
GRANT ALL ON user_car_bids TO authenticated;