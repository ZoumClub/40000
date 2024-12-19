-- Drop existing car_features table if exists
DROP TABLE IF EXISTS car_features CASCADE;

-- Create car_features table
CREATE TABLE car_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_type VARCHAR(20) NOT NULL CHECK (car_type IN ('user_car', 'dealer_car')),
    car_id UUID NOT NULL,
    feature VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure unique features per car
    UNIQUE (car_type, car_id, feature)
);

-- Create indexes for better query performance
CREATE INDEX idx_car_features_car_type_id ON car_features(car_type, car_id);

-- Create function to validate car reference
CREATE OR REPLACE FUNCTION validate_car_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.car_type = 'user_car' THEN
        IF NOT EXISTS (SELECT 1 FROM user_cars WHERE id = NEW.car_id) THEN
            RAISE EXCEPTION 'Invalid user_car reference';
        END IF;
    ELSIF NEW.car_type = 'dealer_car' THEN
        IF NOT EXISTS (SELECT 1 FROM dealer_cars WHERE id = NEW.car_id) THEN
            RAISE EXCEPTION 'Invalid dealer_car reference';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for car reference validation
CREATE TRIGGER validate_car_reference_trigger
    BEFORE INSERT OR UPDATE ON car_features
    FOR EACH ROW
    EXECUTE FUNCTION validate_car_reference();

-- Enable RLS
ALTER TABLE car_features ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view car features"
    ON car_features FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage dealer car features"
    ON car_features
    USING (
        (car_type = 'dealer_car' AND auth.jwt() ->> 'role' = 'admin') OR
        (car_type = 'user_car')
    )
    WITH CHECK (
        (car_type = 'dealer_car' AND auth.jwt() ->> 'role' = 'admin') OR
        (car_type = 'user_car')
    );