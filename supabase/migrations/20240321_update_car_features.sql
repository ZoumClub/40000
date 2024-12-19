-- Drop existing car_features table
DROP TABLE IF EXISTS car_features;

-- Create new car_features table with polymorphic associations
CREATE TABLE car_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_type VARCHAR(20) NOT NULL CHECK (car_type IN ('user_car', 'dealer_car')),
    car_id UUID NOT NULL,
    feature VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Add foreign key constraints with ON DELETE CASCADE
    CONSTRAINT fk_user_car
        FOREIGN KEY (car_id)
        REFERENCES user_cars(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_dealer_car
        FOREIGN KEY (car_id)
        REFERENCES dealer_cars(id)
        ON DELETE CASCADE,
        
    -- Add check constraint for car type validation
    CONSTRAINT valid_car_reference CHECK (
        (car_type = 'user_car' AND EXISTS (
            SELECT 1 FROM user_cars WHERE id = car_id
        )) OR
        (car_type = 'dealer_car' AND EXISTS (
            SELECT 1 FROM dealer_cars WHERE id = car_id
        ))
    ),
        
    -- Ensure unique features per car
    UNIQUE (car_type, car_id, feature)
);

-- Create indexes for better query performance
CREATE INDEX idx_car_features_user_car ON car_features(car_id) WHERE car_type = 'user_car';
CREATE INDEX idx_car_features_dealer_car ON car_features(car_id) WHERE car_type = 'dealer_car';

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