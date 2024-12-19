"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CarStatusBadge } from "@/components/cars/CarStatusBadge";
import { CarThumbnail } from "../CarThumbnail";
import { formatPrice, formatDate } from "@/lib/utils";
import type { DealerCar } from "@/types/dealerCar";
import type { CarStatus } from "@/lib/modules/cars/constants";

export const columns: ColumnDef<DealerCar>[] = [
  {
    accessorKey: "thumbnail",
    header: "Car",
    cell: ({ row }) => <CarThumbnail car={row.original} />
  },
  {
    accessorKey: "dealer",
    header: "Dealer",
    cell: ({ row }) => row.original.dealer?.name || "Unknown Dealer"
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
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
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <CarStatusBadge status={row.getValue("status") as CarStatus} />
    )
  },
  {
    accessorKey: "created_at",
    header: "Listed On",
    cell: ({ row }) => formatDate(row.getValue("created_at")),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const car = row.original;
      const isSold = car.status === 'sold';
      
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.options.meta?.onViewDetails?.(car)}
          >
            View Details
          </Button>
          <Button
            variant={isSold ? "secondary" : "default"}
            size="sm"
            onClick={() => table.options.meta?.onStatusChange?.(car.id, isSold ? 'available' : 'sold')}
          >
            {isSold ? "Mark Available" : "Mark Sold"}
          </Button>
        </div>
      );
    },
  },
];