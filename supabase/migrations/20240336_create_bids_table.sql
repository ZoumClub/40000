-- Create bids table
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES user_cars(id) ON DELETE CASCADE,
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Add constraints
    CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Create indexes
CREATE INDEX idx_bids_car ON bids(car_id);
CREATE INDEX idx_bids_dealer ON bids(dealer_id);
CREATE INDEX idx_bids_status ON bids(status);

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

-- Create trigger for updated_at
CREATE TRIGGER update_bids_updated_at
    BEFORE UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();