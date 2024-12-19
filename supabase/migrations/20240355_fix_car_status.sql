-- Drop existing enum if exists
DROP TYPE IF EXISTS car_status CASCADE;

-- Create new enum type
CREATE TYPE car_status AS ENUM ('pending', 'approved', 'rejected', 'sold');

-- Update dealer_cars table
ALTER TABLE dealer_cars
ALTER COLUMN status TYPE car_status USING status::text::car_status;

-- Add default constraint
ALTER TABLE dealer_cars
ALTER COLUMN status SET DEFAULT 'pending'::car_status;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_dealer_cars_status ON dealer_cars(status);