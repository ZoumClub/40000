-- Create new enum types
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE availability_status AS ENUM ('available', 'sold');

-- Add new columns to dealer_cars
ALTER TABLE dealer_cars
DROP COLUMN IF EXISTS status CASCADE;

ALTER TABLE dealer_cars
ADD COLUMN approval_status approval_status NOT NULL DEFAULT 'pending',
ADD COLUMN availability_status availability_status NOT NULL DEFAULT 'available';

-- Create indexes for better performance
CREATE INDEX idx_dealer_cars_approval ON dealer_cars(approval_status);
CREATE INDEX idx_dealer_cars_availability ON dealer_cars(availability_status);

-- Create function to validate status transitions
CREATE OR REPLACE FUNCTION validate_dealer_car_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent changing approval status of sold cars
    IF OLD.availability_status = 'sold' AND 
       NEW.approval_status != OLD.approval_status THEN
        RAISE EXCEPTION 'Cannot change approval status of sold cars';
    END IF;

    -- Only approved cars can be marked as sold
    IF NEW.availability_status = 'sold' AND 
       NEW.approval_status != 'approved' THEN
        RAISE EXCEPTION 'Only approved cars can be marked as sold';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status validation
CREATE TRIGGER dealer_car_status_validation
    BEFORE UPDATE ON dealer_cars
    FOR EACH ROW
    EXECUTE FUNCTION validate_dealer_car_status();

-- Update RLS policies
DROP POLICY IF EXISTS "Public cars are viewable by everyone" ON dealer_cars;
CREATE POLICY "Public cars are viewable by everyone"
    ON dealer_cars FOR SELECT
    USING (approval_status = 'approved');

-- Create function to mark car as sold
CREATE OR REPLACE FUNCTION mark_car_as_sold(car_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE dealer_cars
    SET availability_status = 'sold'
    WHERE id = car_id
    AND approval_status = 'approved'
    AND availability_status = 'available';
END;
$$ LANGUAGE plpgsql;