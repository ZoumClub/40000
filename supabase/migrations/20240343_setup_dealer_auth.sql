-- Drop existing functions and triggers
DROP FUNCTION IF EXISTS authenticate_dealer CASCADE;
DROP FUNCTION IF EXISTS hash_pin CASCADE;

-- Create extension for password hashing if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create function to hash PIN
CREATE OR REPLACE FUNCTION hash_pin(pin TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(pin, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update dealers table
ALTER TABLE dealers 
DROP COLUMN IF EXISTS pin CASCADE;

ALTER TABLE dealers
ADD COLUMN hashed_pin TEXT,
ADD COLUMN auth_token TEXT,
ADD COLUMN last_login TIMESTAMPTZ;

-- Create function to authenticate dealer
CREATE OR REPLACE FUNCTION authenticate_dealer(
    dealer_name TEXT,
    pin TEXT
) RETURNS TABLE (
    id UUID,
    name TEXT,
    email TEXT,
    phone TEXT,
    auth_token TEXT
) AS $$
DECLARE
    v_dealer_id UUID;
    v_auth_token TEXT;
BEGIN
    -- Find dealer by first name and verify PIN
    SELECT d.id INTO v_dealer_id
    FROM dealers d
    WHERE LOWER(SPLIT_PART(d.name, ' ', 1)) = LOWER(dealer_name)
    AND d.hashed_pin = crypt(pin, d.hashed_pin);

    IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'Invalid credentials';
    END IF;

    -- Generate auth token
    SELECT encode(gen_random_bytes(32), 'base64') INTO v_auth_token;

    -- Update dealer with new auth token and last login
    UPDATE dealers
    SET 
        auth_token = v_auth_token,
        last_login = NOW()
    WHERE id = v_dealer_id;

    -- Return dealer info with auth token
    RETURN QUERY
    SELECT 
        d.id,
        d.name,
        d.email,
        d.phone,
        d.auth_token
    FROM dealers d
    WHERE d.id = v_dealer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate dealer token
CREATE OR REPLACE FUNCTION validate_dealer_token(token TEXT)
RETURNS UUID AS $$
DECLARE
    v_dealer_id UUID;
BEGIN
    SELECT id INTO v_dealer_id
    FROM dealers
    WHERE auth_token = token
    AND last_login > NOW() - INTERVAL '24 hours';

    IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'Invalid or expired token';
    END IF;

    RETURN v_dealer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to invalidate dealer token
CREATE OR REPLACE FUNCTION invalidate_dealer_token(dealer_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE dealers
    SET auth_token = NULL
    WHERE id = dealer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing dealers with hashed PINs from last 4 digits of phone
UPDATE dealers d
SET hashed_pin = hash_pin(RIGHT(REGEXP_REPLACE(d.phone, '[^0-9]', '', 'g'), 4))
WHERE hashed_pin IS NULL;

-- Create RLS policies
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Dealers can view their own data" ON dealers;
CREATE POLICY "Dealers can view their own data"
    ON dealers FOR SELECT
    USING (
        id = validate_dealer_token(current_setting('request.header.authorization', true))::UUID
        OR auth.role() = 'authenticated'
    );

DROP POLICY IF EXISTS "Dealers can update their own data" ON dealers;
CREATE POLICY "Dealers can update their own data"
    ON dealers FOR UPDATE
    USING (id = validate_dealer_token(current_setting('request.header.authorization', true))::UUID)
    WITH CHECK (id = validate_dealer_token(current_setting('request.header.authorization', true))::UUID);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dealers_auth_token ON dealers(auth_token);
CREATE INDEX IF NOT EXISTS idx_dealers_last_login ON dealers(last_login);

-- Add constraint to ensure phone numbers are unique
ALTER TABLE dealers
ADD CONSTRAINT dealers_phone_unique UNIQUE (phone);