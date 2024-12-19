-- Create features table
CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create junction tables
CREATE TABLE dealer_car_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES dealer_cars(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (car_id, feature_id)
);

CREATE TABLE user_car_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES user_cars(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (car_id, feature_id)
);

-- Create indexes
CREATE INDEX idx_dealer_car_features_car ON dealer_car_features(car_id);
CREATE INDEX idx_user_car_features_car ON user_car_features(car_id);
CREATE INDEX idx_features_category ON features(category);

-- Enable RLS
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_car_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_car_features ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view features"
    ON features FOR SELECT USING (true);

CREATE POLICY "Only admins can manage features"
    ON features USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Anyone can view dealer car features"
    ON dealer_car_features FOR SELECT USING (true);

CREATE POLICY "Only admins can manage dealer car features"
    ON dealer_car_features USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Anyone can view user car features"
    ON user_car_features FOR SELECT USING (true);

CREATE POLICY "Users can manage their car features"
    ON user_car_features FOR ALL USING (true);

-- Insert default features
INSERT INTO features (name, category) VALUES
    ('Air Conditioning', 'Comfort'),
    ('Bluetooth', 'Technology'),
    ('Cruise Control', 'Safety'),
    ('Leather Seats', 'Interior'),
    ('Navigation System', 'Technology'),
    ('Parking Sensors', 'Safety'),
    ('Sunroof', 'Comfort'),
    ('Backup Camera', 'Safety'),
    ('Heated Seats', 'Comfort'),
    ('Keyless Entry', 'Convenience');