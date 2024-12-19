-- Create dealers table
CREATE TABLE dealers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    pin CHAR(4) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Add constraints
    CONSTRAINT valid_phone CHECK (phone ~ '^[+]?[0-9\s()-]+$'),
    CONSTRAINT valid_pin CHECK (pin ~ '^\d{4}$')
);

-- Create index for phone number
CREATE INDEX idx_dealers_phone ON dealers(phone);

-- Enable RLS
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view dealers"
    ON dealers FOR SELECT
    USING (true);

CREATE POLICY "Admin can manage dealers"
    ON dealers
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_dealers_updated_at
    BEFORE UPDATE ON dealers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample dealers
INSERT INTO dealers (name, phone, pin, email) VALUES
    ('Premium Motors', '+44 20 1234 5678', '5678', 'sales@premiummotors.com'),
    ('AutoMax Dealers', '+44 20 8765 4321', '4321', 'sales@automax.com'),
    ('Elite Cars', '+44 20 2468 1357', '1357', 'sales@elitecars.com');