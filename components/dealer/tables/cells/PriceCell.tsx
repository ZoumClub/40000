"use client";

import { type CellContext } from "@tanstack/react-table";
import { formatPrice } from "@/lib/utils";
import type { DealerCar } from "@/types/dealerCar";

export function PriceCell({ row }: CellContext<DealerCar, unknown>) {
  const price = row.getValue("price");
  const savings = row.original.savings;
  
  return (
    <div>
      <div className="font-medium">{formatPrice(price as number)}</div>
      {savings && savings > 0 && (
        <div className="text-sm text-green-600">
          Save {formatPrice(savings)}
        </div>
      )}
    </div>
  );
}