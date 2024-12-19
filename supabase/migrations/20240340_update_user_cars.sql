-- Add sold status to user_cars
ALTER TABLE user_cars
DROP CONSTRAINT IF EXISTS user_cars_status_check;

ALTER TABLE user_cars
ADD CONSTRAINT user_cars_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'sold'));

-- Create bids table if not exists
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES user_cars(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES dealers(id),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bids_car ON bids(car_id);
CREATE INDEX IF NOT EXISTS idx_bids_dealer ON bids(dealer_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);

-- Enable RLS
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Dealers can view their own bids"
    ON bids FOR SELECT
    USING (dealer_id = auth.uid());

CREATE POLICY "Dealers can create bids"
    ON bids FOR INSERT
    WITH CHECK (dealer_id = auth.uid());

CREATE POLICY "Car owners can view bids on their cars"
    ON bids FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_cars
        WHERE user_cars.id = car_id
        AND user_cars.seller_id = auth.uid()
    ));

-- Create function to handle bid acceptance
CREATE OR REPLACE FUNCTION handle_bid_acceptance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        -- Mark car as sold
        UPDATE user_cars
        SET status = 'sold'
        WHERE id = NEW.car_id;
        
        -- Reject other pending bids
        UPDATE bids
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
    AFTER UPDATE ON bids
    FOR EACH ROW
    WHEN (NEW.status = 'accepted' AND OLD.status = 'pending')
    EXECUTE FUNCTION handle_bid_acceptance();