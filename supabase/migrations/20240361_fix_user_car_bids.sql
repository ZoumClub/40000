-- Drop existing bids table if exists
DROP TABLE IF EXISTS bids CASCADE;

-- Create user_car_bids table
CREATE TABLE user_car_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES user_cars(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES dealers(id),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure unique active bids per dealer/car combination
    CONSTRAINT unique_active_bid UNIQUE (car_id, dealer_id) 
        WHERE status = 'pending'
);

-- Create indexes
CREATE INDEX idx_user_car_bids_car ON user_car_bids(car_id);
CREATE INDEX idx_user_car_bids_dealer ON user_car_bids(dealer_id);
CREATE INDEX idx_user_car_bids_status ON user_car_bids(status);

-- Enable RLS
ALTER TABLE user_car_bids ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Dealers can view their own bids"
    ON user_car_bids FOR SELECT
    USING (dealer_id = auth.uid());

CREATE POLICY "Dealers can create bids"
    ON user_car_bids FOR INSERT
    WITH CHECK (
        dealer_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_cars
            WHERE id = car_id
            AND status = 'approved'
        )
    );

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
        WHERE id = NEW.car_id;
        
        -- Reject other pending bids
        UPDATE user_car_bids
        SET status = 'rejected'
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
CREATE OR REPLACE FUNCTION update_bid_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamps
CREATE TRIGGER update_bid_timestamp
    BEFORE UPDATE ON user_car_bids
    FOR EACH ROW
    EXECUTE FUNCTION update_bid_timestamp();