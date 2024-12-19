-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_car_bids CASCADE;
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
    approval_status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    availability_status VARCHAR(20) NOT NULL DEFAULT 'available'
        CHECK (availability_status IN ('available', 'sold')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_car_bids table
CREATE TABLE user_car_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES user_cars(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES dealers(id),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_cars_pin ON user_cars(pin);
CREATE INDEX idx_user_cars_approval ON user_cars(approval_status);
CREATE INDEX idx_user_cars_availability ON user_cars(availability_status);
CREATE INDEX idx_user_car_bids_car ON user_car_bids(car_id);
CREATE INDEX idx_user_car_bids_dealer ON user_car_bids(dealer_id);
CREATE INDEX idx_user_car_bids_status ON user_car_bids(status);

-- Create unique index for active bids
CREATE UNIQUE INDEX idx_unique_active_bid 
ON user_car_bids (car_id, dealer_id) 
WHERE status = 'pending';

-- Enable RLS
ALTER TABLE user_cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_car_bids ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view approved cars"
    ON user_cars FOR SELECT
    USING (
        approval_status = 'approved' AND 
        availability_status = 'available'
    );

CREATE POLICY "Users can manage their cars"
    ON user_cars
    USING (pin = current_setting('app.current_pin', true))
    WITH CHECK (pin = current_setting('app.current_pin', true));

CREATE POLICY "Dealers can view their own bids"
    ON user_car_bids FOR SELECT
    USING (dealer_id = auth.uid());

CREATE POLICY "Car owners can view bids on their cars"
    ON user_car_bids FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_cars
        WHERE user_cars.id = car_id
        AND user_cars.pin = current_setting('app.current_pin', true)
    ));

-- Create function to handle bid acceptance
CREATE OR REPLACE FUNCTION handle_bid_acceptance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        -- Mark car as sold
        UPDATE user_cars
        SET availability_status = 'sold'
        WHERE id = NEW.car_id
        AND availability_status = 'available';
        
        -- Reject other pending bids
        UPDATE user_car_bids
        SET 
            status = 'rejected',
            updated_at = NOW()
        WHERE car_id = NEW.car_id
        AND id != NEW.id
        AND status = 'pending';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bid acceptance
CREATE TRIGGER on_bid_accepted
    AFTER UPDATE ON user_car_bids
    FOR EACH ROW
    WHEN (NEW.status = 'accepted' AND OLD.status = 'pending')
    EXECUTE FUNCTION handle_bid_acceptance();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_user_car_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_user_car_timestamp
    BEFORE UPDATE ON user_cars
    FOR EACH ROW
    EXECUTE FUNCTION update_user_car_timestamp();

CREATE TRIGGER update_user_car_bid_timestamp
    BEFORE UPDATE ON user_car_bids
    FOR EACH ROW
    EXECUTE FUNCTION update_user_car_timestamp();