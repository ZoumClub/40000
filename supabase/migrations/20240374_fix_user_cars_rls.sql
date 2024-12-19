-- Drop existing RLS policies
DROP POLICY IF EXISTS "Public can view all cars" ON user_cars;
DROP POLICY IF EXISTS "Users can manage their cars" ON user_cars;
DROP POLICY IF EXISTS "Anyone can view car features" ON user_car_features;
DROP POLICY IF EXISTS "Users can manage their car features" ON user_car_features;
DROP POLICY IF EXISTS "Dealers can view their own bids" ON user_car_bids;
DROP POLICY IF EXISTS "Dealers can create bids" ON user_car_bids;

-- Create new RLS policies
CREATE POLICY "Public can view all cars"
    ON user_cars FOR SELECT
    USING (true);

CREATE POLICY "Users can insert cars"
    ON user_cars FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their cars"
    ON user_cars FOR UPDATE
    USING (pin = current_setting('app.current_pin', true))
    WITH CHECK (pin = current_setting('app.current_pin', true));

CREATE POLICY "Users can delete their cars"
    ON user_cars FOR DELETE
    USING (pin = current_setting('app.current_pin', true));

-- Features policies
CREATE POLICY "Anyone can view car features"
    ON user_car_features FOR SELECT
    USING (true);

CREATE POLICY "Users can insert car features"
    ON user_car_features FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM user_cars
        WHERE user_cars.id = car_id
        AND user_cars.pin = current_setting('app.current_pin', true)
    ));

-- Bids policies
CREATE POLICY "Anyone can view bids"
    ON user_car_bids FOR SELECT
    USING (true);

CREATE POLICY "Dealers can create bids"
    ON user_car_bids FOR INSERT
    WITH CHECK (dealer_id = auth.uid());

-- Grant necessary permissions
GRANT ALL ON user_cars TO authenticated;
GRANT ALL ON user_car_features TO authenticated;
GRANT ALL ON user_car_bids TO authenticated;