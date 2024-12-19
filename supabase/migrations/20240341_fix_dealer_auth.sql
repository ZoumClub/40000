-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_dealer_created ON dealers;
DROP FUNCTION IF EXISTS create_dealer_auth_user();
DROP FUNCTION IF EXISTS dealer_login();

-- Add PIN column if not exists
ALTER TABLE dealers 
ADD COLUMN IF NOT EXISTS pin CHAR(4) NOT NULL DEFAULT '0000'
CHECK (pin ~ '^\d{4}$');

-- Create function to get PIN from phone number
CREATE OR REPLACE FUNCTION get_pin_from_phone(phone_number TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Extract last 4 digits
    RETURN RIGHT(REGEXP_REPLACE(phone_number, '[^0-9]', '', 'g'), 4);
END;
$$ LANGUAGE plpgsql;

-- Update existing dealers with PIN from phone
UPDATE dealers 
SET pin = get_pin_from_phone(phone)
WHERE pin = '0000';

-- Create function to handle dealer authentication
CREATE OR REPLACE FUNCTION authenticate_dealer(dealer_name TEXT, pin TEXT)
RETURNS TABLE (
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

-- Create RLS policies for dealers
DROP POLICY IF EXISTS "Dealers can view their own data" ON dealers;
CREATE POLICY "Dealers can view their own data"
    ON dealers FOR SELECT
    USING (id = auth.uid());

DROP POLICY IF EXISTS "Dealers can update their own data" ON dealers;
CREATE POLICY "Dealers can update their own data"
    ON dealers FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());