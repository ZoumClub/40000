-- Add PIN column to user_cars table
ALTER TABLE user_cars
ADD COLUMN pin CHAR(4) NOT NULL CHECK (pin ~ '^\d{4}$');

-- Create index for PIN lookups
CREATE INDEX idx_user_cars_pin ON user_cars(pin);

-- Update RLS policies to allow PIN-based access
DROP POLICY IF EXISTS "Users can manage their cars" ON user_cars;
CREATE POLICY "Users can manage their cars"
    ON user_cars
    USING (pin = current_setting('app.current_pin', true))
    WITH CHECK (pin = current_setting('app.current_pin', true));

-- Create function to authenticate user car access
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

-- Create function to set current PIN
CREATE OR REPLACE FUNCTION set_current_pin(pin TEXT)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_pin', pin, false);
END;
$$ LANGUAGE plpgsql;