-- Add sold status to car tables
ALTER TABLE dealer_cars
ALTER COLUMN status TYPE VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'sold'));

ALTER TABLE user_cars
ALTER COLUMN status TYPE VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'sold'));

-- Add dealer_id to dealer_cars if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'dealer_cars' 
                  AND column_name = 'dealer_id') THEN
        ALTER TABLE dealer_cars
        ADD COLUMN dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add savings field to dealer_cars
ALTER TABLE dealer_cars
ADD COLUMN IF NOT EXISTS savings DECIMAL(12, 2) CHECK (savings >= 0);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dealer_cars_dealer ON dealer_cars(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_cars_status ON dealer_cars(status);
CREATE INDEX IF NOT EXISTS idx_user_cars_status ON user_cars(status);

-- Update RLS policies for dealer_cars
DROP POLICY IF EXISTS "Dealers can manage their cars" ON dealer_cars;
CREATE POLICY "Dealers can manage their cars"
    ON dealer_cars
    USING (dealer_id = auth.uid())
    WITH CHECK (dealer_id = auth.uid());

-- Update RLS policies for user_cars
DROP POLICY IF EXISTS "Dealers can view approved user cars" ON user_cars;
CREATE POLICY "Dealers can view approved user cars"
    ON user_cars FOR SELECT
    USING (status = 'approved');