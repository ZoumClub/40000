-- First create the new enum type
DO $$ BEGIN
    CREATE TYPE car_status AS ENUM ('draft', 'pending', 'approved', 'sold');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add temporary column with new type
ALTER TABLE dealer_cars 
ADD COLUMN status_new car_status;

-- Convert existing status values to new enum
UPDATE dealer_cars SET 
    status_new = CASE 
        WHEN status = 'pending' THEN 'pending'::car_status
        WHEN status = 'approved' THEN 'approved'::car_status
        WHEN status = 'rejected' THEN 'pending'::car_status
        WHEN status = 'sold' THEN 'sold'::car_status
        ELSE 'pending'::car_status
    END;

-- Drop old column and constraints
ALTER TABLE dealer_cars 
DROP COLUMN status CASCADE;

-- Rename new column and set constraints
ALTER TABLE dealer_cars 
ALTER COLUMN status_new SET NOT NULL,
ALTER COLUMN status_new SET DEFAULT 'pending'::car_status;

ALTER TABLE dealer_cars 
RENAME COLUMN status_new TO status;

-- Add constraint to ensure valid status transitions
CREATE OR REPLACE FUNCTION validate_car_status_transition()
RETURNS TRIGGER AS $$
BEGIN
    -- Allow any transition to 'sold'
    IF NEW.status = 'sold' THEN
        RETURN NEW;
    END IF;

    -- Prevent changing status once sold
    IF OLD.status = 'sold' THEN
        RAISE EXCEPTION 'Cannot change status of sold cars';
    END IF;

    -- Allow normal status progression
    IF (OLD.status = 'draft' AND NEW.status IN ('pending', 'approved')) OR
       (OLD.status = 'pending' AND NEW.status = 'approved') OR
       (OLD.status = 'approved' AND NEW.status = 'sold') THEN
        RETURN NEW;
    END IF;

    RAISE EXCEPTION 'Invalid status transition from % to %', OLD.status, NEW.status;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status transitions
DROP TRIGGER IF EXISTS car_status_transition ON dealer_cars;
CREATE TRIGGER car_status_transition
    BEFORE UPDATE OF status ON dealer_cars
    FOR EACH ROW
    EXECUTE FUNCTION validate_car_status_transition();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dealer_cars_status ON dealer_cars(status);
CREATE INDEX IF NOT EXISTS idx_dealer_cars_dealer_status ON dealer_cars(dealer_id, status);