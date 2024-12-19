-- Create storage bucket for car media if not exists
INSERT INTO storage.buckets (id, name)
VALUES ('car-media', 'car-media')
ON CONFLICT (id) DO NOTHING;

-- Drop existing dealer_car_media table
DROP TABLE IF EXISTS dealer_car_media CASCADE;

-- Create dealer_car_media table
CREATE TABLE dealer_car_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES dealer_cars(id) ON DELETE CASCADE,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image', 'video')),
    url TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure valid positions for images (0-2) and video (0)
    CONSTRAINT valid_position CHECK (
        (media_type = 'image' AND position >= 0 AND position <= 2) OR
        (media_type = 'video' AND position = 0)
    ),
    
    -- Ensure unique positions per car and media type
    UNIQUE (car_id, media_type, position)
);

-- Create indexes
CREATE INDEX idx_dealer_car_media_car ON dealer_car_media(car_id);
CREATE INDEX idx_dealer_car_media_type ON dealer_car_media(media_type);

-- Enable RLS
ALTER TABLE dealer_car_media ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view car media"
    ON dealer_car_media FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage car media"
    ON dealer_car_media
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Create storage policies
CREATE POLICY "Public read access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'car-media');

CREATE POLICY "Admin upload access"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'car-media' AND
        auth.role() = 'admin'
    );

CREATE POLICY "Admin delete access"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'car-media' AND
        auth.role() = 'admin'
    );