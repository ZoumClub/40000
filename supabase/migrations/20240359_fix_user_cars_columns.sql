-- Drop existing columns and constraints
ALTER TABLE user_cars 
DROP COLUMN IF EXISTS pin_code CASCADE,
DROP COLUMN IF EXISTS features CASCADE;

-- Add PIN column with proper constraints
ALTER TABLE user_cars
ADD COLUMN pin CHAR(4) NOT NULL CHECK (pin ~ '^\d{4}$');

-- Create index for PIN lookups
CREATE INDEX IF NOT EXISTS idx_user_cars_pin ON user_cars(pin);

-- Add status column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_cars' AND column_name = 'status') THEN
    ALTER TABLE user_cars 
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'sold'));
  END IF;
END $$;

-- Create function to validate PIN format
CREATE OR REPLACE FUNCTION validate_pin()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.pin !~ '^\d{4}$' THEN
        RAISE EXCEPTION 'PIN must be exactly 4 digits';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for PIN validation
DROP TRIGGER IF EXISTS validate_pin_trigger ON user_cars;
CREATE TRIGGER validate_pin_trigger
    BEFORE INSERT OR UPDATE ON user_cars
    FOR EACH ROW
    EXECUTE FUNCTION validate_pin();

-- Update RLS policies
DROP POLICY IF EXISTS "Users can manage their cars" ON user_cars;
CREATE POLICY "Users can manage their cars"
    ON user_cars
    USING (pin = current_setting('app.current_pin', true))
    WITH CHECK (pin = current_setting('app.current_pin', true));