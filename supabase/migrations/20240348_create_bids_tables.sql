-- Create bids table
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES user_cars(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Add constraints
    CONSTRAINT positive_bid CHECK (amount > 0),
    CONSTRAINT unique_dealer_bid UNIQUE (car_id, dealer_id)
);

-- Create indexes
CREATE INDEX idx_bids_car ON bids(car_id);
CREATE INDEX idx_bids_dealer ON bids(dealer_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_bids_created ON bids(created_at);

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
    AFTER UPDATE ON bids
    FOR EACH ROW
    WHEN (NEW.status = 'accepted' AND OLD.status = 'pending')
    EXECUTE FUNCTION handle_bid_acceptance();

-- Create function to get latest bid for a car
CREATE OR REPLACE FUNCTION get_latest_bid(car_id UUID, dealer_id UUID)
RETURNS TABLE (
    amount DECIMAL(12, 2),
    status VARCHAR(20),
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT b.amount, b.status, b.created_at
    FROM bids b
    WHERE b.car_id = $1
    AND b.dealer_id = $2
    ORDER BY b.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to get bid statistics
CREATE OR REPLACE FUNCTION get_dealer_bid_stats(dealer_id UUID)
RETURNS TABLE (
    total_bids BIGINT,
    active_bids BIGINT,
    accepted_bids BIGINT,
    rejected_bids BIGINT,
    total_amount DECIMAL(12, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) as total_bids,
        COUNT(*) FILTER (WHERE status = 'pending') as active_bids,
        COUNT(*) FILTER (WHERE status = 'accepted') as accepted_bids,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected_bids,
        SUM(amount) FILTER (WHERE status = 'accepted') as total_amount
    FROM bids
    WHERE dealer_id = $1;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_bid_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bid_timestamp
    BEFORE UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION update_bid_timestamp();