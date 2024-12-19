"use client";

interface PriceTagProps {
  price: number;
  savings?: number;
}

export function PriceTag({ price, savings }: PriceTagProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const originalPrice = savings ? price + savings : price;
  const discountedPrice = price;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">
          {formatPrice(discountedPrice)}
        </span>
        {savings && savings > 0 && (
          <span className="text-sm font-medium text-green-600">
            Save {formatPrice(savings)}
          </span>
        )}
      </div>
      
      {savings && savings > 0 && (
        <div className="text-sm text-muted-foreground">
          <span className="line-through">
            {formatPrice(originalPrice)}
          </span>
        </div>
      )}
    </div>
  );
}