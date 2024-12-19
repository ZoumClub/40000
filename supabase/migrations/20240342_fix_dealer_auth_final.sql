-- Drop existing functions
DROP FUNCTION IF EXISTS authenticate_dealer;

-- Create function to hash PIN
CREATE OR REPLACE FUNCTION hash_pin(pin TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(pin, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql;

-- Update dealers table to store hashed PIN
ALTER TABLE dealers 
ADD COLUMN IF NOT EXISTS hashed_pin TEXT;

-- Update existing dealers with hashed PINs
UPDATE dealers 
SET hashed_pin = hash_pin(pin)
WHERE hashed_pin IS NULL;

-- Create authentication function
CREATE OR REPLACE FUNCTION authenticate_dealer(dealer_name TEXT, pin TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    email TEXT,
    phone TEXT,
    auth_token TEXT
) AS $$
DECLARE
    v_dealer_id UUID;
BEGIN
    -- Find dealer by first name and PIN
    SELECT d.id INTO v_dealer_id
    FROM dealers d
    WHERE LOWER(SPLIT_PART(d.name, ' ', 1)) = LOWER(dealer_name)
    AND d.hashed_pin = crypt(pin, d.hashed_pin);

    IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'Invalid credentials';
    END IF;

    -- Return dealer info with auth token
    RETURN QUERY
    SELECT 
        d.id,
        d.name,
        d.email,
        d.phone,
        auth.sign(
            json_build_object(
                'role', 'dealer',
                'user_id', d.id,
                'exp', extract(epoch from (now() + interval '1 day'))::integer
            ),
            current_setting('app.jwt_secret')
        ) as auth_token
    FROM dealers d
    WHERE d.id = v_dealer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealers can view their own data"
    ON dealers FOR SELECT
    USING (id = auth.uid() OR auth.role() = 'authenticated');

CREATE POLICY "Dealers can update their own data"
    ON dealers FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());