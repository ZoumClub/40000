"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Eye } from "lucide-react";
import type { UserCar } from "@/types/userCar";
import { formatPrice, formatDate } from "@/lib/utils";

export const columns: ColumnDef<UserCar>[] = [
  {
    accessorKey: "thumbnail",
    header: "Car",
    cell: ({ row }) => {
      const car = row.original;
      return (
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
            {car.images?.[0] ? (
              <img
                src={car.images[0]}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{car.brand} {car.model}</div>
            <div className="text-sm text-muted-foreground">{car.year}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Asking Price",
    cell: ({ row }) => formatPrice(row.getValue("price")),
  },
  {
    accessorKey: "bids",
    header: "Your Bid",
    cell: ({ row }) => {
      const bids = row.getValue("bids") as any[];
      const latestBid = bids?.length ? bids[0] : null;
      return latestBid ? formatPrice(latestBid.amount) : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("status") === "sold" ? "destructive" : "default"}>
        {row.getValue("status")}
      </Badge>
    ),
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
      const isSold = car.status === "sold";
      const hasActiveBid = car.bids?.some(bid => bid.status === "pending");
      
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.options.meta?.onViewDetails?.(car)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => table.options.meta?.onPlaceBid?.(car)}
            disabled={isSold || hasActiveBid}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            {hasActiveBid ? "Bid Pending" : "Place Bid"}
          </Button>
        </div>
      );
    },
  },
];