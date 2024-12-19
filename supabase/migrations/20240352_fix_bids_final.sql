-- Drop existing tables and constraints
DROP TABLE IF EXISTS bids CASCADE;
DROP TABLE IF EXISTS car_sales CASCADE;

-- Create car_sales table
CREATE TABLE car_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL,
    dealer_id UUID NOT NULL REFERENCES dealers(id),
    sale_price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2) NOT NULL,
    savings DECIMAL(12, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT positive_prices CHECK (
        sale_price > 0 AND 
        original_price > 0 AND 
        (savings IS NULL OR savings >= 0)
    )
);

-- Create bids table
CREATE TABLE bids (
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
CREATE INDEX idx_bids_car ON bids(car_id);
CREATE INDEX idx_bids_dealer ON bids(dealer_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_car_sales_dealer ON car_sales(dealer_id);

-- Create partial index for unique active bids
CREATE UNIQUE INDEX idx_unique_active_bid 
ON bids (car_id, dealer_id) 
WHERE status = 'pending';

-- Enable RLS
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Dealers can view their own bids"
    ON bids FOR SELECT
    USING (dealer_id = auth.uid());

CREATE POLICY "Dealers can create bids"
    ON bids FOR INSERT
    WITH CHECK (
        dealer_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM user_cars
            WHERE id = car_id
            AND status = 'approved'
        )
    );

CREATE POLICY "Dealers can update their own bids"
    ON bids FOR UPDATE
    USING (dealer_id = auth.uid());

CREATE POLICY "Dealers can view their sales"
    ON car_sales FOR SELECT
    USING (dealer_id = auth.uid());

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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating timestamps
CREATE TRIGGER update_bid_timestamp
    BEFORE UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Create function to validate bid
CREATE OR REPLACE FUNCTION validate_bid()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if car is available for bidding
    IF NOT EXISTS (
        SELECT 1 FROM user_cars
        WHERE id = NEW.car_id
        AND status = 'approved'
    ) THEN
        RAISE EXCEPTION 'Car is not available for bidding';
    END IF;

    -- Check if dealer already has an active bid
    IF TG_OP = 'INSERT' AND EXISTS (
        SELECT 1 FROM bids
        WHERE car_id = NEW.car_id
        AND dealer_id = NEW.dealer_id
        AND status = 'pending'
    ) THEN
        RAISE EXCEPTION 'Dealer already has an active bid on this car';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bid validation
CREATE TRIGGER validate_bid
    BEFORE INSERT OR UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION validate_bid();