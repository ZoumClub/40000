-- Create dealer_cars table
CREATE TABLE dealer_cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Car Information
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    mileage_range VARCHAR(50) NOT NULL,
    previous_owners INTEGER NOT NULL DEFAULT 0,
    
    -- Technical Specifications
    fuel_type fuel_type NOT NULL,
    transmission transmission_type NOT NULL,
    body_type body_type NOT NULL,
    exterior_color VARCHAR(50) NOT NULL,
    interior_color VARCHAR(50) NOT NULL,
    
    -- Features
    features TEXT[] NOT NULL DEFAULT '{}',
    
    -- Status and Type
    type car_type NOT NULL DEFAULT 'new',
    status approval_status NOT NULL DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Validation Constraints
    CONSTRAINT dealer_year_check CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    CONSTRAINT dealer_price_check CHECK (price > 0),
    CONSTRAINT dealer_previous_owners_check CHECK (previous_owners >= 0)
);

-- Create dealer_car_media table
CREATE TABLE dealer_car_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID REFERENCES dealer_cars(id) ON DELETE CASCADE,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image', 'video')),
    url TEXT NOT NULL,
    path TEXT NOT NULL,
    position INTEGER CHECK (
        (media_type = 'image' AND position >= 0 AND position <= 2) OR
        (media_type = 'video' AND position = 0)
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (car_id, media_type, position)
);

-- Create indexes
CREATE INDEX idx_dealer_cars_type ON dealer_cars(type);
CREATE INDEX idx_dealer_cars_status ON dealer_cars(status);
CREATE INDEX idx_dealer_cars_brand ON dealer_cars(brand);
CREATE INDEX idx_dealer_cars_created_at ON dealer_cars(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_dealer_cars_updated_at
    BEFORE UPDATE ON dealer_cars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE dealer_cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_car_media ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public cars are viewable by everyone"
    ON dealer_cars FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Only admins can manage dealer cars"
    ON dealer_cars
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Anyone can view car media"
    ON dealer_car_media FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage car media"
    ON dealer_car_media
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');