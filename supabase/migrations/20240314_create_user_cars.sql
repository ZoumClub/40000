-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for consistent data
CREATE TYPE car_type AS ENUM ('new', 'used');
CREATE TYPE fuel_type AS ENUM ('Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid');
CREATE TYPE transmission_type AS ENUM ('Automatic', 'Manual', 'Semi-Automatic', 'CVT');
CREATE TYPE body_type AS ENUM ('Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Wagon', 'Van', 'Truck');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Create the main user_cars table
CREATE TABLE user_cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Contact Information
    seller_name VARCHAR(255) NOT NULL,
    pin_code CHAR(4) NOT NULL,
    
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
    
    -- Status and Timestamps
    status approval_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Validation Constraints
    CONSTRAINT year_check CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM NOW()) + 1),
    CONSTRAINT price_check CHECK (price > 0),
    CONSTRAINT previous_owners_check CHECK (previous_owners >= 0)
);

-- Create table for car features (many-to-many relationship)
CREATE TABLE car_features (
    car_id UUID REFERENCES user_cars(id) ON DELETE CASCADE,
    feature VARCHAR(100) NOT NULL,
    PRIMARY KEY (car_id, feature)
);

-- Create table for car media
CREATE TABLE car_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID REFERENCES user_cars(id) ON DELETE CASCADE,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image', 'video')),
    url TEXT NOT NULL,
    position INTEGER CHECK (
        (media_type = 'image' AND position >= 0 AND position <= 2) OR
        (media_type = 'video' AND position = 0)
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (car_id, media_type, position)
);

-- Create indexes for better query performance
CREATE INDEX idx_user_cars_status ON user_cars(status);
CREATE INDEX idx_user_cars_brand ON user_cars(brand);
CREATE INDEX idx_user_cars_created_at ON user_cars(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_cars_updated_at
    BEFORE UPDATE ON user_cars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE user_cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_media ENABLE ROW LEVEL SECURITY;

-- Create policies for user_cars
CREATE POLICY "Public cars are viewable by everyone"
    ON user_cars FOR SELECT
    USING (status = 'approved');

CREATE POLICY "Users can insert their own cars"
    ON user_cars FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update their own cars"
    ON user_cars FOR UPDATE
    USING (pin_code = current_setting('app.user_pin', true));

-- Create policies for car_features
CREATE POLICY "Anyone can view car features"
    ON car_features FOR SELECT
    USING (true);

CREATE POLICY "Users can insert car features"
    ON car_features FOR INSERT
    WITH CHECK (true);

-- Create policies for car_media
CREATE POLICY "Anyone can view car media"
    ON car_media FOR SELECT
    USING (true);

CREATE POLICY "Users can insert car media"
    ON car_media FOR INSERT
    WITH CHECK (true);