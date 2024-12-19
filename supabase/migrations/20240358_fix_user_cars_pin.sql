-- Drop existing PIN column if exists
ALTER TABLE user_cars 
DROP COLUMN IF EXISTS pin CASCADE;

-- Add PIN column with proper constraints and default
ALTER TABLE user_cars
ADD COLUMN pin CHAR(4) NOT NULL DEFAULT '0000' CHECK (pin ~ '^\d{4}$');

-- Create index for PIN lookups
CREATE INDEX IF NOT EXISTS idx_user_cars_pin ON user_cars(pin);

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

-- Create helper functions
CREATE OR REPLACE FUNCTION authenticate_car_owner(car_id UUID, pin TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_cars
        WHERE id = car_id
        AND pin = pin
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION set_current_pin(pin TEXT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_pin', pin, false);
END;
$$ LANGUAGE plpgsql;