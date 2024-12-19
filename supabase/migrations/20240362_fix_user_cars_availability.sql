-- Add availability_status to user_cars if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_cars' 
        AND column_name = 'availability_status') THEN
        
        -- Add availability_status column
        ALTER TABLE user_cars
        ADD COLUMN availability_status VARCHAR(20) NOT NULL DEFAULT 'available'
        CHECK (availability_status IN ('available', 'sold'));

        -- Create index
        CREATE INDEX idx_user_cars_availability 
        ON user_cars(availability_status);
    END IF;
END $$;

-- Update existing records
UPDATE user_cars
SET availability_status = 
    CASE 
        WHEN status = 'sold' THEN 'sold'
        ELSE 'available'
    END
WHERE availability_status IS NULL;

-- Update RLS policies
DROP POLICY IF EXISTS "Public can view approved cars" ON user_cars;
CREATE POLICY "Public can view approved cars"
    ON user_cars FOR SELECT
    USING (
        status = 'approved' AND 
        availability_status = 'available'
    );

-- Update bid handling function
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

-- Update bid validation function
CREATE OR REPLACE FUNCTION validate_bid()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if car is available for bidding
    IF NOT EXISTS (
        SELECT 1 FROM user_cars
        WHERE id = NEW.car_id
        AND status = 'approved'
        AND availability_status = 'available'
    ) THEN
        RAISE EXCEPTION 'Car is not available for bidding';
    END IF;

    -- Check if dealer already has an active bid
    IF TG_OP = 'INSERT' AND EXISTS (
        SELECT 1 FROM user_car_bids
        WHERE car_id = NEW.car_id
        AND dealer_id = NEW.dealer_id
        AND status = 'pending'
    ) THEN
        RAISE EXCEPTION 'Dealer already has an active bid on this car';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;