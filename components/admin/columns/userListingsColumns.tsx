"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, DollarSign } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import type { UserCar } from "@/types/userCar";

export const columns: ColumnDef<UserCar>[] = [
  {
    accessorKey: "seller_name",
    header: "Seller",
  },
  {
    accessorKey: "car_info",
    header: "Car",
    cell: ({ row }) => {
      const car = row.original;
      return (
        <div>
          <div className="font-medium">
            {car.brand} {car.model}
          </div>
          <div className="text-sm text-muted-foreground">
            {car.year} • {car.mileage_range}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatPrice(row.getValue("price")),
  },
  {
    accessorKey: "bids",
    header: "Bids",
    cell: ({ row }) => {
      const bids = row.original.user_car_bids || [];
      const acceptedBid = bids.find(bid => bid.status === "accepted");
      
      if (acceptedBid) {
        return (
          <div className="text-green-600 font-medium">
            Sold for {formatPrice(acceptedBid.amount)}
          </div>
        );
      }

      return bids.length > 0 ? `${bids.length} bids` : "No bids";
    },
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
      const bids = car.user_car_bids || [];
      const meta = table.options.meta;
      
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => meta?.onViewDetails?.(car)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {bids.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => meta?.onViewBids?.(car)}
            >
              <DollarSign className="h-4 w-4" />
              <span className="ml-1">{bids.length}</span>
            </Button>
          )}
        </div>
      );
    },
  },
];