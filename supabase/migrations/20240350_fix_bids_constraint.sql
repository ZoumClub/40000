-- Drop existing unique constraint
ALTER TABLE bids
DROP CONSTRAINT IF EXISTS unique_dealer_bid;

ALTER TABLE bids
DROP CONSTRAINT IF EXISTS unique_active_dealer_bid;

-- Add new unique constraint for active bids
ALTER TABLE bids
ADD CONSTRAINT unique_active_bid 
    UNIQUE (car_id, dealer_id)
    WHERE status = 'pending';

-- Update bid validation function
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

    -- Ensure car is approved and not sold
    IF NOT EXISTS (
        SELECT 1 FROM user_cars
        WHERE id = NEW.car_id
        AND status = 'approved'
    ) THEN
        RAISE EXCEPTION 'Car is not available for bidding';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS validate_bid ON bids;

CREATE TRIGGER validate_bid
    BEFORE INSERT OR UPDATE ON bids
    FOR EACH ROW
    EXECUTE FUNCTION validate_bid_amount();

-- Update RLS policies
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