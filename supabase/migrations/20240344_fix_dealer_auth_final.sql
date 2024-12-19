-- Drop existing functions and triggers
DROP FUNCTION IF EXISTS authenticate_dealer CASCADE;
DROP FUNCTION IF EXISTS hash_pin CASCADE;

-- Create extension for password hashing if not exists
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update dealers table
ALTER TABLE dealers 
DROP COLUMN IF EXISTS pin CASCADE;

ALTER TABLE dealers
ADD COLUMN pin CHAR(4) NOT NULL DEFAULT '0000' CHECK (pin ~ '^\d{4}$'),
ADD COLUMN last_login TIMESTAMPTZ;

-- Create function to authenticate dealer
CREATE OR REPLACE FUNCTION authenticate_dealer(
    dealer_name TEXT,
    pin TEXT
) RETURNS TABLE (
    id UUID,
    name TEXT,
    email TEXT,
    phone TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.name,
        d.email,
        d.phone
    FROM dealers d
    WHERE LOWER(SPLIT_PART(d.name, ' ', 1)) = LOWER(dealer_name)
    AND d.pin = pin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing dealers with PIN from phone
UPDATE dealers d
SET pin = RIGHT(REGEXP_REPLACE(d.phone, '[^0-9]', '', 'g'), 4)
WHERE pin = '0000';

-- Create RLS policies
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Dealers can view their own data" ON dealers;
CREATE POLICY "Dealers can view their own data"
    ON dealers FOR SELECT
    USING (id = auth.uid() OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Dealers can update their own data" ON dealers;
CREATE POLICY "Dealers can update their own data"
    ON dealers FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Add constraint to ensure phone numbers are unique
ALTER TABLE dealers
ADD CONSTRAINT dealers_phone_unique UNIQUE (phone);