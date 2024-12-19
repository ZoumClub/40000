-- Create separate tables for each car type's features
CREATE TABLE user_car_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES user_cars(id) ON DELETE CASCADE,
    feature VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (car_id, feature)
);

CREATE TABLE dealer_car_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES dealer_cars(id) ON DELETE CASCADE,
    feature VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (car_id, feature)
);

-- Create view to unify features
CREATE OR REPLACE VIEW car_features AS
    SELECT 
        id,
        'user_car' as car_type,
        car_id,
        feature,
        created_at
    FROM user_car_features
    UNION ALL
    SELECT 
        id,
        'dealer_car' as car_type,
        car_id,
        feature,
        created_at
    FROM dealer_car_features;

-- Create indexes
CREATE INDEX idx_user_car_features_car_id ON user_car_features(car_id);
CREATE INDEX idx_dealer_car_features_car_id ON dealer_car_features(car_id);

-- Enable RLS
ALTER TABLE user_car_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_car_features ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view user car features"
    ON user_car_features FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view dealer car features"
    ON dealer_car_features FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage dealer car features"
    ON dealer_car_features
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can manage their car features"
    ON user_car_features
    USING (true)
    WITH CHECK (true);

-- Create function to handle feature insertions
CREATE OR REPLACE FUNCTION insert_car_feature(
    p_car_type VARCHAR,
    p_car_id UUID,
    p_feature VARCHAR
) RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_car_type = 'user_car' THEN
        INSERT INTO user_car_features (car_id, feature)
        VALUES (p_car_id, p_feature)
        RETURNING id INTO v_id;
    ELSIF p_car_type = 'dealer_car' THEN
        INSERT INTO dealer_car_features (car_id, feature)
        VALUES (p_car_id, p_feature)
        RETURNING id INTO v_id;
    ELSE
        RAISE EXCEPTION 'Invalid car type: %', p_car_type;
    END IF;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;