-- Add savings column to dealer_cars
ALTER TABLE dealer_cars
ADD COLUMN IF NOT EXISTS savings DECIMAL(12, 2) CHECK (savings >= 0);

-- Add sold status
ALTER TABLE dealer_cars
DROP CONSTRAINT IF EXISTS dealer_cars_status_check;

ALTER TABLE dealer_cars
ADD CONSTRAINT dealer_cars_status_check 
CHECK (status IN ('pending', 'approved', 'rejected', 'sold'));

-- Create function to handle car sales
CREATE OR REPLACE FUNCTION handle_car_sale()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'sold' AND OLD.status != 'sold' THEN
        -- Log the sale
        INSERT INTO car_sales (
            car_id,
            dealer_id,
            sale_price,
            original_price,
            savings
        ) VALUES (
            NEW.id,
            NEW.dealer_id,
            NEW.price,
            NEW.price + COALESCE(NEW.savings, 0),
            NEW.savings
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for car sales
CREATE TRIGGER on_car_sold
    AFTER UPDATE ON dealer_cars
    FOR EACH ROW
    WHEN (NEW.status = 'sold' AND OLD.status != 'sold')
    EXECUTE FUNCTION handle_car_sale();

-- Create car_sales table
CREATE TABLE IF NOT EXISTS car_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID NOT NULL REFERENCES dealer_cars(id),
    dealer_id UUID NOT NULL REFERENCES dealers(id),
    sale_price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2) NOT NULL,
    savings DECIMAL(12, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_car_sales_dealer ON car_sales(dealer_id);
CREATE INDEX IF NOT EXISTS idx_car_sales_date ON car_sales(created_at);

-- Enable RLS
ALTER TABLE car_sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Dealers can view their own sales"
    ON car_sales FOR SELECT
    USING (dealer_id = auth.uid());