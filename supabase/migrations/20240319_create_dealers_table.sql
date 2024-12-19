-- Create dealers table
CREATE TABLE dealers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add dealer_id to dealer_cars table
ALTER TABLE dealer_cars
ADD COLUMN dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE;

-- Create updated_at trigger
CREATE TRIGGER update_dealers_updated_at
    BEFORE UPDATE ON dealers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view dealers"
    ON dealers FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage dealers"
    ON dealers
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Insert some sample dealers
INSERT INTO dealers (name, phone, whatsapp, email) VALUES
    ('Premium Motors', '+44 20 1234 5678', '+44 7700 900123', 'sales@premiummotors.com'),
    ('AutoMax Dealers', '+44 20 8765 4321', '+44 7700 900456', 'sales@automax.com'),
    ('Elite Cars', '+44 20 2468 1357', '+44 7700 900789', 'sales@elitecars.com');