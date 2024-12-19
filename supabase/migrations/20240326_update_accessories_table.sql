-- Add new columns to accessories table
ALTER TABLE accessories
ADD COLUMN provider_name VARCHAR(255),
ADD COLUMN contact_number VARCHAR(20),
ADD COLUMN whatsapp_number VARCHAR(20);

-- Update existing accessories with default values
UPDATE accessories
SET 
  provider_name = 'AutoMarket Parts',
  contact_number = '+44 20 1234 5678';

-- Make columns non-nullable after update
ALTER TABLE accessories
ALTER COLUMN provider_name SET NOT NULL,
ALTER COLUMN contact_number SET NOT NULL;

-- Add validation constraints
ALTER TABLE accessories
ADD CONSTRAINT valid_contact_number CHECK (contact_number ~ '^[+]?[0-9\s()-]+$'),
ADD CONSTRAINT valid_whatsapp_number CHECK (
  whatsapp_number IS NULL OR 
  whatsapp_number ~ '^[+]?[0-9]+$'
);