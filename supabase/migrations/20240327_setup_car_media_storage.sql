-- Create storage bucket for car media
CREATE POLICY "Public Access"
ON storage.buckets
FOR SELECT USING (
  bucket_id = 'car-media'
);

CREATE POLICY "Authenticated users can upload car media"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'car-media' AND
  (auth.role() = 'authenticated' OR auth.role() = 'admin')
);

CREATE POLICY "Public can view car media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'car-media');

-- Create dealer_car_media table
CREATE TABLE dealer_car_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES dealer_cars(id) ON DELETE CASCADE,
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('image', 'video')),
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
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

-- Create function to handle media cleanup on car deletion
CREATE OR REPLACE FUNCTION delete_car_media() RETURNS TRIGGER AS $$
BEGIN
    -- Delete media files from storage
    DELETE FROM storage.objects
    WHERE bucket_id = 'car-media'
    AND path LIKE 'cars/' || OLD.id || '/%';
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to cleanup media when car is deleted
CREATE TRIGGER cleanup_car_media
    BEFORE DELETE ON dealer_cars
    FOR EACH ROW
    EXECUTE FUNCTION delete_car_media();