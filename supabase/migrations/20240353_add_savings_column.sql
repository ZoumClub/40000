-- Add savings column to dealer_cars table
ALTER TABLE dealer_cars
ADD COLUMN IF NOT EXISTS savings DECIMAL(12, 2) CHECK (savings >= 0);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_dealer_cars_savings ON dealer_cars(savings);

-- Update existing records to have 0 savings
UPDATE dealer_cars 
SET savings = 0 
WHERE savings IS NULL;