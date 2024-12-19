-- Add new columns to services table
ALTER TABLE services
ADD COLUMN provider_name VARCHAR(255),
ADD COLUMN contact_number VARCHAR(20),
ADD COLUMN whatsapp_number VARCHAR(20);

-- Update existing services with default values
UPDATE services
SET 
  provider_name = 'AutoMarket Service',
  contact_number = '+44 20 1234 5678';

-- Make columns non-nullable after update
ALTER TABLE services
ALTER COLUMN provider_name SET NOT NULL,
ALTER COLUMN contact_number SET NOT NULL;

-- Add validation constraints using simpler regex patterns
ALTER TABLE services
ADD CONSTRAINT valid_contact_number CHECK (contact_number ~ '^[+]?[0-9\s()-]+$'),
ADD CONSTRAINT valid_whatsapp_number CHECK (
  whatsapp_number IS NULL OR 
  whatsapp_number ~ '^[+]?[0-9]+$'
);