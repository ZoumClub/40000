-- Add missing columns to car_media table
ALTER TABLE car_media 
ADD COLUMN IF NOT EXISTS path TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS bucket_id TEXT NOT NULL DEFAULT 'car-media';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_car_media_car_id ON car_media(car_id);
CREATE INDEX IF NOT EXISTS idx_car_media_type ON car_media(media_type);

-- Add constraints
ALTER TABLE car_media
ADD CONSTRAINT car_media_path_check CHECK (path ~ '^[a-zA-Z0-9\-\_\/\.]+$'),
ADD CONSTRAINT car_media_bucket_check CHECK (bucket_id IN ('car-media'));

-- Update existing records if any
UPDATE car_media 
SET path = url, bucket_id = 'car-media'
WHERE path IS NULL;