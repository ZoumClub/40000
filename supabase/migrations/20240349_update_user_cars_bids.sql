-- Add seller_id to user_cars if not exists
ALTER TABLE user_cars
ADD COLUMN IF NOT EXISTS seller_id UUID;

-- Create index for seller_id
CREATE INDEX IF NOT EXISTS idx_user_cars_seller ON user_cars(seller_id);

-- Update RLS policies for user_cars
DROP POLICY IF EXISTS "Public can view approved user cars" ON user_cars;
CREATE POLICY "Public can view approved user cars"
    ON user_cars FOR SELECT
    USING (status = 'approved');

DROP POLICY IF EXISTS "Sellers can manage their cars" ON user_cars;
CREATE POLICY "Sellers can manage their cars"
    ON user_cars
    USING (seller_id = auth.uid())
    WITH CHECK (seller_id = auth.uid());

-- Update bids table
ALTER TABLE bids
DROP CONSTRAINT IF EXISTS unique_dealer_bid;

ALTER TABLE bids
ADD CONSTRAINT unique_active_dealer_bid 
    UNIQUE (car_id, dealer_id)
    WHERE status = 'pending';

-- Update RLS policies for bids
DROP POLICY IF EXISTS "Dealers can view their own bids" ON bids;
CREATE POLICY "Dealers can view their own bids"
    ON bids FOR SELECT
    USING (dealer_id = auth.uid());

DROP POLICY IF EXISTS "Dealers can create bids" ON bids;
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

DROP POLICY IF EXISTS "Car owners can view bids on their cars" ON bids;
CREATE POLICY "Car owners can view bids on their cars"
    ON bids FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM user_cars
        WHERE user_cars.id = car_id
        AND user_cars.seller_id = auth.uid()
    ));

-- Create function to validate bid amount
CREATE OR REPLACE FUNCTION validate_bid_amount()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure bid amount is at least 100
    IF NEW.amount < 100 THEN
        RAISE EXCEPTION 'Bid amount must be at least £100';
    END IF;

    -- Ensure dealer can't bid on their own cars
    IF EXISTS (
        SELECT 1 FROM dealer_cars
        WHERE id = NEW.car_id
        AND dealer_id = NEW.dealer_id
    ) THEN
        RAISE EXCEPTION 'Dealers cannot bid on their own cars';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bid validation
CREATE TRIGGER validate_bid
    BEFORE INSERT OR UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION validate_bid_amount();

-- Create function to get bid history
CREATE OR REPLACE FUNCTION get_bid_history(p_car_id UUID)
RETURNS TABLE (
    bid_id UUID,
    dealer_name TEXT,
    amount DECIMAL(12, 2),
    status VARCHAR(20),
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        d.name,
        b.amount,
        b.status,
        b.created_at
    FROM bids b
    JOIN dealers d ON d.id = b.dealer_id
    WHERE b.car_id = p_car_id
    ORDER BY b.created_at DESC;
END;
$$ LANGUAGE plpgsql;